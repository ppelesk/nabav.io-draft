<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj o provedenoj inventuri</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 18px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Izvještaj o provedenoj inventuri</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Naziv liste</th>
                <th>Kreator</th>
                <th>Status</th>
                <th>Datum kreiranja</th>
            </tr>
        </thead>
        <tbody>
            @foreach($liste as $lista)
                <tr>
                    <td>{{ $lista->id_liste }}</td>
                    <td>{{ $lista->naziv_liste }}</td>
                    <td>{{ $lista->kreator->ime_korisnika }} {{ $lista->kreator->prezime_korisnika }}</td>
                    <td>{{ $lista->status_liste }}</td>
                    <td>{{ $lista->created_at->format('d.m.Y H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
