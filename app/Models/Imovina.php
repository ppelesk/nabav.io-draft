<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Imovina extends Model
{
    use HasFactory;

    protected $table = 'imovina';

    protected $primaryKey = 'id_imovine';

    protected $fillable = [
        'inventarni_broj',
        'barcode_token',
        'naziv_imovine',
        'serijski_broj',
        'broj_racuna',
        'datum_nabave',
        'cijena',
        'jamstvo_mjeseci',
        'amortizacija_mjeseci',
        'id_kategorije',
        'id_statusa',
        'id_odjela',
        'id_lokacije',
        'id_zaposlenika',
        'na_revers',
        'datum_zaduzenja',
        'datum_razduzenja',
        'datum_popisa',
    ];

    protected function casts(): array
    {
        return [
            'datum_nabave' => 'date',
            'datum_zaduzenja' => 'date',
            'datum_razduzenja' => 'date',
            'datum_popisa' => 'datetime',
            'na_revers' => 'boolean',
            'cijena' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (Imovina $imovina): void {
            $imovina->updateQuietly([
                'inventarni_broj' => $imovina->inventarni_broj ?: $imovina->generiraniInventarniBroj(),
                'barcode_token' => $imovina->barcode_token ?: $imovina->generiraniBarcodeToken(),
            ]);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'id_imovine';
    }

    public function kategorija(): BelongsTo
    {
        return $this->belongsTo(KategorijaImovine::class, 'id_kategorije', 'id_kategorije');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(StatusImovine::class, 'id_statusa', 'id_statusa');
    }

    public function odjel(): BelongsTo
    {
        return $this->belongsTo(Odjel::class, 'id_odjela', 'id_odjela');
    }

    public function lokacija(): BelongsTo
    {
        return $this->belongsTo(Lokacija::class, 'id_lokacije', 'id_lokacije');
    }

    public function zaposlenik(): BelongsTo
    {
        return $this->belongsTo(Zaposlenik::class, 'id_zaposlenika', 'id_zaposlenika');
    }

    public function generiraniInventarniBroj(): string
    {
        return sprintf('INV-%06d', $this->id_imovine);
    }

    public function generiraniBarcodeToken(): string
    {
        return sprintf('BAR-%06d', $this->id_imovine);
    }
}
