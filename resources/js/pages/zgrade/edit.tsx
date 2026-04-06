import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Zgrada = {
    id_zgrade: number;
    naziv_zgrade: string;
    adresa_zgrade: string | null;
};

type ZgradaForm = {
    naziv_zgrade: string;
    adresa_zgrade: string;
};

export default function ZgradeEdit({ zgrada }: { zgrada: Zgrada }) {
    const { data, setData, put, processing, errors } = useForm<ZgradaForm>({
        naziv_zgrade: zgrada.naziv_zgrade,
        adresa_zgrade: zgrada.adresa_zgrade ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/zgrade/${zgrada.id_zgrade}`);
    };

    return (
        <>
            <Head title="Uredi zgradu" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi zgradu"
                    description={`Uredjujete zgradu #${zgrada.id_zgrade}`}
                />

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
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/zgrade">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ZgradeEdit.layout = {
    breadcrumbs: [
        {
            title: 'Zgrade',
            href: '/zgrade',
        },
        {
            title: 'Uredi',
            href: '/zgrade',
        },
    ],
};
