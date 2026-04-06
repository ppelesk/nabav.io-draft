<?php

namespace App\Http\Controllers;

use App\Models\KategorijaImovine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KategorijaImovineController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('kategorije-imovine/index', [
            'kategorijeImovine' => KategorijaImovine::query()
                ->latest('id_kategorije')
                ->get([
                    'id_kategorije',
                    'naziv_kategorije',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('kategorije-imovine/create');
    }

    public function store(Request $request): RedirectResponse
    {
        KategorijaImovine::create($this->validatePayload($request));

        return to_route('kategorije-imovine.index');
    }

    public function show(KategorijaImovine $kategorije_imovine): Response
    {
        return Inertia::render('kategorije-imovine/show', [
            'kategorijaImovine' => $kategorije_imovine->only([
                'id_kategorije',
                'naziv_kategorije',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function edit(KategorijaImovine $kategorije_imovine): Response
    {
        return Inertia::render('kategorije-imovine/edit', [
            'kategorijaImovine' => $kategorije_imovine->only([
                'id_kategorije',
                'naziv_kategorije',
            ]),
        ]);
    }

    public function update(Request $request, KategorijaImovine $kategorije_imovine): RedirectResponse
    {
        $kategorije_imovine->update($this->validatePayload($request, $kategorije_imovine));

        return to_route('kategorije-imovine.index');
    }

    public function destroy(KategorijaImovine $kategorije_imovine): RedirectResponse
    {
        $kategorije_imovine->delete();

        return to_route('kategorije-imovine.index');
    }

    /**
     * @return array<string, string>
     */
    private function validatePayload(Request $request, ?KategorijaImovine $kategorijaImovine = null): array
    {
        return $request->validate([
            'naziv_kategorije' => [
                'required',
                'string',
                'max:100',
                Rule::unique('kategorije_imovine', 'naziv_kategorije')->ignore(
                    $kategorijaImovine?->id_kategorije,
                    'id_kategorije'
                ),
            ],
        ]);
    }
}
