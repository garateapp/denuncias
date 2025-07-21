<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Denuncia;
use Illuminate\Support\Str;

class DenunciaReceived extends Mailable
{
    use Queueable, SerializesModels;

    public $denuncia;
    public $isLeyKarin;

    /**
     * Create a new message instance.
     */
    public function __construct(Denuncia $denuncia)
    {
        $this->denuncia = $denuncia->load('tipos');
        $this->isLeyKarin = $denuncia->tipos->contains(function ($tipo) {
            return Str::contains($tipo->nombre, 'Ley Karin', true);
        });
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva Denuncia Recibida - Código: ' . $this->denuncia->codigo_seguimiento,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.denuncia-received',
            with: [
                'denuncia' => $this->denuncia,
                'isLeyKarin' => $this->isLeyKarin,
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
