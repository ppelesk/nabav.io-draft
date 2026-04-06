<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zaposlenik extends Model
{
    use HasFactory;

    protected $table = 'zaposlenici';

    protected $primaryKey = 'id_zaposlenika';

    protected $fillable = [
        'oib_zaposlenika',
        'ime_zaposlenika',
        'prezime_zaposlenika',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_zaposlenika';
    }
}
