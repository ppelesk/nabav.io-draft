<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj o imovini po kategoriji</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Izvještaj o imovini po kategoriji</h1>
    <table>
        <thead>
            <tr>
                <th>Kategorija</th>
                <th>Inventarni broj</th>
                <th>Naziv imovine</th>
            </tr>
        </thead>
        <tbody>
            @foreach($imovina->sortBy('kategorija.naziv_kategorije') as $i)
                <tr>
                    <td>{{ $i->kategorija->naziv_kategorije ?? '-' }}</td>
                    <td>{{ $i->inventarni_broj }}</td>
                    <td>{{ $i->naziv_imovine }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
