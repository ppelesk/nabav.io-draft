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

type KategorijaImovine = {
    id_kategorije: number;
    naziv_kategorije: string;
};

export default function KategorijeImovineIndex({
    kategorijeImovine,
}: {
    kategorijeImovine: KategorijaImovine[];
}) {
    const obrisiKategoriju = (idKategorije: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati kategoriju imovine?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/kategorije-imovine/${idKategorije}`);
    };

    return (
        <>
            <Head title="Kategorije imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Kategorije imovine"
                    description="Pregled, dodavanje i uredjivanje kategorija imovine"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/kategorije-imovine/create">
                            Dodaj kategoriju
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis kategorija</CardTitle>
                        <CardDescription>
                            Ukupno zapisa: {kategorijeImovine.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">
                                            ID kategorije
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Naziv kategorije
                                        </th>
                                        <th className="py-3 text-right font-medium">
                                            Akcije
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {kategorijeImovine.length === 0 ? (
                                        <tr>
                                            <td
                                                className="py-6 text-muted-foreground"
                                                colSpan={3}
                                            >
                                                Nema unesenih kategorija imovine.
                                            </td>
                                        </tr>
                                    ) : (
                                        kategorijeImovine.map((kategorija) => (
                                            <tr
                                                key={kategorija.id_kategorije}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-3 pr-4">
                                                    {kategorija.id_kategorije}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {kategorija.naziv_kategorije}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={`/kategorije-imovine/${kategorija.id_kategorije}`}
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
                                                                href={`/kategorije-imovine/${kategorija.id_kategorije}/edit`}
                                                            >
                                                                Uredi
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                obrisiKategoriju(
                                                                    kategorija.id_kategorije
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

KategorijeImovineIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Kategorije imovine',
            href: '/kategorije-imovine',
        },
    ],
};
