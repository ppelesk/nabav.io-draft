import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Imovina = {
    inventarni_broj: string | null;
    naziv_imovine: string;
    lokacija?: { oznaka_sobe: string; naziv_sobe: string | null; zgrada?: { naziv_zgrade: string } };
    status?: { naziv_statusa: string };
};

export default function imovina_na_lokacijama_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-na-lokacijama?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        {
            header: 'Lokacija',
            cell: (item) => item.lokacija ? `${item.lokacija.oznaka_sobe}${item.lokacija.naziv_sobe ? ` (${item.lokacija.naziv_sobe})` : ''}` : '-',
        },
        { header: 'Zgrada', cell: (item) => item.lokacija?.zgrada?.naziv_zgrade ?? '-' },
        { header: 'Status', cell: (item) => item.status?.naziv_statusa ?? '-' },
    ];

    return (
        <>
            <Head title="Izvještaj o imovini na lokacijama" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o imovini na lokacijama"
                        description="Popis stavki razvrstanih po lokacijama i zgradama"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis imovine po lokacijama</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

imovina_na_lokacijama_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o imovini na lokacijama', href: '/izvjestaji/imovina-na-lokacijama' },
    ],
};
