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
    ];

    /**
     * Get the complaint that owns the evidence.
     */
    public function denuncia(): BelongsTo
    {
        return $this->belongsTo(Denuncia::class);
    }
}
