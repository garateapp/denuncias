<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConflictInterestDeclarationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'empresa' => 'required|string|in:Comercializadora Garate Ltda,San Expedito,Greenex Spa',
            'area' => 'required|string|max:255',
            'nombre_colaborador' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'rut' => 'required|string|max:255',
            'fecha' => 'required|date',
            'firma_colaborador' => 'required|string',
        ];

        foreach ($this->questionKeys() as $key) {
            $rules[$key] = 'required|boolean';
            $rules["{$key}_detalle"] = [
                Rule::requiredIf($this->isAffirmative($key)),
                'nullable',
                'string',
                'max:2000',
            ];
        }

        return $rules;
    }

    /**
     * @return array<int, string>
     */
    protected function questionKeys(): array
    {
        return [
            'intereses_externos',
            'beneficios_externos',
            'cliente_greenex',
            'negocios_agroindustria',
            'proveedor_greenex',
            'familiares_clientes_proveedores',
            'vinculos_misma_area',
            'relacion_sentimental',
            'vinculos_clientes_proveedores',
            'regalos_cortesia',
            'soborno_participacion',
            'propiedad_intelectual',
            'contratacion_terceros',
            'conductas_anticompetitivas',
        ];
    }

    protected function isAffirmative(string $key): bool
    {
        return filter_var($this->input($key), FILTER_VALIDATE_BOOLEAN);
    }
}
