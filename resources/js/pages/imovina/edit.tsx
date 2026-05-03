import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Option = {
    id_statusa?: number;
    naziv_statusa?: string;
    id_kategorije?: number;
    naziv_kategorije?: string;
    id_odjela?: number;
    naziv_odjela?: string;
    id_lokacije?: number;
    oznaka_sobe?: string;
    naziv_sobe?: string | null;
    id_zaposlenika?: number;
    ime_zaposlenika?: string;
    prezime_zaposlenika?: string;
};

type ImovinaPayload = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    serijski_broj: string | null;
    broj_racuna: string | null;
    datum_nabave: string;
    cijena: string;
    jamstvo_mjeseci: number;
    amortizacija_mjeseci: number | null;
    id_kategorije: number;
    id_statusa: number;
    id_odjela: number | null;
    id_lokacije: number | null;
    id_zaposlenika: number | null;
    na_revers: boolean;
    datum_zaduzenja: string | null;
    datum_razduzenja: string | null;
};

type ImovinaForm = {
    inventarni_broj: string;
    naziv_imovine: string;
    serijski_broj: string;
    broj_racuna: string;
    datum_nabave: string;
    cijena: string;
    jamstvo_mjeseci: string;
    amortizacija_mjeseci: string;
    id_kategorije: string;
    id_statusa: string;
    id_odjela: string;
    id_lokacije: string;
    id_zaposlenika: string;
    na_revers: string;
    datum_zaduzenja: string;
    datum_razduzenja: string;
};

