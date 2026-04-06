<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusImovine extends Model
{
    use HasFactory;

    protected $table = 'status_imovine';

    protected $primaryKey = 'id_statusa';

    protected $fillable = [
        'naziv_statusa',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_statusa';
    }
}
