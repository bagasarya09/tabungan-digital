<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_fee_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('sinking_fund_total', 15, 2)->default(100000);
            $table->decimal('admin_fee_monthly_total', 15, 2)->default(6000);
            $table->date('start_date')->nullable();
            $table->date('holiday_date')->nullable();
            $table->unsignedInteger('active_participant_count')->default(0);
            $table->decimal('sinking_fund_per_user', 15, 2)->default(0);
            $table->decimal('admin_fee_per_user_monthly', 15, 2)->default(0);
            $table->unsignedInteger('total_program_months')->default(0);
            $table->decimal('admin_fee_total_per_user', 15, 2)->default(0);
            $table->decimal('total_deduction_per_user', 15, 2)->default(0);
            $table->decimal('estimated_total_available_balance', 15, 2)->default(0);
            $table->decimal('estimated_total_net_withdrawal', 15, 2)->default(0);
            $table->timestamp('calculated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_fee_settings');
    }
};
