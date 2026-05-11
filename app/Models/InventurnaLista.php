<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventurnaLista extends Model
{
    protected $table = 'inventurne_liste';

    protected $primaryKey = 'id_liste';

    protected $fillable = [
        'kreirao_korisnik_id',
        'naziv_liste',
        'status_liste',
    ];

    public function kreator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kreirao_korisnik_id', 'id');
    }

    public function stavke(): HasMany
    {
        return $this->hasMany(InventurnaListaStavka::class, 'id_liste', 'id_liste');
    }
}
