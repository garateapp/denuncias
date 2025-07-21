<p style="text-align: center;">
    <img src="{{ asset('img/logo.webp') }}" alt="Greenex Logo" style="max-width: 150px; margin-bottom: 20px;">
</p>
<h1>Nueva Denuncia Recibida</h1>

<p>Se ha recibido una nueva denuncia con el siguiente código de seguimiento: <strong>{{ $denuncia->codigo_seguimiento }}</strong></p>

<h2>Detalles de la Denuncia:</h2>

@if($isLeyKarin)
    <p style="color: #d9534f; font-weight: bold;">Esta denuncia se enmarca en las disposiciones de la Ley Karin.</p>
@endif

<ul>
    <li><strong>Descripción de los hechos:</strong> {{ $denuncia->descripcion }}</li>
    @if($denuncia->implicados)
        <li><strong>Posibles implicados:</strong> {{ $denuncia->implicados }}</li>
    @endif
    <li><strong>Medidas de protección solicitadas:</strong> {{ $denuncia->medidas_proteccion_solicitadas ? 'Sí' : 'No' }}</li>
    <li><strong>Denuncia anónima:</strong> {{ $denuncia->es_anonima ? 'Sí' : 'No' }}</li>
</ul>

@if(!$denuncia->es_anonima)
    <h3>Datos del Denunciante:</h3>
    <ul>
        <li><strong>Nombre:</strong> {{ $denuncia->nombre_denunciante }} {{ $denuncia->apellidos_denunciante }}</li>
        <li><strong>Género:</strong> {{ $denuncia->genero_denunciante }}</li>
        <li><strong>Email Personal:</strong> {{ $denuncia->email_personal_denunciante }}</li>
        <li><strong>RUT:</strong> {{ $denuncia->rut_denunciante }}</li>
        <li><strong>Teléfono:</strong> {{ $denuncia->telefono_denunciante }}</li>
    </ul>
@endif

@if($denuncia->nombre_denunciado || $denuncia->apellidos_denunciado || $denuncia->area_denunciado || $denuncia->cargo_denunciado)
    <h3>Datos del Denunciado:</h3>
    <ul>
        @if($denuncia->nombre_denunciado)
            <li><strong>Nombre:</strong> {{ $denuncia->nombre_denunciado }}</li>
        @endif
        @if($denuncia->apellidos_denunciado)
            <li><strong>Apellidos:</strong> {{ $denuncia->apellidos_denunciado }}</li>
        @endif
        @if($denuncia->area_denunciado)
            <li><strong>Área o Sector:</strong> {{ $denuncia->area_denunciado }}</li>
        @endif
        @if($denuncia->cargo_denunciado)
            <li><strong>Cargo o Puesto:</strong> {{ $denuncia->cargo_denunciado }}</li>
        @endif
    </ul>
@endif

@if($denuncia->evidencias->count() > 0)
    <h3>Evidencias Adjuntas:</h3>
    <ul>
        @foreach($denuncia->evidencias as $evidencia)
            <li><a href="{{ asset('storage/' . $evidencia->ruta_archivo) }}">{{ $evidencia->nombre_archivo }}</a></li>
        @endforeach
    </ul>
@endif

<p>Puedes ver los detalles completos de la denuncia en el panel de administración.</p>
