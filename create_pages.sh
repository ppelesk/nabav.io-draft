#!/bin/bash

function create_page {
    NAME=$1
    TITLE=$2
    cat << TEMPLATE > "resources/js/pages/izvjestaji/${NAME}.tsx"
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ${NAME//-/_}_page({ $3 }: { $3: any[] }) {
    const handleExport = () => {
        window.open(\`/izvjestaji/${NAME}?pdf=true\`, '_blank');
    };

    return (
        <>
            <Head title="${TITLE}" />
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <Heading
                        title="${TITLE}"
                        description="Pregled podataka i opcija za preuzimanje izvjestaja"
                    />
                    <Button onClick={handleExport}>Preuzmi PDF</Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Prikaz podataka</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {${3}.length === 0 ? (
                            <p className="text-muted-foreground">Nema podataka za prikaz.</p>
                        ) : (
                            <p>Ukupno zapisa: {${3}.length}</p>
                        )}
                        <p className="mt-4 text-sm text-muted-foreground">Za detaljan prikaz svih zapisa preuzmite PDF verziju.</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

${NAME//-/_}_page.layout = {
    breadcrumbs: [
        { title: 'Izvjestaji', href: '/izvjestaji' },
        { title: '${TITLE}', href: '/izvjestaji/${NAME}' },
    ],
};
TEMPLATE
}

create_page "provedena-inventura" "Izvještaj o provedenoj inventuri" "liste"
create_page "stanje-imovine" "Izvještaj o stanju imovine" "imovina"
create_page "izdana-imovina" "Izvještaj o izdanoj imovini" "imovina"
create_page "imovina-u-odjelima" "Izvještaj o imovini u odjelima" "imovina"
create_page "imovina-na-lokacijama" "Izvještaj o imovini na lokacijama" "imovina"
create_page "imovina-po-kategoriji" "Izvještaj o imovini po kategoriji" "imovina"
create_page "imovina-u-skladistu" "Izvještaj o imovini u skladištu" "imovina"
create_page "imovina-na-servisu" "Izvještaj o imovini na servisu" "imovina"
create_page "rashodovana-imovina" "Izvještaj o rashodovanoj imovini" "imovina"
create_page "revizijski-trag" "Izvještaj iz revizijskog traga" "logovi"
create_page "imovina-na-revers" "Izvještaj o imovini izdanoj na revers" "imovina"
