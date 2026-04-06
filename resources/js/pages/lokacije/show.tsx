import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Lokacija = {
    id_lokacije: number;
    id_zgrade: number;
    oznaka_sobe: string;
    naziv_sobe: string | null;
    created_at: string | null;
    updated_at: string | null;
    zgrada: {
        id_zgrade: number;
        naziv_zgrade: string;
        adresa_zgrade: string | null;
    } | null;
};

export default function LokacijeShow({ lokacija }: { lokacija: Lokacija }) {
    return (
        <>
            <Head title="Detalji lokacije" />

            <div className="space-y-6 p-4">
                <Heading title="Detalji lokacije" description={`Zapis #${lokacija.id_lokacije}`} />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p><strong>ID lokacije:</strong> {lokacija.id_lokacije}</p>
                        <p><strong>Zgrada:</strong> {lokacija.zgrada?.naziv_zgrade ?? '-'}</p>
                        <p><strong>Oznaka sobe:</strong> {lokacija.oznaka_sobe}</p>
                        <p><strong>Naziv sobe:</strong> {lokacija.naziv_sobe ?? '-'}</p>
                        <p><strong>Adresa zgrade:</strong> {lokacija.zgrada?.adresa_zgrade ?? '-'}</p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/lokacije/${lokacija.id_lokacije}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/lokacije">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

LokacijeShow.layout = {
    breadcrumbs: [
        {
            title: 'Lokacije',
            href: '/lokacije',
        },
        {
            title: 'Detalji',
            href: '/lokacije',
        },
    ],
};
