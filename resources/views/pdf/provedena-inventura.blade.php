<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj o provedenoj inventuri</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 20px; text-align: center; }
        h2 { font-size: 16px; margin-top: 28px; margin-bottom: 10px; }
        .summary { display: flex; gap: 16px; margin-bottom: 20px; }
        .summary div { padding: 10px; border: 1px solid #ddd; border-radius: 6px; background: #f9f9f9; }
        .summary strong { display: block; font-size: 20px; margin-top: 4px; }
    </style>
</head>
<body>
    <h1>Izvještaj o provedenoj inventuri</h1>

    <div class="summary">
        <div>
            <div>Završene liste</div>
            <strong>{{ $liste->count() }}</strong>
        </div>
        <div>
            <div>Skenirane stavke</div>
            <strong>{{ $liste->sum(fn($lista) => $lista->stavke->count()) }}</strong>
        </div>
    </div>

    @foreach($liste as $lista)
        <h2>{{ $lista->naziv_liste }} (ID {{ $lista->id_liste }})</h2>
        <p><strong>Kreator:</strong> {{ $lista->kreator->ime_korisnika }} {{ $lista->kreator->prezime_korisnika }}<br>
        <strong>Datum kreiranja:</strong> {{ $lista->created_at->format('d.m.Y H:i') }}</p>

        @if($lista->stavke->isEmpty())
            <p>Nema skeniranih stavki za ovu listu.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>INV broj</th>
                        <th>Naziv imovine</th>
                        <th>Skenirao</th>
                        <th>Lokacija skeniranja</th>
                        <th>Prethodna lokacija</th>
                        <th>Datum skeniranja</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($lista->stavke as $stavka)
                        <tr>
                            <td>{{ $stavka->imovina->inventarni_broj ?? '-' }}</td>
                            <td>{{ $stavka->imovina->naziv_imovine ?? '-' }}</td>
                            <td>{{ $stavka->skeniraoKorisnik->name ?? '-' }}</td>
                            <td>{{ $stavka->lokacijaSkeniranja->oznaka_sobe ?? '-' }}</td>
                            <td>{{ $stavka->prethodnaLokacija->oznaka_sobe ?? '-' }}</td>
                            <td>{{ optional($stavka->created_at)->format('d.m.Y H:i') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endforeach
</body>
</html>
