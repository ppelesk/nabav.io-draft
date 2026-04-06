<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Funkcija extends Model
{
    use HasFactory;

    protected $table = 'funkcije';

    protected $primaryKey = 'id_funkcije';

    protected $fillable = [
        'sifra_funkcije',
        'naziv_funkcije',
    ];

    public function auditZapisi(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'id_funkcije', 'id_funkcije');
    }
}
