<?php

namespace App\Http\Controllers;

use App\Models\Odjel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OdjelController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('odjeli/index', [
            'odjeli' => Odjel::query()
                ->latest('id_odjela')
                ->get([
                    'id_odjela',
                    'naziv_odjela',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('odjeli/create');
    }

    public function store(Request $request): RedirectResponse
    {
        Odjel::create($this->validatePayload($request));

        return to_route('odjeli.index');
    }

    public function show(Odjel $odjeli): Response
    {
        return Inertia::render('odjeli/show', [
            'odjel' => $odjeli->only([
                'id_odjela',
                'naziv_odjela',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function edit(Odjel $odjeli): Response
    {
        return Inertia::render('odjeli/edit', [
            'odjel' => $odjeli->only([
                'id_odjela',
                'naziv_odjela',
            ]),
        ]);
    }

    public function update(Request $request, Odjel $odjeli): RedirectResponse
    {
        $odjeli->update($this->validatePayload($request, $odjeli));

        return to_route('odjeli.index');
    }

    public function destroy(Odjel $odjeli): RedirectResponse
    {
        $odjeli->delete();

        return to_route('odjeli.index');
    }

    /**
     * @return array<string, string>
     */
    private function validatePayload(Request $request, ?Odjel $odjel = null): array
    {
        return $request->validate([
            'naziv_odjela' => [
                'required',
                'string',
                'max:100',
                Rule::unique('odjeli', 'naziv_odjela')->ignore(
                    $odjel?->id_odjela,
                    'id_odjela'
                ),
            ],
        ]);
    }
}
