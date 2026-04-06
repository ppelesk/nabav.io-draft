<?php

namespace App\Listeners;

use App\Models\User;
use App\Support\AuditLogger;
use Illuminate\Auth\Events\PasswordResetLinkSent;

class LogPasswordResetLinkSent
{
    /**
     * Handle the event.
     */
    public function handle(PasswordResetLinkSent $event): void
    {
        $idKorisnika = User::query()
            ->where('email', $event->user->email)
            ->value('id');

        AuditLogger::log(
            sifraFunkcije: 'auth_reset_link',
            nazivFunkcije: 'Slanje poveznice za reset lozinke',
            idKorisnika: $idKorisnika,
        );
    }
}
