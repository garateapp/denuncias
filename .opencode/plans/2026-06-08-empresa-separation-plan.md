# Separación Novafresh / Agrícola Greenex - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add empresa (Novafresh/Agrícola Greenex) field to denuncias, show 4 entry cards on welcome, route emails to different lists per empresa.

**Architecture:** Add `empresa` column to `denuncias` table. Welcome page renders 2 sections (one per company) with 2 cards each. Form receives `empresa` from URL param. Controller uses `empresa` to decide email recipients. Admin views show/filter by empresa.

**Tech Stack:** Laravel 12, React 18 + Inertia.js 2, Tailwind CSS, SQLite

---

### Task 1: Database Migration

**Files:**
- Create: `database/migrations/2026_06_08_000001_add_empresa_to_denuncias_table.php`
- Modify: `database/seeders/TipoDenunciaSeeder.php` (no changes needed - tipos are shared)

- [ ] **Step 1: Create migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->string('empresa', 20)->default('novafresh')->after('codigo_seguimiento');
        });
    }

    public function down(): void
    {
        Schema::table('denuncias', function (Blueprint $table) {
            $table->dropColumn('empresa');
        });
    }
};
```

- [ ] **Step 2: Run migration**

Run: `php artisan migrate`

---

### Task 2: Model Update

**Files:**
- Modify: `app/Models/Denuncia.php`

- [ ] **Step 1: Add `empresa` to $fillable**

In the `$fillable` array, add `'empresa'` in alphabetical order with the other fields:

```php
protected $fillable = [
    'asignado',
    'apellidos_denunciado',
    // ... other fields ...
    'empresa',
    'es_anonima',
    // ... rest of fields
];
```

---

### Task 3: DenunciaController - welcome()

**Files:**
- Modify: `app/Http/Controllers/DenunciaController.php`

- [ ] **Step 1: Update welcome() to pass empresa info**

The welcome() method currently sends `leyKarinTipos`, `otrosTipos`, `leyKarinTypeIds`, `delitosYEticaTypeIds` to the view. Add `empresas` array:

```php
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
```

No code changes needed to `welcome()` itself. The view will use the existing props to render 4 cards.

---

### Task 4: DenunciaController - create()

**Files:**
- Modify: `app/Http/Controllers/DenunciaController.php`

- [ ] **Step 1: Accept `empresa` parameter in create()**

```php
public function create(Request $request)
{
    $initialTiposDenuncia = [];
    $initialEsAnonima = true;
    $empresa = $request->input('empresa', 'novafresh');
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
        'empresa' => $empresa,
        'leyKarinTypeIds' => $leyKarinTypeIds,
        'delitosYEticaTypeIds' => $delitosYEticaTypeIds,
    ]);
}
```

---

### Task 5: DenunciaController - store()

**Files:**
- Modify: `app/Http/Controllers/DenunciaController.php`

- [ ] **Step 1: Add `empresa` to validation and email logic**

```php
$rules = [
    'descripcion' => 'required|string',
    'implicados' => 'nullable|string',
    'medidas_proteccion_solicitadas' => 'boolean',
    'es_anonima' => 'boolean',
    'empresa' => 'required|string|in:novafresh,agricola',
    // ... rest of rules
];
```

Replace the admin recipients block:

```php
if(env('APP_ENV') === 'local') {
    $adminRecipients = [
        'carlos.alvarez@greenex.cl',
    ];
} else {
    if ($denuncia->empresa === 'agricola') {
        $adminRecipients = [
            'francisca.garate@novafresh.cl',
            'nadia.lell@novafresh.cl',
            'elizabeth.elizondo@novafresh.cl',
            'eduardo.garate@novafresh.cl',
            'iromero@novafresh.cl',
            'rodrigo.garate@novafresh.cl',
        ];
    } else {
        $adminRecipients = [
            'francisca.garate@novafresh.cl',
            'nadia.lell@novafresh.cl',
            'elizabeth.elizondo@novafresh.cl',
            'eduardo.garate@novafresh.cl',
            'rodrigo.garate@novafresh.cl',
        ];
    }
}
```

---

### Task 6: Welcome.jsx - 4 cards

**Files:**
- Modify: `resources/js/Pages/Welcome.jsx`

- [ ] **Step 1: Update the grid to show 4 cards in 2 sections**

Replace the existing 2-card grid with 2 sections:

```jsx
{/* Novafresh Section */}
<div className="mb-10">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-left border-b pb-2">Novafresh</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acoso o Violencia Laboral - Novafresh */}
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Acoso o Violencia Laboral</h3>
                <p className="text-gray-600 mb-6">
                    Reporta situaciones de acoso sexual, acoso laboral o violencia en el trabajo, conforme a la Ley Karin.
                </p>
            </div>
            <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'leyKarin', empresa: 'novafresh' })}>
                Iniciar Denuncia
            </PrimaryButton>
        </div>
        {/* Delitos o Faltas a la Ética - Novafresh */}
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Delitos o Faltas a la Ética</h3>
                <p className="text-gray-600 mb-6">
                    Informa sobre robos, fraudes, sobornos, o cualquier otra conducta contraria a nuestro código de ética.
                </p>
            </div>
            <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'delitosYEtica', empresa: 'novafresh' })}>
                Iniciar Denuncia
            </PrimaryButton>
        </div>
    </div>
