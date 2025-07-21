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
        Schema::create('denuncias', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_seguimiento')->unique();
            $table->string('tipo_denuncia'); // Nuevo campo
            $table->text('descripcion');
            $table->text('implicados')->nullable();
            $table->boolean('medidas_proteccion_solicitadas')->default(false);
            $table->boolean('es_anonima')->default(true);
            $table->string('estado')->default('Recibida');

            // Campos del denunciante
            $table->string('nombre_denunciante')->nullable();
            $table->string('apellidos_denunciante')->nullable();
            $table->string('genero_denunciante')->nullable();
            $table->string('email_personal_denunciante')->nullable();
            $table->string('rut_denunciante')->nullable();
            $table->string('telefono_denunciante')->nullable();

            // Campos del denunciado
            $table->string('nombre_denunciado')->nullable();
            $table->string('apellidos_denunciado')->nullable();
            $table->string('area_denunciado')->nullable();
            $table->string('cargo_denunciado')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('denuncias');
    }
};
