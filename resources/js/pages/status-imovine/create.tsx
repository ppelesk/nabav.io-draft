import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type StatusImovineForm = {
    naziv_statusa: string;
};

export default function StatusImovineCreate() {
    const { data, setData, post, processing, errors } =
        useForm<StatusImovineForm>({
            naziv_statusa: '',
        });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/status-imovine');
    };

    return (
        <>
            <Head title="Dodaj status imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Dodaj status imovine"
                    description="Unesite naziv novog statusa imovine"
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
                            Spremi status
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

StatusImovineCreate.layout = {
    breadcrumbs: [
        {
            title: 'Statusi imovine',
            href: '/status-imovine',
        },
        {
            title: 'Dodaj',
            href: '/status-imovine/create',
        },
    ],
};
