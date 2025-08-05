<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evidencia extends Model
{
    protected $fillable = [
        'denuncia_id',
        'nombre_archivo',
        'ruta_archivo',
        'tipo_mime',
        'tamano',
        'subido_por',
        'actualizacion_denuncia_id',
    ];

    /**
     * Get the complaint that owns the evidence.
     */
    public function denuncia(): BelongsTo
    {
        return $this->belongsTo(Denuncia::class);
    }

    /**
     * Get the update that owns the evidence.
     */
    public function actualizacionDenuncia(): BelongsTo
    {
        return $this->belongsTo(ActualizacionDenuncia::class);
    }
}
