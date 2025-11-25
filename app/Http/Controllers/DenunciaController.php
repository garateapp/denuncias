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
use Illuminate\Support\Facades\Route;
use Illuminate\Contracts\Foundation\Application;

class DenunciaController extends Controller
{
    public function welcome()
    {
        $tiposDenuncia = TipoDenuncia::all();

        $leyKarinNombres = ['Acoso Sexual', 'Acoso Laboral', 'Violencia en el Trabajo'];

        $leyKarinTipos = $tiposDenuncia->whereIn('nombre', $leyKarinNombres)->values();
        $otrosTipos = $tiposDenuncia->whereNotIn('nombre', $leyKarinNombres)->values();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
            'leyKarinTipos' => $leyKarinTipos->map(function ($tipo) {
                return ['id' => $tipo->id, 'nombre' => $tipo->nombre];
            })->toArray(),
            'otrosTipos' => $otrosTipos->map(function ($tipo) {
                return ['id' => $tipo->id, 'nombre' => $tipo->nombre];
            })->toArray(),
            'leyKarinTypeIds' => $leyKarinTipos->pluck('id')->toArray(),
        ]);
    }

    /**
     * Display the complaint form.
     */
    public function create(Request $request)
    {
        $initialTiposDenuncia = [];
        $initialEsAnonima = true;
        $leyKarinTypeIds = [1, 2, 3];
        $delitosYEticaTypeIds = [4, 5, 6];

        if ($request->has('category')) {
            $category = $request->input('category');
            if ($category === 'leyKarin') {
                $initialTiposDenuncia = $leyKarinTypeIds;
                $initialEsAnonima = false;
            } elseif ($category === 'delitosYEtica') {
                $initialTiposDenuncia = $delitosYEticaTypeIds;
                $initialEsAnonima = true;
            }
        }

        return Inertia::render('Denuncias/Create', [
            'initialTiposDenuncia' => $initialTiposDenuncia,
            'initialEsAnonima' => $initialEsAnonima,
            'leyKarinTypeIds' => $leyKarinTypeIds,
            'delitosYEticaTypeIds' => $delitosYEticaTypeIds,
        ]);
    }

    /**
     * Store a new complaint.
     */
    public function store(Request $request)
    {
        $leyKarinNombres = ['Acoso Sexual', 'Acoso Laboral', 'Violencia en el Trabajo'];
        $leyKarinTypeIds = TipoDenuncia::whereIn('nombre', $leyKarinNombres)->pluck('id')->toArray();

        $rules = [
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

            // Nuevo campo para email opcional de confirmación
            'email_opcional_confirmacion' => 'nullable|email|max:255',

            // Campos del denunciado
            'nombre_denunciado' => 'nullable|string|max:255',
            'apellidos_denunciado' => 'nullable|string|max:255',
            'area_denunciado' => 'nullable|string|max:255',
            'cargo_denunciado' => 'nullable|string|max:255',

            'evidencias.*' => 'nullable|file|max:10240', // Max 10MB per file
        ];

        $selectedTipos = $request->input('tipos_denuncia', []);
        $isLeyKarinSelected = count(array_intersect($selectedTipos, $leyKarinTypeIds)) > 0;

        if ($isLeyKarinSelected) {
            $rules['es_anonima'] = ['boolean', 'declined']; // Must be false (not anonymous)
        }

        if (!$request->input('es_anonima')) {
            $rules['nombre_denunciante'] = 'required|string|max:255';
            $rules['apellidos_denunciante'] = 'required|string|max:255';
            $rules['genero_denunciante'] = 'required|string|in:Masculino,Femenino,Otro,Prefiero no especificar';
            $rules['email_personal_denunciante'] = 'required|email|max:255';
            $rules['rut_denunciante'] = 'required|string|max:255';
            $rules['telefono_denunciante'] = 'required|string|max:255';
        }

        $validatedData = $request->validate($rules);

        $codigoSeguimiento = Str::random(10); // Generate a unique tracking code

        // Extraer el email opcional antes de crear la denuncia para no guardarlo
        $emailOpcionalConfirmacion = $request->input('email_opcional_confirmacion');
        unset($validatedData['email_opcional_confirmacion']);

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

        if ($request->has('tipos_denuncia')) {
            $denuncia->tipos()->attach($request->input('tipos_denuncia'));
        }

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
                ]);
            }
        }

        // Enviar correo electrónico a los administradores
        if(env('APP_ENV') === 'local') {


        $adminRecipients = [

            'carlos.alvarez@greenex.cl',
        ];
        } else {
          $adminRecipients = [

            'francisca.garate@greenex.cl',
            'nadia.lell@greenex.cl',
            'ximena.soto@greenex.cl',
            'eduardo.garate@greenex.cl',
            'ivan.romero@greenex.cl',
            'rodrigo.garate@greenex.cl',
            'cristian.salinas@planaris.cl',
        ];
        }

        Mail::to($adminRecipients)->send(new DenunciaReceived($denuncia));

        // Enviar correo de confirmación al denunciante si no es anónimo
        if ($denuncia->es_anonima && $emailOpcionalConfirmacion) {
            Mail::to($emailOpcionalConfirmacion)->send(new DenunciaConfirmation($denuncia));
        } elseif (!$denuncia->es_anonima && $denuncia->email_personal_denunciante) {
            Mail::to($denuncia->email_personal_denunciante)->send(new DenunciaConfirmation($denuncia));
        }

        return Inertia::render('Denuncias/Success', [
            'codigoSeguimiento' => $codigoSeguimiento,
        ]);
    }
}
