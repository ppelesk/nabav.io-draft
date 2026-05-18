<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj o imovini izdanoj na revers</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Izvještaj o imovini izdanoj na revers</h1>
    <table>
        <thead>
            <tr>
                <th>Zaposlenik</th>
                <th>Inventarni broj</th>
                <th>Naziv imovine</th>
                <th>Datum zaduženja</th>
            </tr>
        </thead>
        <tbody>
            @foreach($imovina->sortBy('zaposlenik.prezime_zaposlenika') as $i)
                <tr>
                    <td>{{ $i->zaposlenik->ime_zaposlenika }} {{ $i->zaposlenik->prezime_zaposlenika }}</td>
                    <td>{{ $i->inventarni_broj }}</td>
                    <td>{{ $i->naziv_imovine }}</td>
                    <td>{{ $i->datum_zaduzenja ? $i->datum_zaduzenja->format('d.m.Y') : '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
