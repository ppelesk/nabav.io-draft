import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ZgradaOption = {
    id_zgrade: number;
    naziv_zgrade: string;
    adresa_zgrade: string | null;
};

type Lokacija = {
    id_lokacije: number;
    id_zgrade: number;
    oznaka_sobe: string;
    naziv_sobe: string | null;
};

type LokacijaForm = {
    id_zgrade: string;
    naziv_sobe: string;
};

export default function LokacijeEdit({
    lokacija,
    zgrade,
}: {
    lokacija: Lokacija;
    zgrade: ZgradaOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<LokacijaForm>({
        id_zgrade: String(lokacija.id_zgrade),
        naziv_sobe: lokacija.naziv_sobe ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/lokacije/${lokacija.id_lokacije}`);
    };

    return (
        <>
            <Head title="Uredi lokaciju" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Uredi lokaciju"
                    description={`Uredjujete lokaciju #${lokacija.id_lokacije}`}
                />

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="id_zgrade">Zgrada</Label>
                        <Select value={data.id_zgrade} onValueChange={(value) => setData('id_zgrade', value)}>
                            <SelectTrigger className="w-full" id="id_zgrade">
                                <SelectValue placeholder="Odaberite zgradu" />
                            </SelectTrigger>
                            <SelectContent>
                                {zgrade.map((zgrada) => (
                                    <SelectItem key={zgrada.id_zgrade} value={String(zgrada.id_zgrade)}>
                                        {zgrada.naziv_zgrade}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.id_zgrade} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="oznaka_sobe">Oznaka sobe</Label>
                        <Input id="oznaka_sobe" value={lokacija.oznaka_sobe} disabled readOnly />
                        <p className="text-sm text-muted-foreground">
                            Oznaka sobe generira se automatski iz ID-a lokacije.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="naziv_sobe">Naziv sobe</Label>
                        <Input
                            id="naziv_sobe"
                            maxLength={100}
                            value={data.naziv_sobe}
                            onChange={(event) => setData('naziv_sobe', event.target.value)}
                        />
                        <InputError message={errors.naziv_sobe} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>Spremi promjene</Button>
                        <Button asChild variant="outline" type="button">
                            <Link href="/lokacije">Odustani</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

LokacijeEdit.layout = {
    breadcrumbs: [
        {
            title: 'Lokacije',
            href: '/lokacije',
        },
        {
            title: 'Uredi',
            href: '/lokacije',
        },
    ],
};
