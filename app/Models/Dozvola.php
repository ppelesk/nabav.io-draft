<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Dozvola extends Model
{
    use HasFactory;

    protected $table = 'dozvole';

    protected $primaryKey = 'id_dozvole';

    protected $fillable = [
        'naziv_dozvole',
        'sifra_dozvole',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_dozvole';
    }

    public function uloge(): BelongsToMany
    {
        return $this->belongsToMany(Uloga::class, 'dozvola_uloga', 'id_dozvole', 'id_uloge');
    }
}
