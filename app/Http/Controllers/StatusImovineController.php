<?php

namespace App\Http\Controllers;

use App\Models\StatusImovine;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StatusImovineController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('status-imovine/index', [
            'statusiImovine' => StatusImovine::query()
                ->latest('id_statusa')
                ->get([
                    'id_statusa',
                    'naziv_statusa',
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('status-imovine/create');
    }

    public function store(Request $request): RedirectResponse
    {
        StatusImovine::create($this->validatePayload($request));

        return to_route('status-imovine.index');
    }

    public function show(StatusImovine $status_imovine): Response
    {
        return Inertia::render('status-imovine/show', [
            'statusImovine' => $status_imovine->only([
                'id_statusa',
                'naziv_statusa',
                'created_at',
                'updated_at',
            ]),
        ]);
    }

    public function edit(StatusImovine $status_imovine): Response
    {
        return Inertia::render('status-imovine/edit', [
            'statusImovine' => $status_imovine->only([
                'id_statusa',
                'naziv_statusa',
            ]),
        ]);
    }

    public function update(Request $request, StatusImovine $status_imovine): RedirectResponse
    {
        $status_imovine->update($this->validatePayload($request, $status_imovine));

        return to_route('status-imovine.index');
    }

    public function destroy(StatusImovine $status_imovine): RedirectResponse
    {
        $status_imovine->delete();

        return to_route('status-imovine.index');
    }

    /**
     * @return array<string, string>
     */
    private function validatePayload(Request $request, ?StatusImovine $statusImovine = null): array
    {
        return $request->validate([
            'naziv_statusa' => [
                'required',
                'string',
                'max:100',
                Rule::unique('status_imovine', 'naziv_statusa')->ignore(
                    $statusImovine?->id_statusa,
                    'id_statusa'
                ),
            ],
        ]);
    }
}
