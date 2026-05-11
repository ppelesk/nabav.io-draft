import { Head, useForm, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Lokacija = { id_lokacije: number; oznaka_sobe: string; naziv_sobe: string };
type Stavka = {
    id_stavke: number;
    created_at: string;
    prethodna_lokacija_id: number;
    id_lokacije_skeniranja: number;
    imovina?: { naziv_imovine: string; inventarni_broj: string };
    skenirao_korisnik?: { name: string };
    lokacija_skeniranja?: { oznaka_sobe: string };
};
type Lista = {
    id_liste: number;
    naziv_liste: string;
    status_liste: string;
    stavke: Stavka[];
};

export default function InventurnaListaShow({ lista, lokacije }: { lista: Lista, lokacije: Lokacija[] }) {
    const { data, setData, post, processing, reset } = useForm({
        id_lokacije: '',
        kod: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/inventurna-lista/${lista.id_liste}/skeniraj`, {
            preserveScroll: true,
            onSuccess: () => reset('kod')
        });
    };

    const flash = usePage().props.flash as { success?: string, error?: string };

    return (
        <>
            <Head title={`Inventurna lista: ${lista.naziv_liste}`} />
            <div className="space-y-6 p-4">
                <Heading title={`Inventurna lista: ${lista.naziv_liste}`} description={`Status: ${lista.status_liste}`} />
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        {flash.success && <div className="text-green-600 bg-green-100 p-2 rounded">{flash.success}</div>}
                        {flash.error && <div className="text-red-600 bg-red-100 p-2 rounded">{flash.error}</div>}

                        <form onSubmit={submit} className="flex gap-4 items-end">
                            <div className="grid gap-2">
                                <Label>Lokacija skeniranja</Label>
                                <select className="h-10 rounded border px-3" value={data.id_lokacije} onChange={e => setData('id_lokacije', e.target.value)}>
                                    <option value="">Odaberite...</option>
                                    {lokacije.map(l => <option key={l.id_lokacije} value={l.id_lokacije}>{l.oznaka_sobe} - {l.naziv_sobe}</option>)}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Inventarni broj</Label>
                                <Input value={data.kod} onChange={e => setData('kod', e.target.value)} />
                            </div>
                            <Button type="submit" disabled={processing || !data.id_lokacije || !data.kod}>Skeniraj</Button>
                        </form>

                        <h3 className="font-semibold text-lg mt-8">Popisana imovina</h3>
                        <table className="w-full text-left text-sm border">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="p-2">Imovina</th>
                                    <th className="p-2">Skenirao</th>
                                    <th className="p-2">Lokacija skeniranja</th>
                                    <th className="p-2">Vrijeme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.stavke.length === 0 ? <tr><td colSpan={4} className="p-2 text-center text-muted-foreground">Nema unosa</td></tr> : null}
                                {lista.stavke.map((stavka) => (
                                    <tr key={stavka.id_stavke} className="border-b">
                                        <td className="p-2">{stavka.imovina?.naziv_imovine} ({stavka.imovina?.inventarni_broj})</td>
                                        <td className="p-2">{stavka.skenirao_korisnik?.name}</td>
                                        <td className="p-2">{stavka.lokacija_skeniranja?.oznaka_sobe} {stavka.prethodna_lokacija_id !== stavka.id_lokacije_skeniranja ? '(premjesteno)' : ''}</td>
                                        <td className="p-2">{new Date(stavka.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
