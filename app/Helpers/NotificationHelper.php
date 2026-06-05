<?php

namespace App\Helpers;

use App\Models\Notification;

class NotificationHelper
{
    public static function send(
        int $userId,
        string $title,
        string $message,
        string $type = 'info'
    ): void {
        Notification::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'is_read' => false,
        ]);
    }
}