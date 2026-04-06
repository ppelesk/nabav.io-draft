<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('audit-log/index', [
            'logovi' => AuditLog::query()
                ->with([
                    'funkcija:id_funkcije,naziv_funkcije,sifra_funkcije',
                    'korisnik:id,ime_korisnika,prezime_korisnika,email',
                ])
                ->orderByDesc('vrijeme_dogadaja')
                ->limit(500)
                ->get()
                ->map(fn (AuditLog $log) => [
                    'id_loga' => $log->id_loga,
                    'vrijeme_dogadaja' => $log->vrijeme_dogadaja,
                    'metoda' => $log->metoda,
                    'ruta' => $log->ruta,
                    'detalji' => $log->detalji,
                    'funkcija' => $log->funkcija?->only(['naziv_funkcije', 'sifra_funkcije']),
                    'korisnik' => $log->korisnik?->only(['ime_korisnika', 'prezime_korisnika', 'email']),
                ]),
        ]);
    }
}
