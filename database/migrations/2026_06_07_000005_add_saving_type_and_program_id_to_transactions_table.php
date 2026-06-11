<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('saving_type', ['general', 'holiday'])
                ->default('general')
                ->after('saving_goal_id');
            $table->foreignId('program_id')
                ->nullable()
                ->after('saving_type')
                ->constrained('holiday_saving_programs')
                ->nullOnDelete();
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['saving_goal_id']);
            $table->foreignId('saving_goal_id')
                ->nullable()
                ->change();
            $table->foreign('saving_goal_id')
                ->references('id')
                ->on('saving_goals')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['program_id']);
            $table->dropColumn(['saving_type', 'program_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['saving_goal_id']);
            $table->foreignId('saving_goal_id')
                ->nullable(false)
                ->change();
            $table->foreign('saving_goal_id')
                ->references('id')
                ->on('saving_goals')
                ->cascadeOnDelete();
        });
    }
};
