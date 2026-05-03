import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type SumRow = {
    ukupno_imovine: number;
    ukupna_vrijednost: string;
    popisano: number;
    izdano_na_revers: number;
};

type GroupRow = {
    naziv_statusa?: string;
    naziv_odjela?: string;
    oznaka_lokacije?: string;
    naziv_kategorije?: string;
    ukupno: number;
};

type ReversRow = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    datum_zaduzenja: string | null;
    zaposlenik: {
        ime_zaposlenika: string;
        prezime_zaposlenika: string;
    } | null;
};

type StatusRow = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
    naziv_statusa: string;
};

export default function IzvjestajiIndex({
    sazetak,
    poStatusu,
    poOdjelu,
    poLokaciji,
    poKategoriji,
    imovinaNaReversu,
    imovinaNaServisu,
    rashodovanaImovina,
}: {
    sazetak: SumRow;
    poStatusu: GroupRow[];
    poOdjelu: GroupRow[];
    poLokaciji: GroupRow[];
    poKategoriji: GroupRow[];
    imovinaNaReversu: ReversRow[];
    imovinaNaServisu: StatusRow[];
    rashodovanaImovina: StatusRow[];
}) {
    return (
        <>
            <Head title="Izvjestaji" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Izvjestaji"
                    description="Godisnji i operativni pregled stanja imovine"
                />

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ukupno imovine</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {sazetak.ukupno_imovine}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ukupna vrijednost</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {sazetak.ukupna_vrijednost}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Popisano</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {sazetak.popisano}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Izdano na revers</CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-semibold">
                            {sazetak.izdano_na_revers}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <ReportCard
                        title="Imovina po statusu"
                        rows={poStatusu.map((item) => ({
                            naziv: item.naziv_statusa ?? '-',
                            ukupno: item.ukupno,
                        }))}
                    />
                    <ReportCard
                        title="Imovina po odjelima"
                        rows={poOdjelu.map((item) => ({
                            naziv: item.naziv_odjela ?? '-',
                            ukupno: item.ukupno,
                        }))}
                    />
                    <ReportCard
                        title="Imovina po lokacijama"
                        rows={poLokaciji.map((item) => ({
                            naziv: item.oznaka_lokacije ?? '-',
                            ukupno: item.ukupno,
                        }))}
                    />
                    <ReportCard
                        title="Imovina po kategorijama"
                        rows={poKategoriji.map((item) => ({
                            naziv: item.naziv_kategorije ?? '-',
                            ukupno: item.ukupno,
                        }))}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Imovina izdana na revers</CardTitle>
                        <CardDescription>
                            Popis trenutno zaduzenih stavki zaposlenicima
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SimpleAssetTable
                            rows={imovinaNaReversu.map((item) => ({
                                inventarni: item.inventarni_broj,
                                naziv: item.naziv_imovine,
                                status: item.zaposlenik
                                    ? `${item.zaposlenik.ime_zaposlenika} ${item.zaposlenik.prezime_zaposlenika}`
                                    : '-',
                            }))}
                        />
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Imovina na servisu</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleAssetTable
                                rows={imovinaNaServisu.map((item) => ({
                                    inventarni: item.inventarni_broj,
                                    naziv: item.naziv_imovine,
                                    status: item.naziv_statusa,
                                }))}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rashodovana/unistena imovina</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SimpleAssetTable
                                rows={rashodovanaImovina.map((item) => ({
                                    inventarni: item.inventarni_broj,
                                    naziv: item.naziv_imovine,
                                    status: item.naziv_statusa,
                                }))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function ReportCard({
    title,
    rows,
}: {
    title: string;
    rows: Array<{ naziv: string; ukupno: number }>;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 font-medium">Naziv</th>
                            <th className="py-2 text-right font-medium">Ukupno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td className="py-4 text-muted-foreground" colSpan={2}>
                                    Nema podataka.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.naziv} className="border-b last:border-b-0">
                                    <td className="py-2">{row.naziv}</td>
                                    <td className="py-2 text-right">{row.ukupno}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}

function SimpleAssetTable({
    rows,
}: {
    rows: Array<{ inventarni: string | null; naziv: string; status: string }>;
}) {
    return (
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="border-b">
                    <th className="py-2 pr-4 font-medium">Inventarni broj</th>
                    <th className="py-2 pr-4 font-medium">Naziv</th>
                    <th className="py-2 font-medium">Status / zaduzenje</th>
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td className="py-4 text-muted-foreground" colSpan={3}>
                            Nema podataka.
                        </td>
                    </tr>
                ) : (
                    rows.map((row) => (
                        <tr key={`${row.inventarni}-${row.naziv}`} className="border-b last:border-b-0">
                            <td className="py-2 pr-4">{row.inventarni ?? '-'}</td>
                            <td className="py-2 pr-4">{row.naziv}</td>
                            <td className="py-2">{row.status}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

IzvjestajiIndex.layout = {
    breadcrumbs: [
        {
            title: 'Izvjestaji',
            href: '/izvjestaji',
        },
    ],
};