</div>

{/* Agrícola Greenex Section */}
<div className="mb-10">
    <h2 className="text-2xl font-bold text-green-800 mb-6 text-left border-b border-green-200 pb-2">Agrícola Greenex</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acoso o Violencia Laboral - Agrícola */}
        <div className="bg-green-50 overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-green-800 mb-3">Acoso o Violencia Laboral</h3>
                <p className="text-green-600 mb-6">
                    Reporta situaciones de acoso sexual, acoso laboral o violencia en el trabajo, conforme a la Ley Karin.
                </p>
            </div>
            <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'leyKarin', empresa: 'agricola' })} className="bg-green-600 hover:bg-green-700">
                Iniciar Denuncia
            </PrimaryButton>
        </div>
        {/* Delitos o Faltas a la Ética - Agrícola */}
        <div className="bg-green-50 overflow-hidden shadow-xl sm:rounded-lg p-8 flex flex-col items-center justify-between">
            <div>
                <h3 className="text-2xl font-bold text-green-800 mb-3">Delitos o Faltas a la Ética</h3>
                <p className="text-green-600 mb-6">
                    Informa sobre robos, fraudes, sobornos, o cualquier otra conducta contraria a nuestro código de ética.
                </p>
            </div>
            <PrimaryButton onClick={() => window.location.href = route('denuncias.create', { category: 'delitosYEtica', empresa: 'agricola' })} className="bg-green-600 hover:bg-green-700">
                Iniciar Denuncia
            </PrimaryButton>
        </div>
    </div>
