# Separación de Empresas: Novafresh y Agrícola Greenex

## Resumen
Greenex Spa se dividió en dos empresas: **Novafresh** y **Agrícola Greenex**. El canal de denuncias debe permitir al denunciante seleccionar a qué empresa pertenece su denuncia, y enviar las notificaciones a listas de correo distintas según la empresa.

## Requerimientos

1. Agregar 2 nuevas tarjetas ("calugas") en la página de bienvenida para Agrícola Greenex:
   - Acoso o Violencia Laboral (Agrícola)
   - Delitos o Faltas a la Ética (Agrícola)
2. Al crear una denuncia, poder especificar si es para Novafresh o Agrícola Greenex
3. Correos de notificación:
   - **Agrícola Greenex**: `francisca.garate@novafresh.cl`, `nadia.lell@novafresh.cl`, `elizabeth.elizondo@novafresh.cl`, `eduardo.garate@novafresh.cl`, `iromero@novafresh.cl`, `rodrigo.garate@novafresh.cl`
   - **Novafresh**: misma lista pero sin `iromero@novafresh.cl`

## Supuestos

- Los tipos de denuncia (Acoso Sexual, Acoso Laboral, Violencia en el Trabajo, Robo, Cohecho, Otro) son **compartidos** entre ambas empresas
- No se requieren tipos de denuncia adicionales ni separados por empresa

## Diseño

### 1. Base de Datos

**Nueva migración**: `add_empresa_to_denuncias_table`

```php
Schema::table('denuncias', function (Blueprint $table) {
    $table->string('empresa', 20)->default('novafresh')->after('codigo_seguimiento');
});
```

### 2. Modelo `Denuncia`

Agregar `empresa` al `$fillable`

### 3. Controlador `DenunciaController`

#### `welcome()` - pasar indicador de empresas a la vista
#### `create(Request $request)` - aceptar parámetro `empresa`
#### `store(Request $request)` - guardar `empresa`, elegir lista de correos según empresa

### 4. Frontend

#### `Welcome.jsx` - 4 tarjetas (2 Novafresh + 2 Agrícola)
#### `Create.jsx` - banner con empresa, campo oculto
#### `Admin/Denuncias/Index.jsx` - columna empresa + filtro
#### `Admin/Denuncias/Show.jsx` - mostrar empresa

### 5. Email template
- `denuncia-received.blade.php` - indicar empresa

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| Nueva migración | `add_empresa_to_denuncias` |
| `app/Models/Denuncia.php` | +`empresa` a fillable |
| `app/Http/Controllers/DenunciaController.php` | welcome(), create(), store() |
| `app/Http/Controllers/AdminDenunciaController.php` | index() con filtro empresa |
| `resources/js/Pages/Welcome.jsx` | 4 tarjetas |
| `resources/js/Pages/Denuncias/Create.jsx` | Banner empresa |
| `resources/js/Pages/Admin/Denuncias/Index.jsx` | Columna + filtro |
| `resources/js/Pages/Admin/Denuncias/Show.jsx` | Campo empresa |
| `resources/js/Pages/Seguimiento/Show.jsx` | Campo empresa |
| `resources/views/emails/denuncia-received.blade.php` | Indicar empresa |
