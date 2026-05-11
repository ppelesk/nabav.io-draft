import { Head, Link, router, useForm } from '@inertiajs/react';
import type { FormEvent} from 'react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';

type Option = {
    id_statusa?: number;
    naziv_statusa?: string;
    id_kategorije?: number;
    naziv_kategorije?: string;
    id_odjela?: number;
    naziv_odjela?: string;
    id_lokacije?: number;
    oznaka_sobe?: string;
};

type Imovina = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    serijski_broj: string | null;
    cijena: string;
    na_revers: boolean;
    datum_popisa: string | null;
    status: { naziv_statusa: string } | null;
    kategorija: { naziv_kategorije: string } | null;
    odjel: { naziv_odjela: string } | null;
    lokacija: { oznaka_sobe: string; naziv_sobe: string | null } | null;
    zaposlenik: { ime_zaposlenika: string; prezime_zaposlenika: string } | null;
};

type ZaposlenikOption = {
    id_zaposlenika: number;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

type FilterState = {
    q: string;
    id_statusa: string;
    id_kategorije: string;
    id_odjela: string;
    id_lokacije: string;
};

type ZaduzenjeForm = {
    id_zaposlenika: string;
    datum_zaduzenja: string;
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

export default function ImovinaIndex({
    imovina,
    filters,
    statusi,
    kategorije,
    odjeli,
    lokacije,
    zaposlenici,
}: {
    imovina: Imovina[];
    filters: Partial<FilterState>;
    statusi: Option[];
    kategorije: Option[];
    odjeli: Option[];
    lokacije: Option[];
    zaposlenici: ZaposlenikOption[];
}) {
    const { data, setData, get } = useForm<FilterState>({
        q: filters.q ?? '',
        id_statusa: filters.id_statusa ?? '',
        id_kategorije: filters.id_kategorije ?? '',
        id_odjela: filters.id_odjela ?? '',
        id_lokacije: filters.id_lokacije ?? '',
    });

    const filtriraj = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        get('/imovina', {
            preserveState: true,
            replace: true,
        });
    };

    const resetiraj = () => {
        router.get('/imovina');
    };

    const [odabranaImovinaZaZaduzenje, setOdabranaImovinaZaZaduzenje] = useState<Imovina | null>(null);
    const {
        data: zaduzenjeData,
        setData: setZaduzenjeData,
        patch: patchZaduzenje,
        processing: zaduzenjeProcessing,
        errors: zaduzenjeErrors,
        clearErrors: clearZaduzenjeErrors,
        reset: resetZaduzenje,
    } = useForm<ZaduzenjeForm>({
        id_zaposlenika: '',
        datum_zaduzenja: '',
        oib_zaposlenika: '',
        ime_zaposlenika: '',
        prezime_zaposlenika: '',
    });

    const koristiNoviUnos = useMemo(
        () => zaduzenjeData.id_zaposlenika === 'new',
        [zaduzenjeData.id_zaposlenika],
    );

    const obrisi = (idImovine: number) => {
        if (!window.confirm('Jeste li sigurni da zelite obrisati stavku imovine?')) {
            return;
        }

        router.delete(`/imovina/${idImovine}`);
    };

    const oznaciPopisanu = (idImovine: number) => {
        router.patch(`/imovina/${idImovine}/popisano`);
    };

    const razduzi = (idImovine: number) => {
        router.patch(`/imovina/${idImovine}/razduzi`);
    };

    const otvoriZaduzenje = (stavka: Imovina) => {
        setOdabranaImovinaZaZaduzenje(stavka);
        clearZaduzenjeErrors();
        resetZaduzenje();
    };

    const zatvoriZaduzenje = () => {
        setOdabranaImovinaZaZaduzenje(null);
        clearZaduzenjeErrors();
        resetZaduzenje();
    };

    const submitZaduzenje = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!odabranaImovinaZaZaduzenje) {
            return;
        }

        patchZaduzenje(`/imovina/${odabranaImovinaZaZaduzenje.id_imovine}/zaduzi`, {
            preserveScroll: true,
            onSuccess: () => {
                zatvoriZaduzenje();
            },
        });
    };

    return (
        <>
            <Head title="Imovina" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Upravljanje imovinom"
                    description="Evidentiranje, zaduzenje i popis imovine"
                />

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button asChild variant="outline">
                        <Link href="/imovina/barkod-naljepnice">Barkod naljepnice</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/provjera-barkoda">Provjera barkoda</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/izvjestaji">Izvjestaji</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/imovina/create">Dodaj imovinu</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filteri</CardTitle>
                        <CardDescription>Pretraga po nazivu, kodu i rasporedu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-3 md:grid-cols-5" onSubmit={filtriraj}>
                            <Input
                                placeholder="Naziv, inventarni ili serijski broj"
                                value={data.q}
                                onChange={(event) => setData('q', event.target.value)}
                            />

                            <Select
                                value={data.id_statusa || 'all'}
                                onValueChange={(value) =>
                                    setData('id_statusa', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Svi statusi</SelectItem>
                                    {statusi.map((status) => (
                                        <SelectItem
                                            key={status.id_statusa}
                                            value={String(status.id_statusa)}
                                        >
                                            {status.naziv_statusa}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={data.id_kategorije || 'all'}
                                onValueChange={(value) =>
                                    setData('id_kategorije', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategorija" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Sve kategorije</SelectItem>
                                    {kategorije.map((kategorija) => (
                                        <SelectItem
                                            key={kategorija.id_kategorije}
                                            value={String(kategorija.id_kategorije)}
                                        >
                                            {kategorija.naziv_kategorije}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={data.id_odjela || 'all'}
                                onValueChange={(value) =>
                                    setData('id_odjela', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Odjel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Svi odjeli</SelectItem>
                                    {odjeli.map((odjel) => (
                                        <SelectItem
                                            key={odjel.id_odjela}
                                            value={String(odjel.id_odjela)}
                                        >
                                            {odjel.naziv_odjela}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={data.id_lokacije || 'all'}
                                onValueChange={(value) =>
                                    setData('id_lokacije', value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Lokacija" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Sve lokacije</SelectItem>
                                    {lokacije.map((lokacija) => (
                                        <SelectItem
                                            key={lokacija.id_lokacije}
                                            value={String(lokacija.id_lokacije)}
                                        >
                                            {lokacija.oznaka_sobe}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2 md:col-span-5">
                                <Button type="submit">Primijeni filtre</Button>
                                <Button type="button" variant="outline" onClick={resetiraj}>
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis imovine</CardTitle>
                        <CardDescription>Ukupno zapisa: {imovina.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">Inventarni broj</th>
                                        <th className="py-3 pr-4 font-medium">Naziv</th>
                                        <th className="py-3 pr-4 font-medium">Status</th>
                                        <th className="py-3 pr-4 font-medium">Kategorija</th>
                                        <th className="py-3 pr-4 font-medium">Lokacija</th>
                                        <th className="py-3 pr-4 font-medium">Odgovorna osoba</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {imovina.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={7}>
                                                Nema pronadene imovine.
                                            </td>
                                        </tr>
                                    ) : (
                                        imovina.map((stavka) => (
                                            <tr key={stavka.id_imovine} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">
                                                    {stavka.inventarni_broj ?? '-'}
                                                </td>
                                                <td className="py-3 pr-4">{stavka.naziv_imovine}</td>
                                                <td className="py-3 pr-4">{stavka.status?.naziv_statusa ?? '-'}</td>
                                                <td className="py-3 pr-4">
                                                    {stavka.kategorija?.naziv_kategorije ?? '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {stavka.lokacija
                                                        ? `${stavka.lokacija.oznaka_sobe}${
                                                              stavka.lokacija.naziv_sobe
                                                                  ? ` (${stavka.lokacija.naziv_sobe})`
                                                                  : ''
                                                          }`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {stavka.zaposlenik
                                                        ? `${stavka.zaposlenik.ime_zaposlenika} ${stavka.zaposlenik.prezime_zaposlenika}`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/imovina/${stavka.id_imovine}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/imovina/barkod-naljepnice?ids=${stavka.id_imovine}`}>
                                                                Naljepnica
                                                            </Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/imovina/${stavka.id_imovine}/edit`}>Uredi</Link>
                                                        </Button>
                                                        {!stavka.datum_popisa && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => oznaciPopisanu(stavka.id_imovine)}
                                                            >
                                                                Popisi
                                                            </Button>
                                                        )}
                                                        {stavka.zaposlenik && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => razduzi(stavka.id_imovine)}
                                                            >
                                                                Razduzi
                                                            </Button>
                                                        )}
                                                        {!stavka.zaposlenik && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => otvoriZaduzenje(stavka)}
                                                            >
                                                                Zaduzi
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisi(stavka.id_imovine)}
                                                        >
                                                            Obrisi
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Dialog
                    open={odabranaImovinaZaZaduzenje !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            zatvoriZaduzenje();
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Zaduzenje imovine</DialogTitle>
                            <DialogDescription>
                                {odabranaImovinaZaZaduzenje
                                    ? `Zaduzujete: ${odabranaImovinaZaZaduzenje.naziv_imovine}`
                                    : 'Unesite podatke o zaduzenju.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={submitZaduzenje}>
                            <div className="grid gap-2">
                                <Label htmlFor="id_zaposlenika">Zaposlenik</Label>
                                <Select
                                    value={zaduzenjeData.id_zaposlenika || 'none'}
                                    onValueChange={(value) => {
                                        const vrijednost = value === 'none' ? '' : value;

                                        setZaduzenjeData('id_zaposlenika', vrijednost);

                                        if (value !== 'new') {
                                            setZaduzenjeData('oib_zaposlenika', '');
                                            setZaduzenjeData('ime_zaposlenika', '');
                                            setZaduzenjeData('prezime_zaposlenika', '');
                                        }
                                    }}
                                >
                                    <SelectTrigger id="id_zaposlenika">
                                        <SelectValue placeholder="Odaberite zaposlenika" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Odaberite</SelectItem>
                                        {zaposlenici.map((zaposlenik) => (
                                            <SelectItem
                                                key={zaposlenik.id_zaposlenika}
                                                value={String(zaposlenik.id_zaposlenika)}
                                            >
                                                {zaposlenik.ime_zaposlenika} {zaposlenik.prezime_zaposlenika}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="new">+ Kreiraj novog zaposlenika</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={zaduzenjeErrors.id_zaposlenika} />
                            </div>

                            {koristiNoviUnos && (
                                <div className="grid gap-3 rounded-md border p-3">
                                    <p className="text-sm font-medium">Novi zaposlenik</p>

                                    <div className="grid gap-2">
                                        <Label htmlFor="oib_zaposlenika">OIB</Label>
                                        <Input
                                            id="oib_zaposlenika"
                                            inputMode="numeric"
                                            maxLength={11}
                                            value={zaduzenjeData.oib_zaposlenika}
                                            onChange={(event) =>
                                                setZaduzenjeData('oib_zaposlenika', event.target.value)
                                            }
                                        />
                                        <InputError message={zaduzenjeErrors.oib_zaposlenika} />
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ime_zaposlenika">Ime</Label>
                                            <Input
                                                id="ime_zaposlenika"
                                                value={zaduzenjeData.ime_zaposlenika}
                                                onChange={(event) =>
                                                    setZaduzenjeData('ime_zaposlenika', event.target.value)
                                                }
                                            />
                                            <InputError message={zaduzenjeErrors.ime_zaposlenika} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="prezime_zaposlenika">Prezime</Label>
                                            <Input
                                                id="prezime_zaposlenika"
                                                value={zaduzenjeData.prezime_zaposlenika}
                                                onChange={(event) =>
                                                    setZaduzenjeData('prezime_zaposlenika', event.target.value)
                                                }
                                            />
                                            <InputError message={zaduzenjeErrors.prezime_zaposlenika} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="datum_zaduzenja">Datum zaduzenja (opcionalno)</Label>
                                <Input
                                    id="datum_zaduzenja"
                                    type="date"
                                    value={zaduzenjeData.datum_zaduzenja}
                                    onChange={(event) =>
                                        setZaduzenjeData('datum_zaduzenja', event.target.value)
                                    }
                                />
                                <InputError message={zaduzenjeErrors.datum_zaduzenja} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={zatvoriZaduzenje}>
                                    Odustani
                                </Button>
                                <Button type="submit" disabled={zaduzenjeProcessing}>
                                    Potvrdi zaduzenje
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ImovinaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Imovina',
            href: '/imovina',
        },
    ],
};
