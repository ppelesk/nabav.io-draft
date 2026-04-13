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

        $dozvole = [
            ['naziv_dozvole' => 'Korisnik', 'sifra_dozvole' => 'korisnik'],
            ['naziv_dozvole' => 'Upravitelj imovinom', 'sifra_dozvole' => 'upravitelj_imovinom'],
            ['naziv_dozvole' => 'Administrator sustava', 'sifra_dozvole' => 'administrator_sustava'],
        ];

        foreach ($dozvole as $dozvola) {
            DB::table('dozvole')->updateOrInsert(
                ['sifra_dozvole' => $dozvola['sifra_dozvole']],
                [
                    'naziv_dozvole' => $dozvola['naziv_dozvole'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

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

        $dozvolaIds = DB::table('dozvole')->pluck('id_dozvole', 'sifra_dozvole');
        $ulogaIds = DB::table('uloge')->pluck('id_uloge', 'sifra_uloge');

        $pivot = [
            // Administrator sustava → sve tri dozvole
            ['id_dozvole' => $dozvolaIds['korisnik'], 'id_uloge' => $ulogaIds['administrator_sustava']],
            ['id_dozvole' => $dozvolaIds['upravitelj_imovinom'], 'id_uloge' => $ulogaIds['administrator_sustava']],
            ['id_dozvole' => $dozvolaIds['administrator_sustava'], 'id_uloge' => $ulogaIds['administrator_sustava']],
            // Upravitelj imovinom → korisnik + upravitelj_imovinom
            ['id_dozvole' => $dozvolaIds['korisnik'], 'id_uloge' => $ulogaIds['upravitelj_imovinom']],
            ['id_dozvole' => $dozvolaIds['upravitelj_imovinom'], 'id_uloge' => $ulogaIds['upravitelj_imovinom']],
            // Korisnik → samo korisnik
            ['id_dozvole' => $dozvolaIds['korisnik'], 'id_uloge' => $ulogaIds['korisnik']],
        ];

        foreach ($pivot as $row) {
            DB::table('dozvola_uloga')->updateOrInsert(
                ['id_dozvole' => $row['id_dozvole'], 'id_uloge' => $row['id_uloge']],
                []
            );
        }
    }
}
