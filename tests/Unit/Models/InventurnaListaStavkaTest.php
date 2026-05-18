
<?php

use App\Models\InventurnaListaStavka;
use App\Models\InventurnaLista;
use App\Models\Imovina;
use App\Models\User;
use App\Models\Lokacija;

test('inventurna lista stavka has correct table name', function () {
    $stavka = new InventurnaListaStavka();
    expect($stavka->getTable())->toBe('inventurne_liste_stavke');
});

test('inventurna lista stavka has correct primary key', function () {
    $stavka = new InventurnaListaStavka();
    expect($stavka->getKeyName())->toBe('id_stavke');
});

test('inventurna lista stavka has fillable attributes', function () {
    $stavka = new InventurnaListaStavka();
    expect($stavka->getFillable())->toEqual([
        'id_liste',
        'id_imovine',
        'skenirao_korisnik_id',
        'id_lokacije_skeniranja',
        'prethodna_lokacija_id',
        'pronadjeno',
    ]);
});

test('inventurna lista stavka belongs to inventurna lista relationship', function () {
    $stavka = new InventurnaListaStavka();
    $relation = $stavka->inventurnaLista();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(InventurnaLista::class);
    expect($relation->getForeignKeyName())->toBe('id_liste');
    expect($relation->getOwnerKeyName())->toBe('id_liste');
});

test('inventurna lista stavka belongs to imovina relationship', function () {
    $stavka = new InventurnaListaStavka();
    $relation = $stavka->imovina();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Imovina::class);
    expect($relation->getForeignKeyName())->toBe('id_imovine');
    expect($relation->getOwnerKeyName())->toBe('id_imovine');
});

test('inventurna lista stavka belongs to skenirao korisnik relationship', function () {
    $stavka = new InventurnaListaStavka();
    $relation = $stavka->skeniraoKorisnik();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(User::class);
    expect($relation->getForeignKeyName())->toBe('skenirao_korisnik_id');
    expect($relation->getOwnerKeyName())->toBe('id');
});

test('inventurna lista stavka belongs to lokacija skeniranja relationship', function () {
    $stavka = new InventurnaListaStavka();
    $relation = $stavka->lokacijaSkeniranja();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Lokacija::class);
    expect($relation->getForeignKeyName())->toBe('id_lokacije_skeniranja');
    expect($relation->getOwnerKeyName())->toBe('id_lokacije');
});

test('inventurna lista stavka belongs to prethodna lokacija relationship', function () {
    $stavka = new InventurnaListaStavka();
    $relation = $stavka->prethodnaLokacija();

    expect($relation)->toBeInstanceOf(Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($relation->getRelated())->toBeInstanceOf(Lokacija::class);
    expect($relation->getForeignKeyName())->toBe('prethodna_lokacija_id');
    expect($relation->getOwnerKeyName())->toBe('id_lokacije');
});
