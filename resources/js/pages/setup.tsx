import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

type SetupForm = {
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Setup() {
    const { data, setData, post, processing, errors } = useForm<SetupForm>({
        ime_korisnika: '',
        prezime_korisnika: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/setup');
    };

    return (
        <AuthSimpleLayout
            title="Postavljanje aplikacije"
            description="Dobrošli! Aplikacija nije konfigurirana. Kliknite na gumb ispod kako biste pokrenuli migracije baze podataka i kreirali administratorski račun."
        >
            <Head title="Postavljanje aplikacije" />

            <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ime_korisnika">Ime</Label>
                            <Input
                                id="ime_korisnika"
                                type="text"
                                maxLength={100}
                                required
                                autoFocus
                                autoComplete="given-name"
                                value={data.ime_korisnika}
                                onChange={(e) => setData('ime_korisnika', e.target.value)}
                            />
                            <InputError message={errors.ime_korisnika} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="prezime_korisnika">Prezime</Label>
                            <Input
                                id="prezime_korisnika"
                                type="text"
                                maxLength={100}
                                required
                                autoComplete="family-name"
                                value={data.prezime_korisnika}
                                onChange={(e) => setData('prezime_korisnika', e.target.value)}
                            />
                            <InputError message={errors.prezime_korisnika} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email adresa</Label>
                        <Input
                            id="email"
                            type="email"
                            maxLength={255}
                            required
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Lozinka</Label>
                        <PasswordInput
                            id="password"
                            required
                            autoComplete="new-password"
                            minLength={8}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Potvrda lozinke</Label>
                        <PasswordInput
                            id="password_confirmation"
                            required
                            autoComplete="new-password"
                            minLength={8}
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <Spinner />}
                        {processing ? 'Pokretanje migracija i kreiranje računa...' : 'Pokreni migracije i kreiraj račun'}
                    </Button>
                </div>
            </form>
        </AuthSimpleLayout>
    );
}
