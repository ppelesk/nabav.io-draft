<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasDozvola
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $sifraDozvole): Response
    {
        $user = $request->user();

        if (! $user || ! $user->imaDozvolu($sifraDozvole)) {
            abort(403);
        }

        return $next($request);
    }
}
