import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type KategorijaImovineForm = {
    naziv_kategorije: string;
};

export default function KategorijeImovineCreate() {
    const { data, setData, post, processing, errors } =
        useForm<KategorijaImovineForm>({
            naziv_kategorije: '',
        });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/kategorije-imovine');
    };

    return (
        <>
            <Head title="Dodaj kategoriju imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Dodaj kategoriju imovine"
                    description="Unesite naziv nove kategorije imovine"
                />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="naziv_kategorije">Naziv kategorije</Label>
                        <Input
                            id="naziv_kategorije"
                            maxLength={100}
                            value={data.naziv_kategorije}
                            onChange={(event) =>
                                setData('naziv_kategorije', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.naziv_kategorije} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Spremi kategoriju
                        </Button>

                        <Button asChild variant="outline" type="button">
                            <Link href="/kategorije-imovine">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

KategorijeImovineCreate.layout = {
    breadcrumbs: [
        {
            title: 'Kategorije imovine',
            href: '/kategorije-imovine',
        },
        {
            title: 'Dodaj',
            href: '/kategorije-imovine/create',
        },
    ],
};
