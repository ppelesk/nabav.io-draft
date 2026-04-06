<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'audit_log';

    protected $primaryKey = 'id_loga';

    protected $fillable = [
        'id_funkcije',
        'id_korisnika',
        'metoda',
        'ruta',
        'user_agent',
        'detalji',
        'vrijeme_dogadaja',
    ];

    protected function casts(): array
    {
        return [
            'vrijeme_dogadaja' => 'datetime',
        ];
    }

    public function funkcija(): BelongsTo
    {
        return $this->belongsTo(Funkcija::class, 'id_funkcije', 'id_funkcije');
    }

    public function korisnik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_korisnika');
    }
}
