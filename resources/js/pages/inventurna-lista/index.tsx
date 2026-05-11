import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Lista = {
    id_liste: number;
    naziv_liste: string;
    status_liste: string;
    kreator?: { name: string };
};

export default function InventurnaListaIndex({ liste }: { liste: Lista[] }) {
    return (
        <>
            <Head title="Inventurne liste" />
            <div className="space-y-6 p-4">
                <Heading title="Inventurne liste" description="Pregled svih inventurnih listi" />
                <Card>
                    <CardContent className="pt-6">
                        <Button asChild className="mb-4"><Link href="/inventurna-lista/create">Kreiraj novu listu</Link></Button>
                        <table className="w-full text-left text-sm border">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Naziv</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Kreator</th>
                                    <th className="p-2">Akcije</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liste.map((lista) => (
                                    <tr key={lista.id_liste} className="border-b">
                                        <td className="p-2">{lista.naziv_liste}</td>
                                        <td className="p-2">{lista.status_liste}</td>
                                        <td className="p-2">{lista.kreator?.name || 'Nepoznato'}</td>
                                        <td className="p-2">
                                            <Button asChild size="sm" variant="outline"><Link href={`/inventurna-lista/${lista.id_liste}`}>Otvori</Link></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
