import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Imovina = {
    inventarni_broj: string | null;
    naziv_imovine: string;
    status?: { naziv_statusa: string };
    lokacija?: { oznaka_sobe: string; naziv_sobe: string | null };
    odjel?: { naziv_odjela: string };
};

export default function imovina_na_servisu_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-na-servisu?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        { header: 'Status', cell: (item) => item.status?.naziv_statusa ?? '-' },
        {
            header: 'Lokacija',
            cell: (item) => item.lokacija ? `${item.lokacija.oznaka_sobe}${item.lokacija.naziv_sobe ? ` (${item.lokacija.naziv_sobe})` : ''}` : '-',
        },
        { header: 'Odjel', cell: (item) => item.odjel?.naziv_odjela ?? '-' },
    ];

    return (
        <>
            <Head title="Izvještaj o imovini na servisu" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o imovini na servisu"
                        description="Popis stavki koje su trenutno na servisu"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis servisirane imovine</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

imovina_na_servisu_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o imovini na servisu', href: '/izvjestaji/imovina-na-servisu' },
    ],
};
