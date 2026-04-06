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

type StatusImovine = {
    id_statusa: number;
    naziv_statusa: string;
};

export default function StatusImovineIndex({
    statusiImovine,
}: {
    statusiImovine: StatusImovine[];
}) {
    const obrisiStatus = (idStatusa: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati status imovine?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/status-imovine/${idStatusa}`);
    };

    return (
        <>
            <Head title="Statusi imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Statusi imovine"
                    description="Pregled, dodavanje i uredjivanje statusa imovine"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/status-imovine/create">Dodaj status</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis statusa</CardTitle>
                        <CardDescription>
                            Ukupno zapisa: {statusiImovine.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">
                                            ID statusa
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Naziv statusa
                                        </th>
                                        <th className="py-3 text-right font-medium">
                                            Akcije
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statusiImovine.length === 0 ? (
                                        <tr>
                                            <td
                                                className="py-6 text-muted-foreground"
                                                colSpan={3}
                                            >
                                                Nema unesenih statusa imovine.
                                            </td>
                                        </tr>
                                    ) : (
                                        statusiImovine.map((status) => (
                                            <tr
                                                key={status.id_statusa}
                                                className="border-b last:border-b-0"
                                            >
                                                <td className="py-3 pr-4">
                                                    {status.id_statusa}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {status.naziv_statusa}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={`/status-imovine/${status.id_statusa}`}
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
                                                                href={`/status-imovine/${status.id_statusa}/edit`}
                                                            >
                                                                Uredi
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                obrisiStatus(
                                                                    status.id_statusa
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

StatusImovineIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Statusi imovine',
            href: '/status-imovine',
        },
    ],
};
