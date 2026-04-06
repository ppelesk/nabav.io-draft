<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UlogaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        $uloge = [
            ['naziv_uloge' => 'Administrator sustava', 'sifra_uloge' => 'administrator_sustava'],
            ['naziv_uloge' => 'Upravitelj imovinom', 'sifra_uloge' => 'upravitelj_imovinom'],
            ['naziv_uloge' => 'Korisnik', 'sifra_uloge' => 'korisnik'],
        ];

        foreach ($uloge as $uloga) {
            DB::table('uloge')->updateOrInsert(
                ['sifra_uloge' => $uloga['sifra_uloge']],
                [
                    'naziv_uloge' => $uloga['naziv_uloge'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }
}
