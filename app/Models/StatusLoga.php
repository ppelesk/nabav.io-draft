<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusLoga extends Model
{
    use HasFactory;

    protected $table = 'statusi_loga';

    protected $primaryKey = 'id_statusa_loga';

    protected $fillable = [
        'sifra_statusa',
        'naziv_statusa',
    ];

    public function auditZapisi(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'id_statusa_loga', 'id_statusa_loga');
    }
}
