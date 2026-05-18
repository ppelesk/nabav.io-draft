
<?php

use App\Models\Imovina;
use App\Models\KategorijaImovine;
use App\Models\StatusImovine;
use App\Models\Odjel;
use App\Models\Lokacija;
use App\Models\Zaposlenik;

test('imovina has correct table name', function () {
    $imovina = new Imovina();
    expect($imovina->getTable())->toBe('imovina');
});

test('imovina has correct primary key', function () {
    $imovina = new Imovina();
    expect($imovina->getKeyName())->toBe('id_imovine');
});

test('imovina has fillable attributes', function () {
    $imovina = new Imovina();
    expect($imovina->getFillable())->toEqual([
        'inventarni_broj',
        'barcode_token',
        'naziv_imovine',
        'serijski_broj',
        'broj_racuna',
        'datum_nabave',
        'cijena',
        'jamstvo_mjeseci',
        'amortizacija_mjeseci',
        'id_kategorije',
        'id_statusa',
        'id_odjela',
        'id_lokacije',
        'id_zaposlenika',
        'na_revers',
        'datum_zaduzenja',
        'datum_razduzenja',
        'datum_popisa',
    ]);
});

test('imovina has casts', function () {
    $imovina = new Imovina();
    $casts = $imovina->getCasts();

    expect($casts)->toHaveKey('datum_nabave', 'date');
    expect($casts)->toHaveKey('datum_zaduzenja', 'date');
    expect($casts)->toHaveKey('datum_razduzenja', 'date');
    expect($casts)->toHaveKey('datum_popisa', 'datetime');
    expect($casts)->toHaveKey('na_revers', 'boolean');
    expect($casts)->toHaveKey('cijena', 'decimal:2');
});

test('imovina get route key name is id_imovine', function () {
    $imovina = new Imovina();
    expect($imovina->getRouteKeyName())->toBe('id_imovine');
});

test('imovina belongs to kategorija relationship', function () {
    $imovina = new Imovina();
    $relation = $imovina->kategorija();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(KategorijaImovine::class);
    expect($relation->getForeignKeyName())->toBe('id_kategorije');
    expect($relation->getOwnerKeyName())->toBe('id_kategorije');
});

test('imovina belongs to status relationship', function () {
    $imovina = new Imovina();
    $relation = $imovina->status();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(StatusImovine::class);
    expect($relation->getForeignKeyName())->toBe('id_statusa');
    expect($relation->getOwnerKeyName())->toBe('id_statusa');
});

test('imovina belongs to odjel relationship', function () {
    $imovina = new Imovina();
    $relation = $imovina->odjel();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Odjel::class);
    expect($relation->getForeignKeyName())->toBe('id_odjela');
    expect($relation->getOwnerKeyName())->toBe('id_odjela');
});

test('imovina belongs to lokacija relationship', function () {
    $imovina = new Imovina();
    $relation = $imovina->lokacija();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Lokacija::class);
    expect($relation->getForeignKeyName())->toBe('id_lokacije');
    expect($relation->getOwnerKeyName())->toBe('id_lokacije');
});

test('imovina belongs to zaposlenik relationship', function () {
    $imovina = new Imovina();
    $relation = $imovina->zaposlenik();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Zaposlenik::class);
    expect($relation->getForeignKeyName())->toBe('id_zaposlenika');
    expect($relation->getOwnerKeyName())->toBe('id_zaposlenika');
});
