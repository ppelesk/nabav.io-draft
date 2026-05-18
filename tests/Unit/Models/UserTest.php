
<?php

use App\Models\User;
use App\Models\Uloga;

test('user has fillable attributes', function () {
    $user = new User();
    expect($user->getFillable())->toEqual([
        'id_uloge',
        'ime_korisnika',
        'prezime_korisnika',
        'name',
        'email',
        'password',
        'deactivated_at',
    ]);
});

test('user has hidden attributes', function () {
    $user = new User();
    expect($user->getHidden())->toEqual([
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ]);
});

test('user has casts', function () {
    $user = new User();
    $casts = $user->getCasts();

    expect($casts)->toHaveKey('email_verified_at', 'datetime');
    expect($casts)->toHaveKey('password', 'hashed');
    expect($casts)->toHaveKey('two_factor_confirmed_at', 'datetime');
    expect($casts)->toHaveKey('deactivated_at', 'datetime');
});

test('user belongs to uloga relationship', function () {
    $user = new User();
    $relation = $user->uloga();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Uloga::class);
    expect($relation->getForeignKeyName())->toBe('id_uloge');
    expect($relation->getOwnerKeyName())->toBe('id_uloge');
});
