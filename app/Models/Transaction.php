<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'saving_goal_id',
        'saving_type',
        'program_id',
        'type',
        'amount',
        'status',
        'proof_image',
        'note',
        'admin_note',
        'approved_by',
        'approved_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savingGoal()
    {
        return $this->belongsTo(SavingGoal::class);
    }

    public function holidayProgram()
    {
        return $this->belongsTo(HolidaySavingProgram::class, 'program_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
