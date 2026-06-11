<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HolidaySavingParticipant extends Model
{
    protected $fillable = [
        'holiday_saving_program_id',
        'user_id',
        'status',
        'joined_at',
        'inactive_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'inactive_at' => 'datetime',
    ];

    public function program()
    {
        return $this->belongsTo(HolidaySavingProgram::class, 'holiday_saving_program_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(HolidayParticipantStatusHistory::class);
    }
}
