<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->string('empresa', 20)->default('novafresh')->after('codigo_seguimiento');
        });
    }

    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropColumn('empresa');
        });
    }
};
