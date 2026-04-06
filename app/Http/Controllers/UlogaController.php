<?php

namespace App\Http\Controllers;

use App\Models\Uloga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UlogaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('uloge/index', [
            'uloge' => Uloga::query()
                ->latest('id_uloge')
                ->get([
                    'id_uloge',
                    'naziv_uloge',
                    'sifra_uloge',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('uloge/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Uloga::create($this->validatePayload($request));

        return to_route('uloge.index');
    }

    public function show(Uloga $uloge): Response
    {
        return Inertia::render('uloge/show', [
            'uloga' => [
                ...$uloge->only([
                    'id_uloge',
                    'naziv_uloge',
                    'sifra_uloge',
                    'created_at',
                    'updated_at',
                ]),
                'broj_korisnika' => $uloge->korisnici()->count(),
            ],
        ]);
    }

    public function edit(Uloga $uloge): Response
    {
        return Inertia::render('uloge/edit', [
            'uloga' => $uloge->only([
                'id_uloge',
                'naziv_uloge',
                'sifra_uloge',
            ]),
        ]);
    }

    public function update(Request $request, Uloga $uloge): RedirectResponse
    {
        $uloge->update($this->validatePayload($request, $uloge));

        return to_route('uloge.index');
    }

    public function destroy(Uloga $uloge): RedirectResponse
    {
        if ($uloge->korisnici()->exists()) {
            return back()->withErrors([
                'uloga' => 'Uloga se ne moze obrisati jer je dodijeljena korisnicima.',
            ]);
        }

        $uloge->delete();

        return to_route('uloge.index');
    }

    /**
     * @return array<string, string>
     */
    private function validatePayload(Request $request, ?Uloga $uloga = null): array
    {
        return $request->validate([
            'naziv_uloge' => ['required', 'string', 'max:100'],
            'sifra_uloge' => [
                'required',
                'string',
                'max:50',
                Rule::unique('uloge', 'sifra_uloge')->ignore($uloga?->id_uloge, 'id_uloge'),
            ],
        ]);
    }
}
