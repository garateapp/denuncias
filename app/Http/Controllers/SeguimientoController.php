<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SeguimientoController extends Controller
{
    /**
     * Display the tracking form.
     */
    public function index()
    {
        return Inertia::render('Seguimiento/Index');
    }

    /**
     * Display the specified complaint tracking information.
     */
    public function show(Request $request, $codigo)
    {
        $denuncia = Denuncia::where('codigo_seguimiento', $codigo)->with('actualizaciones', 'evidencias')->first();

        if (!$denuncia) {
            return redirect()->route('seguimiento.index')->withErrors(['codigo' => 'Código de seguimiento no válido.']);
        }

        return Inertia::render('Seguimiento/Show', [
            'denuncia' => $denuncia,
        ]);
    }
}
