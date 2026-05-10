import { Head, Link, router, usePage } from '@inertiajs/react';
import { CircleCheckBig } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Korisnik = {
    id_korisnika: number;
    ime_korisnika: string;
    prezime_korisnika: string;
    email: string;
    deactivated_at: string | null;
    uloga: {
        id_uloge: number;
        naziv_uloge: string;
    } | null;
};

export default function KorisniciIndex({ korisnici }: { korisnici: Korisnik[] }) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;

    const obrisiKorisnika = (idKorisnika: number) => {
        if (!window.confirm('Jeste li sigurni da zelite obrisati korisnika?')) {
            return;
        }

        router.delete(`/korisnici/${idKorisnika}`);
    };

    return (
        <>
            <Head title="Korisnici" />

            <div className="space-y-6 p-4">
                <Heading title="Korisnici" description="Upravljanje korisnickim racunima" />

                {flash?.status && (
                    <Alert>
                        <CircleCheckBig />
                        <AlertTitle>Pozivnica poslana</AlertTitle>
                        <AlertDescription>{flash.status}</AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/korisnici/create">Dodaj korisnika</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis korisnika</CardTitle>
                        <CardDescription>Ukupno zapisa: {korisnici.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[920px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">ID korisnika</th>
                                        <th className="py-3 pr-4 font-medium">Ime i prezime</th>
                                        <th className="py-3 pr-4 font-medium">Email</th>
                                        <th className="py-3 pr-4 font-medium">Uloga</th>
                                        <th className="py-3 pr-4 font-medium">Status</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {korisnici.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={6}>
                                                Nema unesenih korisnika.
                                            </td>
                                        </tr>
                                    ) : (
                                        korisnici.map((korisnik) => (
                                            <tr key={korisnik.id_korisnika} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{korisnik.id_korisnika}</td>
                                                <td className="py-3 pr-4">
                                                    {korisnik.ime_korisnika} {korisnik.prezime_korisnika}
                                                </td>
                                                <td className="py-3 pr-4">{korisnik.email}</td>
                                                <td className="py-3 pr-4">{korisnik.uloga?.naziv_uloge ?? '-'}</td>
                                                <td className="py-3 pr-4">
                                                    {korisnik.deactivated_at ? 'Neaktivan' : 'Aktivan'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/korisnici/${korisnik.id_korisnika}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/korisnici/${korisnik.id_korisnika}/edit`}>Uredi</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisiKorisnika(korisnik.id_korisnika)}
                                                        >
                                                            Obrisi
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KorisniciIndex.layout = {
    breadcrumbs: [
        {
            title: 'Korisnici',
            href: '/korisnici',
        },
    ],
};
