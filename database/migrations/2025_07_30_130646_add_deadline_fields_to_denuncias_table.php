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
        Schema::table('denuncias', function (Blueprint $table) {
            $table->timestamp('fecha_inicio_investigacion')->nullable();
            $table->timestamp('fecha_informe_investigacion')->nullable();
            $table->timestamp('fecha_aplicacion_medidas')->nullable();
            $table->timestamp('fecha_derivacion_dt')->nullable();
            $table->timestamp('fecha_notificacion_diat')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropColumn([
                'fecha_inicio_investigacion',
                'fecha_informe_investigacion',
                'fecha_aplicacion_medidas',
                'fecha_derivacion_dt',
                'fecha_notificacion_diat',
            ]);
        });
    }
};