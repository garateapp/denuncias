<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\TipoDenuncia;

class Denuncia extends Model
{
    protected $fillable = [
        'codigo_seguimiento',
        'descripcion',
        'implicados',
        'medidas_proteccion_solicitadas',
        'es_anonima',
        'estado',
        'nombre_denunciante',
        'apellidos_denunciante',
        'genero_denunciante',
        'email_personal_denunciante',
        'rut_denunciante',
        'telefono_denunciante',
        'nombre_denunciado',
        'apellidos_denunciado',
        'area_denunciado',
        'cargo_denunciado',
    ];

    public function tipos()
    {
        return $this->belongsToMany(TipoDenuncia::class, 'denuncia_tipo_denuncia', 'denuncia_id', 'tipo_denuncia_id');
    }

    /**
     * Get the evidences for the complaint.
     */
    public function evidencias(): HasMany
    {
        return $this->hasMany(Evidencia::class);
    }

    /**
     * Get the updates for the complaint.
     */
    public function actualizaciones(): HasMany
    {
        return $this->hasMany(ActualizacionDenuncia::class);
    }
}
