import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Imovina = {
    inventarni_broj: string | null;
    naziv_imovine: string;
    zaposlenik?: { ime_zaposlenika: string; prezime_zaposlenika: string };
    status?: { naziv_statusa: string };
};

export default function imovina_na_revers_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-na-revers?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        { header: 'Zaposlenik', cell: (item) => item.zaposlenik ? `${item.zaposlenik.ime_zaposlenika} ${item.zaposlenik.prezime_zaposlenika}` : '-' },
        { header: 'Status', cell: (item) => item.status?.naziv_statusa ?? '-' },
    ];

    return (
        <>
            <Head title="Izvještaj o imovini izdanoj na revers" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o imovini izdanoj na revers"
                        description="Popis imovine trenutno zadužene na revers"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis imovine na revers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
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
