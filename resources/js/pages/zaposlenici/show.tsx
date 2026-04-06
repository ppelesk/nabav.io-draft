import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Zaposlenik = {
    id_zaposlenika: number;
    id_korisnika: number | null;
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
    created_at: string | null;
    updated_at: string | null;
};

export default function ZaposleniciShow({
    zaposlenik,
}: {
    zaposlenik: Zaposlenik;
}) {
    return (
        <>
            <Head title="Detalji zaposlenika" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Detalji zaposlenika"
                    description={`Zapis #${zaposlenik.id_zaposlenika}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p>
                            <strong>ID zaposlenika:</strong>{' '}
                            {zaposlenik.id_zaposlenika}
                        </p>
                        <p>
                            <strong>ID korisnika:</strong>{' '}
                            {zaposlenik.id_korisnika ?? '-'}
                        </p>
                        <p>
                            <strong>OIB:</strong> {zaposlenik.oib_zaposlenika}
                        </p>
                        <p>
                            <strong>Ime:</strong> {zaposlenik.ime_zaposlenika}
                        </p>
                        <p>
                            <strong>Prezime:</strong> {zaposlenik.prezime_zaposlenika}
                        </p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/zaposlenici/${zaposlenik.id_zaposlenika}/edit`}>
                            Uredi
                        </Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/zaposlenici">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

ZaposleniciShow.layout = {
    breadcrumbs: [
        {
            title: 'Zaposlenici',
            href: '/zaposlenici',
        },
        {
            title: 'Detalji',
            href: '/zaposlenici',
        },
    ],
};
