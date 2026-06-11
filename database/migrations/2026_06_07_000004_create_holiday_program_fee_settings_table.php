<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holiday_program_fee_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('holiday_saving_program_id')
                ->constrained('holiday_saving_programs')
                ->cascadeOnDelete();
            $table->decimal('sinking_fund_total', 15, 2)->default(100000);
            $table->decimal('admin_fee_monthly_total', 15, 2)->default(6000);
            $table->unsignedInteger('active_participant_count')->default(0);
            $table->decimal('sinking_fund_per_user', 15, 2)->default(0);
            $table->decimal('admin_fee_per_user_monthly', 15, 2)->default(0);
            $table->unsignedInteger('total_program_months')->default(0);
            $table->decimal('admin_fee_total_per_user', 15, 2)->default(0);
            $table->decimal('total_deduction_per_user', 15, 2)->default(0);
            $table->timestamp('calculated_at')->nullable();
            $table->timestamps();

            $table->unique('holiday_saving_program_id', 'holiday_program_fee_setting_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holiday_program_fee_settings');
    }
};
