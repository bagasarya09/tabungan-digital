<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HolidayProgramFeeSetting extends Model
{
    protected $fillable = [
        'holiday_saving_program_id',
        'sinking_fund_total',
        'admin_fee_monthly_total',
        'active_participant_count',
        'sinking_fund_per_user',
        'admin_fee_per_user_monthly',
        'total_program_months',
        'admin_fee_total_per_user',
        'total_deduction_per_user',
        'calculated_at',
    ];

    protected $casts = [
        'sinking_fund_total' => 'decimal:2',
        'admin_fee_monthly_total' => 'decimal:2',
        'sinking_fund_per_user' => 'decimal:2',
        'admin_fee_per_user_monthly' => 'decimal:2',
        'admin_fee_total_per_user' => 'decimal:2',
        'total_deduction_per_user' => 'decimal:2',
        'calculated_at' => 'datetime',
    ];

    public function program()
    {
        return $this->belongsTo(HolidaySavingProgram::class, 'holiday_saving_program_id');
    }
}
