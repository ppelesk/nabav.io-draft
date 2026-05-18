
<?php

use App\Models\Lokacija;
use App\Models\Zgrada;

test('lokacija has correct table name', function () {
    $lokacija = new Lokacija();
    expect($lokacija->getTable())->toBe('lokacije');
});

test('lokacija has correct primary key', function () {
    $lokacija = new Lokacija();
    expect($lokacija->getKeyName())->toBe('id_lokacije');
});

test('lokacija has fillable attributes', function () {
    $lokacija = new Lokacija();
    expect($lokacija->getFillable())->toEqual([
        'id_zgrade',
        'oznaka_sobe',
        'naziv_sobe',
    ]);
});

test('lokacija get route key name is id_lokacije', function () {
    $lokacija = new Lokacija();
    expect($lokacija->getRouteKeyName())->toBe('id_lokacije');
});

test('lokacija belongs to zgrada relationship', function () {
    $lokacija = new Lokacija();
    $relation = $lokacija->zgrada();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Zgrada::class);
    expect($relation->getForeignKeyName())->toBe('id_zgrade');
    expect($relation->getOwnerKeyName())->toBe('id_zgrade');
});
