<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDenuncia extends Model
{
    protected $table = 'tipos_denuncia';
    protected $fillable = ['nombre'];

    public function denuncias()
    {
        return $this->belongsToMany(Denuncia::class, 'denuncia_tipo_denuncia', 'tipo_denuncia_id', 'denuncia_id');
    }
}
