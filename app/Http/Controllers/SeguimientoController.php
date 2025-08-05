<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use App\Models\Evidencia;
use App\Models\ActualizacionDenuncia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
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

    public function addPublicUpdate(Request $request, $codigo)
    {
        $request->validate([
            'comentario' => 'required|string',
            'evidencias.*' => 'nullable|file|max:10240', // Max 10MB per file
        ]);

        $denuncia = Denuncia::where('codigo_seguimiento', $codigo)->firstOrFail();

        DB::transaction(function () use ($request, $denuncia) {
            $actualizacion = ActualizacionDenuncia::create([
                'denuncia_id' => $denuncia->id,
                'comentario' => $request->comentario,
                'estado_anterior' => $denuncia->estado,
                'estado_nuevo' => $denuncia->estado, // El estado no cambia con una actualización pública
                'user_id' => null, // No hay usuario autenticado
            ]);

            if ($request->hasFile('evidencias')) {
                foreach ($request->file('evidencias') as $file) {
                    $path = $file->store('evidencias', 'public');

                    Evidencia::create([
                        'denuncia_id' => $denuncia->id,
                        'nombre_archivo' => $file->getClientOriginalName(),
                        'ruta_archivo' => $path,
                        'tipo_mime' => $file->getMimeType(),
                        'tamano' => $file->getSize(),
                        'subido_por' => 'denunciante',
                        'actualizacion_denuncia_id' => $actualizacion->id,
                    ]);
                }
            }
        });

        return redirect()->route('seguimiento.show', $denuncia->codigo_seguimiento)->with('success', 'Información añadida correctamente.');
    }
}
