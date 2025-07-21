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
        Schema::create('actualizacion_denuncias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('denuncia_id')->constrained()->onDelete('cascade');
            $table->text('comentario');
            $table->string('estado_anterior')->nullable();
            $table->string('estado_nuevo');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actualizacion_denuncias');
    }
};
