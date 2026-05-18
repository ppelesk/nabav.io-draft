
<?php

use App\Models\Odjel;

test('odjel has correct table name', function () {
    $odjel = new Odjel();
    expect($odjel->getTable())->toBe('odjeli');
});

test('odjel has correct primary key', function () {
    $odjel = new Odjel();
    expect($odjel->getKeyName())->toBe('id_odjela');
});

test('odjel has fillable attributes', function () {
    $odjel = new Odjel();
    expect($odjel->getFillable())->toEqual(['naziv_odjela']);
});

test('odjel get route key name is id_odjela', function () {
    $odjel = new Odjel();
    expect($odjel->getRouteKeyName())->toBe('id_odjela');
});

test('odjel uses timestamps', function () {
    $odjel = new Odjel();
    expect($odjel->usesTimestamps())->toBeTrue();
});
