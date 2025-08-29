<?php

namespace App\Http\Controllers;


use App\Mail\NotificacionSugerenciaFelicitacion;
use App\Models\SugerenciaFelicitacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SugerenciaFelicitacionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'detalle' => 'required|string',
            'tipo' => 'required|string|in:sugerencia,felicitacion',
        ]);

        $sugerenciaFelicitacion = SugerenciaFelicitacion::create($request->all());

        // Enviar correo
        $emails = ['francisca.garate@greenex.cl', 'carlos.alvarez@greenex.cl'];
        Mail::to($emails)->send(new NotificacionSugerenciaFelicitacion($sugerenciaFelicitacion));

        return redirect()->back()->with('success', 'Gracias por tu mensaje. Ha sido enviado correctamente.');
    }
}

