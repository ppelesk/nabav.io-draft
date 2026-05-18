import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function imovina_u_skladistu_page({ imovina }: { imovina: any[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-u-skladistu?pdf=true`, '_blank');
    };

    return (
        <>
            <Head title="Izvještaj o imovini u skladištu" />
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <Heading
                        title="Izvještaj o imovini u skladištu"
                        description="Pregled podataka i opcija za preuzimanje izvjestaja"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Prikaz podataka</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {imovina.length === 0 ? (
                            <p className="text-muted-foreground">Nema podataka za prikaz.</p>
                        ) : (
                            <p>Ukupno zapisa: {imovina.length}</p>
                        )}
                        <p className="mt-4 text-sm text-muted-foreground">Za detaljan prikaz svih zapisa preuzmite PDF verziju.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

imovina_u_skladistu_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o imovini u skladištu', href: '/izvjestaji/imovina-u-skladistu' },
    ],
};
