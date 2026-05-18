<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj o stanju imovine</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Izvještaj o stanju imovine</h1>
    <table>
        <thead>
            <tr>
                <th>Inventarni broj</th>
                <th>Naziv</th>
                <th>Kategorija</th>
                <th>Lokacija</th>
                <th>Status</th>
                <th>Cijena</th>
            </tr>
        </thead>
        <tbody>
            @foreach($imovina as $i)
                <tr>
                    <td>{{ $i->inventarni_broj }}</td>
                    <td>{{ $i->naziv_imovine }}</td>
                    <td>{{ $i->kategorija->naziv_kategorije ?? '-' }}</td>
                    <td>{{ $i->lokacija->oznaka_sobe ?? '-' }}</td>
                    <td>{{ $i->status->naziv_statusa ?? '-' }}</td>
                    <td>{{ number_format($i->cijena, 2, ',', '.') }} EUR</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
