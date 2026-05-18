
<?php

use App\Models\InventurnaLista;
use App\Models\InventurnaListaStavka;
use App\Models\User;

test('inventurna lista has correct table name', function () {
    $inventurnaLista = new InventurnaLista();
    expect($inventurnaLista->getTable())->toBe('inventurne_liste');
});

test('inventurna lista has correct primary key', function () {
    $inventurnaLista = new InventurnaLista();
    expect($inventurnaLista->getKeyName())->toBe('id_liste');
});

test('inventurna lista has fillable attributes', function () {
    $inventurnaLista = new InventurnaLista();
    expect($inventurnaLista->getFillable())->toEqual([
        'kreirao_korisnik_id',
        'naziv_liste',
        'status_liste',
    ]);
});

test('inventurna lista belongs to kreator relationship', function () {
    $inventurnaLista = new InventurnaLista();
    $relation = $inventurnaLista->kreator();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(User::class);
    expect($relation->getForeignKeyName())->toBe('kreirao_korisnik_id');
    expect($relation->getOwnerKeyName())->toBe('id');
});

test('inventurna lista has many stavke relationship', function () {
    $inventurnaLista = new InventurnaLista();
    $relation = $inventurnaLista->stavke();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($relation->getRelated())->toBeInstanceOf(InventurnaListaStavka::class);
    expect($relation->getForeignKeyName())->toBe('id_liste');
    expect($relation->getLocalKeyName())->toBe('id_liste');
});
