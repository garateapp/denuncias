<p>Estimado/a denunciante,</p>

<p>Esperamos que este correo le encuentre bien.</p>

<p>En relación a su denuncia con código de seguimiento <strong>{{ $denuncia->codigo_seguimiento }}</strong>, necesitamos solicitarle más antecedentes para poder continuar con la investigación de manera efectiva.</p>

<p>A continuación, el mensaje de nuestro equipo:</p>

<div style="border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px; margin-top: 20px; margin-bottom: 20px;">
    <p><em>{{ $messageContent }}</em></p>
</div>

<p>Para añadir la información solicitada y/o adjuntar nuevos archivos, por favor ingrese al siguiente enlace:</p>

<p><a href="{{ route('seguimiento.show', $denuncia->codigo_seguimiento) }}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Añadir Información</a></p>

<p>Agradecemos su colaboración para resolver este caso.</p>

<p>Atentamente,</p>
<p>El equipo de Greenex</p>
