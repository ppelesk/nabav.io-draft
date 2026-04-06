<?php

namespace App\Http\Middleware;

use App\Support\AuditLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditCrudOperations
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $routeName = $request->route()?->getName();
        $user = $request->user();

        if (! $routeName || ! $user || ! str_contains($routeName, '.')) {
            return $response;
        }

        [$modul, $akcija] = explode('.', $routeName, 2);

        $moduliZaLog = [
            'korisnici',
            'uloge',
            'zaposlenici',
            'lokacije',
            'zgrade',
            'odjeli',
            'kategorije-imovine',
            'status-imovine',
        ];

        if (! in_array($modul, $moduliZaLog, true)) {
            return $response;
        }

        $akcijaMap = [
            'index' => 'pregled',
            'show' => 'detalji',
            'create' => 'forma_novi',
            'store' => 'kreiraj',
            'edit' => 'forma_uredi',
            'update' => 'azuriraj',
            'destroy' => 'obrisi',
            'resend-invite' => 'ponovno_slanje_pozivnice',
        ];

        if (! isset($akcijaMap[$akcija])) {
            return $response;
        }

        $sifraFunkcije = $modul.'_'.$akcijaMap[$akcija];
        $nazivFunkcije = ucfirst($modul).' - '.str_replace('_', ' ', $akcijaMap[$akcija]);
        AuditLogger::log(
            sifraFunkcije: $sifraFunkcije,
            nazivFunkcije: $nazivFunkcije,
            idKorisnika: $user->id,
            metoda: $request->method(),
            ruta: $request->path(),
            userAgent: $request->userAgent(),
        );

        return $response;
    }
}
