<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holiday_saving_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('holiday_saving_program_id')
                ->constrained('holiday_saving_programs')
                ->cascadeOnDelete();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->unique(['holiday_saving_program_id', 'user_id'], 'holiday_program_user_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holiday_saving_participants');
    }
};
