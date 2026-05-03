<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvjeraBarkodaController extends Controller
{
    public function index(Request $request): Response
    {
        $kod = trim((string) $request->string('kod'));
        $stavka = null;

        if ($kod !== '') {
            $pronadena = Imovina::query()
                ->with([
                    'status:id_statusa,naziv_statusa',
                    'kategorija:id_kategorije,naziv_kategorije',
                    'lokacija:id_lokacije,oznaka_sobe,naziv_sobe',
                    'zaposlenik:id_zaposlenika,ime_zaposlenika,prezime_zaposlenika',
                ])
                ->where('inventarni_broj', $kod)
                ->orWhere('serijski_broj', $kod)
                ->first();

            if ($pronadena) {
                $stavka = [
                    ...$pronadena->only([
                        'id_imovine',
                        'inventarni_broj',
                        'barcode_token',
                        'naziv_imovine',
                        'serijski_broj',
                        'datum_nabave',
                        'cijena',
                        'na_revers',
                        'datum_popisa',
                    ]),
                    'status' => $pronadena->status?->only(['id_statusa', 'naziv_statusa']),
                    'kategorija' => $pronadena->kategorija?->only(['id_kategorije', 'naziv_kategorije']),
                    'lokacija' => $pronadena->lokacija?->only(['id_lokacije', 'oznaka_sobe', 'naziv_sobe']),
                    'zaposlenik' => $pronadena->zaposlenik?->only(['id_zaposlenika', 'ime_zaposlenika', 'prezime_zaposlenika']),
                ];
            }
        }

        return Inertia::render('provjera-barkoda/index', [
            'kod' => $kod,
            'stavka' => $stavka,
        ]);
    }
}
