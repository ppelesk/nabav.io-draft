<?php

namespace App\Http\Controllers;

use App\Models\Zaposlenik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ZaposlenikController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('zaposlenici/index', [
            'zaposlenici' => Zaposlenik::query()
                ->latest('id_zaposlenika')
                ->get([
                    'id_zaposlenika',
                    'id_korisnika',
                    'oib_zaposlenika',
                    'ime_zaposlenika',
                    'prezime_zaposlenika',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('zaposlenici/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Zaposlenik::create($this->validatePayload($request));

        return to_route('zaposlenici.index');
    }

    public function show(Zaposlenik $zaposlenici): Response
    {
        return Inertia::render('zaposlenici/show', [
            'zaposlenik' => $zaposlenici->only([
                'id_zaposlenika',
                'id_korisnika',
                'oib_zaposlenika',
                'ime_zaposlenika',
                'prezime_zaposlenika',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function edit(Zaposlenik $zaposlenici): Response
    {
        return Inertia::render('zaposlenici/edit', [
            'zaposlenik' => $zaposlenici->only([
                'id_zaposlenika',
                'id_korisnika',
                'oib_zaposlenika',
                'ime_zaposlenika',
                'prezime_zaposlenika',
            ]),
        ]);
    }

    public function update(Request $request, Zaposlenik $zaposlenici): RedirectResponse
    {
        $zaposlenici->update($this->validatePayload($request, $zaposlenici));

        return to_route('zaposlenici.index');
    }

    public function destroy(Zaposlenik $zaposlenici): RedirectResponse
    {
        $zaposlenici->delete();

        return to_route('zaposlenici.index');
    }

    /**
     * @return array<string, int|string|null>
     */
    private function validatePayload(Request $request, ?Zaposlenik $zaposlenici = null): array
    {
        return $request->validate([
            'id_korisnika' => ['nullable', 'integer', 'exists:users,id'],
            'oib_zaposlenika' => [
                'required',
                'digits:11',
                Rule::unique('zaposlenici', 'oib_zaposlenika')->ignore(
                    $zaposlenici?->id_zaposlenika,
                    'id_zaposlenika'
                ),
            ],
            'ime_zaposlenika' => ['required', 'string', 'max:255'],
            'prezime_zaposlenika' => ['required', 'string', 'max:255'],
        ]);
    }
}
