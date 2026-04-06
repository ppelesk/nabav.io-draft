<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lokacija extends Model
{
    use HasFactory;

    protected $table = 'lokacije';

    protected $primaryKey = 'id_lokacije';

    protected $fillable = [
        'id_zgrade',
        'oznaka_sobe',
        'naziv_sobe',
    ];

    protected static function booted(): void
    {
        static::created(function (Lokacija $lokacija): void {
            if ($lokacija->oznaka_sobe !== '') {
                return;
            }

            $lokacija->updateQuietly([
                'oznaka_sobe' => $lokacija->generiranaOznakaSobe(),
            ]);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'id_lokacije';
    }

    public function zgrada(): BelongsTo
    {
        return $this->belongsTo(Zgrada::class, 'id_zgrade', 'id_zgrade');
    }

    public function generiranaOznakaSobe(): string
    {
        return (string) $this->id_lokacije;
    }
}
