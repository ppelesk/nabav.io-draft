import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Imovina = {
    id_imovine: number;
    inventarni_broj: string | null;
    barcode_token: string | null;
    naziv_imovine: string;
    serijski_broj: string | null;
    broj_racuna: string | null;
    datum_nabave: string;
    cijena: string;
    jamstvo_mjeseci: number;
    amortizacija_mjeseci: number | null;
    na_revers: boolean;
    datum_zaduzenja: string | null;
    datum_razduzenja: string | null;
    datum_popisa: string | null;
    status: { naziv_statusa: string } | null;
    kategorija: { naziv_kategorije: string } | null;
    odjel: { naziv_odjela: string } | null;
    lokacija: { oznaka_sobe: string; naziv_sobe: string | null } | null;
    zaposlenik: { ime_zaposlenika: string; prezime_zaposlenika: string } | null;
};

export default function ImovinaShow({ imovina }: { imovina: Imovina }) {
    return (
        <>
            <Head title="Detalji imovine" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Detalji imovine"
                    description="Pregled podataka za odabranu stavku"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>{imovina.naziv_imovine}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 text-sm md:grid-cols-2">
                        <p><strong>Inventarni broj:</strong> {imovina.inventarni_broj ?? '-'}</p>
                        <p><strong>Barcode token:</strong> {imovina.barcode_token ?? '-'}</p>
                        <p><strong>Serijski broj:</strong> {imovina.serijski_broj ?? '-'}</p>
                        <p><strong>Broj racuna:</strong> {imovina.broj_racuna ?? '-'}</p>
                        <p><strong>Datum nabave:</strong> {imovina.datum_nabave}</p>
                        <p><strong>Cijena:</strong> {imovina.cijena}</p>
                        <p><strong>Jamstvo (mjeseci):</strong> {imovina.jamstvo_mjeseci}</p>
                        <p>
                            <strong>Amortizacija (mjeseci):</strong>{' '}
                            {imovina.amortizacija_mjeseci ?? '-'}
                        </p>
                        <p><strong>Status:</strong> {imovina.status?.naziv_statusa ?? '-'}</p>
                        <p><strong>Kategorija:</strong> {imovina.kategorija?.naziv_kategorije ?? '-'}</p>
                        <p><strong>Odjel:</strong> {imovina.odjel?.naziv_odjela ?? '-'}</p>
                        <p>
                            <strong>Lokacija:</strong>{' '}
                            {imovina.lokacija
                                ? `${imovina.lokacija.oznaka_sobe}${
                                      imovina.lokacija.naziv_sobe
                                          ? ` (${imovina.lokacija.naziv_sobe})`
                                          : ''
                                  }`
                                : '-'}
                        </p>
                        <p>
                            <strong>Zaduzena osobi:</strong>{' '}
                            {imovina.zaposlenik
                                ? `${imovina.zaposlenik.ime_zaposlenika} ${imovina.zaposlenik.prezime_zaposlenika}`
                                : '-'}
                        </p>
                        <p><strong>Izdana na revers:</strong> {imovina.na_revers ? 'Da' : 'Ne'}</p>
                        <p><strong>Datum zaduzenja:</strong> {imovina.datum_zaduzenja ?? '-'}</p>
                        <p><strong>Datum razduzenja:</strong> {imovina.datum_razduzenja ?? '-'}</p>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline">
                        <Link href={`/imovina/barkod-naljepnice?ids=${imovina.id_imovine}`}>Barkod naljepnica</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={`/imovina/${imovina.id_imovine}/edit`}>Uredi</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/imovina">Natrag</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

ImovinaShow.layout = {
    breadcrumbs: [
        {
            title: 'Imovina',
            href: '/imovina',
        },
        {
            title: 'Detalji',
            href: '#',
        },
    ],
};
