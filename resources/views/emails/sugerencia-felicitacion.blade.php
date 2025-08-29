<x-mail::message>
# Nueva {{ ucfirst($sugerenciaFelicitacion->tipo) }}

Se ha recibido una nueva {{ $sugerenciaFelicitacion->tipo }}.

**Nombre:** {{ $sugerenciaFelicitacion->nombre }}
**Email:** {{ $sugerenciaFelicitacion->email }}

**Detalle:**
{{ $sugerenciaFelicitacion->detalle }}

Gracias,<br>
Equipo Greenex
</x-mail::message>
