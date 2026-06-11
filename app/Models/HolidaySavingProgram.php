<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HolidaySavingProgram extends Model
{
    protected $fillable = [
        'name',
        'holiday_type',
        'start_date',
        'holiday_date',
        'description',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'holiday_date' => 'date',
    ];

    public function participants()
    {
        return $this->hasMany(HolidaySavingParticipant::class);
    }

    public function feeSetting()
    {
        return $this->hasOne(HolidayProgramFeeSetting::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'program_id');
    }
}
