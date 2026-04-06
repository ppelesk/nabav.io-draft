import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatusImovine = {
    id_statusa: number;
    naziv_statusa: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function StatusImovineShow({
    statusImovine,
}: {
    statusImovine: StatusImovine;
}) {
    return (
        <>
            <Head title="Detalji statusa imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Detalji statusa imovine"
                    description={`Zapis #${statusImovine.id_statusa}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p>
                            <strong>ID statusa:</strong> {statusImovine.id_statusa}
                        </p>
                        <p>
                            <strong>Naziv statusa:</strong>{' '}
                            {statusImovine.naziv_statusa}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/status-imovine/${statusImovine.id_statusa}/edit`}>
                            Uredi
                        </Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/status-imovine">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

StatusImovineShow.layout = {
    breadcrumbs: [
        {
            title: 'Statusi imovine',
            href: '/status-imovine',
        },
        {
            title: 'Detalji',
            href: '/status-imovine',
        },
    ],
};
