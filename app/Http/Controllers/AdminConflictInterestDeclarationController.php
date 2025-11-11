<?php

namespace App\Http\Controllers;

use App\Models\ConflictInterestDeclaration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminConflictInterestDeclarationController extends Controller
{
    private const REVIEW_STATUS_LABELS = [
        'sin_observaciones' => 'Sin observaciones',
        'con_observaciones' => 'Con observaciones',
        'requiere_seguimiento' => 'Requiere seguimiento',
    ];

    public function index(Request $request)
    {
        $statusFilter = $request->input('status', 'todos');

        $query = ConflictInterestDeclaration::with('reviewer')
            ->orderByDesc('created_at');

        if ($statusFilter === 'pendiente') {
            $query->whereNull('review_status');
        } elseif ($statusFilter !== 'todos') {
            $query->where('review_status', $statusFilter);
        }

        $declarations = $query->paginate(10)->withQueryString();

        $statusOptions = collect([
            ['value' => 'todos', 'label' => 'Todos'],
            ['value' => 'pendiente', 'label' => 'Pendiente'],
        ])->merge(
            collect(self::REVIEW_STATUS_LABELS)->map(function ($label, $value) {
                return ['value' => $value, 'label' => $label];
            })->values()
        )->values();

        return Inertia::render('Admin/Conflictos/Index', [
            'declarations' => $declarations,
            'statusFilter' => $statusFilter,
            'statusOptions' => $statusOptions,
            'statusLabels' => self::REVIEW_STATUS_LABELS,
        ]);
    }

    public function show(ConflictInterestDeclaration $declaration)
    {
        $declaration->load('reviewer');

        return Inertia::render('Admin/Conflictos/Show', [
            'declaration' => $declaration,
            'statusOptions' => self::REVIEW_STATUS_LABELS,
            'canReview' => Auth::user()->hasRole('Comisionado') || Auth::user()->hasRole('super-admin'),
            'signatureUrl' => $declaration->firma_colaborador
                ? route('admin.conflictos.signature', $declaration)
                : null,
        ]);
    }

    public function review(Request $request, ConflictInterestDeclaration $declaration)
    {
        $user = Auth::user();

        if (!$user->hasRole('Comisionado') && !$user->hasRole('super-admin')) {
            abort(403, 'No tienes permiso para registrar revisiones.');
        }

        $request->validate([
            'review_status' => ['required', Rule::in(array_keys(self::REVIEW_STATUS_LABELS))],
            'review_notes' => [
                Rule::requiredIf($request->input('review_status') !== 'sin_observaciones'),
                'nullable',
                'string',
                'max:2000',
            ],
        ]);

        $declaration->update([
            'review_status' => $request->input('review_status'),
            'review_notes' => $request->input('review_notes'),
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return redirect()
            ->back()
            ->with('status', 'Revisión registrada correctamente.');
    }

    public function signature(ConflictInterestDeclaration $declaration)
    {
        if (!$declaration->firma_colaborador || !Storage::disk('public')->exists($declaration->firma_colaborador)) {
            abort(404);
        }

        return Storage::disk('public')->response($declaration->firma_colaborador);
    }
}
