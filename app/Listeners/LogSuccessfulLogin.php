<?php

namespace App\Listeners;

use App\Support\AuditLogger;
use Illuminate\Auth\Events\Login;

class LogSuccessfulLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        AuditLogger::log(
            sifraFunkcije: 'auth_prijava',
            nazivFunkcije: 'Prijava korisnika',
            idKorisnika: $event->user->id,
        );
    }
}
