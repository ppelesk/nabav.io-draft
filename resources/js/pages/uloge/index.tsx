import { Head, Link, router, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Uloga = {
    id_uloge: number;
    naziv_uloge: string;
    sifra_uloge: string;
};

export default function UlogeIndex({ uloge }: { uloge: Uloga[] }) {
    const { errors } = usePage().props as { errors?: Record<string, string> };

    const obrisiUlogu = (idUloge: number) => {
        if (!window.confirm('Jeste li sigurni da zelite obrisati ulogu?')) {
            return;
        }

        router.delete(`/uloge/${idUloge}`);
    };

    return (
        <>
            <Head title="Uloge" />

            <div className="space-y-6 p-4">
                <Heading title="Uloge" description="Upravljanje ulogama korisnika" />

                {errors?.uloga && (
                    <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errors.uloga}
                    </div>
                )}

                <div className="flex items-center justify-end">
                    <Button asChild>
                        <Link href="/uloge/create">Dodaj ulogu</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Popis uloga</CardTitle>
                        <CardDescription>Ukupno zapisa: {uloge.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">ID uloge</th>
                                        <th className="py-3 pr-4 font-medium">Naziv uloge</th>
                                        <th className="py-3 pr-4 font-medium">Sifra uloge</th>
                                        <th className="py-3 text-right font-medium">Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uloge.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={4}>
                                                Nema unesenih uloga.
                                            </td>
                                        </tr>
                                    ) : (
                                        uloge.map((uloga) => (
                                            <tr key={uloga.id_uloge} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">{uloga.id_uloge}</td>
                                                <td className="py-3 pr-4">{uloga.naziv_uloge}</td>
                                                <td className="py-3 pr-4">{uloga.sifra_uloge}</td>
                                                <td className="py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/uloge/${uloga.id_uloge}`}>Detalji</Link>
                                                        </Button>
                                                        <Button asChild size="sm" variant="secondary">
                                                            <Link href={`/uloge/${uloga.id_uloge}/edit`}>Uredi</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => obrisiUlogu(uloga.id_uloge)}
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

UlogeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Uloge',
            href: '/uloge',
        },
    ],
};
