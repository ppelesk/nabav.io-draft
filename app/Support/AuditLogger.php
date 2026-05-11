<?php

namespace App\Support;

use App\Models\AuditLog;
use App\Models\Funkcija;

class AuditLogger
{
    /**
     * @param  array<string, mixed>  $detalji
     */
    public static function log(
        string $sifraFunkcije,
        string $nazivFunkcije,
        ?int $idKorisnika,
        ?string $metoda = null,
        ?string $ruta = null,
        ?string $userAgent = null,
        array $detalji = [],
    ): void {
        $funkcija = Funkcija::query()->firstOrCreate(
            ['sifra_funkcije' => $sifraFunkcije],
            ['naziv_funkcije' => $nazivFunkcije]
        );

        AuditLog::query()->create([
            'id_funkcije' => $funkcija->id_funkcije,
            'id_korisnika' => $idKorisnika,
            'metoda' => $metoda,
            'ruta' => $ruta,
            'user_agent' => $userAgent,
            'detalji' => empty($detalji) ? null : json_encode($detalji, JSON_UNESCAPED_UNICODE),
            'vrijeme_dogadaja' => now(),
        ]);
    }
}
