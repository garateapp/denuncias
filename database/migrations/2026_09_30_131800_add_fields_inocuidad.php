<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->string('area_ocurrencia', 100)->nullable()->after('fecha_notificacion_diat');
            $table->date('fecha_aproximada')->nullable()->after('area_ocurrencia');
            $table->string('turno', 50)->nullable()->after('fecha_aproximada');
            $table->string('fruta_despachada', 100)->nullable()->after('turno');
            $table->string('situacion_continua', 100)->nullable()->after('fruta_despachada');
        });
    }

    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropColumn('area_ocurrencia');
            $table->dropColumn('fecha_aproximada');
            $table->dropColumn('turno');
            $table->dropColumn('fruta_despachada');
            $table->dropColumn('situacion_continua');
        });
    }
};
