import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type KategorijaImovine = {
    id_kategorije: number;
    naziv_kategorije: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function KategorijeImovineShow({
    kategorijaImovine,
}: {
    kategorijaImovine: KategorijaImovine;
}) {
    return (
        <>
            <Head title="Detalji kategorije imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Detalji kategorije imovine"
                    description={`Zapis #${kategorijaImovine.id_kategorije}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p>
                            <strong>ID kategorije:</strong>{' '}
                            {kategorijaImovine.id_kategorije}
                        </p>
                        <p>
                            <strong>Naziv kategorije:</strong>{' '}
                            {kategorijaImovine.naziv_kategorije}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link
                            href={`/kategorije-imovine/${kategorijaImovine.id_kategorije}/edit`}
                        >
                            Uredi
                        </Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/kategorije-imovine">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

KategorijeImovineShow.layout = {
    breadcrumbs: [
        {
            title: 'Kategorije imovine',
            href: '/kategorije-imovine',
        },
        {
            title: 'Detalji',
            href: '/kategorije-imovine',
        },
    ],
};
