import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Odjel = {
    id_odjela: number;
    naziv_odjela: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function OdjeliShow({ odjel }: { odjel: Odjel }) {
    return (
        <>
            <Head title="Detalji odjela" />

            <div className="space-y-6 p-4">
                <Heading title="Detalji odjela" description={`Zapis #${odjel.id_odjela}`} />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p><strong>ID odjela:</strong> {odjel.id_odjela}</p>
                        <p><strong>Naziv odjela:</strong> {odjel.naziv_odjela}</p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/odjeli/${odjel.id_odjela}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/odjeli">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

OdjeliShow.layout = {
    breadcrumbs: [
        {
            title: 'Odjeli',
            href: '/odjeli',
        },
        {
            title: 'Detalji',
            href: '/odjeli',
        },
    ],
};
