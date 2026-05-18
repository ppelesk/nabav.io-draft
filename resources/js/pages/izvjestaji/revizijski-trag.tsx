import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Log = {
    vrijeme_dogadaja: string;
    korisnik?: { name: string };
    funkcija?: { naziv_funkcije: string };
    ruta: string;
    metoda: string;
    detalji?: string | null;
};

export default function revizijski_trag_page({ logovi }: { logovi: Log[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/revizijski-trag?pdf=true`, '_blank');
    };

    const columns: ReportColumn<Log>[] = [
        { header: 'Vrijeme', cell: (item) => new Date(item.vrijeme_dogadaja).toLocaleString() },
        { header: 'Korisnik', cell: (item) => item.korisnik?.name ?? '-' },
        { header: 'Funkcija', cell: (item) => item.funkcija?.naziv_funkcije ?? '-' },
        { header: 'Ruta', cell: (item) => item.ruta },
        { header: 'Metoda', cell: (item) => item.metoda },
        { header: 'Detalji', cell: (item) => item.detalji ?? '-' },
    ];

    return (
        <>
            <Head title="Izvještaj iz revizijskog traga" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj iz revizijskog traga"
                        description="Detaljan popis revizijskih događaja i zapisa"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Revizijski trag</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={logovi} columns={columns} pageSize={20} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

revizijski_trag_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj iz revizijskog traga', href: '/izvjestaji/revizijski-trag' },
    ],
};
