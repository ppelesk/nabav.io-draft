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

type Imovina = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    na_revers: boolean;
    datum_zaduzenja: string | null;
    datum_razduzenja: string | null;
    status: { naziv_statusa: string } | null;
    lokacija: { oznaka_sobe: string; naziv_sobe: string | null } | null;
    zaposlenik: { ime_zaposlenika: string; prezime_zaposlenika: string } | null;
};

type ZaposlenikOption = {
    id_zaposlenika: number;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

type ZaduzenjeForm = {
    id_zaposlenika: string;
    datum_zaduzenja: string;
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

export default function ImovinaZaduzenja({
    imovina,
    zaposlenici,
    mode,
}: {
    imovina: Imovina[];
    zaposlenici: ZaposlenikOption[];
    mode: 'zaduzenje' | 'razduzenje';
}) {
    const [odabranaImovinaZaZaduzenje, setOdabranaImovinaZaZaduzenje] = useState<Imovina | null>(null);
    const [odabranaImovinaZaRazduzenje, setOdabranaImovinaZaRazduzenje] = useState<Imovina | null>(null);
    const [otvoriDodajZaduzenje, setOtvoriDodajZaduzenje] = useState(false);
    const [izabranaImovinaZaDodavanje, setIzabranaImovinaZaDodavanje] = useState<string>('');
    const {
        data,
        setData,
        patch,
        processing,
        errors,
        clearErrors,
        reset,
    } = useForm<ZaduzenjeForm>({
        id_zaposlenika: '',
        datum_zaduzenja: '',
        oib_zaposlenika: '',
        ime_zaposlenika: '',
        prezime_zaposlenika: '',
    });
    const {
        data: razduzenjeData,
        setData: setRazduzenjeData,
        patch: patchRazduzenje,
        processing: razduzenjeProcessing,
        errors: razduzenjeErrors,
        clearErrors: clearRazduzenjeErrors,
        reset: resetRazduzenje,
    } = useForm<{ datum_razduzenja: string }>({
        datum_razduzenja: '',
    });

    const [selectedZaposlenikZaKreiranje, setSelectedZaposlenikZaKreiranje] = useState<string>('');
    const koristiNoviUnos = useMemo(() => data.id_zaposlenika === 'new', [data.id_zaposlenika]);
    const naslov = mode === 'zaduzenje' ? 'Zaduzenje imovine' : 'Razduzenje imovine';
    const opis = mode === 'zaduzenje'
        ? 'Brzi CRUD pristup za dodjelu imovine zaposleniku'
        : 'Brzi CRUD pristup za razduzenje imovine i unos datuma vracanja';
    const filtriranaImovina = mode === 'zaduzenje'
        ? imovina.filter((stavka) => !stavka.zaposlenik)
        : imovina.filter((stavka) => !!stavka.zaposlenik);

    const otvoriZaduzenje = (stavka: Imovina) => {
        setOdabranaImovinaZaZaduzenje(stavka);
        clearErrors();
        reset();
    };

    const zatvoriZaduzenje = () => {
        setOdabranaImovinaZaZaduzenje(null);
        clearErrors();
        reset();
    };

    const otvoriModalDodajZaduzenje = () => {
        setOtvoriDodajZaduzenje(true);
        setIzabranaImovinaZaDodavanje('');
        clearErrors();
        reset();
    };

    const zatvoriModalDodajZaduzenje = () => {
        setOtvoriDodajZaduzenje(false);
        setIzabranaImovinaZaDodavanje('');
        clearErrors();
        reset();
    };

    const otvoriRazduzenje = (stavka: Imovina) => {
        setOdabranaImovinaZaRazduzenje(stavka);
        clearRazduzenjeErrors();
        resetRazduzenje();
        setRazduzenjeData('datum_razduzenja', new Date().toISOString().slice(0, 10));
    };

    const zatvoriRazduzenje = () => {
        setOdabranaImovinaZaRazduzenje(null);
        clearRazduzenjeErrors();
        resetRazduzenje();
    };

    const submitRazduzenje = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!odabranaImovinaZaRazduzenje) {
            return;
        }

        patchRazduzenje(`/imovina/${odabranaImovinaZaRazduzenje.id_imovine}/razduzi`, {
            preserveScroll: true,
            onSuccess: () => {
                zatvoriRazduzenje();
            },
        });
    };

    const submitZaduzenje = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!odabranaImovinaZaZaduzenje) {
            return;
        }

        patch(`/imovina/${odabranaImovinaZaZaduzenje.id_imovine}/zaduzi`, {
            preserveScroll: true,
            onSuccess: () => {
                zatvoriZaduzenje();
            },
        });
    };

    const submitDodajZaduzenje = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!izabranaImovinaZaDodavanje) {
            return;
        }

        patch(`/imovina/${izabranaImovinaZaDodavanje}/zaduzi`, {
            preserveScroll: true,
            onSuccess: () => {
                zatvoriModalDodajZaduzenje();
            },
        });
    };

    return (
        <>
            <Head title={naslov} />

            <div className="space-y-6 p-4">
                <Heading
                    title={naslov}
                    description={opis}
                />

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button asChild variant="outline">
                        <Link href="/imovina">Puni popis imovine</Link>
                    </Button>
                    {mode === 'zaduzenje' ? (
                        <Button asChild variant="outline">
                            <Link href="/imovina/razduzenje">Idi na razduzenje</Link>
                        </Button>
                    ) : (
                        <Button asChild variant="outline">
                            <Link href="/imovina/zaduzenje">Idi na zaduzenje</Link>
                        </Button>
                    )}
                    <Button asChild>
                        <Link href="/imovina/create">Dodaj imovinu</Link>
                    </Button>
                    {mode === 'zaduzenje' && (
                        <Button onClick={otvoriModalDodajZaduzenje}>Dodaj zaduženje</Button>
                    )}
                </div>
                

                <Card>
                    <CardHeader>
                        <CardTitle>Aktivne stavke</CardTitle>
                        <CardDescription>
                            {mode === 'zaduzenje'
                                ? 'Odaberite stavku koju zelite zaduziti.'
                                : 'Odaberite stavku koju zelite razduziti.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">Inventarni broj</th>
                                        <th className="py-3 pr-4 font-medium">Naziv</th>
                                        <th className="py-3 pr-4 font-medium">Status</th>
                                        <th className="py-3 pr-4 font-medium">Lokacija</th>
                                        <th className="py-3 pr-4 font-medium">Zaduzeno na</th>
                                        <th className="py-3 pr-4 font-medium">Datum zaduzenja</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtriranaImovina.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={7}>
                                                {mode === 'zaduzenje'
                                                    ? 'Nema slobodnih stavki za zaduzenje.'
                                                    : 'Nema trenutno zaduzenih stavki za razduzenje.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filtriranaImovina.map((stavka) => (
                                            <tr key={stavka.id_imovine} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{stavka.inventarni_broj ?? '-'}</td>
                                                <td className="py-3 pr-4">{stavka.naziv_imovine}</td>
                                                <td className="py-3 pr-4">{stavka.status?.naziv_statusa ?? '-'}</td>
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
                                                <td className="py-3 pr-4">{stavka.datum_zaduzenja ?? '-'}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/imovina/${stavka.id_imovine}/edit`}>Uredi</Link>
                                                        </Button>
                                                        {mode === 'razduzenje' ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => otvoriRazduzenje(stavka)}
                                                            >
                                                                Razduzi
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => otvoriZaduzenje(stavka)}
                                                            >
                                                                Zaduzi
                                                            </Button>
                                                        )}
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
                    open={otvoriDodajZaduzenje}
                    onOpenChange={(open) => {
                        if (!open) {
                            zatvoriModalDodajZaduzenje();
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Dodaj zaduženje</DialogTitle>
                            <DialogDescription>
                                Odaberite slobodnu stavku, zaposlenika ili stvorite novog zaposlenika bez napuštanja stranice.
                            </DialogDescription>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={submitDodajZaduzenje}>
                            <div className="grid gap-2">
                                <Label htmlFor="izabrana_imovina">
                                    Stavka za zaduženje
                                    <span className="text-destructive ml-1">*</span>
                                </Label>
                                <Select
                                    value={izabranaImovinaZaDodavanje || 'none'}
                                    onValueChange={(value) =>
                                        setIzabranaImovinaZaDodavanje(value === 'none' ? '' : value)
                                    }
                                >
                                    <SelectTrigger id="izabrana_imovina">
                                        <SelectValue placeholder="Odaberite stavku" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Odaberite</SelectItem>
                                        {filtriranaImovina.map((stavka) => (
                                            <SelectItem
                                                key={stavka.id_imovine}
                                                value={String(stavka.id_imovine)}
                                            >
                                                {stavka.inventarni_broj ?? '-'} - {stavka.naziv_imovine}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="id_zaposlenika">
                                    Zaposlenik
                                    <span className="text-destructive ml-1">*</span>
                                </Label>
                                <Select
                                    value={data.id_zaposlenika || 'none'}
                                    required
                                    onValueChange={(value) => {
                                        const vrijednost = value === 'none' ? '' : value;

                                        setData('id_zaposlenika', vrijednost);

                                        if (value !== 'new') {
                                            setData('oib_zaposlenika', '');
                                            setData('ime_zaposlenika', '');
                                            setData('prezime_zaposlenika', '');
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
                                <InputError message={errors.id_zaposlenika} />
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
                                            value={data.oib_zaposlenika}
                                            onChange={(event) => setData('oib_zaposlenika', event.target.value)}
                                        />
                                        <InputError message={errors.oib_zaposlenika} />
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ime_zaposlenika">Ime</Label>
                                            <Input
                                                id="ime_zaposlenika"
                                                value={data.ime_zaposlenika}
                                                onChange={(event) => setData('ime_zaposlenika', event.target.value)}
                                            />
                                            <InputError message={errors.ime_zaposlenika} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="prezime_zaposlenika">Prezime</Label>
                                            <Input
                                                id="prezime_zaposlenika"
                                                value={data.prezime_zaposlenika}
                                                onChange={(event) => setData('prezime_zaposlenika', event.target.value)}
                                            />
                                            <InputError message={errors.prezime_zaposlenika} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="datum_zaduzenja">Datum zaduzenja (opcionalno)</Label>
                                <Input
                                    id="datum_zaduzenja"
                                    type="date"
                                    value={data.datum_zaduzenja}
                                    onChange={(event) => setData('datum_zaduzenja', event.target.value)}
                                />
                                <InputError message={errors.datum_zaduzenja} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={zatvoriModalDodajZaduzenje}>
                                    Odustani
                                </Button>
                                <Button type="submit" disabled={processing || !izabranaImovinaZaDodavanje}>
                                    Dodaj zaduženje
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

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
                                <Label htmlFor="id_zaposlenika">
                                    Zaposlenik
                                    <span className="text-destructive ml-1">*</span>
                                </Label>
                                <Select
                                    value={data.id_zaposlenika || 'none'}
                                    required
                                    onValueChange={(value) => {
                                        const vrijednost = value === 'none' ? '' : value;

                                        setData('id_zaposlenika', vrijednost);

                                        if (value !== 'new') {
                                            setData('oib_zaposlenika', '');
                                            setData('ime_zaposlenika', '');
                                            setData('prezime_zaposlenika', '');
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
                                <InputError message={errors.id_zaposlenika} />
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
                                            value={data.oib_zaposlenika}
                                            onChange={(event) => setData('oib_zaposlenika', event.target.value)}
                                        />
                                        <InputError message={errors.oib_zaposlenika} />
                                    </div>

                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ime_zaposlenika">Ime</Label>
                                            <Input
                                                id="ime_zaposlenika"
                                                value={data.ime_zaposlenika}
                                                onChange={(event) => setData('ime_zaposlenika', event.target.value)}
                                            />
                                            <InputError message={errors.ime_zaposlenika} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="prezime_zaposlenika">Prezime</Label>
                                            <Input
                                                id="prezime_zaposlenika"
                                                value={data.prezime_zaposlenika}
                                                onChange={(event) =>
                                                    setData('prezime_zaposlenika', event.target.value)
                                                }
                                            />
                                            <InputError message={errors.prezime_zaposlenika} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="datum_zaduzenja">Datum zaduzenja (opcionalno)</Label>
                                <Input
                                    id="datum_zaduzenja"
                                    type="date"
                                    value={data.datum_zaduzenja}
                                    onChange={(event) => setData('datum_zaduzenja', event.target.value)}
                                />
                                <InputError message={errors.datum_zaduzenja} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={zatvoriZaduzenje}>
                                    Odustani
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Spremi zaduzenje
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={odabranaImovinaZaRazduzenje !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            zatvoriRazduzenje();
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Razduzenje imovine</DialogTitle>
                            <DialogDescription>
                                {odabranaImovinaZaRazduzenje
                                    ? `Razduzujete: ${odabranaImovinaZaRazduzenje.naziv_imovine}`
                                    : 'Unesite datum vracanja imovine.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={submitRazduzenje}>
                            <div className="grid gap-2">
                                <Label htmlFor="datum_razduzenja">Datum vracanja</Label>
                                <Input
                                    id="datum_razduzenja"
                                    type="date"
                                    value={razduzenjeData.datum_razduzenja}
                                    onChange={(event) =>
                                        setRazduzenjeData('datum_razduzenja', event.target.value)
                                    }
                                />
                                <InputError message={razduzenjeErrors.datum_razduzenja} />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={zatvoriRazduzenje}>
                                    Odustani
                                </Button>
                                <Button type="submit" disabled={razduzenjeProcessing}>
                                    Spremi razduzenje
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

ImovinaZaduzenja.layout = {
    breadcrumbs: [
        {
            title: 'Imovina',
            href: '/imovina',
        },
        {
            title: 'Workflow zaduzenja',
            href: '/imovina/zaduzenje',
        },
    ],
};
