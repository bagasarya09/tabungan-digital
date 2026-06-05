<?php

namespace App\Helpers;

use App\Models\ActivityLog;

class ActivityLogger
{
    public static function log(
        string $action,
        ?string $description = null,
        $subject = null,
        array $properties = []
    ): void {
        $user = auth()->user();

        ActivityLog::create([
            'user_id' => $user?->id,
            'role' => $user?->role,
            'action' => $action,
            'description' => $description,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->id,
            'properties' => $properties,
        ]);
    }
}