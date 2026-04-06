<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Zaposlenik extends Model
{
    use HasFactory;

    protected $table = 'zaposlenici';

    protected $primaryKey = 'id_zaposlenika';

    protected $fillable = [
        'id_korisnika',
        'oib_zaposlenika',
        'ime_zaposlenika',
        'prezime_zaposlenika',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_zaposlenika';
    }

    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_korisnika');
    }
}
