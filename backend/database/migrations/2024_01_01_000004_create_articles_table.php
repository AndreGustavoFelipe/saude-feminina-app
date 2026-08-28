<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body')->nullable();
            $table->string('cover_image')->nullable();
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('life_phase_id')->nullable()->constrained('life_phases')->onDelete('set null');
            $table->integer('display_order')->default(0);
            $table->integer('user_id')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
