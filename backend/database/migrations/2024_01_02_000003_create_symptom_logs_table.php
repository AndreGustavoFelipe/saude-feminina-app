<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('symptom_logs', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->default(1);
            $table->foreignId('symptom_id')->constrained('symptoms')->onDelete('cascade');
            $table->date('log_date');
            $table->enum('intensity', ['leve', 'moderado', 'intenso']);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('symptom_logs');
    }
};
