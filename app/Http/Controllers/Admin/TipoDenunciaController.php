<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TipoDenuncia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoDenunciaController extends Controller
{
    public function index()
    {
        $tiposDenuncia = TipoDenuncia::all();
        return Inertia::render('Admin/TiposDenuncia/Index', [
            'tiposDenuncia' => $tiposDenuncia,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:tipos_denuncia,nombre',
        ]);

        TipoDenuncia::create($request->all());

        return redirect()->route('admin.tipos_denuncia.index')
            ->with('success', 'Tipo de Denuncia creado exitosamente.');
    }

    public function update(Request $request, TipoDenuncia $tipoDenuncia)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:tipos_denuncia,nombre,' . $tipoDenuncia->id,
        ]);

        $tipoDenuncia->update($request->all());

        return redirect()->route('admin.tipos_denuncia.index')
            ->with('success', 'Tipo de Denuncia actualizado exitosamente.');
    }

    public function destroy(TipoDenuncia $tipoDenuncia)
    {
        $tipoDenuncia->delete();

        return redirect()->route('admin.tipos_denuncia.index')
            ->with('success', 'Tipo de Denuncia eliminado exitosamente.');
    }
}
