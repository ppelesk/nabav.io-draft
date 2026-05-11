import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Zaposlenik = {
    id_zaposlenika: number;
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

type ZaposlenikForm = {
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

export default function ZaposleniciEdit({
    zaposlenik,
}: {
    zaposlenik: Zaposlenik;
}) {
    const { data, setData, put, processing, errors } = useForm<ZaposlenikForm>({
        oib_zaposlenika: zaposlenik.oib_zaposlenika,
        ime_zaposlenika: zaposlenik.ime_zaposlenika,
        prezime_zaposlenika: zaposlenik.prezime_zaposlenika,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(`/zaposlenici/${zaposlenik.id_zaposlenika}`);
    };

    return (
        <>
            <Head title="Uredi zaposlenika" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi zaposlenika"
                    description={`Uredjujete zaposlenika #${zaposlenik.id_zaposlenika}`}
                />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="oib_zaposlenika">OIB zaposlenika</Label>
                        <Input
                            id="oib_zaposlenika"
                            maxLength={11}
                            value={data.oib_zaposlenika}
                            onChange={(event) =>
                                setData('oib_zaposlenika', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.oib_zaposlenika} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ime_zaposlenika">Ime zaposlenika</Label>
                        <Input
                            id="ime_zaposlenika"
                            value={data.ime_zaposlenika}
                            onChange={(event) =>
                                setData('ime_zaposlenika', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.ime_zaposlenika} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="prezime_zaposlenika">
                            Prezime zaposlenika
                        </Label>
                        <Input
                            id="prezime_zaposlenika"
                            value={data.prezime_zaposlenika}
                            onChange={(event) =>
                                setData('prezime_zaposlenika', event.target.value)
                            }
                            required
                        />
                        <InputError message={errors.prezime_zaposlenika} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Spremi promjene
                        </Button>

                        <Button asChild variant="outline" type="button">
                            <Link href="/zaposlenici">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ZaposleniciEdit.layout = {
    breadcrumbs: [
        {
            title: 'Zaposlenici',
            href: '/zaposlenici',
        },
        {
            title: 'Uredi',
            href: '/zaposlenici',
        },
    ],
};
