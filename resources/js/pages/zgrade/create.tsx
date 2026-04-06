import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ZgradaForm = {
    naziv_zgrade: string;
    adresa_zgrade: string;
};

export default function ZgradeCreate() {
    const { data, setData, post, processing, errors } = useForm<ZgradaForm>({
        naziv_zgrade: '',
        adresa_zgrade: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/zgrade');
    };

    return (
        <>
            <Head title="Dodaj zgradu" />

            <div className="space-y-6 p-4">
                <Heading title="Dodaj zgradu" description="Unesite podatke nove zgrade" />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="naziv_zgrade">Naziv zgrade</Label>
                        <Input
                            id="naziv_zgrade"
                            maxLength={150}
                            value={data.naziv_zgrade}
                            onChange={(event) => setData('naziv_zgrade', event.target.value)}
                            required
                        />
                        <InputError message={errors.naziv_zgrade} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="adresa_zgrade">Adresa zgrade</Label>
                        <Input
                            id="adresa_zgrade"
                            maxLength={200}
                            value={data.adresa_zgrade}
                            onChange={(event) => setData('adresa_zgrade', event.target.value)}
                        />
                        <InputError message={errors.adresa_zgrade} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi zgradu</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/zgrade">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ZgradeCreate.layout = {
    breadcrumbs: [
        {
            title: 'Zgrade',
            href: '/zgrade',
        },
        {
            title: 'Dodaj',
            href: '/zgrade/create',
        },
    ],
};
