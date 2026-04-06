<?php

namespace App\Listeners;

use App\Support\AuditLogger;
use Illuminate\Auth\Events\Logout;

class LogLogout
{
    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        AuditLogger::log(
            sifraFunkcije: 'auth_odjava',
            nazivFunkcije: 'Odjava korisnika',
            idKorisnika: $event->user?->id,
        );
    }
}
