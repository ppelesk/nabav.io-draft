<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategorijaImovine extends Model
{
    use HasFactory;

    protected $table = 'kategorije_imovine';

    protected $primaryKey = 'id_kategorije';

    protected $fillable = [
        'naziv_kategorije',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_kategorije';
    }
}
