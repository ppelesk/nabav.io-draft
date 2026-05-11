<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class EnsureAppIsSetup
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->routeIs('setup.*')) {
            return $next($request);
        }

        try {
            $adminExists = User::whereHas(
                'uloga',
                fn ($q) => $q->where('sifra_uloge', 'administrator_sustava')
            )->exists();
        } catch (Throwable) {
            // Tablice još ne postoje — migracije nisu pokrenute
            $adminExists = false;
        }

        if (! $adminExists) {
            return redirect()->route('setup.create');
        }

        return $next($request);
    }
}
