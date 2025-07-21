<p style="text-align: center;">
    <img src="{{ asset('img/logo.webp') }}" alt="Greenex Logo" style="max-width: 150px; margin-bottom: 20px;">
</p>
<h1>Confirmación de Recepción de Denuncia</h1>

<p>Estimado/a {{ $denuncia->nombre_denunciante }} {{ $denuncia->apellidos_denunciante }},</p>

<p>Hemos recibido su denuncia con el código de seguimiento: <strong>{{ $denuncia->codigo_seguimiento }}</strong></p>

<p>Puede utilizar este código para consultar el estado de su denuncia en el siguiente enlace:</p>
<p><a href="{{ route('seguimiento.index') }}">{{ route('seguimiento.index') }}</a></p>

<p>Agradecemos su confianza.</p>

<p>Atentamente,</p>
<p>El equipo de Greenex</p>
