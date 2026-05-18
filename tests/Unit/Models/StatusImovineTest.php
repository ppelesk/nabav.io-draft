
<?php

use App\Models\StatusImovine;

test('status imovine has correct table name', function () {
    $status = new StatusImovine();
    expect($status->getTable())->toBe('status_imovine');
});

test('status imovine has correct primary key', function () {
    $status = new StatusImovine();
    expect($status->getKeyName())->toBe('id_statusa');
});

test('status imovine has fillable attributes', function () {
    $status = new StatusImovine();
    expect($status->getFillable())->toEqual(['naziv_statusa']);
});

test('status imovine get route key name is id_statusa', function () {
    $status = new StatusImovine();
    expect($status->getRouteKeyName())->toBe('id_statusa');
});
