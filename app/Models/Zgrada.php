<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Zgrada extends Model
{
    use HasFactory;

    protected $table = 'zgrade';

    protected $primaryKey = 'id_zgrade';

    protected $fillable = [
        'naziv_zgrade',
        'adresa_zgrade',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_zgrade';
    }

    public function lokacije(): HasMany
    {
        return $this->hasMany(Lokacija::class, 'id_zgrade', 'id_zgrade');
    }
}
