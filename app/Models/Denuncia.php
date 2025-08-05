<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

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
        'assigned_user_id',
        'urgency_level',
        'fecha_inicio_investigacion',
        'fecha_informe_investigacion',
        'fecha_aplicacion_medidas',
        'fecha_derivacion_dt',
        'fecha_notificacion_diat',
    ];

    protected $casts = [
        'fecha_inicio_investigacion' => 'datetime',
        'fecha_informe_investigacion' => 'datetime',
        'fecha_aplicacion_medidas' => 'datetime',
        'fecha_derivacion_dt' => 'datetime',
        'fecha_notificacion_diat' => 'datetime',
        'medidas_proteccion_solicitadas' => 'boolean',
        'es_anonima' => 'boolean',
    ];

    protected $appends = ['fecha_fin_investigacion_prevista', 'fecha_aplicacion_medidas_prevista', 'categoria_denuncia'];

    public function categoriaDenuncia(): Attribute
    {
        return new Attribute(
            get: function () {
                $leyKarinTypeIds = [1, 2, 3]; // IDs for Ley Karin types
                $delitosYEticaTypeIds = [4, 5, 6]; // IDs for Delitos y Ética types

                $isLeyKarin = $this->tipos->pluck('id')->intersect($leyKarinTypeIds)->isNotEmpty();
                $isDelitosYEtica = $this->tipos->pluck('id')->intersect($delitosYEticaTypeIds)->isNotEmpty();

                if ($isLeyKarin && $isDelitosYEtica) {
                    return 'Mixta (Ley Karin y Delitos/Ética)';
                } elseif ($isLeyKarin) {
                    return 'Ley Karin';
                } elseif ($isDelitosYEtica) {
                    return 'Delitos y Falta a la Ética';
                } else {
                    return 'Otros'; // Or a more specific default if needed
                }
            }
        );
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

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

    public function isLeyKarin(): bool
    {
        // Assuming Ley Karin types have specific IDs, e.g., 1, 2, 3
        return $this->tipos()->whereIn('tipo_denuncia_id', [1, 2, 3])->exists();
    }

    protected function fechaFinInvestigacionPrevista(): Attribute
    {
        return new Attribute(
            get: fn () => $this->fecha_inicio_investigacion
                ? $this->fecha_inicio_investigacion->addDays(30)->format('Y-m-d')
                : null
        );
    }

    protected function fechaAplicacionMedidasPrevista(): Attribute
    {
        return new Attribute(
            get: fn () => $this->fecha_informe_investigacion
                ? $this->fecha_informe_investigacion->addDays(15)->format('Y-m-d')
                : null
        );
    }
}
