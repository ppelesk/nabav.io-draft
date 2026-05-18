import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTable, type ReportColumn } from '@/components/report-table';

type Stavka = {
    id_stavke: number;
    created_at: string;
    imovina?: { inventarni_broj: string | null; naziv_imovine: string };
    skenirao_korisnik?: { name: string };
    lokacija_skeniranja?: { oznaka_sobe: string };
    prethodna_lokacija?: { oznaka_sobe: string };
    inventurna_lista?: { naziv_liste: string };
};

type Lista = {
    id_liste: number;
    naziv_liste: string;
    kreator?: { ime_korisnika: string; prezime_korisnika: string };
    status_liste: string;
    created_at: string;
    stavke: Stavka[];
};

export default function provedena_inventura_page({ liste }: { liste: Lista[] }) {
    const handleExport = () => {
        window.open(`/izvjestaji/provedena-inventura?pdf=true`, '_blank');
    };

    const scannedItems = liste.flatMap((lista) =>
        lista.stavke.map((stavka) => ({
            ...stavka,
            naziv_liste: lista.naziv_liste,
            kreator: lista.kreator,
            status_liste: lista.status_liste,
            lista_created_at: lista.created_at,
        })),
    );

    const columns: ReportColumn<typeof scannedItems[number]>[] = [
        {
            header: 'Inventurna lista',
            cell: (stavka) => stavka.naziv_liste,
        },
        {
            header: 'Inventarni broj',
            cell: (stavka) => stavka.imovina?.inventarni_broj ?? '-',
        },
        {
            header: 'Naziv imovine',
            cell: (stavka) => stavka.imovina?.naziv_imovine ?? '-',
        },
        {
            header: 'Skenirao',
            cell: (stavka) => stavka.skenirao_korisnik?.name ?? '-',
        },
        {
            header: 'Lokacija skeniranja',
            cell: (stavka) => stavka.lokacija_skeniranja?.oznaka_sobe ?? '-',
        },
        {
            header: 'Prethodna lokacija',
            cell: (stavka) => stavka.prethodna_lokacija?.oznaka_sobe ?? '-',
        },
        {
            header: 'Vrijeme skeniranja',
            cell: (stavka) => new Date(stavka.created_at).toLocaleString(),
        },
    ];

    return (
        <>
            <Head title="Izvještaj o provedenoj inventuri" />
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Heading
                        title="Izvještaj o provedenoj inventuri"
                        description="Popis svih skeniranih stavki po završenim inventurnim listama"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sažetak</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-3">
                        <div className="rounded border p-3">
                            <div className="text-sm text-muted-foreground">Popisane liste</div>
                            <div className="mt-2 text-2xl font-semibold">{liste.length}</div>
                        </div>
                        <div className="rounded border p-3">
                            <div className="text-sm text-muted-foreground">Skeniranih stavki</div>
                            <div className="mt-2 text-2xl font-semibold">{scannedItems.length}</div>
                        </div>
                        <div className="rounded border p-3">
                            <div className="text-sm text-muted-foreground">Završene liste</div>
                            <div className="mt-2 text-2xl font-semibold">{liste.filter((lista) => lista.status_liste === 'zavrsena').length}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skenirane stavke</CardTitle>
                        <div className="text-sm text-muted-foreground">Prikaz svih inventarnih stavki koje su evidentirane u završnim listama.</div>
                    </CardHeader>
                    <CardContent>
                        <ReportTable items={scannedItems} columns={columns} pageSize={15} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

provedena_inventura_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: 'Izvještaj o provedenoj inventuri', href: '/izvjestaji/provedena-inventura' },
    ],
};
