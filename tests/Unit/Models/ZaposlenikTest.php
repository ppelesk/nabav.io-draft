
<?php

use App\Models\Zaposlenik;

test('zaposlenik has correct table name', function () {
    $zaposlenik = new Zaposlenik();
    expect($zaposlenik->getTable())->toBe('zaposlenici');
});

test('zaposlenik has correct primary key', function () {
    $zaposlenik = new Zaposlenik();
    expect($zaposlenik->getKeyName())->toBe('id_zaposlenika');
});

test('zaposlenik has fillable attributes', function () {
    $zaposlenik = new Zaposlenik();
    expect($zaposlenik->getFillable())->toEqual([
        'oib_zaposlenika',
        'ime_zaposlenika',
        'prezime_zaposlenika',
    ]);
});

test('zaposlenik get route key name is id_zaposlenika', function () {
    $zaposlenik = new Zaposlenik();
    expect($zaposlenik->getRouteKeyName())->toBe('id_zaposlenika');
});
