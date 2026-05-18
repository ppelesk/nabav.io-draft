<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use App\Models\InventurnaLista;
use App\Models\InventurnaListaStavka;
use App\Models\Lokacija;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class InventurnaListaController extends Controller
{
    public function index(): Response
    {
        $liste = InventurnaLista::with('kreator')->get();

        return Inertia::render('inventurna-lista/index', ['liste' => $liste]);
    }

    public function create(): Response
    {
        return Inertia::render('inventurna-lista/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'naziv_liste' => ['required', 'string', 'max:255'],
        ]);

        $lista = InventurnaLista::create([
            'naziv_liste' => $validated['naziv_liste'],
            'kreirao_korisnik_id' => Auth::id(),
            'status_liste' => 'u_tijeku',
        ]);

        return redirect()->route('inventurna-lista.show', $lista->id_liste);
    }

    public function zakljucaj(InventurnaLista $lista)
    {
        if ($lista->status_liste !== 'u_tijeku') {
            return back()->with('error', 'Lista je vec zakljucana ili nije moguca za zakljucavanje.');
        }

        $lista->update(['status_liste' => 'zavrsena']);

        return back()->with('success', 'Inventurna lista je zakljucana.');
    }

    public function show(InventurnaLista $lista): Response
    {
        $lista->load(['stavke.imovina', 'stavke.skeniraoKorisnik', 'stavke.lokacijaSkeniranja', 'stavke.prethodnaLokacija']);
        $lokacije = Lokacija::all();

        return Inertia::render('inventurna-lista/show', ['lista' => $lista, 'lokacije' => $lokacije]);
    }

    public function skeniraj(Request $request, InventurnaLista $lista)
    {
        $validated = $request->validate([
            'id_lokacije' => ['required', 'integer', 'exists:lokacije,id_lokacije'],
            'kod' => ['required', 'string', 'max:255'],
        ]);

        $idLokacije = (int) $validated['id_lokacije'];
        $kod = trim((string) $validated['kod']);

        $stavka = Imovina::query()->where('inventarni_broj', $kod)->first();

        if (! $stavka) {
            return back()->with('error', 'Stavka s tim inventarnim brojem nije pronadjena.');
        }

        $prethodnaLokacijaId = $stavka->id_lokacije;

        $stavka->update([
            'id_lokacije' => $idLokacije,
            'datum_popisa' => now(),
        ]);

        InventurnaListaStavka::create([
            'id_liste' => $lista->id_liste,
            'id_imovine' => $stavka->id_imovine,
            'skenirao_korisnik_id' => Auth::id(),
            'id_lokacije_skeniranja' => $idLokacije,
            'prethodna_lokacija_id' => $prethodnaLokacijaId,
            'pronadjeno' => true,
        ]);

        return back()->with('success', 'Stavka uspjesno evidentirana na listi.');
    }
}
