<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DenunciaController;
use App\Http\Controllers\SeguimientoController;
use App\Http\Controllers\SugerenciaFelicitacionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [DenunciaController::class, 'welcome'])->name('welcome');

Route::get('/dashboard', [App\Http\Controllers\AdminDenunciaController::class, 'dashboardStats'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Rutas públicas para el canal de denuncias
Route::get('/denunciar', [DenunciaController::class, 'create'])->name('denuncias.create');
Route::post('/denuncias', [DenunciaController::class, 'store'])->name('denuncias.store');
Route::get('/seguimiento', [SeguimientoController::class, 'index'])->name('seguimiento.index');
Route::get('/denuncias/{codigo}', [SeguimientoController::class, 'show'])->name('seguimiento.show');
Route::post('/seguimiento/{codigo}', [SeguimientoController::class, 'addPublicUpdate'])->name('seguimiento.addPublicUpdate');
Route::post('sugerencias-felicitaciones', [SugerenciaFelicitacionController::class, 'store'])->name('sugerencias.felicitaciones.store');


require __DIR__.'/auth.php';

// Rutas para el panel de administración de denuncias
Route::middleware(['auth', 'verified', 'role:admin|super-admin|Comisionado|Gerencia'])->group(function () {
    Route::get('/admin/denuncias', [App\Http\Controllers\AdminDenunciaController::class, 'index'])->name('admin.denuncias.index');
    Route::get('/admin/denuncias/{denuncia}', [App\Http\Controllers\AdminDenunciaController::class, 'show'])->name('admin.denuncias.show');
    Route::patch('/admin/denuncias/{denuncia}', [App\Http\Controllers\AdminDenunciaController::class, 'update'])->name('admin.denuncias.update');
    Route::post('/admin/denuncias/{denuncia}/actualizar', [App\Http\Controllers\AdminDenunciaController::class, 'addUpdate'])->name('admin.denuncias.addUpdate');
    Route::post('/admin/denuncias/{denuncia}/assign', [App\Http\Controllers\AdminDenunciaController::class, 'assign'])->name('admin.denuncias.assign');
    Route::post('/admin/denuncias/{denuncia}/deadlines', [App\Http\Controllers\AdminDenunciaController::class, 'updateDeadlines'])->name('admin.denuncias.updateDeadlines');

    Route::post('/admin/denuncias/{denuncia}/request-info', [App\Http\Controllers\AdminDenunciaController::class, 'requestMoreInfo'])->name('admin.denuncias.requestMoreInfo');
    Route::post('/admin/denuncias/{denuncia}/tipos', [App\Http\Controllers\AdminDenunciaController::class, 'updateTipos'])->name('admin.denuncias.updateTipos');

    // Rutas para la gestión de roles y permisos
    Route::get('/admin/roles', [App\Http\Controllers\Admin\RolePermissionController::class, 'index'])->name('admin.roles.index');
    Route::post('/admin/roles', [App\Http\Controllers\Admin\RolePermissionController::class, 'storeRole'])->name('admin.roles.store');
    Route::put('/admin/roles/{role}', [App\Http\Controllers\Admin\RolePermissionController::class, 'updateRole'])->name('admin.roles.update');
    Route::delete('/admin/roles/{role}', [App\Http\Controllers\Admin\RolePermissionController::class, 'destroyRole'])->name('admin.roles.destroy');
    Route::post('/admin/permissions', [App\Http\Controllers\Admin\RolePermissionController::class, 'storePermission'])->name('admin.permissions.store');
    Route::put('/admin/permissions/{permission}', [App\Http\Controllers\Admin\RolePermissionController::class, 'updatePermission'])->name('admin.permissions.update');
    Route::delete('/admin/permissions/{permission}', [App\Http\Controllers\Admin\RolePermissionController::class, 'destroyPermission'])->name('admin.permissions.destroy');
    Route::post('/admin/roles/{role}/assign-permissions', [App\Http\Controllers\Admin\RolePermissionController::class, 'assignPermission'])->name('admin.roles.assignPermission');

    // Rutas para la gestión de Tipos de Denuncia
    Route::get('/admin/tipos-denuncia', [App\Http\Controllers\Admin\TipoDenunciaController::class, 'index'])->name('admin.tipos_denuncia.index');
    Route::post('/admin/tipos-denuncia', [App\Http\Controllers\Admin\TipoDenunciaController::class, 'store'])->name('admin.tipos_denuncia.store');
    Route::put('/admin/tipos-denuncia/{tipoDenuncia}', [App\Http\Controllers\Admin\TipoDenunciaController::class, 'update'])->name('admin.tipos_denuncia.update');
    Route::delete('/admin/tipos-denuncia/{tipoDenuncia}', [App\Http\Controllers\Admin\TipoDenunciaController::class, 'destroy'])->name('admin.tipos_denuncia.destroy');

    // Rutas para la gestión de Usuarios
    Route::get('/admin/users', [App\Http\Controllers\Admin\UserController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [App\Http\Controllers\Admin\UserController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}/roles', [App\Http\Controllers\Admin\UserController::class, 'updateRole'])->name('admin.users.updateRole');

    // Ruta para ver sugerencias y felicitaciones
    Route::get('/admin/sugerencias-felicitaciones', [App\Http\Controllers\Admin\AdminSugerenciaFelicitacionController::class, 'index'])->name('admin.sugerencias_felicitaciones.index');
});