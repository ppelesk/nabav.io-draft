import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import BarcodeSvg from '@/components/barcode-svg';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ImovinaLabel = {
    id_imovine: number;
    inventarni_broj: string | null;
    naziv_imovine: string;
};

export default function BarkodNaljepnice({
    imovina,
    preselectedIds,
}: {
    imovina: ImovinaLabel[];
    preselectedIds: number[];
}) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>(
        preselectedIds.length > 0 ? preselectedIds : imovina.map((stavka) => stavka.id_imovine),
    );

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (q === '') {
            return imovina;
        }

        return imovina.filter((stavka) =>
            [
                stavka.naziv_imovine,
                stavka.inventarni_broj ?? '',
            ]
                .join(' ')
                .toLowerCase()
                .includes(q),
        );
    }, [imovina, search]);

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const labelsToPrint = useMemo(
        () => imovina.filter((stavka) => selectedSet.has(stavka.id_imovine)),
        [imovina, selectedSet],
    );

    const toggle = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
    };

    const selectFiltered = () => {
        setSelectedIds((prev) => {
            const set = new Set(prev);
            filtered.forEach((stavka) => set.add(stavka.id_imovine));

            return Array.from(set);
        });
    };

    const clearAll = () => {
        setSelectedIds([]);
    };

    const printLabels = () => {
        if (labelsToPrint.length === 0) {
            return;
        }

        window.print();
    };

    return (
        <>
            <Head title="Barkod naljepnice" />

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .barcode-print-area, .barcode-print-area * { visibility: visible; }
                    .barcode-print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .barcode-label { break-inside: avoid; page-break-inside: avoid; }
                }
            `}</style>

            <div className="space-y-6 p-4">
                <Heading
                    title="Generiranje i ispis barkoda"
                    description="Odaberite stavke i ispisite barkod naljepnice"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Odabir naljepnica</CardTitle>
                        <CardDescription>
                            Oznaceno za ispis: {selectedIds.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Pretrazi po nazivu ili inventarnom broju"
                            />
                            <Button type="button" variant="outline" onClick={selectFiltered}>
                                Oznaci filtrirane
                            </Button>
                            <Button type="button" variant="outline" onClick={clearAll}>
                                Ocisti odabir
                            </Button>
                            <Button type="button" onClick={printLabels} disabled={labelsToPrint.length === 0}>
                                Ispisi naljepnice
                            </Button>
                        </div>

                        <div className="max-h-80 overflow-auto rounded border">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="w-12 p-2">#</th>
                                        <th className="p-2">Inventarni broj</th>
                                        <th className="p-2">Naziv</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((stavka) => {
                                        const checked = selectedSet.has(stavka.id_imovine);

                                        return (
                                            <tr key={stavka.id_imovine} className="border-b last:border-b-0">
                                                <td className="p-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggle(stavka.id_imovine)}
                                                    />
                                                </td>
                                                <td className="p-2">{stavka.inventarni_broj ?? '-'}</td>
                                                <td className="p-2">{stavka.naziv_imovine}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <div className="barcode-print-area grid grid-cols-2 gap-4">
                    {labelsToPrint.map((stavka) => {
                        const code = stavka.inventarni_broj ?? '';

                        if (code === '') {
                            return null;
                        }

                        return (
                            <div
                                key={`label-${stavka.id_imovine}`}
                                className="barcode-label rounded border bg-white p-3 text-black"
                            >
                                <p className="text-xs font-semibold">{stavka.naziv_imovine}</p>
                                <p className="text-[11px]">INV: {stavka.inventarni_broj ?? '-'}</p>
                                <div className="mt-2 flex justify-center">
                                    <BarcodeSvg value={code} className="w-full" />
                                </div>
                                <p className="mt-1 text-center text-[11px] tracking-wide">{code}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

BarkodNaljepnice.layout = {
    breadcrumbs: [
        {
            title: 'Imovina',
            href: '/imovina',
        },
        {
            title: 'Barkod naljepnice',
            href: '/imovina/barkod-naljepnice',
        },
    ],
};
