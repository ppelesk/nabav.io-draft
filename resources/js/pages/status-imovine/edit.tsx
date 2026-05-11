import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type StatusImovine = {
    id_statusa: number;
    naziv_statusa: string;
};

type StatusImovineForm = {
    naziv_statusa: string;
};

export default function StatusImovineEdit({
    statusImovine,
}: {
    statusImovine: StatusImovine;
}) {
    const { data, setData, put, processing, errors } =
        useForm<StatusImovineForm>({
            naziv_statusa: statusImovine.naziv_statusa,
        });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/status-imovine/${statusImovine.id_statusa}`);
    };

    return (
        <>
            <Head title="Uredi status imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi status imovine"
                    description={`Uredjujete status #${statusImovine.id_statusa}`}
                />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="naziv_statusa">Naziv statusa</Label>
                        <Input
                            id="naziv_statusa"
                            maxLength={100}
                            value={data.naziv_statusa}
                            onChange={(event) =>
                                setData('naziv_statusa', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.naziv_statusa} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Spremi promjene
                        </Button>

                        <Button asChild variant="outline" type="button">
                            <Link href="/status-imovine">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

StatusImovineEdit.layout = {
    breadcrumbs: [
        {
            title: 'Statusi imovine',
            href: '/status-imovine',
        },
        {
            title: 'Uredi',
            href: '/status-imovine',
        },
    ],
};
