import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Imovina = {
    inventarni_broj: string | null;
    naziv_imovine: string;
    zaposlenik?: { ime_zaposlenika: string; prezime_zaposlenika: string };
    odjel?: { naziv_odjela: string };
    datum_zaduzenja?: string | null;
};

export default function izdana_imovina_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/izdana-imovina?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        { header: 'Zaposlenik', cell: (item) => item.zaposlenik ? `${item.zaposlenik.ime_zaposlenika} ${item.zaposlenik.prezime_zaposlenika}` : '-' },
        { header: 'Odjel', cell: (item) => item.odjel?.naziv_odjela ?? '-' },
        { header: 'Datum zaduzenja', cell: (item) => item.datum_zaduzenja ?? '-' },
    ];

    return (
        <>
            <Head title="Izvještaj o izdanoj imovini" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o izdanoj imovini"
                        description="Popis izdanih stavki s detaljima osoblja i odjela"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis izdanih stavki</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

izdana_imovina_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o izdanoj imovini', href: '/izvjestaji/izdana-imovina' },
    ],
};
