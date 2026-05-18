
<?php

use App\Models\KategorijaImovine;

test('kategorija imovine has correct table name', function () {
    $kategorija = new KategorijaImovine();
    expect($kategorija->getTable())->toBe('kategorije_imovine');
});

test('kategorija imovine has correct primary key', function () {
    $kategorija = new KategorijaImovine();
    expect($kategorija->getKeyName())->toBe('id_kategorije');
});

test('kategorija imovine has fillable attributes', function () {
    $kategorija = new KategorijaImovine();
    expect($kategorija->getFillable())->toEqual(['naziv_kategorije']);
});

test('kategorija imovine get route key name is id_kategorije', function () {
    $kategorija = new KategorijaImovine();
    expect($kategorija->getRouteKeyName())->toBe('id_kategorije');
});
