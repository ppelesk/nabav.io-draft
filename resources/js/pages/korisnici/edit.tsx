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

type UlogaOption = {
    id_uloge: number;
    naziv_uloge: string;
    sifra_uloge: string;
};

type Korisnik = {
    id_korisnika: number;
    id_uloge: number;
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
    deactivated_at: string | null;
};

type KorisnikForm = {
    id_uloge: string;
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
    aktivan: boolean;
};

export default function KorisniciEdit({
    korisnik,
    uloge,
}: {
    korisnik: Korisnik;
    uloge: UlogaOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<KorisnikForm>({
        id_uloge: String(korisnik.id_uloge),
        ime_korisnika: korisnik.ime_korisnika,
        prezime_korisnika: korisnik.prezime_korisnika,
        email: korisnik.email,
        aktivan: korisnik.deactivated_at === null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/korisnici/${korisnik.id_korisnika}`);
    };

    return (
        <>
            <Head title="Uredi korisnika" />

            <div className="space-y-6 p-4">
                <Heading title="Uredi korisnika" description={`Uredjujete korisnika #${korisnik.id_korisnika}`} />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="id_uloge">Uloga</Label>
                        <Select value={data.id_uloge} onValueChange={(value) => setData('id_uloge', value)}>
                            <SelectTrigger className="w-full" id="id_uloge">
                                <SelectValue placeholder="Odaberite ulogu" />
                            </SelectTrigger>
                            <SelectContent>
                                {uloge.map((uloga) => (
                                    <SelectItem key={uloga.id_uloge} value={String(uloga.id_uloge)}>
                                        {uloga.naziv_uloge}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.id_uloge} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ime_korisnika">Ime</Label>
                        <Input
                            id="ime_korisnika"
                            maxLength={100}
                            value={data.ime_korisnika}
                            onChange={(event) => setData('ime_korisnika', event.target.value)}
                            required
                        />
                        <InputError message={errors.ime_korisnika} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="prezime_korisnika">Prezime</Label>
                        <Input
                            id="prezime_korisnika"
                            maxLength={100}
                            value={data.prezime_korisnika}
                            onChange={(event) => setData('prezime_korisnika', event.target.value)}
                            required
                        />
                        <InputError message={errors.prezime_korisnika} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            maxLength={150}
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={data.aktivan}
                            onChange={(event) => setData('aktivan', event.target.checked)}
                        />
                        Korisnik je aktivan
                    </label>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/korisnici">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

KorisniciEdit.layout = {
    breadcrumbs: [
        {
            title: 'Korisnici',
            href: '/korisnici',
        },
        {
            title: 'Uredi',
            href: '/korisnici',
        },
    ],
};
