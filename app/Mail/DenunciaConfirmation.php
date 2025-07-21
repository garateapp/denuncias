<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Denuncia;

class DenunciaConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $denuncia;

    /**
     * Create a new message instance.
     */
    public function __construct(Denuncia $denuncia)
    {
        $this->denuncia = $denuncia;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmación de Recepción de Denuncia - Código: ' . $this->denuncia->codigo_seguimiento,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.denuncia-confirmation',
            with: [
                'denuncia' => $this->denuncia,
            ],
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
