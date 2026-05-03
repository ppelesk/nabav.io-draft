import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type LokacijaOption = {
    id_lokacije: number;
    oznaka_sobe: string;
    naziv_sobe: string | null;
    naziv_zgrade: string | null;
};

type InventuraStavka = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    datum_popisa: string | null;
    status: { id_statusa: number; naziv_statusa: string } | null;
};

type ScanResult = {
    ok: boolean;
    kod: string;
    id_imovine?: number;
    message: string;
    premjestena?: boolean;
    prethodna_lokacija?: string | null;
};

export default function InventuraIndex({
    lokacije,
    selectedLokacijaId,
    stavke,
    summary,
    scanResult,
}: {
    lokacije: LokacijaOption[];
    selectedLokacijaId: number | null;
    stavke: InventuraStavka[];
    summary: {
        ukupno: number;
        popisano: number;
        nepopisano: number;
    };
    scanResult: ScanResult | null;
}) {
    const [activeLokacijaId, setActiveLokacijaId] = useState<number | null>(selectedLokacijaId);
    const [manualKod, setManualKod] = useState('');
    const [isLoadingResult, setIsLoadingResult] = useState(false);
    const [scannerStatus, setScannerStatus] = useState('Skener nije pokrenut.');
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const isScanningActiveRef = useRef(false);
    const firstCallbackRef = useRef(false);
    const lastScannedKodRef = useRef('');

    useEffect(() => {
        setActiveLokacijaId(selectedLokacijaId);
    }, [selectedLokacijaId]);

    const stopScanner = useCallback(() => {
        isScanningActiveRef.current = false;

        if (readerRef.current) {
            readerRef.current.reset();
            readerRef.current = null;
        }

        setIsScanning(false);
        firstCallbackRef.current = false;
    }, []);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    const submitScan = useCallback(
        (kod: string) => {
            const trimmed = kod.trim();
            if (!trimmed || !activeLokacijaId) return;

            if (trimmed === lastScannedKodRef.current) return;
            lastScannedKodRef.current = trimmed;

            setIsLoadingResult(true);

            router.post(
                '/inventura/skeniraj',
                {
                    id_lokacije: activeLokacijaId,
                    kod: trimmed,
                },
                {
                    preserveState: true,
                    only: ['selectedLokacijaId', 'stavke', 'summary', 'scanResult'],
                    onSuccess: () => {
                        setIsLoadingResult(false);
                    },
                    onError: () => {
                        setIsLoadingResult(false);
                    },
                },
            );

            setTimeout(() => {
                lastScannedKodRef.current = '';
            }, 2500);
        },
        [activeLokacijaId],
    );

    const startScanner = useCallback(() => {
        if (!activeLokacijaId) {
            setScannerError('Prvo odaberite sobu za inventuru.');
            return;
        }

        setScannerError(null);
        setScannerStatus('Pokretanje kamere...');
        firstCallbackRef.current = false;

        if (!videoRef.current) {
            setScannerError('Video element nije pronaden. Osvjezite stranicu.');
            return;
        }

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;
        isScanningActiveRef.current = true;

        reader
            .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
                if (!isScanningActiveRef.current) {
                    return;
                }

                if (!firstCallbackRef.current) {
                    firstCallbackRef.current = true;
                    setIsScanning(true);
                    setScannerStatus('Kamera aktivna - skeniram inventarni broj...');
                }

                if (result) {
                    const ocitaniKod = result.getText();
                    setScannerStatus(`Ocitano: ${ocitaniKod}`);
                    submitScan(ocitaniKod);
                    return;
                }

                if (error instanceof NotFoundException) {
                    return;
                }

                if (error) {
                    setScannerError(`Greska skenera: ${error.message}`);
                }
            })
            .catch((err: unknown) => {
                stopScanner();

                const message = err instanceof Error ? err.message : String(err);

                if (message.includes('NotAllowed') || message.includes('Permission')) {
                    setScannerError('Pristup kameri nije odobren. Odobrite dozvolu u postavkama browsera i pokusajte ponovo.');
                } else if (message.includes('NotFound')) {
                    setScannerError('Kamera nije pronadena na uredaju.');
                } else {
                    setScannerError(`Kamera nije dostupna: ${message}`);
                }

                setScannerStatus('Skener nije pokrenut.');
            });
    }, [activeLokacijaId, stopScanner, submitScan]);

    const odaberiLokaciju = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!activeLokacijaId) {
            return;
        }

        router.get(
            '/inventura',
            { id_lokacije: activeLokacijaId },
            {
                preserveState: true,
                replace: true,
                only: ['selectedLokacijaId', 'stavke', 'summary'],
            },
        );
    };

    const submitManual = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submitScan(manualKod);
        setManualKod('');
    };

    const highlightedId = useMemo(() => scanResult?.id_imovine ?? null, [scanResult]);

    return (
        <>
            <Head title="Inventura" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Inventura u hodu"
                    description="Odaberite sobu i skenirajte inventarne brojeve za potvrdu lokacije"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>1) Odabir sobe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-2 md:flex-row" onSubmit={odaberiLokaciju}>
                            <select
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                                value={activeLokacijaId ?? ''}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setActiveLokacijaId(value ? Number(value) : null);
                                }}
                            >
                                <option value="">Odaberite sobu...</option>
                                {lokacije.map((lokacija) => (
                                    <option key={lokacija.id_lokacije} value={lokacija.id_lokacije}>
                                        {lokacija.oznaka_sobe}
                                        {lokacija.naziv_sobe ? ` - ${lokacija.naziv_sobe}` : ''}
                                        {lokacija.naziv_zgrade ? ` (${lokacija.naziv_zgrade})` : ''}
                                    </option>
                                ))}
                            </select>
                            <Button type="submit" disabled={!activeLokacijaId}>
                                Ucitaj inventurnu listu
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2) Skeniranje u sobi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form className="flex flex-col gap-2 md:flex-row" onSubmit={submitManual}>
                            <Input
                                placeholder="Rucni unos inventarnog broja (npr. INV-000123)"
                                value={manualKod}
                                onChange={(event) => setManualKod(event.target.value)}
                                disabled={!activeLokacijaId}
                            />
                            <Button type="submit" disabled={!activeLokacijaId || isLoadingResult}>
                                Potvrdi
                            </Button>
                        </form>

                        <div className="flex flex-wrap items-center gap-2">
                            {!isScanning ? (
                                <Button type="button" variant="secondary" onClick={startScanner} disabled={!activeLokacijaId}>
                                    Pokreni skener
                                </Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={stopScanner}>
                                    Zaustavi skener
                                </Button>
                            )}
                            {isLoadingResult && (
                                <span className="text-sm text-muted-foreground">Spremam rezultat inventure...</span>
                            )}
                        </div>

                        {isScanning && (
                            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                                {scannerStatus}
                            </div>
                        )}

                        {scannerError && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {scannerError}
                            </div>
                        )}

                        {scanResult && (
                            <div
                                className={`rounded-md px-3 py-2 text-sm ${
                                    scanResult.ok
                                        ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
                                        : 'border border-amber-300 bg-amber-50 text-amber-900'
                                }`}
                            >
                                <p><strong>{scanResult.message}</strong></p>
                                <p>Kod: {scanResult.kod}</p>
                                {scanResult.ok && scanResult.premjestena && (
                                    <p>
                                        Stavka je bila na: {scanResult.prethodna_lokacija ?? 'nepoznatoj lokaciji'}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="relative overflow-hidden rounded-md border bg-black">
                            <video
                                ref={videoRef}
                                className="h-64 w-full object-cover"
                                autoPlay
                                muted
                                playsInline
                            />
                            {isScanning && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="h-40 w-64 rounded border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                                        Skenirajte INV broj unutar okvira
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3) Inventurna lista lokacije</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid gap-2 text-sm md:grid-cols-3">
                            <div className="rounded border p-2">Ukupno: <strong>{summary.ukupno}</strong></div>
                            <div className="rounded border p-2">Popisano: <strong>{summary.popisano}</strong></div>
                            <div className="rounded border p-2">Nepopisano: <strong>{summary.nepopisano}</strong></div>
                        </div>

                        <div className="max-h-96 overflow-auto rounded border">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2">INV broj</th>
                                        <th className="p-2">Naziv</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Popisano</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stavke.length === 0 && (
                                        <tr>
                                            <td className="p-3 text-muted-foreground" colSpan={4}>
                                                Odaberite sobu za prikaz inventurne liste.
                                            </td>
                                        </tr>
                                    )}
                                    {stavke.map((stavka) => (
                                        <tr
                                            key={stavka.id_imovine}
                                            className={`border-b last:border-b-0 ${
                                                highlightedId === stavka.id_imovine ? 'bg-emerald-50' : ''
                                            }`}
                                        >
                                            <td className="p-2 font-medium">{stavka.inventarni_broj ?? '-'}</td>
                                            <td className="p-2">{stavka.naziv_imovine}</td>
                                            <td className="p-2">{stavka.status?.naziv_statusa ?? '-'}</td>
                                            <td className="p-2">{stavka.datum_popisa ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

InventuraIndex.layout = {
    breadcrumbs: [
        {
            title: 'Inventura',
            href: '/inventura',
        },
    ],
};
