<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;
use App\Http\Controllers\Controller;
use App\Models\HolidayProgramFeeSetting;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use App\Services\HolidayFeeCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HolidayWithdrawalController extends Controller
{
    private const AUTO_WITHDRAW_NOTE = 'Penarikan otomatis hari raya setelah potongan uang pengendap dan administrasi';

    public function __construct(private HolidayFeeCalculator $calculator)
    {
    }

    public function index(Request $request)
    {
        $programs = HolidaySavingProgram::latest()->get();
        $programId = $request->integer('program_id') ?: $programs->first()?->id;
        $program = $programId ? HolidaySavingProgram::find($programId) : null;

        if (! $program) {
            return Inertia::render('Admin/Holiday/Withdrawals', [
                'programs' => $programs,
                'selectedProgram' => null,
                'calculation' => null,
                'participants' => [],
                'pendingWithdrawals' => [],
            ]);
        }

        $setting = $this->settingFor($program);
        $calculation = $this->calculate($program, $setting);

        return Inertia::render('Admin/Holiday/Withdrawals', [
            'programs' => $programs,
            'selectedProgram' => $program,
            'calculation' => $calculation,
            'participants' => $this->participants($program, $setting),
            'pendingWithdrawals' => $this->pendingWithdrawals($program, $setting),
        ]);
    }

    public function generate(Request $request)
    {
        $data = $request->validate([
            'program_id' => 'required|exists:holiday_saving_programs,id',
        ]);

        $program = HolidaySavingProgram::findOrFail($data['program_id']);
        $setting = $this->settingFor($program);
        $calculation = $this->calculate($program, $setting);
        $created = 0;
        $insufficient = 0;
        $updated = 0;
        $skipped = 0;

        DB::transaction(function () use ($program, $setting, &$created, &$insufficient, &$updated, &$skipped) {
            $participants = HolidaySavingParticipant::where('holiday_saving_program_id', $program->id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get();

            foreach ($participants as $participant) {
                $balance = $this->balanceFor($program->id, $participant->user_id);
                $deduction = $this->calculator->deductionForParticipant($program, $setting, $participant);
                $totalDeduction = (float) $deduction['total_deduction_per_user'];
                $netAmount = round($balance - $totalDeduction, 2);

                if ($netAmount <= 0) {
                    $insufficient++;
                    continue;
                }

                $adminNote = 'Potongan otomatis: uang pengendap Rp ' . number_format((float) $deduction['sinking_fund_per_user'], 0, ',', '.') .
                    ', administrasi sesuai bulan setoran Rp ' . number_format((float) $deduction['admin_fee_total_per_user'], 0, ',', '.') . '.';

                $existing = Transaction::where('saving_type', 'holiday')
                    ->where('program_id', $program->id)
                    ->where('user_id', $participant->user_id)
                    ->where('type', 'withdraw')
                    ->where('status', 'pending')
                    ->where('note', self::AUTO_WITHDRAW_NOTE)
                    ->lockForUpdate()
                    ->first();

                if ($existing) {
                    $existing->update([
                        'amount' => $netAmount,
                        'admin_note' => $adminNote . ' Nominal pending disesuaikan ulang pada ' . now()->format('d/m/Y H:i') . '.',
                    ]);

                    $updated++;
                    continue;
                }

                $transaction = Transaction::create([
                    'user_id' => $participant->user_id,
                    'saving_goal_id' => null,
                    'saving_type' => 'holiday',
                    'program_id' => $program->id,
                    'type' => 'withdraw',
                    'amount' => $netAmount,
                    'status' => 'pending',
                    'note' => self::AUTO_WITHDRAW_NOTE,
                    'admin_note' => $adminNote,
                ]);

                NotificationHelper::send(
                    $participant->user_id,
                    'Penarikan Hari Raya Dibuat',
                    'Penarikan hari raya sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' sedang menunggu verifikasi admin.',
                    'warning'
                );

                $created++;
            }
        });

        ActivityLogger::log('generate_holiday_program_withdrawals', 'Admin generate penarikan hari raya: ' . $program->name, $program, [
            'created' => $created,
            'updated' => $updated,
            'insufficient' => $insufficient,
            'skipped' => $skipped,
        ]);

        return redirect()->route('admin.holiday.withdrawals.index', ['program_id' => $program->id])
            ->with('success', "Generate selesai. {$created} dibuat, {$updated} pending diperbarui, {$insufficient} saldo tidak cukup, {$skipped} dilewati.");
    }

    public function approve(Transaction $transaction)
    {
        if (! $this->isHolidayWithdrawal($transaction)) {
            return redirect()->back()->with('error', 'Transaksi ini bukan penarikan Hari Raya.');
        }

        if ($transaction->status !== 'pending') {
            return redirect()->back()->with('error', 'Transaksi ini sudah diproses.');
        }

        try {
            DB::transaction(function () use ($transaction) {
                $lockedTransaction = Transaction::whereKey($transaction->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if (! $this->isHolidayWithdrawal($lockedTransaction)) {
                    throw ValidationException::withMessages([
                        'transaction' => 'Transaksi ini bukan penarikan Hari Raya.',
                    ]);
                }

                if ($lockedTransaction->status !== 'pending') {
                    throw ValidationException::withMessages([
                        'transaction' => 'Transaksi ini sudah diproses.',
                    ]);
                }

                $currentBalance = $this->balanceFor($lockedTransaction->program_id, $lockedTransaction->user_id);

                if ((float) $lockedTransaction->amount > $currentBalance) {
                    throw ValidationException::withMessages([
                        'amount' => 'Saldo peserta tidak mencukupi untuk menyetujui penarikan ini.',
                    ]);
                }

                $lockedTransaction->update([
                    'status' => 'approved',
                    'approved_by' => auth()->id(),
                    'approved_at' => now(),
                    'admin_note' => trim(($lockedTransaction->admin_note ? $lockedTransaction->admin_note . ' ' : '') . 'Disetujui admin pada ' . now()->format('d/m/Y H:i') . '.'),
                ]);

                NotificationHelper::send(
                    $lockedTransaction->user_id,
                    'Penarikan Hari Raya Disetujui',
                    'Penarikan hari raya sebesar Rp ' . number_format($lockedTransaction->amount, 0, ',', '.') . ' telah disetujui oleh admin.',
                    'success'
                );

                ActivityLogger::log('approve_holiday_withdraw', 'Admin menyetujui penarikan Hari Raya.', $lockedTransaction, [
                    'transaction_id' => $lockedTransaction->id,
                    'user_id' => $lockedTransaction->user_id,
                    'program_id' => $lockedTransaction->program_id,
                    'amount' => $lockedTransaction->amount,
                    'approved_by' => auth()->id(),
                ]);
            });
        } catch (ValidationException $exception) {
            return redirect()->back()
                ->withErrors($exception->errors())
                ->with('error', collect($exception->errors())->flatten()->first());
        }

        return redirect()->back()->with('success', 'Penarikan Hari Raya berhasil disetujui.');
    }

    public function reject(Request $request, Transaction $transaction)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ]);

        if (! $this->isHolidayWithdrawal($transaction)) {
            return redirect()->back()->with('error', 'Transaksi ini bukan penarikan Hari Raya.');
        }

        if ($transaction->status !== 'pending') {
            return redirect()->back()->with('error', 'Transaksi ini sudah diproses.');
        }

        $transaction->update([
            'status' => 'rejected',
            'admin_note' => $request->admin_note,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        NotificationHelper::send(
            $transaction->user_id,
            'Penarikan Hari Raya Ditolak',
            'Penarikan hari raya sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' ditolak oleh admin. Alasan: ' . $request->admin_note,
            'danger'
        );

        ActivityLogger::log('reject_holiday_withdraw', 'Admin menolak penarikan Hari Raya.', $transaction, [
            'transaction_id' => $transaction->id,
            'user_id' => $transaction->user_id,
            'program_id' => $transaction->program_id,
            'amount' => $transaction->amount,
            'admin_note' => $request->admin_note,
            'rejected_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Penarikan Hari Raya berhasil ditolak.');
    }

    private function settingFor(HolidaySavingProgram $program): HolidayProgramFeeSetting
    {
        $setting = HolidayProgramFeeSetting::firstOrCreate([
            'holiday_saving_program_id' => $program->id,
        ], [
            'sinking_fund_total' => 100000,
            'admin_fee_monthly_total' => 6000,
        ]);

        if ((float) $setting->sinking_fund_total === 10000000.0 && (float) $setting->admin_fee_monthly_total === 600000.0) {
            $setting->update([
                'sinking_fund_total' => 100000,
                'admin_fee_monthly_total' => 6000,
            ]);
            $setting = $setting->fresh();
        }

        $setting->update($this->calculate($program, $setting) + [
            'calculated_at' => now(),
        ]);

        return $setting->fresh();
    }

    private function calculate(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting): array
    {
        return $this->calculator->summary($program, $setting);
    }

    private function participants(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting): array
    {
        return HolidaySavingParticipant::with('user:id,name,email,member_number')
            ->where('holiday_saving_program_id', $program->id)
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function (HolidaySavingParticipant $participant) use ($program, $setting) {
                $balance = $this->balanceFor($program->id, $participant->user_id);
                $deduction = $this->calculator->deductionForParticipant($program, $setting, $participant);
                $totalDeduction = (float) $deduction['total_deduction_per_user'];

                return [
                    'id' => $participant->id,
                    'user' => $participant->user,
                    'balance' => $balance,
                    'sinking_fund_per_user' => $deduction['sinking_fund_per_user'],
                    'admin_fee_total_per_user' => $deduction['admin_fee_total_per_user'],
                    'total_deduction_per_user' => $totalDeduction,
                    'net_withdrawal_amount' => round($balance - $totalDeduction, 2),
                    'is_sufficient' => ($balance - $totalDeduction) > 0,
                ];
            })
            ->values()
            ->all();
    }

    private function pendingWithdrawals(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting)
    {
        return Transaction::with('user:id,name,email,member_number')
            ->where('saving_type', 'holiday')
            ->where('program_id', $program->id)
            ->where('type', 'withdraw')
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function (Transaction $withdrawal) use ($program, $setting) {
                $participant = HolidaySavingParticipant::where('holiday_saving_program_id', $program->id)
                    ->where('user_id', $withdrawal->user_id)
                    ->first();

                if (! $participant) {
                    $withdrawal->setAttribute('expected_amount', null);
                    $withdrawal->setAttribute('amount_difference', null);
                    $withdrawal->setAttribute('is_amount_current', false);

                    return $withdrawal;
                }

                $balance = $this->balanceFor($program->id, $withdrawal->user_id);
                $deduction = $this->calculator->deductionForParticipant($program, $setting, $participant);
                $expectedAmount = max(round($balance - (float) $deduction['total_deduction_per_user'], 2), 0);
                $difference = round((float) $withdrawal->amount - $expectedAmount, 2);

                $withdrawal->setAttribute('expected_amount', $expectedAmount);
                $withdrawal->setAttribute('amount_difference', $difference);
                $withdrawal->setAttribute('is_amount_current', abs($difference) < 0.01);

                return $withdrawal;
            });
    }

    private function balanceFor(int $programId, int $userId): float
    {
        $deposit = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $programId)
            ->where('user_id', $userId)
            ->where('type', 'deposit')
            ->where('status', 'approved')
            ->sum('amount');

        $withdraw = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $programId)
            ->where('user_id', $userId)
            ->where('type', 'withdraw')
            ->where('status', 'approved')
            ->sum('amount');

        return (float) $deposit - (float) $withdraw;
    }

    private function isHolidayWithdrawal(Transaction $transaction): bool
    {
        return $transaction->saving_type === 'holiday'
            && $transaction->type === 'withdraw'
            && filled($transaction->program_id);
    }

    private function totalProgramMonths(HolidaySavingProgram $program): int
    {
        $start = Carbon::parse($program->start_date)->startOfMonth();
        $holiday = Carbon::parse($program->holiday_date)->startOfMonth();

        return $holiday->lt($start) ? 0 : ((int) $start->diffInMonths($holiday) + 1);
    }
}
