<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->default(1);
            $table->date('event_date');
            $table->enum('type', ['menstruation', 'reminder', 'note']);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->time('time')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'event_date']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
