import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OdjelForm = {
    naziv_odjela: string;
};

export default function OdjeliCreate() {
    const { data, setData, post, processing, errors } = useForm<OdjelForm>({
        naziv_odjela: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/odjeli');
    };

    return (
        <>
            <Head title="Dodaj odjel" />

            <div className="space-y-6 p-4">
                <Heading title="Dodaj odjel" description="Unesite naziv novog odjela" />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="naziv_odjela">Naziv odjela</Label>
                        <Input
                            id="naziv_odjela"
                            maxLength={100}
                            value={data.naziv_odjela}
                            onChange={(event) => setData('naziv_odjela', event.target.value)}
                            required
                        />
                        <InputError message={errors.naziv_odjela} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi odjel</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/odjeli">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

OdjeliCreate.layout = {
    breadcrumbs: [
        {
            title: 'Odjeli',
            href: '/odjeli',
        },
        {
            title: 'Dodaj',
            href: '/odjeli/create',
        },
    ],
};
