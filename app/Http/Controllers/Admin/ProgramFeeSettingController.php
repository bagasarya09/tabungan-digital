<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;
use App\Http\Controllers\Controller;
use App\Models\ProgramFeeSetting;
use App\Models\SavingGoal;
use App\Models\Transaction;
use App\Services\ProgramFeeCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProgramFeeSettingController extends Controller
{
    public function index(ProgramFeeCalculator $calculator)
    {
        $setting = ProgramFeeSetting::current();
        $preview = $calculator->calculate($setting);

        return Inertia::render('Admin/ProgramFees/Index', [
            'setting' => $setting,
            'preview' => $preview,
            'participants' => $this->participants($preview['total_deduction_per_user']),
        ]);
    }

    public function recalculate(Request $request, ProgramFeeCalculator $calculator)
    {
        $data = $request->validate([
            'sinking_fund_total' => 'required|numeric|min:0',
            'admin_fee_monthly_total' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'holiday_date' => 'required|date|after_or_equal:start_date',
        ]);

        $setting = ProgramFeeSetting::current();
        $setting->update($data);
        $calculator->recalculateAndSave($setting);

        ActivityLogger::log(
            'recalculate_program_fee',
            'Admin menghitung ulang potongan program hari raya.',
            $setting,
            $setting->fresh()->only([
                'active_participant_count',
                'sinking_fund_per_user',
                'admin_fee_per_user_monthly',
                'total_program_months',
                'total_deduction_per_user',
            ])
        );

        return redirect()->route('admin.program-fees.index')
            ->with('success', 'Potongan peserta berhasil dihitung ulang.');
    }

    public function generateHolidayWithdrawals(ProgramFeeCalculator $calculator)
    {
        $setting = $calculator->recalculateAndSave(ProgramFeeSetting::current());
        $totalDeduction = (float) $setting->total_deduction_per_user;
        $createdCount = 0;
        $insufficientCount = 0;
        $skippedCount = 0;

        DB::transaction(function () use ($setting, $totalDeduction, &$createdCount, &$insufficientCount, &$skippedCount) {
            $goals = SavingGoal::query()
                ->where('status', 'active')
                ->lockForUpdate()
                ->get();

            foreach ($goals as $goal) {
                $availableBalance = (float) $goal->current_amount;
                $netWithdrawalAmount = round($availableBalance - $totalDeduction, 2);

                if ($netWithdrawalAmount <= 0) {
                    $insufficientCount++;
                    continue;
                }

                $alreadyGenerated = Transaction::query()
                    ->where('saving_goal_id', $goal->id)
                    ->where('type', 'withdraw')
                    ->where('status', 'pending')
                    ->where('note', 'Penarikan otomatis hari raya setelah potongan uang pengendap dan administrasi')
                    ->exists();

                if ($alreadyGenerated) {
                    $skippedCount++;
                    continue;
                }

                $transaction = Transaction::create([
                    'user_id' => $goal->user_id,
                    'saving_goal_id' => $goal->id,
                    'type' => 'withdraw',
                    'status' => 'pending',
                    'amount' => $netWithdrawalAmount,
                    'note' => 'Penarikan otomatis hari raya setelah potongan uang pengendap dan administrasi',
                    'admin_note' => 'Potongan otomatis: uang pengendap Rp ' . number_format((float) $setting->sinking_fund_per_user, 0, ',', '.') .
                        ', administrasi Rp ' . number_format((float) $setting->admin_fee_total_per_user, 0, ',', '.') . '.',
                ]);

                NotificationHelper::send(
                    $goal->user_id,
                    'Penarikan Hari Raya Dibuat',
                    'Penarikan otomatis sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' sedang menunggu verifikasi admin.',
                    'warning'
                );

                $createdCount++;
            }
        });

        ActivityLogger::log(
            'generate_holiday_withdrawals',
            'Admin membuat penarikan otomatis hari raya.',
            $setting,
            [
                'created_count' => $createdCount,
                'insufficient_count' => $insufficientCount,
                'skipped_count' => $skippedCount,
                'total_deduction_per_user' => $setting->total_deduction_per_user,
            ]
        );

        return redirect()->route('admin.program-fees.index')
            ->with('success', "Generate selesai. {$createdCount} penarikan dibuat, {$insufficientCount} saldo tidak mencukupi, {$skippedCount} sudah memiliki penarikan pending.");
    }

    private function participants(float $totalDeduction): array
    {
        return SavingGoal::query()
            ->with('user:id,name,email,member_number')
            ->where('status', 'active')
            ->latest()
            ->get()
            ->map(function (SavingGoal $goal) use ($totalDeduction) {
                $availableBalance = (float) $goal->current_amount;

                return [
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'user' => $goal->user,
                    'available_balance' => $availableBalance,
                    'net_withdrawal_amount' => round($availableBalance - $totalDeduction, 2),
                    'is_sufficient' => ($availableBalance - $totalDeduction) > 0,
                ];
            })
            ->values()
            ->all();
    }
}
