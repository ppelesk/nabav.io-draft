
<?php

use App\Models\AuditLog;
use App\Models\Funkcija;
use App\Models\User;

test('audit log has correct table name', function () {
    $auditLog = new AuditLog();
    expect($auditLog->getTable())->toBe('audit_log');
});

test('audit log has correct primary key', function () {
    $auditLog = new AuditLog();
    expect($auditLog->getKeyName())->toBe('id_loga');
});

test('audit log timestamps are disabled', function () {
    $auditLog = new AuditLog();
    expect($auditLog->timestamps)->toBeFalse();
});

test('audit log has fillable attributes', function () {
    $auditLog = new AuditLog();
    expect($auditLog->getFillable())->toEqual([
        'id_funkcije',
        'id_korisnika',
        'metoda',
        'ruta',
        'user_agent',
        'detalji',
        'vrijeme_dogadaja',
    ]);
});

test('audit log has casts', function () {
    $auditLog = new AuditLog();
    $casts = $auditLog->getCasts();

    expect($casts)->toHaveKey('vrijeme_dogadaja', 'datetime');
});

test('audit log belongs to funkcija relationship', function () {
    $auditLog = new AuditLog();
    $relation = $auditLog->funkcija();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Funkcija::class);
    expect($relation->getForeignKeyName())->toBe('id_funkcije');
    expect($relation->getOwnerKeyName())->toBe('id_funkcije');
});

test('audit log belongs to korisnik relationship', function () {
    $auditLog = new AuditLog();
    $relation = $auditLog->korisnik();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(User::class);
    expect($relation->getForeignKeyName())->toBe('id_korisnika');
    expect($relation->getOwnerKeyName())->toBe('id');
});
