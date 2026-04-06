<?php

namespace App\Listeners;

use App\Support\AuditLogger;
use Illuminate\Auth\Events\PasswordReset;

class LogPasswordReset
{
    /**
     * Handle the event.
     */
    public function handle(PasswordReset $event): void
    {
        AuditLogger::log(
            sifraFunkcije: 'auth_reset_lozinke',
            nazivFunkcije: 'Reset lozinke',
            idKorisnika: $event->user->id,
        );
    }
}
