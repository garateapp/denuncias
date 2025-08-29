<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SugerenciaFelicitacion extends Model
{
    protected $table = 'sugerencias_felicitaciones';

    protected $fillable = [
        'nombre',
        'email',
        'detalle',
        'tipo',
    ];
}
