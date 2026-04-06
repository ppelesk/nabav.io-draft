import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuditLogZapis = {
    id_loga: number;
    vrijeme_dogadaja: string;
    metoda: string | null;
    ruta: string | null;
    detalji: string | null;
    funkcija: {
        naziv_funkcije: string;
        sifra_funkcije: string;
    } | null;
    korisnik: {
        ime_korisnika: string;
        prezime_korisnika: string;
        email: string;
    } | null;
};

const formatirajDatumVrijeme = (vrijeme: string): string => {
    const datum = new Date(vrijeme);

    if (Number.isNaN(datum.getTime())) {
        return vrijeme;
    }

    return datum.toLocaleString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

export default function AuditLogIndex({ logovi }: { logovi: AuditLogZapis[] }) {
    return (
        <>
            <Head title="Audit log" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Audit log"
                    description="Zadnjih 500 zapisa aktivnosti korisnika i sustava"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Evidencija aktivnosti</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1080px] text-left text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-3 pr-4 font-medium">Vrijeme</th>
                                        <th className="py-3 pr-4 font-medium">Korisnik</th>
                                        <th className="py-3 pr-4 font-medium">Funkcija</th>
                                        <th className="py-3 pr-4 font-medium">Metoda</th>
                                        <th className="py-3 pr-4 font-medium">Ruta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logovi.length === 0 ? (
                                        <tr>
                                            <td className="py-6 text-muted-foreground" colSpan={5}>
                                                Nema audit zapisa.
                                            </td>
                                        </tr>
                                    ) : (
                                        logovi.map((log) => (
                                            <tr key={log.id_loga} className="border-b last:border-b-0">
                                                <td className="py-3 pr-4">
                                                    {formatirajDatumVrijeme(log.vrijeme_dogadaja)}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {log.korisnik
                                                        ? `${log.korisnik.ime_korisnika} ${log.korisnik.prezime_korisnika}`
                                                        : '-'}
                                                </td>
                                                <td className="py-3 pr-4">{log.funkcija?.naziv_funkcije ?? '-'}</td>
                                                <td className="py-3 pr-4">{log.metoda ?? '-'}</td>
                                                <td className="py-3 pr-4">{log.ruta ?? '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AuditLogIndex.layout = {
    breadcrumbs: [
        {
            title: 'Audit log',
            href: '/audit-log',
        },
    ],
};
