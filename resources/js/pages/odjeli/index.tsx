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

type Odjel = {
    id_odjela: number;
    naziv_odjela: string;
};

export default function OdjeliIndex({ odjeli }: { odjeli: Odjel[] }) {
    const obrisiOdjel = (idOdjela: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati odjel?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/odjeli/${idOdjela}`);
    };

    return (
        <>
            <Head title="Odjeli" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Odjeli"
                    description="Pregled, dodavanje i uredjivanje odjela"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/odjeli/create">Dodaj odjel</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis odjela</CardTitle>
                        <CardDescription>Ukupno zapisa: {odjeli.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">ID odjela</th>
                                        <th className="py-3 pr-4 font-medium">Naziv odjela</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {odjeli.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={3}>
                                                Nema unesenih odjela.
                                            </td>
                                        </tr>
                                    ) : (
                                        odjeli.map((odjel) => (
                                            <tr key={odjel.id_odjela} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{odjel.id_odjela}</td>
                                                <td className="py-3 pr-4">{odjel.naziv_odjela}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/odjeli/${odjel.id_odjela}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/odjeli/${odjel.id_odjela}/edit`}>Uredi</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisiOdjel(odjel.id_odjela)}
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

OdjeliIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Odjeli',
            href: '/odjeli',
        },
    ],
};
