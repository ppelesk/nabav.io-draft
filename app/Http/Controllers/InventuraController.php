<?php

namespace App\Http\Controllers;

use App\Models\Imovina;
use App\Models\Lokacija;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventuraController extends Controller
{
    public function index(Request $request): Response
    {
        $idLokacije = (int) $request->integer('id_lokacije');

        return $this->renderPage($idLokacije > 0 ? $idLokacije : null, null);
    }

    public function skeniraj(Request $request): Response
    {
        $validated = $request->validate([
            'id_lokacije' => ['required', 'integer', 'exists:lokacije,id_lokacije'],
            'kod' => ['required', 'string', 'max:255'],
        ]);

        $idLokacije = (int) $validated['id_lokacije'];
        $kod = trim((string) $validated['kod']);

        if ($kod === '') {
            return $this->renderPage($idLokacije, [
                'ok' => false,
                'kod' => $kod,
                'message' => 'Kod je prazan.',
            ]);
        }

        $stavka = Imovina::query()
            ->with('lokacija:id_lokacije,oznaka_sobe,naziv_sobe')
            ->where('inventarni_broj', $kod)
            ->first();

        if (! $stavka) {
            return $this->renderPage($idLokacije, [
                'ok' => false,
                'kod' => $kod,
                'message' => 'Stavka s tim inventarnim brojem nije pronadena.',
            ]);
        }

        $prethodnaLokacijaId = $stavka->id_lokacije;
        $prethodnaLokacijaLabel = $stavka->lokacija
            ? trim(($stavka->lokacija->oznaka_sobe ?? '').' '.($stavka->lokacija->naziv_sobe ?? ''))
            : null;

        $stavka->update([
            'id_lokacije' => $idLokacije,
            'datum_popisa' => now(),
        ]);

        return $this->renderPage($idLokacije, [
            'ok' => true,
            'kod' => $kod,
            'id_imovine' => $stavka->id_imovine,
            'message' => 'Stavka je uspjesno popisana i potvrdena na odabranoj lokaciji.',
            'premjestena' => $prethodnaLokacijaId !== $idLokacije,
            'prethodna_lokacija' => $prethodnaLokacijaLabel ?: null,
        ]);
    }

    private function renderPage(?int $selectedLokacijaId, ?array $scanResult): Response
    {
        $lokacije = Lokacija::query()
            ->with('zgrada:id_zgrade,naziv_zgrade')
            ->orderBy('oznaka_sobe')
            ->get(['id_lokacije', 'id_zgrade', 'oznaka_sobe', 'naziv_sobe'])
            ->map(static fn (Lokacija $lokacija) => [
                'id_lokacije' => $lokacija->id_lokacije,
                'oznaka_sobe' => $lokacija->oznaka_sobe,
                'naziv_sobe' => $lokacija->naziv_sobe,
                'naziv_zgrade' => $lokacija->zgrada?->naziv_zgrade,
            ])
            ->all();

        $stavke = [];
        $summary = [
            'ukupno' => 0,
            'popisano' => 0,
            'nepopisano' => 0,
        ];

        if ($selectedLokacijaId) {
            $stavkeKolekcija = Imovina::query()
                ->with('status:id_statusa,naziv_statusa')
                ->where('id_lokacije', $selectedLokacijaId)
                ->orderBy('naziv_imovine')
                ->get([
                    'id_imovine',
                    'inventarni_broj',
                    'naziv_imovine',
                    'datum_popisa',
                    'id_statusa',
                ]);

            $stavke = $stavkeKolekcija
                ->map(static fn (Imovina $stavka) => [
                    'id_imovine' => $stavka->id_imovine,
                    'inventarni_broj' => $stavka->inventarni_broj,
                    'naziv_imovine' => $stavka->naziv_imovine,
                    'datum_popisa' => $stavka->datum_popisa?->format('Y-m-d H:i:s'),
                    'status' => $stavka->status?->only(['id_statusa', 'naziv_statusa']),
                ])
                ->all();

            $popisano = $stavkeKolekcija
                ->filter(static fn (Imovina $stavka) => $stavka->datum_popisa !== null)
                ->count();

            $summary = [
                'ukupno' => $stavkeKolekcija->count(),
                'popisano' => $popisano,
                'nepopisano' => $stavkeKolekcija->count() - $popisano,
            ];
        }

        return Inertia::render('inventura/index', [
            'lokacije' => $lokacije,
            'selectedLokacijaId' => $selectedLokacijaId,
            'stavke' => $stavke,
            'summary' => $summary,
            'scanResult' => $scanResult,
        ]);
    }
}
