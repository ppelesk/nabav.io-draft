import { Head, Link, router } from '@inertiajs/react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import type { FormEvent} from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Stavka = {
    id_imovine: number;
    inventarni_broj: string | null;
    barcode_token: string | null;
    naziv_imovine: string;
    serijski_broj: string | null;
    cijena: string;
    datum_nabave: string;
    na_revers: boolean;
    datum_popisa: string | null;
    status: { naziv_statusa: string } | null;
    kategorija: { naziv_kategorije: string } | null;
    lokacija: { oznaka_sobe: string; naziv_sobe: string | null } | null;
    zaposlenik: { ime_zaposlenika: string; prezime_zaposlenika: string } | null;
};

export default function ProvjeraBarkodaIndex({
    kod,
    stavka: _stavka,
}: {
    kod: string;
    stavka: Stavka | null;
}) {
    const [inputKod, setInputKod] = useState<string>(kod ?? '');
    const [scannerError, setScannerError] = useState<string | null>(null);
    const [scannerStatus, setScannerStatus] = useState<string>('Skener nije pokrenut.');
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingResult, setIsLoadingResult] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupStavka, setPopupStavka] = useState<Stavka | null>(null);
    const [popupNotFound, setPopupNotFound] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const isScanningActiveRef = useRef(false);
    const firstCallbackRef = useRef(false);
    const lastLookedUpRef = useRef<string>('');

    const stopScanner = useCallback(() => {
        isScanningActiveRef.current = false;

        if (readerRef.current) {
            readerRef.current.reset();
            readerRef.current = null;
        }

        setIsScanning(false);
        firstCallbackRef.current = false;
    }, []);

    const lookupKod = useCallback((ocitaniKod: string) => {
        const trimmed = ocitaniKod.trim();

        if (!trimmed) {
return;
}

        // Prevent re-looking-up the same code while popup is open.
        if (trimmed === lastLookedUpRef.current) {
return;
}

        lastLookedUpRef.current = trimmed;

        setIsLoadingResult(true);
        setInputKod(trimmed);

        router.get(
            '/provjera-barkoda',
            { kod: trimmed },
            {
                preserveState: true,
                only: ['stavka', 'kod'],
                onSuccess: (page) => {
                    const props = page.props as unknown as { stavka: Stavka | null };
                    setIsLoadingResult(false);
                    setPopupStavka(props.stavka);
                    setPopupNotFound(!props.stavka);
                    setPopupOpen(true);
                },
                onError: () => {
                    setIsLoadingResult(false);
                },
            },
        );

        // Allow re-scanning same code after 3 seconds.
        setTimeout(() => {
            lastLookedUpRef.current = '';
        }, 3000);
    }, []);

    const startScanner = useCallback(() => {
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
                    setScannerStatus('Kamera aktivna — trazim barkod...');
                }

                if (result) {
                    const ocitaniKod = result.getText();
                    setScannerStatus(`Barkod pronadjen: ${ocitaniKod}`);
                    lookupKod(ocitaniKod);

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
                    setScannerError('Kamera nije pronadjena na uredaju.');
                } else {
                    setScannerError(`Kamera nije dostupna: ${message}`);
                }

                setScannerStatus('Skener nije pokrenut.');
            });
    }, [stopScanner, lookupKod]);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    const pretrazi = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        lookupKod(inputKod);
    };

    return (
        <>
            <Head title="Provjera barkoda" />

            {/* ── Result popup ───────────────────────────────────────────── */}
            <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {popupStavka ? popupStavka.naziv_imovine : 'Stavka nije pronadena'}
                        </DialogTitle>
                    </DialogHeader>

                    {popupNotFound && !popupStavka && (
                        <p className="text-sm text-muted-foreground">
                            Nije pronadena stavka za uneseni kod.
                        </p>
                    )}

                    {popupStavka && (
                        <div className="grid gap-2 text-sm md:grid-cols-2">
                            <p><strong>Inventarni broj:</strong> {popupStavka.inventarni_broj ?? '-'}</p>
                            <p><strong>Barkod token:</strong> {popupStavka.barcode_token ?? '-'}</p>
                            <p><strong>Serijski broj:</strong> {popupStavka.serijski_broj ?? '-'}</p>
                            <p><strong>Status:</strong> {popupStavka.status?.naziv_statusa ?? '-'}</p>
                            <p><strong>Kategorija:</strong> {popupStavka.kategorija?.naziv_kategorije ?? '-'}</p>
                            <p>
                                <strong>Lokacija:</strong>{' '}
                                {popupStavka.lokacija
                                    ? `${popupStavka.lokacija.oznaka_sobe}${popupStavka.lokacija.naziv_sobe ? ` (${popupStavka.lokacija.naziv_sobe})` : ''}`
                                    : '-'}
                            </p>
                            <p>
                                <strong>Zaduzena osobi:</strong>{' '}
                                {popupStavka.zaposlenik
                                    ? `${popupStavka.zaposlenik.ime_zaposlenika} ${popupStavka.zaposlenik.prezime_zaposlenika}`
                                    : '-'}
                            </p>
                            <p><strong>Datum nabave:</strong> {popupStavka.datum_nabave}</p>
                            <p><strong>Cijena:</strong> {popupStavka.cijena}</p>
                            <p><strong>Na revers:</strong> {popupStavka.na_revers ? 'Da' : 'Ne'}</p>
                            <p><strong>Popisano:</strong> {popupStavka.datum_popisa ? 'Da' : 'Ne'}</p>
                        </div>
                    )}

                    <DialogFooter className="flex-wrap gap-2">
                        {popupStavka && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/imovina/barkod-naljepnice?ids=${popupStavka.id_imovine}`}>
                                    Ispisi naljepnicu
                                </Link>
                            </Button>
                        )}
                        <DialogClose asChild>
                            <Button size="sm">Zatvori</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Page ───────────────────────────────────────────────────── */}
            <div className="space-y-6 p-4">
                <Heading
                    title="Provjera barkoda"
                    description="Unesite barkod, inventarni ili serijski broj"
                />

                <Card>
                    <CardContent className="pt-6">
                        <form className="flex flex-col gap-2 md:flex-row" onSubmit={pretrazi}>
                            <Input
                                placeholder="npr. BAR-000001 ili INV-000001"
                                value={inputKod}
                                onChange={(event) => setInputKod(event.target.value)}
                            />
                            <Button type="submit" disabled={isLoadingResult}>
                                {isLoadingResult ? 'Trazim...' : 'Provjeri'}
                            </Button>
                        </form>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {!isScanning ? (
                                <Button type="button" variant="secondary" onClick={startScanner}>
                                    Pokreni skener
                                </Button>
                            ) : (
                                <Button type="button" variant="outline" onClick={stopScanner}>
                                    Zaustavi skener
                                </Button>
                            )}
                            {isLoadingResult && (
                                <span className="text-sm text-muted-foreground">Dohvacam podatke...</span>
                            )}
                        </div>

                        {isScanning && (
                            <div className="mt-3 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                                <span>{scannerStatus}</span>
        
                            </div>
                        )}

                        {!isScanning && scannerStatus !== 'Skener nije pokrenut.' && (
                            <p className="mt-3 text-sm text-muted-foreground">{scannerStatus}</p>
                        )}

                        {scannerError && (
                            <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                {scannerError}
                            </div>
                        )}

                        <div className="relative mt-4 overflow-hidden rounded-md border bg-black">
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
                                        Usmjerite barkod unutar okvira
                                    </span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProvjeraBarkodaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Provjera barkoda',
            href: '/provjera-barkoda',
        },
    ],
};
