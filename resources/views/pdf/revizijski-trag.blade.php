<html>
<head>
    <meta charset="UTF-8">
    <title>Izvještaj iz revizijskog traga</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { font-size: 16px; margin-bottom: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Izvještaj iz revizijskog traga</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Korisnik</th>
                <th>Funkcija</th>
                <th>Metoda</th>
                <th>Vrijeme događaja</th>
            </tr>
        </thead>
        <tbody>
            @foreach($logovi as $log)
                <tr>
                    <td>{{ $log->id_loga }}</td>
                    <td>{{ $log->korisnik->ime_korisnika ?? 'Sustav' }} {{ $log->korisnik->prezime_korisnika ?? '' }}</td>
                    <td>{{ $log->funkcija->naziv_funkcije ?? '-' }}</td>
                    <td>{{ $log->metoda }}</td>
                    <td>{{ $log->vrijeme_dogadaja ? $log->vrijeme_dogadaja->format('d.m.Y H:i:s') : '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
