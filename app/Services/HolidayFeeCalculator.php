<?php

namespace App\Services;

use App\Models\HolidayProgramFeeSetting;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class HolidayFeeCalculator
{
    public function summary(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting): array
    {
        $activeParticipants = $this->activeParticipants($program);
        $activeCount = $activeParticipants->count();
        $sinkingPerUser = $activeCount > 0 ? (float) $setting->sinking_fund_total / $activeCount : 0;
        $adminTotals = $activeParticipants->map(fn (HolidaySavingParticipant $participant) => $this->adminTotalForParticipant($program, $setting, $participant));
        $averageAdminTotal = $activeCount > 0 ? $adminTotals->sum() / $activeCount : 0;

        return [
            'active_participant_count' => $activeCount,
            'total_program_months' => $this->totalProgramMonths($program),
            'sinking_fund_per_user' => round($sinkingPerUser, 2),
            'admin_fee_per_user_monthly' => round($activeCount > 0 ? (float) $setting->admin_fee_monthly_total / $activeCount : 0, 2),
            'admin_fee_total_per_user' => round($averageAdminTotal, 2),
            'total_deduction_per_user' => round($sinkingPerUser + $averageAdminTotal, 2),
        ];
    }

    public function deductionForParticipant(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting, HolidaySavingParticipant $participant): array
    {
        $activeCount = $this->activeParticipants($program)->count();
        $sinkingPerUser = $activeCount > 0 ? (float) $setting->sinking_fund_total / $activeCount : 0;
        $adminTotal = $this->adminTotalForParticipant($program, $setting, $participant);

        return [
            'sinking_fund_per_user' => round($sinkingPerUser, 2),
            'admin_fee_total_per_user' => round($adminTotal, 2),
            'total_deduction_per_user' => round($sinkingPerUser + $adminTotal, 2),
        ];
    }

    public function monthlyBreakdown(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting, string $month): array
    {
        $date = Carbon::parse($month . '-01');
        $participants = $this->participantsWithDepositsInMonth($program, $date);
        $activeCount = $participants->count();
        $adminPerUser = $activeCount > 0 ? (float) $setting->admin_fee_monthly_total / $activeCount : 0;

        return [
            'selected_month' => $date->format('Y-m'),
            'month_label' => $date->translatedFormat('F Y'),
            'admin_fee_monthly_total' => (float) $setting->admin_fee_monthly_total,
            'active_participant_count' => $activeCount,
            'admin_fee_per_user_monthly' => round($adminPerUser, 2),
            'participants' => $participants->map(fn (HolidaySavingParticipant $participant) => [
                'id' => $participant->id,
                'user' => $participant->user,
                'status' => $participant->status,
                'joined_at' => $participant->joined_at?->format('d/m/Y'),
                'inactive_at' => $this->inactiveAt($participant)?->format('d/m/Y'),
            ])->values()->all(),
        ];
    }

    public function activeParticipants(HolidaySavingProgram $program): Collection
    {
        return HolidaySavingParticipant::with('user:id,name,email,member_number')
            ->where('holiday_saving_program_id', $program->id)
            ->where('status', 'active')
            ->get();
    }

    public function totalProgramMonths(HolidaySavingProgram $program): int
    {
        $start = Carbon::parse($program->start_date)->startOfMonth();
        $holiday = Carbon::parse($program->holiday_date)->startOfMonth();

        return $holiday->lt($start) ? 0 : ((int) $start->diffInMonths($holiday) + 1);
    }

    private function adminTotalForParticipant(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting, HolidaySavingParticipant $participant): float
    {
        $total = 0;
        $months = \App\Models\Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('program_id', $program->id)
            ->where('user_id', $participant->user_id)
            ->where('type', 'deposit')
            ->where('status', 'approved')
            ->whereBetween('created_at', [
                Carbon::parse($program->start_date)->startOfDay(),
                Carbon::parse($program->holiday_date)->endOfDay(),
            ])
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as deposit_month")
            ->distinct()
            ->pluck('deposit_month');

        foreach ($months as $month) {
            $count = $this->participantsWithDepositsInMonth($program, Carbon::parse($month . '-01'))->count();
            if ($count > 0) {
                $total += (float) $setting->admin_fee_monthly_total / $count;
            }
        }

        return $total;
    }

    private function participantsWithDepositsInMonth(HolidaySavingProgram $program, Carbon $month): Collection
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        $userIds = \App\Models\Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('program_id', $program->id)
            ->where('type', 'deposit')
            ->where('status', 'approved')
            ->whereBetween('created_at', [$start, $end])
            ->distinct()
            ->pluck('user_id');

        return HolidaySavingParticipant::with('user:id,name,email,member_number')
            ->where('holiday_saving_program_id', $program->id)
            ->whereIn('user_id', $userIds)
            ->orderBy('joined_at')
            ->get();
    }

    private function participantsActiveInMonth(HolidaySavingProgram $program, Carbon $month): Collection
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        return HolidaySavingParticipant::with('user:id,name,email,member_number')
            ->where('holiday_saving_program_id', $program->id)
            ->whereDate('joined_at', '<=', $end)
            ->where(function ($query) use ($start) {
                $query->whereHas('statusHistories', function ($history) use ($start) {
                    $history->where('status', 'active')
                        ->whereDate('started_at', '<=', $start->copy()->endOfMonth())
                        ->where(function ($period) use ($start) {
                            $period->whereNull('ended_at')
                                ->orWhereDate('ended_at', '>=', $start);
                        });
                })->orWhere(function ($fallback) use ($start) {
                    $fallback->doesntHave('statusHistories')
                        ->where(function ($legacy) use ($start) {
                            $legacy->where('status', 'active')
                                ->orWhereDate('inactive_at', '>=', $start)
                                ->orWhere(function ($inactiveFallback) use ($start) {
                                    $inactiveFallback->where('status', 'inactive')
                                        ->whereNull('inactive_at')
                                        ->whereDate('updated_at', '>=', $start);
                                });
                        });
                    });
            })
            ->orderBy('joined_at')
            ->get();
    }

    private function inactiveAt(HolidaySavingParticipant $participant): ?Carbon
    {
        if ($participant->inactive_at) {
            return $participant->inactive_at->copy();
        }

        return $participant->status === 'inactive' ? $participant->updated_at?->copy() : null;
    }
}
