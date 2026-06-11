<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holiday_saving_programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('holiday_type', ['idul_fitri', 'idul_adha', 'other'])->default('idul_fitri');
            $table->date('start_date');
            $table->date('holiday_date');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holiday_saving_programs');
    }
};
