<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HolidayParticipantStatusHistory extends Model
{
    protected $fillable = [
        'holiday_saving_participant_id',
        'status',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function participant()
    {
        return $this->belongsTo(HolidaySavingParticipant::class, 'holiday_saving_participant_id');
    }
}
