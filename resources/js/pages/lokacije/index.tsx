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

type Lokacija = {
    id_lokacije: number;
    id_zgrade: number;
    oznaka_sobe: string;
    naziv_sobe: string | null;
    zgrada: {
        id_zgrade: number;
        naziv_zgrade: string;
    } | null;
};

export default function LokacijeIndex({ lokacije }: { lokacije: Lokacija[] }) {
    const obrisiLokaciju = (idLokacije: number) => {
        const potvrda = window.confirm(
            'Jeste li sigurni da zelite obrisati lokaciju?'
        );

        if (!potvrda) {
            return;
        }

        router.delete(`/lokacije/${idLokacije}`);
    };

    return (
        <>
            <Head title="Lokacije" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Lokacije"
                    description="Pregled, dodavanje i uredjivanje lokacija po zgradama"
                />

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/lokacije/create">Dodaj lokaciju</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis lokacija</CardTitle>
                        <CardDescription>Ukupno zapisa: {lokacije.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">ID lokacije</th>
                                        <th className="py-3 pr-4 font-medium">Zgrada</th>
                                        <th className="py-3 pr-4 font-medium">Oznaka sobe</th>
                                        <th className="py-3 pr-4 font-medium">Naziv sobe</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lokacije.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={5}>
                                                Nema unesenih lokacija.
                                            </td>
                                        </tr>
                                    ) : (
                                        lokacije.map((lokacija) => (
                                            <tr key={lokacija.id_lokacije} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{lokacija.id_lokacije}</td>
                                                <td className="py-3 pr-4">{lokacija.zgrada?.naziv_zgrade ?? '-'}</td>
                                                <td className="py-3 pr-4">{lokacija.oznaka_sobe}</td>
                                                <td className="py-3 pr-4">{lokacija.naziv_sobe ?? '-'}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/lokacije/${lokacija.id_lokacije}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/lokacije/${lokacija.id_lokacije}/edit`}>Uredi</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisiLokaciju(lokacija.id_lokacije)}
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

LokacijeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Lokacije',
            href: '/lokacije',
        },
    ],
};
