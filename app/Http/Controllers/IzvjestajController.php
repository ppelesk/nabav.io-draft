<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use App\Models\InventurnaLista;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class IzvjestajController extends Controller
{
    public function index(): Response
    {
        $sumCijena = (float) Imovina::query()->sum('cijena');

        $inventurnaListaSazetak = [
            'ukupno_listi' => InventurnaLista::query()->count(),
            'otvorene_liste' => InventurnaLista::query()->where('status_liste', 'u_tijeku')->count(),
            'zavrsene_liste' => InventurnaLista::query()->where('status_liste', 'zavrsena')->count(),
        ];

        return Inertia::render('izvjestaji/index', [
            'sazetak' => [
                'ukupno_imovine' => Imovina::query()->count(),
                'ukupna_vrijednost' => number_format($sumCijena, 2, '.', ''),
                'popisano' => Imovina::query()->whereNotNull('datum_popisa')->count(),
                'izdano_na_revers' => Imovina::query()
                    ->where('na_revers', true)
                    ->whereNotNull('id_zaposlenika')
                    ->count(),
            ],
            'inventurnaListaSazetak' => $inventurnaListaSazetak,
            'poStatusu' => Imovina::query()
                ->join('status_imovine', 'status_imovine.id_statusa', '=', 'imovina.id_statusa')
                ->select('status_imovine.naziv_statusa', DB::raw('count(*) as ukupno'))
                ->groupBy('status_imovine.naziv_statusa')
                ->orderBy('status_imovine.naziv_statusa')
                ->get(),
            'poOdjelu' => Imovina::query()
                ->leftJoin('odjeli', 'odjeli.id_odjela', '=', 'imovina.id_odjela')
                ->select(DB::raw("coalesce(odjeli.naziv_odjela, 'Nedodijeljen odjel') as naziv_odjela"), DB::raw('count(*) as ukupno'))
                ->groupBy(DB::raw("coalesce(odjeli.naziv_odjela, 'Nedodijeljen odjel')"))
                ->orderBy('naziv_odjela')
                ->get(),
            'poLokaciji' => Imovina::query()
                ->leftJoin('lokacije', 'lokacije.id_lokacije', '=', 'imovina.id_lokacije')
                ->select(DB::raw("coalesce(lokacije.oznaka_sobe, 'Nedodijeljena lokacija') as oznaka_lokacije"), DB::raw('count(*) as ukupno'))
                ->groupBy(DB::raw("coalesce(lokacije.oznaka_sobe, 'Nedodijeljena lokacija')"))
                ->orderBy('oznaka_lokacije')
                ->get(),
            'poKategoriji' => Imovina::query()
                ->join('kategorije_imovine', 'kategorije_imovine.id_kategorije', '=', 'imovina.id_kategorije')
                ->select('kategorije_imovine.naziv_kategorije', DB::raw('count(*) as ukupno'))
                ->groupBy('kategorije_imovine.naziv_kategorije')
                ->orderBy('kategorije_imovine.naziv_kategorije')
                ->get(),
            'imovinaNaReversu' => Imovina::query()
                ->with('zaposlenik:id_zaposlenika,ime_zaposlenika,prezime_zaposlenika')
                ->where('na_revers', true)
                ->whereNotNull('id_zaposlenika')
                ->latest('id_imovine')
                ->get(['id_imovine', 'inventarni_broj', 'naziv_imovine', 'id_zaposlenika', 'datum_zaduzenja']),
            'imovinaNaServisu' => Imovina::query()
                ->join('status_imovine', 'status_imovine.id_statusa', '=', 'imovina.id_statusa')
                ->where('status_imovine.naziv_statusa', 'like', '%servis%')
                ->latest('imovina.id_imovine')
                ->get(['imovina.id_imovine', 'imovina.inventarni_broj', 'imovina.naziv_imovine', 'status_imovine.naziv_statusa']),
            'rashodovanaImovina' => Imovina::query()
                ->join('status_imovine', 'status_imovine.id_statusa', '=', 'imovina.id_statusa')
                ->where(function ($query): void {
                    $query->where('status_imovine.naziv_statusa', 'like', '%rashod%')
                        ->orWhere('status_imovine.naziv_statusa', 'like', '%unist%');
                })
                ->latest('imovina.id_imovine')
                ->get(['imovina.id_imovine', 'imovina.inventarni_broj', 'imovina.naziv_imovine', 'status_imovine.naziv_statusa']),
        ]);
    }
}
