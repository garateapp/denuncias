<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Denuncia;

class RequestMoreInfo extends Mailable
{
    use Queueable, SerializesModels;

    public $denuncia;
    public $messageContent;

    /**
     * Create a new message instance.
     */
    public function __construct(Denuncia $denuncia, string $messageContent)
    {
        $this->denuncia = $denuncia;
        $this->messageContent = $messageContent;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Solicitud de más antecedentes para su Denuncia #' . $this->denuncia->codigo_seguimiento,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.request-more-info',
            with: [
                'denuncia' => $this->denuncia,
                'messageContent' => $this->messageContent,
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
