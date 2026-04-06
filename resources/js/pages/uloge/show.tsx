import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Uloga = {
    id_uloge: number;
    naziv_uloge: string;
    sifra_uloge: string;
    broj_korisnika: number;
};

export default function UlogeShow({ uloga }: { uloga: Uloga }) {
    return (
        <>
            <Head title="Detalji uloge" />

            <div className="space-y-6 p-4">
                <Heading title="Detalji uloge" description={`Zapis #${uloga.id_uloge}`} />

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p><strong>ID uloge:</strong> {uloga.id_uloge}</p>
                        <p><strong>Naziv uloge:</strong> {uloga.naziv_uloge}</p>
                        <p><strong>Sifra uloge:</strong> {uloga.sifra_uloge}</p>
                        <p><strong>Broj korisnika:</strong> {uloga.broj_korisnika}</p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild>
                        <Link href={`/uloge/${uloga.id_uloge}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/uloge">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

UlogeShow.layout = {
    breadcrumbs: [
        {
            title: 'Uloge',
            href: '/uloge',
        },
        {
            title: 'Detalji',
            href: '/uloge',
        },
    ],
};
