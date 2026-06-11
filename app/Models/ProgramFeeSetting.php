<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramFeeSetting extends Model
{
    protected $fillable = [
        'sinking_fund_total',
        'admin_fee_monthly_total',
        'start_date',
        'holiday_date',
        'active_participant_count',
        'sinking_fund_per_user',
        'admin_fee_per_user_monthly',
        'total_program_months',
        'admin_fee_total_per_user',
        'total_deduction_per_user',
        'estimated_total_available_balance',
        'estimated_total_net_withdrawal',
        'calculated_at',
    ];

    protected $casts = [
        'sinking_fund_total' => 'decimal:2',
        'admin_fee_monthly_total' => 'decimal:2',
        'start_date' => 'date',
        'holiday_date' => 'date',
        'sinking_fund_per_user' => 'decimal:2',
        'admin_fee_per_user_monthly' => 'decimal:2',
        'admin_fee_total_per_user' => 'decimal:2',
        'total_deduction_per_user' => 'decimal:2',
        'estimated_total_available_balance' => 'decimal:2',
        'estimated_total_net_withdrawal' => 'decimal:2',
        'calculated_at' => 'datetime',
    ];

    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'sinking_fund_total' => 100000,
            'admin_fee_monthly_total' => 6000,
            'start_date' => now()->toDateString(),
        ]);
    }
}
