
<?php

use App\Models\Funkcija;
use App\Models\AuditLog;

test('funkcija has correct table name', function () {
    $funkcija = new Funkcija();
    expect($funkcija->getTable())->toBe('funkcije');
});

test('funkcija has correct primary key', function () {
    $funkcija = new Funkcija();
    expect($funkcija->getKeyName())->toBe('id_funkcije');
});

test('funkcija has fillable attributes', function () {
    $funkcija = new Funkcija();
    expect($funkcija->getFillable())->toEqual([
        'sifra_funkcije',
        'naziv_funkcije',
    ]);
});

test('funkcija has many auditZapisi relationship', function () {
    $funkcija = new Funkcija();
    $relation = $funkcija->auditZapisi();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($relation->getRelated())->toBeInstanceOf(AuditLog::class);
    expect($relation->getForeignKeyName())->toBe('id_funkcije');
    expect($relation->getLocalKeyName())->toBe('id_funkcije');
});

test('funkcija uses timestamps', function () {
    $funkcija = new Funkcija();
    expect($funkcija->usesTimestamps())->toBeTrue();
});
