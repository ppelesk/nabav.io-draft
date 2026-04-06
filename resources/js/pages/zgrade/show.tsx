import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Zgrada = {
    id_zgrade: number;
    naziv_zgrade: string;
    adresa_zgrade: string | null;
    broj_lokacija: number;
    created_at: string | null;
    updated_at: string | null;
};

export default function ZgradeShow({ zgrada }: { zgrada: Zgrada }) {
    return (
        <>
            <Head title="Detalji zgrade" />

            <div className="space-y-6 p-4">
                <Heading title="Detalji zgrade" description={`Zapis #${zgrada.id_zgrade}`} />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p><strong>ID zgrade:</strong> {zgrada.id_zgrade}</p>
                        <p><strong>Naziv zgrade:</strong> {zgrada.naziv_zgrade}</p>
                        <p><strong>Adresa zgrade:</strong> {zgrada.adresa_zgrade ?? '-'}</p>
                        <p><strong>Broj lokacija:</strong> {zgrada.broj_lokacija}</p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/zgrade/${zgrada.id_zgrade}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/zgrade">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

ZgradeShow.layout = {
    breadcrumbs: [
        {
            title: 'Zgrade',
            href: '/zgrade',
        },
        {
            title: 'Detalji',
            href: '/zgrade',
        },
    ],
};
