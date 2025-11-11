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
        Schema::create('conflict_interest_declarations', function (Blueprint $table) {
            $table->id();
            $table->string('empresa');
            $table->string('area');
            $table->string('nombre_colaborador');
            $table->string('cargo');
            $table->string('rut');
            $table->date('fecha');
            $table->boolean('intereses_externos')->default(false);
            $table->text('intereses_externos_detalle')->nullable();
            $table->boolean('beneficios_externos')->default(false);
            $table->text('beneficios_externos_detalle')->nullable();
            $table->boolean('cliente_greenex')->default(false);
            $table->text('cliente_greenex_detalle')->nullable();
            $table->boolean('negocios_agroindustria')->default(false);
            $table->text('negocios_agroindustria_detalle')->nullable();
            $table->boolean('proveedor_greenex')->default(false);
            $table->text('proveedor_greenex_detalle')->nullable();
            $table->boolean('familiares_clientes_proveedores')->default(false);
            $table->text('familiares_clientes_proveedores_detalle')->nullable();
            $table->boolean('vinculos_misma_area')->default(false);
            $table->text('vinculos_misma_area_detalle')->nullable();
            $table->boolean('relacion_sentimental')->default(false);
            $table->text('relacion_sentimental_detalle')->nullable();
            $table->boolean('vinculos_clientes_proveedores')->default(false);
            $table->text('vinculos_clientes_proveedores_detalle')->nullable();
            $table->boolean('regalos_cortesia')->default(false);
            $table->text('regalos_cortesia_detalle')->nullable();
            $table->boolean('soborno_participacion')->default(false);
            $table->text('soborno_participacion_detalle')->nullable();
            $table->boolean('propiedad_intelectual')->default(false);
            $table->text('propiedad_intelectual_detalle')->nullable();
            $table->boolean('contratacion_terceros')->default(false);
            $table->text('contratacion_terceros_detalle')->nullable();
            $table->boolean('conductas_anticompetitivas')->default(false);
            $table->text('conductas_anticompetitivas_detalle')->nullable();
            $table->string('firma_colaborador');
            $table->timestamp('submitted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conflict_interest_declarations');
    }
};
