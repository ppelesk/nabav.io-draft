import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InventurnaListaCreate() {
    const { data, setData, post, processing, errors } = useForm({
        naziv_liste: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventurna-lista');
    };

    return (
        <>
            <Head title="Kreiraj inventurnu listu" />
            <div className="space-y-6 p-4">
                <Heading title="Kreiraj inventurnu listu" description="Unesite naziv nove inventurne liste" />
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4 max-w-md">
                            <div className="grid gap-2">
                                <Label>Naziv liste</Label>
                                <Input value={data.naziv_liste} onChange={e => setData('naziv_liste', e.target.value)} />
                                {errors.naziv_liste && <div className="text-red-500 text-sm">{errors.naziv_liste}</div>}
                            </div>
                            <Button type="submit" disabled={processing}>Spremi</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
