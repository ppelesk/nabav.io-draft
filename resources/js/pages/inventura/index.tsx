import { Head, router } from '@inertiajs/react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    liste,
    selectedLokacijaId,
    selectedListaId,
    stavke,
    summary,
    scanResult,
}: {
    lokacije: LokacijaOption[];
    liste: { id_liste: number; naziv_liste: string }[];
    selectedLokacijaId: number | null;
    selectedListaId: number | null;
    stavke: InventuraStavka[];
    summary: {
        ukupno: number;
        popisano: number;
        nepopisano: number;
    };
    scanResult: ScanResult | null;
}) {
    const [activeLokacijaId, setActiveLokacijaId] = useState<number | null>(selectedLokacijaId);
    const [activeListaId, setActiveListaId] = useState<number | null>(selectedListaId);
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [scannerStatus, setScannerStatus] = useState<string>('Skener nije pokrenut.');
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingResult, setIsLoadingResult] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

    useEffect(() => {
        if (!codeReaderRef.current) {
            codeReaderRef.current = new BrowserMultiFormatReader();
        }
    }, []);

    const stopScanner = useCallback(() => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
        }
        setIsScanning(false);
        setScannerStatus('Skener zaustavljen.');
    }, []);

    const updateSettings = useCallback(
        (newListaId: number | null, newLokacijaId: number | null) => {
            if (!newListaId || !newLokacijaId) {
                return;
            }

            setScannerError(null);

            router.get(
                '/inventura',
                { id_lokacije: newLokacijaId, id_liste: newListaId },
                {
                    preserveState: true,
                    replace: true,
                    only: ['selectedLokacijaId', 'selectedListaId', 'stavke', 'summary'],
                },
            );
        },
        [],
    );

    const submitScan = useCallback(
        (kod: string) => {
            if (!activeLokacijaId || !activeListaId) {
                setScannerError('Prvo odaberite inventurnu listu i lokaciju/sobu.');
                return;
            }

            setIsLoadingResult(true);
            setScannerError(null);

            router.post(
                '/inventura/skeniraj',
                { id_lokacije: activeLokacijaId, id_liste: activeListaId, kod },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsLoadingResult(false);
                    },
                    onError: (errors) => {
                        setIsLoadingResult(false);
                        setScannerError(errors.kod || 'Doslo je do greske prilikom skeniranja.');
                    },
                },
            );
        },
        [activeLokacijaId, activeListaId],
    );

    const startScanner = useCallback(() => {
        if (!activeLokacijaId || !activeListaId) {
            setScannerError('Prvo odaberite inventurnu listu i lokaciju/sobu.');
            return;
        }

        if (!videoRef.current || !codeReaderRef.current) return;

        setScannerError(null);
        setScannerStatus('Trazim kameru...');

        codeReaderRef.current
            .decodeFromVideoDevice(null, videoRef.current, (result, error) => {
                if (result) {
                    const ocitaniKod = result.getText();
                    setScannerStatus(`Ocitano: ${ocitaniKod}. Saljem na server...`);

                    setTimeout(() => {
                        submitScan(ocitaniKod);
                    }, 500);

                    return;
                }

                if (error instanceof NotFoundException) {
                    return;
                }

                if (error) {
                    setScannerError(`Greska skenera: ${error.message}`);
                }
            })
            .then(() => {
                setIsScanning(true);
                setScannerStatus('Skener je aktivan. Usmjerite kameru prema barkodu.');
            })
            .catch((err: unknown) => {
                stopScanner();
                const message = err instanceof Error ? err.message : String(err);
                if (message.includes('NotAllowed') || message.includes('Permission')) {
                    setScannerError('Pristup kameri odbijen. Molimo dozvolite kameru u pregledniku.');
                } else {
                    setScannerError(`Greska pri pokretanju skenera: ${message}`);
                }
            });
    }, [activeLokacijaId, activeListaId, submitScan, stopScanner]);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    const highlightedId = useMemo(() => scanResult?.id_imovine ?? null, [scanResult]);

    return (
        <>
            <Head title="Inventura" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Inventura u hodu"
                    description="Odaberite inventurnu listu, sobu i skenirajte inventarne brojeve za potvrdu lokacije"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>1) Inventurna lista</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                            value={activeListaId ?? ''}
                            onChange={(event) => {
                                const value = event.target.value;
                                const newListaId = value ? Number(value) : null;

                                setActiveListaId(newListaId);
                                updateSettings(newListaId, activeLokacijaId);
                            }}
                        >
                            <option value="">Odaberite inventurnu listu...</option>
                            {liste.map((lista) => (
                                <option key={lista.id_liste} value={lista.id_liste}>
                                    {lista.naziv_liste}
                                </option>
                            ))}
                        </select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2) Soba</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                            value={activeLokacijaId ?? ''}
                            onChange={(event) => {
                                const value = event.target.value;
                                const newLokacijaId = value ? Number(value) : null;

                                setActiveLokacijaId(newLokacijaId);
                                updateSettings(activeListaId, newLokacijaId);
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
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>3) Skeniranje u sobi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            {!isScanning ? (
                                <Button type="button" variant="secondary" onClick={startScanner} disabled={!activeLokacijaId || !activeListaId}>
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
                        <CardTitle>4) Imovina sobi</CardTitle>
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
                                                Nema rezultata.
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
