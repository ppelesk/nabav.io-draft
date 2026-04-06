import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type KategorijaImovine = {
    id_kategorije: number;
    naziv_kategorije: string;
};

type KategorijaImovineForm = {
    naziv_kategorije: string;
};

export default function KategorijeImovineEdit({
    kategorijaImovine,
}: {
    kategorijaImovine: KategorijaImovine;
}) {
    const { data, setData, put, processing, errors } =
        useForm<KategorijaImovineForm>({
            naziv_kategorije: kategorijaImovine.naziv_kategorije,
        });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/kategorije-imovine/${kategorijaImovine.id_kategorije}`);
    };

    return (
        <>
            <Head title="Uredi kategoriju imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi kategoriju imovine"
                    description={`Uredjujete kategoriju #${kategorijaImovine.id_kategorije}`}
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
                            Spremi promjene
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

KategorijeImovineEdit.layout = {
    breadcrumbs: [
        {
            title: 'Kategorije imovine',
            href: '/kategorije-imovine',
        },
        {
            title: 'Uredi',
            href: '/kategorije-imovine',
        },
    ],
};
