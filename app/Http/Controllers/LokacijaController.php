<?php

namespace App\Http\Controllers;

use App\Models\Lokacija;
use App\Models\Zgrada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LokacijaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('lokacije/index', [
            'lokacije' => Lokacija::query()
                ->with('zgrada:id_zgrade,naziv_zgrade')
                ->latest('id_lokacije')
                ->get([
                    'id_lokacije',
                    'id_zgrade',
                    'oznaka_sobe',
                    'naziv_sobe',
                ])
                ->map(fn (Lokacija $lokacija) => [
                    'id_lokacije' => $lokacija->id_lokacije,
                    'id_zgrade' => $lokacija->id_zgrade,
                    'oznaka_sobe' => $lokacija->oznaka_sobe,
                    'naziv_sobe' => $lokacija->naziv_sobe,
                    'zgrada' => $lokacija->zgrada?->only([
                        'id_zgrade',
                        'naziv_zgrade',
                    ]),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('lokacije/create', [
            'zgrade' => $this->zgradeOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Lokacija::create([
            ...$this->validatePayload($request),
            'oznaka_sobe' => '',
        ]);

        return to_route('lokacije.index');
    }

    public function show(Lokacija $lokacije): Response
    {
        $lokacije->load('zgrada:id_zgrade,naziv_zgrade,adresa_zgrade');

        return Inertia::render('lokacije/show', [
            'lokacija' => [
                ...$lokacije->only([
                    'id_lokacije',
                    'id_zgrade',
                    'oznaka_sobe',
                    'naziv_sobe',
                    'created_at',
                    'updated_at',
                ]),
                'zgrada' => $lokacije->zgrada?->only([
                    'id_zgrade',
                    'naziv_zgrade',
                    'adresa_zgrade',
                ]),
            ],
        ]);
    }

    public function edit(Lokacija $lokacije): Response
    {
        return Inertia::render('lokacije/edit', [
            'lokacija' => $lokacije->only([
                'id_lokacije',
                'id_zgrade',
                'oznaka_sobe',
                'naziv_sobe',
            ]),
            'zgrade' => $this->zgradeOptions(),
        ]);
    }

    public function update(Request $request, Lokacija $lokacije): RedirectResponse
    {
        $lokacije->update($this->validatePayload($request));

        return to_route('lokacije.index');
    }

    public function destroy(Lokacija $lokacije): RedirectResponse
    {
        $lokacije->delete();

        return to_route('lokacije.index');
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private function zgradeOptions(): array
    {
        return Zgrada::query()
            ->orderBy('naziv_zgrade')
            ->get(['id_zgrade', 'naziv_zgrade', 'adresa_zgrade'])
            ->map(fn (Zgrada $zgrada) => $zgrada->only([
                'id_zgrade',
                'naziv_zgrade',
                'adresa_zgrade',
            ]))
            ->all();
    }

    /**
     * @return array<string, int|string|null>
     */
    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'id_zgrade' => ['required', 'integer', 'exists:zgrade,id_zgrade'],
            'naziv_sobe' => ['nullable', 'string', 'max:100'],
        ]);
    }
}
