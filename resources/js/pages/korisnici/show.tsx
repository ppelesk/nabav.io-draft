import { Head, Link, router, usePage } from '@inertiajs/react';
import { CircleCheckBig } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Korisnik = {
    id_korisnika: number;
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
    deactivated_at: string | null;
    uloga: {
        id_uloge: number;
        naziv_uloge: string;
        sifra_uloge: string;
    } | null;
};

export default function KorisniciShow({ korisnik }: { korisnik: Korisnik }) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;

    const ponovnoPosaljiPozivnicu = () => {
        router.post(`/korisnici/${korisnik.id_korisnika}/resend-invite`);
    };

    return (
        <>
            <Head title="Detalji korisnika" />

            <div className="space-y-6 p-4">
                <Heading title="Detalji korisnika" description={`Zapis #${korisnik.id_korisnika}`} />

                {flash?.status && (
                    <Alert>
                        <CircleCheckBig />
                        <AlertTitle>Pozivnica poslana</AlertTitle>
                        <AlertDescription>{flash.status}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Osnovni podaci</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <p><strong>ID korisnika:</strong> {korisnik.id_korisnika}</p>
                        <p><strong>Ime:</strong> {korisnik.ime_korisnika}</p>
                        <p><strong>Prezime:</strong> {korisnik.prezime_korisnika}</p>
                        <p><strong>Email:</strong> {korisnik.email}</p>
                        <p><strong>Uloga:</strong> {korisnik.uloga?.naziv_uloge ?? '-'}</p>
                        <p><strong>Status:</strong> {korisnik.deactivated_at ? 'Neaktivan' : 'Aktivan'}</p>
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={ponovnoPosaljiPozivnicu} variant="secondary">
                        Ponovno posalji pozivnicu
                    </Button>
                    <Button asChild>
                        <Link href={`/korisnici/${korisnik.id_korisnika}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/korisnici">Natrag na popis</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

KorisniciShow.layout = {
    breadcrumbs: [
        {
            title: 'Korisnici',
            href: '/korisnici',
        },
        {
            title: 'Detalji',
            href: '/korisnici',
        },
    ],
};
