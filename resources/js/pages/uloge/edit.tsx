import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Uloga = {
    id_uloge: number;
    naziv_uloge: string;
    sifra_uloge: string;
};

type UlogaForm = {
    naziv_uloge: string;
    sifra_uloge: string;
};

export default function UlogeEdit({ uloga }: { uloga: Uloga }) {
    const { data, setData, put, processing, errors } = useForm<UlogaForm>({
        naziv_uloge: uloga.naziv_uloge,
        sifra_uloge: uloga.sifra_uloge,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/uloge/${uloga.id_uloge}`);
    };

    return (
        <>
            <Head title="Uredi ulogu" />

            <div className="space-y-6 p-4">
                <Heading title="Uredi ulogu" description={`Uredjujete ulogu #${uloga.id_uloge}`} />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="naziv_uloge">Naziv uloge</Label>
                        <Input
                            id="naziv_uloge"
                            maxLength={100}
                            value={data.naziv_uloge}
                            onChange={(event) => setData('naziv_uloge', event.target.value)}
                            required
                        />
                        <InputError message={errors.naziv_uloge} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="sifra_uloge">Sifra uloge</Label>
                        <Input
                            id="sifra_uloge"
                            maxLength={50}
                            value={data.sifra_uloge}
                            onChange={(event) => setData('sifra_uloge', event.target.value)}
                            required
                        />
                        <InputError message={errors.sifra_uloge} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/uloge">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UlogeEdit.layout = {
    breadcrumbs: [
        {
            title: 'Uloge',
            href: '/uloge',
        },
        {
            title: 'Uredi',
            href: '/uloge',
        },
    ],
};
