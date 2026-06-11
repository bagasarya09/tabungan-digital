<?php

namespace App\Services;

use App\Models\ProgramFeeSetting;
use App\Models\SavingGoal;
use Carbon\Carbon;

class ProgramFeeCalculator
{
    public function calculate(ProgramFeeSetting $setting): array
    {
        $activeGoals = SavingGoal::query()
            ->where('status', 'active')
            ->get();

        $activeParticipantCount = $activeGoals->count();
        $totalProgramMonths = $this->totalProgramMonths($setting);
        $sinkingFundTotal = (float) $setting->sinking_fund_total;
        $adminFeeMonthlyTotal = (float) $setting->admin_fee_monthly_total;

        $sinkingFundPerUser = $activeParticipantCount > 0
            ? $sinkingFundTotal / $activeParticipantCount
            : 0;

        $adminFeePerUserMonthly = $activeParticipantCount > 0
            ? $adminFeeMonthlyTotal / $activeParticipantCount
            : 0;

        $adminFeeTotalPerUser = $adminFeePerUserMonthly * $totalProgramMonths;
        $totalDeductionPerUser = $sinkingFundPerUser + $adminFeeTotalPerUser;
        $estimatedTotalAvailableBalance = $activeGoals->sum(fn (SavingGoal $goal) => (float) $goal->current_amount);
        $estimatedTotalNetWithdrawal = $activeGoals->sum(function (SavingGoal $goal) use ($totalDeductionPerUser) {
            return max((float) $goal->current_amount - $totalDeductionPerUser, 0);
        });

        return [
            'active_participant_count' => $activeParticipantCount,
            'sinking_fund_per_user' => round($sinkingFundPerUser, 2),
            'admin_fee_per_user_monthly' => round($adminFeePerUserMonthly, 2),
            'total_program_months' => $totalProgramMonths,
            'admin_fee_total_per_user' => round($adminFeeTotalPerUser, 2),
            'total_deduction_per_user' => round($totalDeductionPerUser, 2),
            'estimated_total_available_balance' => round($estimatedTotalAvailableBalance, 2),
            'estimated_total_net_withdrawal' => round($estimatedTotalNetWithdrawal, 2),
        ];
    }

    public function recalculateAndSave(ProgramFeeSetting $setting): ProgramFeeSetting
    {
        $setting->update($this->calculate($setting) + [
            'calculated_at' => now(),
        ]);

        return $setting->fresh();
    }

    private function totalProgramMonths(ProgramFeeSetting $setting): int
    {
        if (! $setting->start_date || ! $setting->holiday_date) {
            return 0;
        }

        $start = Carbon::parse($setting->start_date)->startOfMonth();
        $holiday = Carbon::parse($setting->holiday_date)->startOfMonth();

        if ($holiday->lt($start)) {
            return 0;
        }

        return (int) $start->diffInMonths($holiday) + 1;
    }
}
