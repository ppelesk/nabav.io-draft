<?php

namespace App\Http\Controllers;

use App\Models\Zgrada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ZgradaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('zgrade/index', [
            'zgrade' => Zgrada::query()
                ->latest('id_zgrade')
                ->get([
                    'id_zgrade',
                    'naziv_zgrade',
                    'adresa_zgrade',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('zgrade/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Zgrada::create($this->validatePayload($request));

        return to_route('zgrade.index');
    }

    public function show(Zgrada $zgrade): Response
    {
        return Inertia::render('zgrade/show', [
            'zgrada' => [
                ...$zgrade->only([
                    'id_zgrade',
                    'naziv_zgrade',
                    'adresa_zgrade',
                    'created_at',
                    'updated_at',
                ]),
                'broj_lokacija' => $zgrade->lokacije()->count(),
            ],
        ]);
    }

    public function edit(Zgrada $zgrade): Response
    {
        return Inertia::render('zgrade/edit', [
            'zgrada' => $zgrade->only([
                'id_zgrade',
                'naziv_zgrade',
                'adresa_zgrade',
            ]),
        ]);
    }

    public function update(Request $request, Zgrada $zgrade): RedirectResponse
    {
        $zgrade->update($this->validatePayload($request, $zgrade));

        return to_route('zgrade.index');
    }

    public function destroy(Zgrada $zgrade): RedirectResponse
    {
        $zgrade->delete();

        return to_route('zgrade.index');
    }

    /**
     * @return array<string, string|null>
     */
    private function validatePayload(Request $request, ?Zgrada $zgrada = null): array
    {
        return $request->validate([
            'naziv_zgrade' => [
                'required',
                'string',
                'max:150',
                Rule::unique('zgrade', 'naziv_zgrade')->ignore(
                    $zgrada?->id_zgrade,
                    'id_zgrade'
                ),
            ],
            'adresa_zgrade' => ['nullable', 'string', 'max:200'],
        ]);
    }
}
