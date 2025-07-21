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
        Schema::create('denuncia_tipo_denuncia', function (Blueprint $table) {
            $table->foreignId('denuncia_id')->constrained()->onDelete('cascade');
            $table->foreignId('tipo_denuncia_id')->constrained('tipos_denuncia')->onDelete('cascade');
            $table->primary(['denuncia_id', 'tipo_denuncia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('denuncia_tipo_denuncia');
    }
};
