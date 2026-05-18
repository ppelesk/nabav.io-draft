import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Imovina = {
    inventarni_broj: string | null;
    naziv_imovine: string;
    odjel?: { naziv_odjela: string };
    status?: { naziv_statusa: string };
    lokacija?: { oznaka_sobe: string; naziv_sobe: string | null };
};

export default function imovina_u_odjelima_page({ imovina }: { imovina: Imovina[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/imovina-u-odjelima?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Imovina>[] = [
        { header: 'Inventarni broj', cell: (item) => item.inventarni_broj ?? '-' },
        { header: 'Naziv imovine', cell: (item) => item.naziv_imovine },
        { header: 'Odjel', cell: (item) => item.odjel?.naziv_odjela ?? '-' },
        { header: 'Status', cell: (item) => item.status?.naziv_statusa ?? '-' },
        {
            header: 'Lokacija',
            cell: (item) => item.lokacija ? `${item.lokacija.oznaka_sobe}${item.lokacija.naziv_sobe ? ` (${item.lokacija.naziv_sobe})` : ''}` : '-',
        },
    ];

    return (
        <>
            <Head title="Izvještaj o imovini u odjelima" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o imovini u odjelima"
                        description="Pregled stavki po odjelima"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Popis imovine po odjelima</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={imovina} columns={columns} pageSize={20} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

imovina_u_odjelima_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o imovini u odjelima', href: '/izvjestaji/imovina-u-odjelima' },
    ],
};
