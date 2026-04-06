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

type Zgrada = {
    id_zgrade: number;
    naziv_zgrade: string;
    adresa_zgrade: string | null;
};

export default function ZgradeIndex({ zgrade }: { zgrade: Zgrada[] }) {
    const obrisiZgradu = (idZgrade: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati zgradu?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/zgrade/${idZgrade}`);
    };

    return (
        <>
            <Head title="Zgrade" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Zgrade"
                    description="Pregled, dodavanje i uredjivanje zgrada"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/zgrade/create">Dodaj zgradu</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis zgrada</CardTitle>
                        <CardDescription>Ukupno zapisa: {zgrade.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">ID zgrade</th>
                                        <th className="py-3 pr-4 font-medium">Naziv zgrade</th>
                                        <th className="py-3 pr-4 font-medium">Adresa zgrade</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {zgrade.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={4}>
                                                Nema unesenih zgrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        zgrade.map((zgrada) => (
                                            <tr key={zgrada.id_zgrade} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{zgrada.id_zgrade}</td>
                                                <td className="py-3 pr-4">{zgrada.naziv_zgrade}</td>
                                                <td className="py-3 pr-4">{zgrada.adresa_zgrade ?? '-'}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/zgrade/${zgrada.id_zgrade}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/zgrade/${zgrada.id_zgrade}/edit`}>Uredi</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisiZgradu(zgrada.id_zgrade)}
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

ZgradeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Zgrade',
            href: '/zgrade',
        },
    ],
};
