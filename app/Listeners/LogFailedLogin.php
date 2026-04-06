<?php

namespace App\Listeners;

use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Auth\Events\Failed;

class LogFailedLogin
{
    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        $idKorisnika = $event->user?->id;

        if (! $idKorisnika && isset($event->credentials['email'])) {
            $idKorisnika = User::query()
                ->where('email', (string) $event->credentials['email'])
                ->value('id');
        }

        AuditLogger::log(
            sifraFunkcije: 'auth_prijava',
            nazivFunkcije: 'Prijava korisnika',
            idKorisnika: $idKorisnika,
            detalji: [
                'email' => $event->credentials['email'] ?? null,
                'ishod' => 'neuspjeh',
            ],
        );
    }
}
