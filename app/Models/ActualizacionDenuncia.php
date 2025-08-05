<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActualizacionDenuncia extends Model
{
    protected $fillable = [
        'denuncia_id',
        'comentario',
        'estado_anterior',
        'estado_nuevo',
        'user_id',
    ];

    /**
     * Get the complaint that owns the update.
     */
    public function denuncia(): BelongsTo
    {
        return $this->belongsTo(Denuncia::class);
    }

    /**
     * Get the user that owns the update.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the evidences for the update.
     */
    public function evidencias()
    {
        return $this->hasMany(Evidencia::class);
    }
}
