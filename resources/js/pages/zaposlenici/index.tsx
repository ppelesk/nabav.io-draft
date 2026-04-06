import { Head, Link, router } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

type Zaposlenik = {
    id_zaposlenika: number;
    id_korisnika: number | null;
    oib_zaposlenika: string;
    ime_zaposlenika: string;
    prezime_zaposlenika: string;
};

export default function ZaposleniciIndex({
    zaposlenici,
}: {
    zaposlenici: Zaposlenik[];
}) {
    const obrisiZaposlenika = (idZaposlenika: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati zaposlenika?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/zaposlenici/${idZaposlenika}`);
    };

    return (
        <>
            <Head title="Zaposlenici" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Zaposlenici"
                    description="Pregled, dodavanje i uredjivanje zaposlenika"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/zaposlenici/create">Dodaj zaposlenika</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis zaposlenika</CardTitle>
                        <CardDescription>
                            Ukupno zapisa: {zaposlenici.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">
                                            ID zaposlenika
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            ID korisnika
                                        </th>
                                        <th className="py-3 pr-4 font-medium">OIB</th>
                                        <th className="py-3 pr-4 font-medium">Ime</th>
                                        <th className="py-3 pr-4 font-medium">
                                            Prezime
                                        </th>
                                        <th className="py-3 text-right font-medium">
                                            Akcije
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {zaposlenici.length === 0 ? (
                                        <tr>
                                            <td
                                                className="py-6 text-muted-foreground"
                                                colSpan={6}
                                            >
                                                Nema unesenih zaposlenika.
                                            </td>
                                        </tr>
                                    ) : (
                                        zaposlenici.map((zaposlenik) => (
                                            <tr
                                                key={zaposlenik.id_zaposlenika}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-3 pr-4">
                                                    {
                                                        zaposlenik.id_zaposlenika
                                                    }
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {zaposlenik.id_korisnika ??
                                                        '-'}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {zaposlenik.oib_zaposlenika}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {zaposlenik.ime_zaposlenika}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {
                                                        zaposlenik.prezime_zaposlenika
                                                    }
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={`/zaposlenici/${zaposlenik.id_zaposlenika}`}
                                                            >
                                                                Detalji
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="secondary"
                                                        >
                                                            <Link
                                                                href={`/zaposlenici/${zaposlenik.id_zaposlenika}/edit`}
                                                            >
                                                                Uredi
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                obrisiZaposlenika(
                                                                    zaposlenik.id_zaposlenika
                                                                )
                                                            }
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

ZaposleniciIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Zaposlenici',
            href: '/zaposlenici',
        },
    ],
};
