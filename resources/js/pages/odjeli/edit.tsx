import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Odjel = {
    id_odjela: number;
    naziv_odjela: string;
};

type OdjelForm = {
    naziv_odjela: string;
};

export default function OdjeliEdit({ odjel }: { odjel: Odjel }) {
    const { data, setData, put, processing, errors } = useForm<OdjelForm>({
        naziv_odjela: odjel.naziv_odjela,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/odjeli/${odjel.id_odjela}`);
    };

    return (
        <>
            <Head title="Uredi odjel" />

            <div className="space-y-6 p-4">
                <Heading title="Uredi odjel" description={`Uredjujete odjel #${odjel.id_odjela}`} />

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
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/odjeli">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

OdjeliEdit.layout = {
    breadcrumbs: [
        {
            title: 'Odjeli',
            href: '/odjeli',
        },
        {
            title: 'Uredi',
            href: '/odjeli',
        },
    ],
};
