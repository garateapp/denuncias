<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use App\Models\ActualizacionDenuncia;
use App\Models\TipoDenuncia;
use App\Models\User; // Import the User model
use App\Models\Evidencia; // Import the Evidencia model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminDenunciaController extends Controller
{
    /**
     * Display a listing of the complaints.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Denuncia::with('tipos', 'assignedUser')->orderBy('created_at', 'desc');

        if ($user->hasRole('investigador') || $user->hasRole('Comisionado')) {
            $query->where('assigned_user_id', $user->id);
        } else if ($user->hasRole('Administrador') || $user->hasRole('super-admin')) {
            // No filter, they can see all complaints
        }

        $currentView = $request->get('view', 'list');

        if ($currentView === 'kanban') {
            $denuncias = $query->get();
        } else {
            $denuncias = $query->paginate(10);
        }

        return Inertia::render('Admin/Denuncias/Index', [
            'denuncias' => $denuncias,
            'currentView' => $currentView,
        ]);
    }

    /**
     * Display the specified complaint.
     */
    public function show(Denuncia $denuncia)
    {
        $denuncia->load('evidencias', 'actualizaciones.user', 'assignedUser', 'tipos');
        $investigators = User::whereHas('roles', function ($query) {
            $query->where('name', 'Comisionado');
        })->get();

        $isLeyKarin = $denuncia->isLeyKarin();

        return Inertia::render('Admin/Denuncias/Show', [
            'denuncia' => $denuncia,
            'investigators' => $investigators,
            'isLeyKarin' => $isLeyKarin,
        ]);
    }

    /**
     * Assign a user and urgency level to the specified complaint.
     */
    public function assign(Request $request, Denuncia $denuncia)
    {
        $user = Auth::user();
        if ($user->hasRole('investigador') || $user->hasRole('Comisionado')) {
            abort(403, 'No tienes permiso para reasignar denuncias o cambiar la urgencia.');
        }

        $request->validate([
            'assigned_user_id' => 'required|exists:users,id',
            'urgency_level' => 'required|string|in:Baja,Media,Alta',
        ]);

        $denuncia->update([
            'assigned_user_id' => $request->assigned_user_id,
            'urgency_level' => $request->urgency_level,
        ]);

        return redirect()->back()->with('success', 'Denuncia asignada correctamente.');
    }

    /**
     * Update the deadlines for the specified complaint.
     */
    public function updateDeadlines(Request $request, Denuncia $denuncia)
    {
        $request->validate([
            'fecha_inicio_investigacion' => 'nullable|date',
            'fecha_informe_investigacion' => 'nullable|date',
            'fecha_aplicacion_medidas' => 'nullable|date',
            'fecha_derivacion_dt' => 'nullable|date',
            'fecha_notificacion_diat' => 'nullable|date',
        ]);

        $denuncia->update($request->all());

        return redirect()->back()->with('success', 'Plazos actualizados correctamente.');
    }

    /**
     * Update the specified complaint in storage.
     */
    public function update(Request $request, Denuncia $denuncia)
    {
        $user = Auth::user();
        if ($user->hasRole('Gerencia')) {
            abort(403, 'No tienes permiso para actualizar el estado de las denuncias.');
        }

        Log::info('Update method called for Denuncia ID: ' . $denuncia->id);
        Log::info('Request data:', $request->all());

        $request->validate([
            'estado' => 'required|string|in:Recibida,En Investigación,Resuelta,Cerrada',
        ]);

        Log::info('Denuncia state before update: ' . $denuncia->estado);

        $updated = $denuncia->update([
            'estado' => $request->estado,
        ]);

        Log::info('Denuncia updated: ' . ($updated ? 'Yes' : 'No'));
        Log::info('Denuncia state after update: ' . $denuncia->estado);

        return redirect()->back()->with('success', 'Estado de la denuncia actualizado correctamente.');
    }

    /**
     * Add a new update to the specified complaint.
     */
    public function addUpdate(Request $request, Denuncia $denuncia)
    {
        $request->validate([
            'comentario' => 'required|string',
            'estado_nuevo' => 'required|string|in:Recibida,En Investigación,Resuelta,Cerrada',
            'evidencias.*' => 'nullable|file|max:10240', // Max 10MB per file
        ]);

        DB::transaction(function () use ($request, $denuncia) {
            ActualizacionDenuncia::create([
                'denuncia_id' => $denuncia->id,
                'comentario' => $request->comentario,
                'estado_anterior' => $denuncia->estado,
                'estado_nuevo' => $request->estado_nuevo,
                'user_id' => Auth::id(),
            ]);

            $denuncia->update([
                'estado' => $request->estado_nuevo,
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
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', 'Actualización añadida correctamente.');
    }

    /**
     * Get dashboard statistics.
     */
    public function dashboardStats()
    {
        $user = Auth::user();
        $baseQuery = Denuncia::query();

        if ($user->hasRole('investigador')) {
            $baseQuery->where('denuncias.assigned_user_id', $user->id);
        }

        $totalReceived = $baseQuery->clone()->count();

        $totalReceivedMonth = $baseQuery->clone()
                                    ->whereMonth('denuncias.created_at', date('m'))
                                    ->whereYear('denuncias.created_at', date('Y'))
                                    ->count();

        $totalsByType = $baseQuery->clone()
                            ->join('denuncia_tipo_denuncia', 'denuncias.id', '=', 'denuncia_tipo_denuncia.denuncia_id')
                            ->join('tipos_denuncia', 'denuncia_tipo_denuncia.tipo_denuncia_id', '=', 'tipos_denuncia.id')
                            ->select('tipos_denuncia.nombre', DB::raw('count(denuncias.id) as total'))
                            ->whereMonth('denuncias.created_at', date('m')) // Added explicit qualification
                            ->whereYear('denuncias.created_at', date('Y')) // Added explicit qualification
                            ->groupBy('tipos_denuncia.nombre')
                            ->get();

        $totalLeyKarin = $baseQuery->clone()->whereHas('tipos', function ($query) {
            $query->whereIn('tipo_denuncia_id', [1, 2, 3]);
        })->count();

        $denunciasByDate = $baseQuery->clone()->select(DB::raw('DATE(denuncias.created_at) as date'), DB::raw('count(*) as total'))
                                ->groupBy('date')
                                ->orderBy('date', 'asc')
                                ->get();

        $totalsByStatus = $baseQuery->clone()->select('estado', DB::raw('count(*) as total'))
                                ->groupBy('estado')
                                ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalReceived' => $totalReceived,
                'totalReceivedMonth' => $totalReceivedMonth,
                'totalsByType' => $totalsByType,
                'totalLeyKarin' => $totalLeyKarin,
                'totalsByStatus' => $totalsByStatus,
            ],
            'chartData' => [
                'dates' => $denunciasByDate->pluck('date')->toArray(),
                'totals' => $denunciasByDate->pluck('total')->toArray(),
            ],
        ]);
    }

    /**
     * Request more information for the specified complaint.
     */
    public function requestMoreInfo(Request $request, Denuncia $denuncia)
    {
        $user = Auth::user();

        // Only allow Comisionado and Administrador to request more info
        if (!$user->hasRole('Comisionado') && !$user->hasRole('Administrador') && !$user->hasRole('super-admin')) {
            abort(403, 'No tienes permiso para solicitar más antecedentes.');
        }

        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        if (empty($denuncia->email_personal_denunciante)) {
            return redirect()->back()->with('error', 'La denuncia no tiene un correo electrónico registrado para solicitar más antecedentes.');
        }

        try {
            DB::transaction(function () use ($request, $denuncia, $user) {
                // Send email to the complainant
                Mail::to($denuncia->email_personal_denunciante)->send(new \App\Mail\RequestMoreInfo($denuncia, $request->message));

                // Record the request as an update
                ActualizacionDenuncia::create([
                    'denuncia_id' => $denuncia->id,
                    'comentario' => 'Se ha solicitado más antecedentes al denunciante: ' . $request->message,
                    'estado_anterior' => $denuncia->estado,
                    'estado_nuevo' => $denuncia->estado, // State remains the same
                    'user_id' => $user->id,
                ]);
            });

            return redirect()->back()->with('success', 'Solicitud de antecedentes enviada correctamente.');
        } catch (\Exception $e) {
            Log::error('Error sending request more info email: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error al enviar la solicitud de antecedentes.');
        }
    }
}
