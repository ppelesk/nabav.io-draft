<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use App\Models\InventurnaLista;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class IzvjestajController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('izvjestaji/index');
    }

    public function provedenaInventura()
    {
        $liste = InventurnaLista::with('kreator')->latest('created_at')->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.provedena-inventura', compact('liste'));
            return $pdf->download('izvjestaj_provedena_inventura.pdf');
        }
        return Inertia::render('izvjestaji/provedena-inventura', ['liste' => $liste]);
    }

    public function stanjeImovine()
    {
        $imovina = Imovina::with(['status', 'kategorija', 'lokacija', 'odjel'])->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.stanje-imovine', compact('imovina'));
            return $pdf->download('izvjestaj_stanje_imovine.pdf');
        }
        return Inertia::render('izvjestaji/stanje-imovine', ['imovina' => $imovina]);
    }

    public function izdanaImovina()
    {
        $imovina = Imovina::with(['zaposlenik', 'odjel'])
            ->whereNotNull('id_zaposlenika')
            ->orWhereNotNull('id_odjela')
            ->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.izdana-imovina', compact('imovina'));
            return $pdf->download('izvjestaj_izdana_imovina.pdf');
        }
        return Inertia::render('izvjestaji/izdana-imovina', ['imovina' => $imovina]);
    }

    public function imovinaUOdjelima()
    {
        $imovina = Imovina::with('odjel')->whereNotNull('id_odjela')->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-u-odjelima', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_u_odjelima.pdf');
        }
        return Inertia::render('izvjestaji/imovina-u-odjelima', ['imovina' => $imovina]);
    }

    public function imovinaNaLokacijama()
    {
        $imovina = Imovina::with('lokacija.zgrada')->whereNotNull('id_lokacije')->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-na-lokacijama', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_na_lokacijama.pdf');
        }
        return Inertia::render('izvjestaji/imovina-na-lokacijama', ['imovina' => $imovina]);
    }

    public function imovinaPoKategoriji()
    {
        $imovina = Imovina::with('kategorija')->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-po-kategoriji', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_po_kategoriji.pdf');
        }
        return Inertia::render('izvjestaji/imovina-po-kategoriji', ['imovina' => $imovina]);
    }

    public function imovinaUSkladistu()
    {
        $imovina = Imovina::whereHas('status', function ($query) {
            $query->where('naziv_statusa', 'like', '%skladište%')->orWhere('naziv_statusa', 'like', '%skladiste%');
        })->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-u-skladistu', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_u_skladistu.pdf');
        }
        return Inertia::render('izvjestaji/imovina-u-skladistu', ['imovina' => $imovina]);
    }

    public function imovinaNaServisu()
    {
        $imovina = Imovina::whereHas('status', function ($query) {
            $query->where('naziv_statusa', 'like', '%servis%');
        })->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-na-servisu', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_na_servisu.pdf');
        }
        return Inertia::render('izvjestaji/imovina-na-servisu', ['imovina' => $imovina]);
    }

    public function rashodovanaImovina()
    {
        $imovina = Imovina::whereHas('status', function ($query) {
            $query->where('naziv_statusa', 'like', '%rashod%')->orWhere('naziv_statusa', 'like', '%unist%');
        })->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.rashodovana-imovina', compact('imovina'));
            return $pdf->download('izvjestaj_rashodovana_imovina.pdf');
        }
        return Inertia::render('izvjestaji/rashodovana-imovina', ['imovina' => $imovina]);
    }

    public function revizijskiTrag()
    {
        $logovi = AuditLog::with('korisnik', 'funkcija')->latest('vrijeme_dogadaja')->limit(500)->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.revizijski-trag', compact('logovi'));
            return $pdf->download('izvjestaj_revizijski_trag.pdf');
        }
        return Inertia::render('izvjestaji/revizijski-trag', ['logovi' => $logovi]);
    }

    public function imovinaNaRevers()
    {
        $imovina = Imovina::with('zaposlenik')
            ->where('na_revers', true)
            ->whereNotNull('id_zaposlenika')
            ->get();
        if (request()->has('pdf')) {
            $pdf = Pdf::loadView('pdf.imovina-na-revers', compact('imovina'));
            return $pdf->download('izvjestaj_imovina_na_revers.pdf');
        }
        return Inertia::render('izvjestaji/imovina-na-revers', ['imovina' => $imovina]);
    }
}
