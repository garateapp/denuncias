<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SugerenciaFelicitacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSugerenciaFelicitacionController extends Controller
{
    public function index()
    {
        $sugerenciasFelicitaciones = SugerenciaFelicitacion::latest()->get();

        return Inertia::render('Admin/SugerenciasFelicitaciones/Index', [
            'sugerenciasFelicitaciones' => $sugerenciasFelicitaciones,
        ]);
    }
}
