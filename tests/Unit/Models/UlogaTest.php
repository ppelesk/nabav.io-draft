
<?php

use App\Models\Uloga;
use App\Models\User;

test('uloga has correct table name', function () {
    $uloga = new Uloga();
    expect($uloga->getTable())->toBe('uloge');
});

test('uloga has correct primary key', function () {
    $uloga = new Uloga();
    expect($uloga->getKeyName())->toBe('id_uloge');
});

test('uloga timestamps are disabled', function () {
    $uloga = new Uloga();
    expect($uloga->timestamps)->toBeFalse();
});

test('uloga has fillable attributes', function () {
    $uloga = new Uloga();
    expect($uloga->getFillable())->toEqual(['naziv_uloge', 'sifra_uloge']);
});

test('uloga get route key name is id_uloge', function () {
    $uloga = new Uloga();
    expect($uloga->getRouteKeyName())->toBe('id_uloge');
});

test('uloga has many korisnici relationship', function () {
    $uloga = new Uloga();
    $relation = $uloga->korisnici();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($relation->getRelated())->toBeInstanceOf(User::class);
    expect($relation->getForeignKeyName())->toBe('id_uloge');
    expect($relation->getLocalKeyName())->toBe('id_uloge');
});
