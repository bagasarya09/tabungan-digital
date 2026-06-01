<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();

        $table->foreignId('user_id')
            ->constrained()
            ->onDelete('cascade');

        $table->foreignId('saving_goal_id')
            ->constrained('saving_goals')
            ->onDelete('cascade');

        $table->enum('type', ['deposit', 'withdraw'])->default('deposit');

        $table->decimal('amount', 15, 2);

        $table->enum('status', ['pending', 'approved', 'rejected'])
            ->default('pending');

        $table->string('proof_image')->nullable();

        $table->text('note')->nullable();
        $table->text('admin_note')->nullable();

        $table->foreignId('approved_by')
            ->nullable()
            ->constrained('users')
            ->nullOnDelete();

        $table->timestamp('approved_at')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
