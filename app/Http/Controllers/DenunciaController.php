<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use App\Models\Evidencia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\DenunciaReceived;
use App\Mail\DenunciaConfirmation;
use App\Models\TipoDenuncia;

class DenunciaController extends Controller
{
    /**
     * Display the complaint form.
     */
    public function create()
    {
        $tiposDenuncia = TipoDenuncia::all();
        return Inertia::render('Denuncias/Create', [
            'tiposDenuncia' => $tiposDenuncia,
        ]);
    }

    /**
     * Store a new complaint.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string',
            'implicados' => 'nullable|string',
            'medidas_proteccion_solicitadas' => 'boolean',
            'es_anonima' => 'boolean',

            // Campos del denunciante
            'nombre_denunciante' => 'nullable|string|max:255',
            'apellidos_denunciante' => 'nullable|string|max:255',
            'genero_denunciante' => 'nullable|string|in:Masculino,Femenino,Otro,Prefiero no especificar',
            'email_personal_denunciante' => 'nullable|email|max:255',
            'rut_denunciante' => 'nullable|string|max:255',
            'telefono_denunciante' => 'nullable|string|max:255',

            // Campos del denunciado
            'nombre_denunciado' => 'nullable|string|max:255',
            'apellidos_denunciado' => 'nullable|string|max:255',
            'area_denunciado' => 'nullable|string|max:255',
            'cargo_denunciado' => 'nullable|string|max:255',

            'evidencias.*' => 'nullable|file|max:10240', // Max 10MB per file
            'tipos_denuncia' => 'required|array',
            'tipos_denuncia.*' => 'exists:tipos_denuncia,id',
        ]);

        $codigoSeguimiento = Str::random(10); // Generate a unique tracking code

        $denuncia = Denuncia::create(array_merge($validatedData, [
            'codigo_seguimiento' => $codigoSeguimiento,
            'estado' => 'Recibida',
            'nombre_denunciante' => $request->es_anonima ? null : $request->nombre_denunciante,
            'apellidos_denunciante' => $request->es_anonima ? null : $request->apellidos_denunciante,
            'genero_denunciante' => $request->es_anonima ? null : $request->genero_denunciante,
            'email_personal_denunciante' => $request->es_anonima ? null : $request->email_personal_denunciante,
            'rut_denunciante' => $request->es_anonima ? null : $request->rut_denunciante,
            'telefono_denunciante' => $request->es_anonima ? null : $request->telefono_denunciante,
        ]));

        $denuncia->tipos()->attach($request->input('tipos_denuncia'));

        if ($request->hasFile('evidencias')) {
            foreach ($request->file('evidencias') as $file) {
                $path = $file->store('evidencias', 'public');

                Evidencia::create([
                    'denuncia_id' => $denuncia->id,
                    'nombre_archivo' => $file->getClientOriginalName(),
                    'ruta_archivo' => $path,
                    'tipo_mime' => $file->getMimeType(),
                    'tamano' => $file->getSize(),
                ]);
            }
        }

        // Enviar correo electrónico a los administradores
        $adminRecipients = [
            // 'carlos.alvarez@greenex.cl',
            'eduardo.garate@greenex.cl',
            'ivan.romero@greenex.cl',
            'rodrigo.garate@greenex.cl',
        ];

        Mail::to($adminRecipients)->send(new DenunciaReceived($denuncia));

        // Enviar correo de confirmación al denunciante si no es anónimo
        if (!$denuncia->es_anonima && $denuncia->email_personal_denunciante) {
            Mail::to($denuncia->email_personal_denunciante)->send(new DenunciaConfirmation($denuncia));
        }

        return Inertia::render('Denuncias/Success', [
            'codigoSeguimiento' => $codigoSeguimiento,
        ]);
    }
}
