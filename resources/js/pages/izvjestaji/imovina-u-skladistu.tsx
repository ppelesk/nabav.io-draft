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
    kategorija?: { naziv_kategorije: string };
};

export default function imovina_u_skladistu_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-u-skladistu?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        { header: 'Status', cell: (item) => item.status?.naziv_statusa ?? '-' },
        { header: 'Kategorija', cell: (item) => item.kategorija?.naziv_kategorije ?? '-' },
        {
            header: 'Lokacija',
            cell: (item) => item.lokacija ? `${item.lokacija.oznaka_sobe}${item.lokacija.naziv_sobe ? ` (${item.lokacija.naziv_sobe})` : ''}` : '-',
        },
    ];

    return (
        <>
            <Head title="Izvještaj o imovini u skladištu" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o imovini u skladištu"
                        description="Prikaz imovine koja se nalazi u skladištu"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis imovine u skladištu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
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