</div>
```

---

### Task 7: Create.jsx - empresa banner

**Files:**
- Modify: `resources/js/Pages/Denuncias/Create.jsx`

- [ ] **Step 1: Receive `empresa` prop and show banner**

Change the function signature:

```jsx
export default function Create({ initialTiposDenuncia, initialEsAnonima, empresa = 'novafresh', leyKarinTypeIds = [], delitosYEticaTypeIds = [] }) {
```

Add empresa to useForm:

```jsx
const { data, setData, post, processing, errors, reset } = useForm({
    descripcion: '',
    implicados: '',
    medidas_proteccion_solicitadas: false,
    es_anonima: initialEsAnonima,
    empresa: empresa,
    // ... rest
});
```

Add empresa banner after the category info banner:

```jsx
{/* Empresa banner */}
<div className="mt-4">
    <div className={`p-4 border-l-4 ${empresa === 'agricola' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-gray-100 border-gray-400 text-gray-800'}`}>
        <p className="font-bold">Empresa: {empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}</p>
        <p className="text-sm">Esta denuncia será gestionada por el equipo de {empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}.</p>
    </div>
</div>
```

---

### Task 8: AdminDenunciaController - filter by empresa

**Files:**
- Modify: `app/Http/Controllers/AdminDenunciaController.php`

- [ ] **Step 1: Add empresa filter to index()**

```php
public function index(Request $request)
{
    $user = Auth::user();
    $query = Denuncia::with('tipos', 'assignedUser')->orderBy('created_at', 'desc');

    if ($user->hasRole('investigador') || $user->hasRole('Comisionado')) {
        $query->where('assigned_user_id', $user->id);
    } else if ($user->hasRole('Administrador') || $user->hasRole('super-admin')) {
        // No filter, they can see all complaints
    }

    // Filter by empresa
    if ($request->has('empresa') && in_array($request->empresa, ['novafresh', 'agricola'])) {
        $query->where('empresa', $request->empresa);
    }

    // ... rest of method
}
```

---

### Task 9: Admin Denuncias Index.jsx - add empresa column + filter

**Files:**
- Modify: `resources/js/Pages/Admin/Denuncias/Index.jsx`

- [ ] **Step 1: Add empresa filter buttons above the table**

Add after the view toggle buttons:

```jsx
{/* Filter by empresa */}
<div className="flex space-x-2 mb-4">
    <button
        onClick={() => Inertia.visit(route('admin.denuncias.index', { view: viewMode, empresa: '' }), { preserveScroll: true })}
        className={`px-3 py-1 rounded-md text-xs font-medium ${!route().params.empresa ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
        Todas
    </button>
    <button
        onClick={() => Inertia.visit(route('admin.denuncias.index', { view: viewMode, empresa: 'novafresh' }), { preserveScroll: true })}
        className={`px-3 py-1 rounded-md text-xs font-medium ${route().params.empresa === 'novafresh' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
        Novafresh
    </button>
    <button
        onClick={() => Inertia.visit(route('admin.denuncias.index', { view: viewMode, empresa: 'agricola' }), { preserveScroll: true })}
        className={`px-3 py-1 rounded-md text-xs font-medium ${route().params.empresa === 'agricola' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
    >
        Agrícola Greenex
    </button>
</div>
```

- [ ] **Step 2: Add empresa column to table**

After the "Código de Seguimiento" column header:

```jsx
<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
```

After the tracking code cell:

```jsx
<td className="px-6 py-4 whitespace-nowrap">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${denuncia.empresa === 'agricola' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {denuncia.empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}
    </span>
</td>
```

---

### Task 10: Admin Denuncias Show.jsx - show empresa

**Files:**
- Modify: `resources/js/Pages/Admin/Denuncias/Show.jsx`

- [ ] **Step 1: Add empresa field to the summary card**

After the tracking number line in the summary card:

```jsx
<div className="mb-4">
    <p className="text-sm font-medium text-gray-600">Empresa:</p>
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${denuncia.empresa === 'agricola' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {denuncia.empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}
    </span>
</div>
```

---

### Task 11: DenunciaCard.jsx - show empresa

**Files:**
- Modify: `resources/js/Components/DenunciaCard.jsx`

- [ ] **Step 1: Add empresa badge to card**

After the `categoria_denuncia` span:

```jsx
<div className="mb-2">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${denuncia.empresa === 'agricola' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {denuncia.empresa === 'agricola' ? 'Agrícola' : 'Novafresh'}
    </span>
</div>
```

---

### Task 12: Seguimiento Show.jsx - show empresa

**Files:**
- Modify: `resources/js/Pages/Seguimiento/Show.jsx`

- [ ] **Step 1: Add empresa to tracking display**

After the status line:

```jsx
<p><span className="font-semibold">Empresa:</span> {denuncia.empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}</p>
```

---

### Task 13: Email template - show empresa

**Files:**
- Modify: `resources/views/emails/denuncia-received.blade.php`

- [ ] **Step 1: Add empresa line to email**

After the tracking code line:

```blade
<p><strong>Empresa:</strong> {{ $denuncia->empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh' }}</p>
```

---

### Task 14: Success.jsx - show empresa

**Files:**
- Modify: `resources/js/Pages/Denuncias/Success.jsx`

- [ ] **Step 1: Pass empresa from controller and show it**

In `DenunciaController@store`:

```php
return Inertia::render('Denuncias/Success', [
    'codigoSeguimiento' => $codigoSeguimiento,
    'empresa' => $denuncia->empresa,
]);
```

In `Success.jsx`, accept `empresa` prop and display it:

```jsx
export default function Success({ codigoSeguimiento, empresa = 'novafresh' }) {
```

Add after the title:

```jsx
<div className="mb-4 text-center">
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${empresa === 'agricola' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {empresa === 'agricola' ? 'Agrícola Greenex' : 'Novafresh'}
    </span>
</div>
```

---

### Task 15: Verify everything works

- [ ] **Step 1: Run migration**

Run: `php artisan migrate`

- [ ] **Step 2: Start the dev server**

Run: `composer dev`

- [ ] **Step 3: Manual verification checklist**

1. Visit `/` - see 4 cards in 2 sections (Novafresh + Agrícola Greenex)
2. Click "Iniciar Denuncia" on Agrícola card - form shows "Empresa: Agrícola Greenex" banner
3. Submit a denuncia for Agrícola - verify empresa saved in DB
4. Submit a denuncia for Novafresh - verify empresa saved in DB
5. Check admin list - see empresa column and filter buttons
6. Check admin detail - see empresa in summary
7. Check public tracking - see empresa
8. Check email (log) - see empresa in email
