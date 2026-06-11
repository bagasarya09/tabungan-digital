<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;
use App\Http\Controllers\Controller;
use App\Models\HolidayParticipantStatusHistory;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use App\Models\User;
use App\Services\HolidayFeeCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HolidayParticipantController extends Controller
{
    private const AUTO_WITHDRAW_NOTE = 'Penarikan otomatis hari raya setelah potongan uang pengendap dan administrasi';

    public function __construct(private HolidayFeeCalculator $calculator)
    {
    }

    public function index(Request $request)
    {
        $programs = HolidaySavingProgram::query()
            ->orderByDesc('created_at')
            ->get();

        $selectedProgramId = $request->integer('program_id') ?: $programs->first()?->id;
        $selectedProgram = $selectedProgramId
            ? HolidaySavingProgram::with('feeSetting')->find($selectedProgramId)
            : null;
        $setting = $selectedProgram?->feeSetting;
        $summary = $selectedProgram && $setting ? $this->calculator->summary($selectedProgram, $setting) : null;
        $totalDeduction = (float) ($summary['total_deduction_per_user'] ?? 0);

        $participants = HolidaySavingParticipant::with(['user:id,name,email,member_number', 'program:id,name'])
            ->when($selectedProgramId, function ($query) use ($selectedProgramId) {
                $query->where('holiday_saving_program_id', $selectedProgramId);
            })
            ->latest()
            ->get();

        $balances = Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('program_id', $selectedProgramId)
            ->where('status', 'approved')
            ->selectRaw("user_id, SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END) as balance")
            ->groupBy('user_id')
            ->pluck('balance', 'user_id');

        $pendingWithdrawals = Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('program_id', $selectedProgramId)
            ->where('type', 'withdraw')
            ->where('status', 'pending')
            ->where('note', self::AUTO_WITHDRAW_NOTE)
            ->pluck('id', 'user_id');

        $approvedWithdrawals = Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('program_id', $selectedProgramId)
            ->where('type', 'withdraw')
            ->where('status', 'approved')
            ->where('note', self::AUTO_WITHDRAW_NOTE)
            ->pluck('id', 'user_id');

        $participants->each(function (HolidaySavingParticipant $participant) use ($selectedProgram, $setting, $balances, $totalDeduction, $pendingWithdrawals, $approvedWithdrawals) {
            $depositBalance = (float) ($balances[$participant->user_id] ?? 0);
            $deduction = $selectedProgram && $setting
                ? $this->calculator->deductionForParticipant($selectedProgram, $setting, $participant)
                : [
                    'sinking_fund_per_user' => 0,
                    'admin_fee_total_per_user' => 0,
                    'total_deduction_per_user' => $totalDeduction,
                ];
            $participantTotalDeduction = (float) $deduction['total_deduction_per_user'];
            $netBalance = $depositBalance - $participantTotalDeduction;

            $participant->setAttribute('balance', $depositBalance);
            $participant->setAttribute('deposit_balance', $depositBalance);
            $participant->setAttribute('sinking_fund_per_user', $deduction['sinking_fund_per_user']);
            $participant->setAttribute('admin_fee_total_per_user', $deduction['admin_fee_total_per_user']);
            $participant->setAttribute('total_deduction', $participantTotalDeduction);
            $participant->setAttribute('net_balance', max($netBalance, 0));
            $participant->setAttribute('withdrawal_status', $this->withdrawalStatus(
                $depositBalance,
                $netBalance,
                $pendingWithdrawals->has($participant->user_id),
                $approvedWithdrawals->has($participant->user_id)
            ));
        });

        $participantUserIds = $participants->pluck('user_id')->all();
        $deposits = Transaction::with('user:id,name,email,member_number')
            ->where('saving_type', 'holiday')
            ->where('program_id', $selectedProgramId)
            ->where('type', 'deposit')
            ->latest()
            ->get();

        return Inertia::render('Admin/Holiday/Participants', [
            'programs' => $programs,
            'participants' => $participants,
            'deposits' => $deposits,
            'users' => User::query()
                ->where('role', 'user')
                ->whereNotIn('id', $participantUserIds)
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'member_number']),
            'filters' => [
                'program_id' => $selectedProgramId,
            ],
            'deduction' => [
                'total_deduction_per_user' => $totalDeduction,
                'calculated_at' => $selectedProgram?->feeSetting?->calculated_at?->format('d/m/Y H:i'),
            ],
        ]);
    }

    private function withdrawalStatus(float $depositBalance, float $netBalance, bool $hasPending, bool $hasApproved): string
    {
        if ($hasPending) {
            return 'Menunggu persetujuan';
        }

        if ($hasApproved) {
            return 'Sudah dicairkan';
        }

        if ($depositBalance <= 0) {
            return 'Belum ada saldo';
        }

        if ($netBalance <= 0) {
            return 'Saldo tidak mencukupi';
        }

        return 'Belum digenerate';
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'holiday_saving_program_id' => 'required|exists:holiday_saving_programs,id',
            'user_id' => [
                'required',
                'exists:users,id',
                Rule::unique('holiday_saving_participants')
                    ->where('holiday_saving_program_id', $request->holiday_saving_program_id),
            ],
            'status' => 'required|in:active,inactive',
        ]);

        $participant = HolidaySavingParticipant::create($data + [
            'joined_at' => now(),
            'inactive_at' => $data['status'] === 'inactive' ? now() : null,
        ]);

        HolidayParticipantStatusHistory::create([
            'holiday_saving_participant_id' => $participant->id,
            'status' => $participant->status,
            'started_at' => $participant->joined_at,
        ]);

        ActivityLogger::log('add_holiday_participant', 'Admin menambahkan peserta program hari raya.', $participant);

        return redirect()->route('admin.holiday.participants.index', [
            'program_id' => $participant->holiday_saving_program_id,
        ])->with('success', 'Peserta program berhasil ditambahkan.');
    }

    public function update(Request $request, HolidaySavingParticipant $participant)
    {
        $data = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $oldStatus = $participant->status;

        $participant->update($data + [
            'inactive_at' => $data['status'] === 'inactive' ? now() : null,
        ]);

        if ($oldStatus !== $data['status']) {
            HolidayParticipantStatusHistory::where('holiday_saving_participant_id', $participant->id)
                ->whereNull('ended_at')
                ->latest('started_at')
                ->first()
                ?->update(['ended_at' => now()]);

            HolidayParticipantStatusHistory::create([
                'holiday_saving_participant_id' => $participant->id,
                'status' => $data['status'],
                'started_at' => now(),
            ]);
        }

        ActivityLogger::log('update_holiday_participant', 'Admin memperbarui status peserta program hari raya.', $participant);

        return redirect()->route('admin.holiday.participants.index', [
            'program_id' => $participant->holiday_saving_program_id,
        ])->with('success', 'Status peserta berhasil diperbarui.');
    }

    public function destroy(HolidaySavingParticipant $participant)
    {
        $programId = $participant->holiday_saving_program_id;
        $participant->delete();

        ActivityLogger::log('delete_holiday_participant', 'Admin menghapus peserta dari program hari raya.');

        return redirect()->route('admin.holiday.participants.index', [
            'program_id' => $programId,
        ])->with('success', 'Peserta berhasil dihapus dari program.');
    }

    public function storeDeposit(Request $request, HolidaySavingParticipant $participant)
    {
        $data = $request->validate([
            'amount' => 'required|numeric|min:1000',
            'deposit_date' => 'required|date',
            'note' => 'nullable|string|max:500',
        ]);

        if ($participant->status !== 'active') {
            return redirect()->back()
                ->withErrors(['participant' => 'Setoran hanya bisa ditambahkan untuk peserta aktif.'])
                ->with('error', 'Setoran hanya bisa ditambahkan untuk peserta aktif.');
        }

        $depositDate = Carbon::parse($data['deposit_date']);

        $transaction = Transaction::create([
            'user_id' => $participant->user_id,
            'saving_goal_id' => null,
            'saving_type' => 'holiday',
            'program_id' => $participant->holiday_saving_program_id,
            'type' => 'deposit',
            'amount' => $data['amount'],
            'status' => 'approved',
            'note' => $data['note'] ?? null,
            'admin_note' => 'Setoran hari raya dicatat langsung oleh admin.',
            'approved_by' => auth()->id(),
            'approved_at' => $depositDate,
        ]);

        $transaction->forceFill([
            'created_at' => $depositDate,
        ])->save();

        NotificationHelper::send(
            $participant->user_id,
            'Setoran Hari Raya Dicatat',
            'Admin telah mencatat setoran hari raya sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . '.',
            'success'
        );

        ActivityLogger::log(
            'manual_holiday_deposit',
            'Admin mencatat setoran hari raya sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
            $transaction,
            [
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'program_id' => $transaction->program_id,
                'amount' => $transaction->amount,
            ]
        );

        return redirect()->route('admin.holiday.participants.index', [
            'program_id' => $participant->holiday_saving_program_id,
        ])->with('success', 'Setoran peserta berhasil dicatat.');
    }

    public function updateDeposit(Request $request, Transaction $transaction)
    {
        if ($transaction->saving_type !== 'holiday' || $transaction->type !== 'deposit') {
            return redirect()->back()
                ->with('error', 'Transaksi ini bukan setoran Hari Raya.');
        }

        $data = $request->validate([
            'amount' => 'required|numeric|min:1000',
            'deposit_date' => 'required|date',
            'note' => 'nullable|string|max:500',
        ]);

        $oldAmount = (float) $transaction->amount;
        $oldDate = $transaction->created_at?->format('Y-m-d');
        $depositDate = Carbon::parse($data['deposit_date']);

        $transaction->update([
            'amount' => $data['amount'],
            'note' => $data['note'] ?? null,
            'admin_note' => trim(($transaction->admin_note ? $transaction->admin_note . ' ' : '') . 'Setoran diedit admin pada ' . now()->format('d/m/Y H:i') . '.'),
            'approved_by' => auth()->id(),
            'approved_at' => $depositDate,
        ]);

        $transaction->forceFill([
            'created_at' => $depositDate,
        ])->save();

        ActivityLogger::log(
            'edit_holiday_deposit',
            'Admin mengedit setoran hari raya.',
            $transaction,
            [
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'program_id' => $transaction->program_id,
                'old_amount' => $oldAmount,
                'new_amount' => (float) $transaction->amount,
                'old_date' => $oldDate,
                'new_date' => $depositDate->format('Y-m-d'),
            ]
        );

        return redirect()->route('admin.holiday.participants.index', [
            'program_id' => $transaction->program_id,
        ])->with('success', 'Setoran peserta berhasil diperbarui.');
    }
}