export default function ImovinaEdit({
    imovina,
    statusi,
    kategorije,
    odjeli,
    lokacije,
    zaposlenici,
}: {
    imovina: ImovinaPayload;
    statusi: Option[];
    kategorije: Option[];
    odjeli: Option[];
    lokacije: Option[];
    zaposlenici: Option[];
}) {
    const { data, setData, put, processing, errors } = useForm<ImovinaForm>({
        inventarni_broj: imovina.inventarni_broj ?? '',
        naziv_imovine: imovina.naziv_imovine,
        serijski_broj: imovina.serijski_broj ?? '',
        broj_racuna: imovina.broj_racuna ?? '',
        datum_nabave: imovina.datum_nabave,
        cijena: imovina.cijena,
        jamstvo_mjeseci: String(imovina.jamstvo_mjeseci),
        amortizacija_mjeseci: imovina.amortizacija_mjeseci
            ? String(imovina.amortizacija_mjeseci)
            : '',
        id_kategorije: String(imovina.id_kategorije),
        id_statusa: String(imovina.id_statusa),
        id_odjela: imovina.id_odjela ? String(imovina.id_odjela) : '',
        id_lokacije: imovina.id_lokacije ? String(imovina.id_lokacije) : '',
        id_zaposlenika: imovina.id_zaposlenika ? String(imovina.id_zaposlenika) : '',
        na_revers: imovina.na_revers ? '1' : '0',
        datum_zaduzenja: imovina.datum_zaduzenja ?? '',
        datum_razduzenja: imovina.datum_razduzenja ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/imovina/${imovina.id_imovine}`);
    };

    return (
        <>
            <Head title="Uredi imovinu" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi imovinu"
                    description="Azuriranje osnovnih podataka i zaduzenja"
                />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="inventarni_broj">Inventarni broj</Label>
                            <Input
                                id="inventarni_broj"
                                maxLength={30}
                                value={data.inventarni_broj}
                                onChange={(event) => setData('inventarni_broj', event.target.value)}
                            />
                            <InputError message={errors.inventarni_broj} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="naziv_imovine">Naziv imovine</Label>
                            <Input
                                id="naziv_imovine"
                                maxLength={150}
                                required
                                value={data.naziv_imovine}
                                onChange={(event) => setData('naziv_imovine', event.target.value)}
                            />
                            <InputError message={errors.naziv_imovine} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="serijski_broj">Serijski broj</Label>
                            <Input
                                id="serijski_broj"
                                maxLength={100}
                                value={data.serijski_broj}
                                onChange={(event) => setData('serijski_broj', event.target.value)}
                            />
                            <InputError message={errors.serijski_broj} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="broj_racuna">Broj racuna</Label>
                            <Input
                                id="broj_racuna"
                                maxLength={80}
                                value={data.broj_racuna}
                                onChange={(event) => setData('broj_racuna', event.target.value)}
                            />
                            <InputError message={errors.broj_racuna} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="datum_nabave">Datum nabave</Label>
                            <Input
                                id="datum_nabave"
                                type="date"
                                required
                                value={data.datum_nabave}
                                onChange={(event) => setData('datum_nabave', event.target.value)}
                            />
                            <InputError message={errors.datum_nabave} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cijena">Cijena</Label>
                            <Input
                                id="cijena"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={data.cijena}
                                onChange={(event) => setData('cijena', event.target.value)}
                            />
                            <InputError message={errors.cijena} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jamstvo_mjeseci">Jamstvo (mjeseci)</Label>
                            <Input
                                id="jamstvo_mjeseci"
                                type="number"
                                min="0"
                                max="240"
                                required
                                value={data.jamstvo_mjeseci}
                                onChange={(event) => setData('jamstvo_mjeseci', event.target.value)}
                            />
                            <InputError message={errors.jamstvo_mjeseci} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="amortizacija_mjeseci">Amortizacija (mjeseci)</Label>
                            <Input
                                id="amortizacija_mjeseci"
                                type="number"
                                min="0"
                                max="1200"
                                value={data.amortizacija_mjeseci}
                                onChange={(event) => setData('amortizacija_mjeseci', event.target.value)}
                            />
                            <InputError message={errors.amortizacija_mjeseci} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_kategorije">Kategorija</Label>
                            <Select
                                value={data.id_kategorije}
                                onValueChange={(value) => setData('id_kategorije', value)}
                            >
                                <SelectTrigger id="id_kategorije">
                                    <SelectValue placeholder="Odaberite kategoriju" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <InputError message={errors.id_kategorije} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_statusa">Status</Label>
                            <Select
                                value={data.id_statusa}
                                onValueChange={(value) => setData('id_statusa', value)}
                            >
                                <SelectTrigger id="id_statusa">
                                    <SelectValue placeholder="Odaberite status" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <InputError message={errors.id_statusa} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_odjela">Odjel</Label>
                            <Select
                                value={data.id_odjela || 'none'}
                                onValueChange={(value) =>
                                    setData('id_odjela', value === 'none' ? '' : value)
                                }
                            >
                                <SelectTrigger id="id_odjela">
                                    <SelectValue placeholder="Odaberite odjel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nije dodijeljeno</SelectItem>
                                    {odjeli.map((odjel) => (
                                        <SelectItem key={odjel.id_odjela} value={String(odjel.id_odjela)}>
                                            {odjel.naziv_odjela}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.id_odjela} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_lokacije">Lokacija</Label>
                            <Select
                                value={data.id_lokacije || 'none'}
                                onValueChange={(value) =>
                                    setData('id_lokacije', value === 'none' ? '' : value)
                                }
                            >
                                <SelectTrigger id="id_lokacije">
                                    <SelectValue placeholder="Odaberite lokaciju" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nije dodijeljeno</SelectItem>
                                    {lokacije.map((lokacija) => (
                                        <SelectItem
                                            key={lokacija.id_lokacije}
                                            value={String(lokacija.id_lokacije)}
                                        >
                                            {lokacija.oznaka_sobe}
                                            {lokacija.naziv_sobe ? ` (${lokacija.naziv_sobe})` : ''}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.id_lokacije} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="id_zaposlenika">Zaposlenik</Label>
                            <Select
                                value={data.id_zaposlenika || 'none'}
                                onValueChange={(value) =>
                                    setData('id_zaposlenika', value === 'none' ? '' : value)
                                }
                            >
                                <SelectTrigger id="id_zaposlenika">
                                    <SelectValue placeholder="Odaberite zaposlenika" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nije zaduzena</SelectItem>
                                    {zaposlenici.map((zaposlenik) => (
                                        <SelectItem
                                            key={zaposlenik.id_zaposlenika}
                                            value={String(zaposlenik.id_zaposlenika)}
                                        >
                                            {zaposlenik.ime_zaposlenika} {zaposlenik.prezime_zaposlenika}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.id_zaposlenika} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="na_revers">Izdana na revers</Label>
                            <Select value={data.na_revers} onValueChange={(value) => setData('na_revers', value)}>
                                <SelectTrigger id="na_revers">
                                    <SelectValue placeholder="Odaberite" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Ne</SelectItem>
                                    <SelectItem value="1">Da</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.na_revers} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="datum_zaduzenja">Datum zaduzenja</Label>
                            <Input
                                id="datum_zaduzenja"
                                type="date"
                                value={data.datum_zaduzenja}
                                onChange={(event) => setData('datum_zaduzenja', event.target.value)}
                            />
                            <InputError message={errors.datum_zaduzenja} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="datum_razduzenja">Datum razduzenja</Label>
                            <Input
                                id="datum_razduzenja"
                                type="date"
                                value={data.datum_razduzenja}
                                onChange={(event) => setData('datum_razduzenja', event.target.value)}
                            />
                            <InputError message={errors.datum_razduzenja} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/imovina">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ImovinaEdit.layout = {
    breadcrumbs: [
        {
            title: 'Imovina',
            href: '/imovina',
        },
        {
            title: 'Uredi',
            href: '#',
        },
    ],
};
