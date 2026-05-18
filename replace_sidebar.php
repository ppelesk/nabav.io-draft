<?php

$file = 'resources/js/components/app-sidebar.tsx';
$content = file_get_contents($file);

$search = <<<SEARCH
            {
                title: 'Izvjestaji',
                href: '/izvjestaji',
            },
SEARCH;

$replace = <<<REPLACE
            {
                title: 'Izvještaji',
                items: [
                    { title: 'Izvještaj o provedenoj inventuri', href: '/izvjestaji/provedena-inventura' },
                    { title: 'Izvještaj o stanju imovine', href: '/izvjestaji/stanje-imovine' },
                    { title: 'Izvještaj o izdanoj imovini', href: '/izvjestaji/izdana-imovina' },
                    { title: 'Izvještaj o imovini u odjelima', href: '/izvjestaji/imovina-u-odjelima' },
                    { title: 'Izvještaj o imovini na lokacijama', href: '/izvjestaji/imovina-na-lokacijama' },
                    { title: 'Izvještaj o imovini po kategoriji', href: '/izvjestaji/imovina-po-kategoriji' },
                    { title: 'Izvještaj o imovini u skladištu', href: '/izvjestaji/imovina-u-skladistu' },
                    { title: 'Izvještaj o imovini na servisu', href: '/izvjestaji/imovina-na-servisu' },
                    { title: 'Izvještaj o rashodovanoj imovini', href: '/izvjestaji/rashodovana-imovina' },
                    { title: 'Izvještaj iz revizijskog traga', href: '/izvjestaji/revizijski-trag' },
                    { title: 'Izvještaj o imovini izdanoj na revers', href: '/izvjestaji/imovina-na-revers' },
                ],
            },
REPLACE;

$newContent = str_replace($search, $replace, $content);
file_put_contents($file, $newContent);
