<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('holiday_saving_participants', function (Blueprint $table) {
            $table->timestamp('inactive_at')->nullable()->after('joined_at');
        });
    }

    public function down(): void
    {
        Schema::table('holiday_saving_participants', function (Blueprint $table) {
            $table->dropColumn('inactive_at');
        });
    }
};
