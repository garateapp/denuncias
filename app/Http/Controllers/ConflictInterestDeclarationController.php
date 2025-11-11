<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConflictInterestDeclarationRequest;
use App\Models\ConflictInterestDeclaration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConflictInterestDeclarationController extends Controller
{
    /**
     * Display the declaration form.
     */
    public function create(): Response
    {
        return Inertia::render('Conflictos/Create', [
            'empresas' => [
                'Comercializadora Garate Ltda',
                'San Expedito',
                'Greenex Spa',
            ],
        ]);
    }

    /**
     * Store a new declaration.
     */
    public function store(StoreConflictInterestDeclarationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['firma_colaborador'] = $this->storeSignatureImage($data['firma_colaborador']);

        ConflictInterestDeclaration::create(array_merge(
            $data,
            ['submitted_at' => now()]
        ));

        return redirect()
            ->route('conflictos.create')
            ->with('status', 'Declaración registrada correctamente. Gracias por tu compromiso.');
    }

    /**
     * @throws ValidationException
     */
    protected function storeSignatureImage(string $base64Signature): string
    {
        if (!preg_match('/^data:image\\/(png|jpe?g);base64,/', $base64Signature, $matches)) {
            throw ValidationException::withMessages([
                'firma_colaborador' => 'La firma enviada no es válida.',
            ]);
        }

        $imageData = substr($base64Signature, strpos($base64Signature, ',') + 1);
        $binaryData = base64_decode($imageData, true);

        if ($binaryData === false) {
            throw ValidationException::withMessages([
                'firma_colaborador' => 'No se pudo procesar la firma. Por favor, vuelve a intentarlo.',
            ]);
        }

        $extension = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
        $path = 'firmas/' . Str::uuid() . '.' . $extension;

        Storage::disk('public')->put($path, $binaryData);

        return $path;
    }
}
