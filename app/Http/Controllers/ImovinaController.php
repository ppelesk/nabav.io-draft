<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use App\Models\KategorijaImovine;
use App\Models\Lokacija;
use App\Models\Odjel;
use App\Models\StatusImovine;
use App\Models\Zaposlenik;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ImovinaController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => (string) $request->string('q'),
            'id_statusa' => $request->input('id_statusa'),
            'id_kategorije' => $request->input('id_kategorije'),
            'id_odjela' => $request->input('id_odjela'),
            'id_lokacije' => $request->input('id_lokacije'),
        ];

        $imovina = Imovina::query()
            ->with([
                'status:id_statusa,naziv_statusa',
                'kategorija:id_kategorije,naziv_kategorije',
                'odjel:id_odjela,naziv_odjela',
                'lokacija:id_lokacije,oznaka_sobe,naziv_sobe',
                'zaposlenik:id_zaposlenika,ime_zaposlenika,prezime_zaposlenika',
            ])
            ->when($filters['q'] !== '', function (Builder $query) use ($filters): void {
                $value = $filters['q'];

                $query->where(function (Builder $inner) use ($value): void {
                    $inner->where('naziv_imovine', 'like', "%{$value}%")
                        ->orWhere('inventarni_broj', 'like', "%{$value}%")
                        ->orWhere('serijski_broj', 'like', "%{$value}%")
                        ->orWhere('barcode_token', 'like', "%{$value}%");
                });
            })
            ->when($filters['id_statusa'], fn (Builder $query, $idStatusa) => $query->where('id_statusa', $idStatusa))
            ->when($filters['id_kategorije'], fn (Builder $query, $idKategorije) => $query->where('id_kategorije', $idKategorije))
            ->when($filters['id_odjela'], fn (Builder $query, $idOdjela) => $query->where('id_odjela', $idOdjela))
            ->when($filters['id_lokacije'], fn (Builder $query, $idLokacije) => $query->where('id_lokacije', $idLokacije))
            ->latest('id_imovine')
            ->get()
            ->map(fn (Imovina $stavka) => [
                ...$stavka->only([
                    'id_imovine',
                    'inventarni_broj',
                    'barcode_token',
                    'naziv_imovine',
                    'serijski_broj',
                    'cijena',
                    'datum_nabave',
                    'na_revers',
                    'datum_popisa',
                ]),
                'status' => $stavka->status?->only(['id_statusa', 'naziv_statusa']),
                'kategorija' => $stavka->kategorija?->only(['id_kategorije', 'naziv_kategorije']),
                'odjel' => $stavka->odjel?->only(['id_odjela', 'naziv_odjela']),
                'lokacija' => $stavka->lokacija?->only(['id_lokacije', 'oznaka_sobe', 'naziv_sobe']),
                'zaposlenik' => $stavka->zaposlenik?->only(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika']),
            ]);

        return Inertia::render('imovina/index', [
            'imovina' => $imovina,
            'filters' => $filters,
            'statusi' => $this->statusiOptions(),
            'kategorije' => $this->kategorijeOptions(),
            'odjeli' => $this->odjeliOptions(),
            'lokacije' => $this->lokacijeOptions(),
            'zaposlenici' => $this->zaposleniciOptions(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('imovina/create', [
            'statusi' => $this->statusiOptions(),
            'kategorije' => $this->kategorijeOptions(),
            'odjeli' => $this->odjeliOptions(),
            'lokacije' => $this->lokacijeOptions(),
            'zaposlenici' => $this->zaposleniciOptions(),
        ]);
    }

    public function zaduzenje(): Response
    {
        return $this->renderZaduzenjaPage('zaduzenje');
    }

    public function razduzenje(): Response
    {
        return $this->renderZaduzenjaPage('razduzenje');
    }

    public function barkodNaljepnice(Request $request): Response
    {
        $ids = collect(explode(',', (string) $request->string('ids')))
            ->map(static fn (string $id): int => (int) trim($id))
            ->filter(static fn (int $id): bool => $id > 0)
            ->values()
            ->all();

        $imovina = Imovina::query()
            ->latest('id_imovine')
            ->get([
                'id_imovine',
                'inventarni_broj',
                'naziv_imovine',
            ]);

        return Inertia::render('imovina/barkod-naljepnice', [
            'imovina' => $imovina,
            'preselectedIds' => $ids,
        ]);
    }

    private function renderZaduzenjaPage(string $mode): Response
    {
        $imovina = Imovina::query()
            ->with([
                'status:id_statusa,naziv_statusa',
                'lokacija:id_lokacije,oznaka_sobe,naziv_sobe',
                'zaposlenik:id_zaposlenika,ime_zaposlenika,prezime_zaposlenika',
            ])
            ->latest('id_imovine')
            ->get()
            ->map(fn (Imovina $stavka) => [
                ...$stavka->only([
                    'id_imovine',
                    'inventarni_broj',
                    'naziv_imovine',
                    'na_revers',
                    'datum_zaduzenja',
                    'datum_razduzenja',
                ]),
                'status' => $stavka->status?->only(['id_statusa', 'naziv_statusa']),
                'lokacija' => $stavka->lokacija?->only(['id_lokacije', 'oznaka_sobe', 'naziv_sobe']),
                'zaposlenik' => $stavka->zaposlenik?->only(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika']),
            ]);

        return Inertia::render('imovina/zaduzenja', [
            'imovina' => $imovina,
            'zaposlenici' => $this->zaposleniciOptions(),
            'mode' => $mode,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Imovina::query()->create($this->validatePayload($request));

        return to_route('imovina.index');
    }

    public function show(Imovina $imovina): Response
    {
        $imovina->load([
            'status:id_statusa,naziv_statusa',
            'kategorija:id_kategorije,naziv_kategorije',
            'odjel:id_odjela,naziv_odjela',
            'lokacija:id_lokacije,oznaka_sobe,naziv_sobe',
            'zaposlenik:id_zaposlenika,ime_zaposlenika,prezime_zaposlenika',
        ]);

        return Inertia::render('imovina/show', [
            'imovina' => [
                ...$imovina->only([
                    'id_imovine',
                    'inventarni_broj',
                    'barcode_token',
                    'naziv_imovine',
                    'serijski_broj',
                    'broj_racuna',
                    'datum_nabave',
                    'cijena',
                    'jamstvo_mjeseci',
                    'amortizacija_mjeseci',
                    'na_revers',
                    'datum_zaduzenja',
                    'datum_razduzenja',
                    'datum_popisa',
                    'created_at',
                    'updated_at',
                ]),
                'status' => $imovina->status?->only(['id_statusa', 'naziv_statusa']),
                'kategorija' => $imovina->kategorija?->only(['id_kategorije', 'naziv_kategorije']),
                'odjel' => $imovina->odjel?->only(['id_odjela', 'naziv_odjela']),
                'lokacija' => $imovina->lokacija?->only(['id_lokacije', 'oznaka_sobe', 'naziv_sobe']),
                'zaposlenik' => $imovina->zaposlenik?->only(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika']),
            ],
        ]);
    }

    public function edit(Imovina $imovina): Response
    {
        return Inertia::render('imovina/edit', [
            'imovina' => $imovina->only([
                'id_imovine',
                'inventarni_broj',
                'naziv_imovine',
                'serijski_broj',
                'broj_racuna',
                'datum_nabave',
                'cijena',
                'jamstvo_mjeseci',
                'amortizacija_mjeseci',
                'id_kategorije',
                'id_statusa',
                'id_odjela',
                'id_lokacije',
                'id_zaposlenika',
                'na_revers',
                'datum_zaduzenja',
                'datum_razduzenja',
            ]),
            'statusi' => $this->statusiOptions(),
            'kategorije' => $this->kategorijeOptions(),
            'odjeli' => $this->odjeliOptions(),
            'lokacije' => $this->lokacijeOptions(),
            'zaposlenici' => $this->zaposleniciOptions(),
        ]);
    }

    public function update(Request $request, Imovina $imovina): RedirectResponse
    {
        $imovina->update($this->validatePayload($request, $imovina));

        return to_route('imovina.index');
    }

    public function destroy(Imovina $imovina): RedirectResponse
    {
        $imovina->delete();

        return to_route('imovina.index');
    }

    public function oznaciPopisanu(Imovina $imovina): RedirectResponse
    {
        $imovina->update([
            'datum_popisa' => now(),
        ]);

        return to_route('imovina.index');
    }

    public function razduzi(Request $request, Imovina $imovina): RedirectResponse
    {
        $validated = $request->validate([
            'datum_razduzenja' => ['nullable', 'date', 'after_or_equal:datum_zaduzenja'],
        ]);

        $imovina->update([
            'id_zaposlenika' => null,
            'na_revers' => false,
            'datum_razduzenja' => $validated['datum_razduzenja'] ?? now()->toDateString(),
        ]);

        return to_route('imovina.index');
    }

    public function zaduzi(Request $request, Imovina $imovina): RedirectResponse
    {
        $payload = $request->all();

        if (($payload['id_zaposlenika'] ?? null) === 'new') {
            $payload['id_zaposlenika'] = null;
        }

        $validated = validator($payload, [
            'id_zaposlenika' => ['nullable', 'integer', 'exists:zaposlenici,id_zaposlenika'],
            'datum_zaduzenja' => ['nullable', 'date'],
            'oib_zaposlenika' => ['nullable', 'string', 'max:11'],
            'ime_zaposlenika' => ['nullable', 'string', 'max:255'],
            'prezime_zaposlenika' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $idZaposlenika = $this->resolveZaposlenikZaZaduzenje($request, $validated);

        $imovina->update([
            'id_zaposlenika' => $idZaposlenika,
            'na_revers' => true,
            'datum_zaduzenja' => $validated['datum_zaduzenja'] ?? now()->toDateString(),
            'datum_razduzenja' => null,
        ]);

        return to_route('imovina.index');
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function statusiOptions(): array
    {
        return StatusImovine::query()
            ->orderBy('naziv_statusa')
            ->get(['id_statusa', 'naziv_statusa'])
            ->map(fn (StatusImovine $status) => $status->only(['id_statusa', 'naziv_statusa']))
            ->all();
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function kategorijeOptions(): array
    {
        return KategorijaImovine::query()
            ->orderBy('naziv_kategorije')
            ->get(['id_kategorije', 'naziv_kategorije'])
            ->map(fn (KategorijaImovine $kategorija) => $kategorija->only(['id_kategorije', 'naziv_kategorije']))
            ->all();
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function odjeliOptions(): array
    {
        return Odjel::query()
            ->orderBy('naziv_odjela')
            ->get(['id_odjela', 'naziv_odjela'])
            ->map(fn (Odjel $odjel) => $odjel->only(['id_odjela', 'naziv_odjela']))
            ->all();
    }

    /**
     * @return array<int, array<string, int|string|null>>
     */
    private function lokacijeOptions(): array
    {
        return Lokacija::query()
            ->orderBy('oznaka_sobe')
            ->get(['id_lokacije', 'oznaka_sobe', 'naziv_sobe'])
            ->map(fn (Lokacija $lokacija) => $lokacija->only(['id_lokacije', 'oznaka_sobe', 'naziv_sobe']))
            ->all();
    }

    /**
     * @return array<int, array<string, int|string>>
     */
    private function zaposleniciOptions(): array
    {
        return Zaposlenik::query()
            ->orderBy('prezime_zaposlenika')
            ->orderBy('ime_zaposlenika')
            ->get(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika'])
            ->map(fn (Zaposlenik $zaposlenik) => $zaposlenik->only(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika']))
            ->all();
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function resolveZaposlenikZaZaduzenje(Request $request, array $validated): int
    {
        $idPostojeceg = $validated['id_zaposlenika'] ?? null;
        $oib = trim((string) ($validated['oib_zaposlenika'] ?? ''));
        $ime = trim((string) ($validated['ime_zaposlenika'] ?? ''));
        $prezime = trim((string) ($validated['prezime_zaposlenika'] ?? ''));
        $imaNoviUnos = $oib !== '' || $ime !== '' || $prezime !== '';

        if ($idPostojeceg && $imaNoviUnos) {
            throw ValidationException::withMessages([
                'id_zaposlenika' => 'Odaberite postojeceg zaposlenika ili unesite novog, ali ne oboje.',
            ]);
        }

        if ($idPostojeceg) {
            return (int) $idPostojeceg;
        }

        if (! $imaNoviUnos) {
            throw ValidationException::withMessages([
                'id_zaposlenika' => 'Potrebno je odabrati zaposlenika ili unijeti podatke novog zaposlenika.',
            ]);
        }

        $podaciNovog = validator([
            'oib_zaposlenika' => $oib,
            'ime_zaposlenika' => $ime,
            'prezime_zaposlenika' => $prezime,
        ], [
            'oib_zaposlenika' => ['required', 'digits:11', 'unique:zaposlenici,oib_zaposlenika'],
            'ime_zaposlenika' => ['required', 'string', 'max:255'],
            'prezime_zaposlenika' => ['required', 'string', 'max:255'],
        ])->validate();

        $zaposlenik = Zaposlenik::query()->create($podaciNovog);

        return (int) $zaposlenik->id_zaposlenika;
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, ?Imovina $imovina = null): array
    {
        $validated = $request->validate([
            'inventarni_broj' => [
                'nullable',
                'string',
                'max:30',
                Rule::unique('imovina', 'inventarni_broj')->ignore($imovina?->id_imovine, 'id_imovine'),
            ],
            'naziv_imovine' => ['required', 'string', 'max:150'],
            'serijski_broj' => ['nullable', 'string', 'max:100'],
            'broj_racuna' => ['nullable', 'string', 'max:80'],
            'datum_nabave' => ['required', 'date'],
            'cijena' => ['required', 'numeric', 'min:0'],
            'jamstvo_mjeseci' => ['required', 'integer', 'min:0', 'max:240'],
            'amortizacija_mjeseci' => ['nullable', 'integer', 'min:0', 'max:1200'],
            'id_kategorije' => ['required', 'integer', 'exists:kategorije_imovine,id_kategorije'],
            'id_statusa' => ['required', 'integer', 'exists:status_imovine,id_statusa'],
            'id_odjela' => ['nullable', 'integer', 'exists:odjeli,id_odjela'],
            'id_lokacije' => [$imovina === null ? 'required' : 'nullable', 'integer', 'exists:lokacije,id_lokacije'],
            'id_zaposlenika' => ['nullable', 'integer', 'exists:zaposlenici,id_zaposlenika'],
            'na_revers' => ['nullable', 'boolean'],
            'datum_zaduzenja' => ['nullable', 'date'],
            'datum_razduzenja' => ['nullable', 'date', 'after_or_equal:datum_zaduzenja'],
        ]);

        $validated['na_revers'] = (bool) ($validated['na_revers'] ?? false);

        return $validated;
    }
}
