<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventurnaListaStavka extends Model
{
    protected $table = 'inventurne_liste_stavke';

    protected $primaryKey = 'id_stavke';

    protected $fillable = [
        'id_liste',
        'id_imovine',
        'skenirao_korisnik_id',
        'id_lokacije_skeniranja',
        'prethodna_lokacija_id',
        'pronadjeno',
    ];

    public function inventurnaLista(): BelongsTo
    {
        return $this->belongsTo(InventurnaLista::class, 'id_liste', 'id_liste');
    }

    public function imovina(): BelongsTo
    {
        return $this->belongsTo(Imovina::class, 'id_imovine', 'id_imovine');
    }

    public function skeniraoKorisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'skenirao_korisnik_id', 'id');
    }

    public function lokacijaSkeniranja(): BelongsTo
    {
        return $this->belongsTo(Lokacija::class, 'id_lokacije_skeniranja', 'id_lokacije');
    }

    public function prethodnaLokacija(): BelongsTo
    {
        return $this->belongsTo(Lokacija::class, 'prethodna_lokacija_id', 'id_lokacije');
    }
}
