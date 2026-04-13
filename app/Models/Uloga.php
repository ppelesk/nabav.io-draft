<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Uloga extends Model
{
    use HasFactory;

    protected $table = 'uloge';

    protected $primaryKey = 'id_uloge';

    protected $fillable = [
        'naziv_uloge',
        'sifra_uloge',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_uloge';
    }

    public function korisnici(): HasMany
    {
        return $this->hasMany(User::class, 'id_uloge', 'id_uloge');
    }

    public function dozvole(): BelongsToMany
    {
        return $this->belongsToMany(Dozvola::class, 'dozvola_uloga', 'id_uloge', 'id_dozvole');
    }

    public function imaDozvolu(string $sifraDozvole): bool
    {
        return $this->dozvole()->where('sifra_dozvole', $sifraDozvole)->exists();
    }
}
