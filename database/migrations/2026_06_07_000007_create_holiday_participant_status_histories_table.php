<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('holiday_participant_status_histories');

        Schema::create('holiday_participant_status_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('holiday_saving_participant_id');
            $table->foreign('holiday_saving_participant_id', 'holiday_participant_status_fk')
                ->references('id')
                ->on('holiday_saving_participants')
                ->cascadeOnDelete();
            $table->enum('status', ['active', 'inactive']);
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamps();

            $table->index(['holiday_saving_participant_id', 'status', 'started_at'], 'holiday_participant_status_period_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holiday_participant_status_histories');
    }
};
