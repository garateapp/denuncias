<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\SugerenciaFelicitacion;

class NotificacionSugerenciaFelicitacion extends Mailable
{
    use Queueable, SerializesModels;

    public $sugerenciaFelicitacion;

    /**
     * Create a new message instance.
     */
    public function __construct(SugerenciaFelicitacion $sugerenciaFelicitacion)
    {
        $this->sugerenciaFelicitacion = $sugerenciaFelicitacion;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva ' . ucfirst($this->sugerenciaFelicitacion->tipo),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.sugerencia-felicitacion',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
