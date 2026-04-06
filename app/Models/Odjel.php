<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Odjel extends Model
{
    use HasFactory;

    protected $table = 'odjeli';

    protected $primaryKey = 'id_odjela';

    protected $fillable = [
        'naziv_odjela',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_odjela';
    }
}
