<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ConflictInterestDeclaration extends Model
{
    use HasFactory;

    protected $fillable = [
        'empresa',
        'area',
        'nombre_colaborador',
        'cargo',
        'rut',
        'fecha',
        'intereses_externos',
        'intereses_externos_detalle',
        'beneficios_externos',
        'beneficios_externos_detalle',
        'cliente_greenex',
        'cliente_greenex_detalle',
        'negocios_agroindustria',
        'negocios_agroindustria_detalle',
        'proveedor_greenex',
        'proveedor_greenex_detalle',
        'familiares_clientes_proveedores',
        'familiares_clientes_proveedores_detalle',
        'vinculos_misma_area',
        'vinculos_misma_area_detalle',
        'relacion_sentimental',
        'relacion_sentimental_detalle',
        'vinculos_clientes_proveedores',
        'vinculos_clientes_proveedores_detalle',
        'regalos_cortesia',
        'regalos_cortesia_detalle',
        'soborno_participacion',
        'soborno_participacion_detalle',
        'propiedad_intelectual',
        'propiedad_intelectual_detalle',
        'contratacion_terceros',
        'contratacion_terceros_detalle',
        'conductas_anticompetitivas',
        'conductas_anticompetitivas_detalle',
        'firma_colaborador',
        'submitted_at',
        'review_status',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'fecha' => 'date',
        'intereses_externos' => 'boolean',
        'beneficios_externos' => 'boolean',
        'cliente_greenex' => 'boolean',
        'negocios_agroindustria' => 'boolean',
        'proveedor_greenex' => 'boolean',
        'familiares_clientes_proveedores' => 'boolean',
        'vinculos_misma_area' => 'boolean',
        'relacion_sentimental' => 'boolean',
        'vinculos_clientes_proveedores' => 'boolean',
        'regalos_cortesia' => 'boolean',
        'soborno_participacion' => 'boolean',
        'propiedad_intelectual' => 'boolean',
        'contratacion_terceros' => 'boolean',
        'conductas_anticompetitivas' => 'boolean',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = [
        'firma_url',
    ];

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function getFirmaUrlAttribute(): ?string
    {
        if (!$this->firma_colaborador) {
            return null;
        }

        return Storage::disk('public')->url($this->firma_colaborador);
    }
}
