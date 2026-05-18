
<?php

use App\Models\Zgrada;
use App\Models\Lokacija;

test('zgrada has correct table name', function () {
    $zgrada = new Zgrada();
    expect($zgrada->getTable())->toBe('zgrade');
});

test('zgrada has correct primary key', function () {
    $zgrada = new Zgrada();
    expect($zgrada->getKeyName())->toBe('id_zgrade');
});

test('zgrada has fillable attributes', function () {
    $zgrada = new Zgrada();
    expect($zgrada->getFillable())->toEqual([
        'naziv_zgrade',
        'adresa_zgrade',
    ]);
});

test('zgrada get route key name is id_zgrade', function () {
    $zgrada = new Zgrada();
    expect($zgrada->getRouteKeyName())->toBe('id_zgrade');
});

test('zgrada has many lokacije relationship', function () {
    $zgrada = new Zgrada();
    $relation = $zgrada->lokacije();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($relation->getRelated())->toBeInstanceOf(Lokacija::class);
    expect($relation->getForeignKeyName())->toBe('id_zgrade');
    expect($relation->getLocalKeyName())->toBe('id_zgrade');
});

test('zgrada uses timestamps', function () {
    $zgrada = new Zgrada();
    expect($zgrada->usesTimestamps())->toBeTrue();
});
