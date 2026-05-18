import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function imovina_na_revers_page({ imovina }: { imovina: any[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-na-revers?pdf=true`, '_blank');
    };

    return (
        <>
            <Head title="Izvještaj o imovini izdanoj na revers" />
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <Heading
                        title="Izvještaj o imovini izdanoj na revers"
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

imovina_na_revers_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o imovini izdanoj na revers', href: '/izvjestaji/imovina-na-revers' },
    ],
};
