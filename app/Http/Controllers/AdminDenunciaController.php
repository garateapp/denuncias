<?php

namespace App\Http\Controllers;

use App\Models\Denuncia;
use App\Models\ActualizacionDenuncia;
use App\Models\TipoDenuncia;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminDenunciaController extends Controller
{
    /**
     * Display a listing of the complaints.
     */
    public function index()
    {
        $denuncias = Denuncia::with('tipos')->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Admin/Denuncias/Index', [
            'denuncias' => $denuncias,
        ]);
    }

    /**
     * Display the specified complaint.
     */
    public function show(Denuncia $denuncia)
    {
        $denuncia->load('evidencias', 'actualizaciones.user');

        return Inertia::render('Admin/Denuncias/Show', [
            'denuncia' => $denuncia,
        ]);
    }

    /**
     * Update the specified complaint in storage.
     */
    public function update(Request $request, Denuncia $denuncia)
    {
        $request->validate([
            'estado' => 'required|string|in:Recibida,En Investigación,Resuelta,Cerrada',
        ]);

        $denuncia->update([
            'estado' => $request->estado,
        ]);

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
        ]);

        ActualizacionDenuncia::create([
            'denuncia_id' => $denuncia->id,
            'comentario' => $request->comentario,
            'estado_anterior' => $denuncia->estado,
            'estado_nuevo' => $denuncia->estado_nuevo,
            'user_id' => Auth::id(),
        ]);

        $denuncia->update([
            'estado' => $request->estado_nuevo,
        ]);

        return redirect()->back()->with('success', 'Actualización añadida correctamente.');
    }

    /**
     * Get dashboard statistics.
     */
    public function dashboardStats()
    {
        $totalReceived = Denuncia::count();
        $totalReceivedMonth = Denuncia::whereMonth('created_at', date('m'))
                                    ->whereYear('created_at', date('Y'))
                                    ->count();

        $totalsByType = DB::table('denuncias')
                            ->join('denuncia_tipo_denuncia', 'denuncias.id', '=', 'denuncia_tipo_denuncia.denuncia_id')
                            ->join('tipos_denuncia', 'denuncia_tipo_denuncia.tipo_denuncia_id', '=', 'tipos_denuncia.id')
                            ->select('tipos_denuncia.nombre', DB::raw('count(*) as total'))
                            ->groupBy('tipos_denuncia.nombre')
                            ->get();

        $totalLeyKarin = Denuncia::whereHas('tipos', function ($query) {
            $query->whereIn('tipo_denuncia_id', [1, 2, 3]);
        })->count();

        $denunciasByDate = Denuncia::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as total'))
                                ->groupBy('date')
                                ->orderBy('date', 'asc')
                                ->get();

        $totalsByStatus = Denuncia::select('estado', DB::raw('count(*) as total'))
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
}
