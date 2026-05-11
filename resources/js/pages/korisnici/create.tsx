import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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

type KorisnikForm = {
    id_uloge: string;
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
};

export default function KorisniciCreate({ uloge }: { uloge: UlogaOption[] }) {
    const { data, setData, post, processing, errors } = useForm<KorisnikForm>({
        id_uloge: '',
        ime_korisnika: '',
        prezime_korisnika: '',
        email: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/korisnici');
    };

    return (
        <>
            <Head title="Dodaj korisnika" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Dodaj korisnika"
                    description="Administrator unosi osnovne podatke, a korisnik postavlja lozinku putem email pozivnice"
                />

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

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi i posalji pozivnicu</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/korisnici">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

KorisniciCreate.layout = {
    breadcrumbs: [
        {
            title: 'Korisnici',
            href: '/korisnici',
        },
        {
            title: 'Dodaj',
            href: '/korisnici/create',
        },
    ],
};
