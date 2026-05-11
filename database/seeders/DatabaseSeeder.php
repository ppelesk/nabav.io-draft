<?php

namespace Database\Seeders;

use App\Models\Uloga;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UlogaSeeder::class);

        $korisnikUlogaId = Uloga::query()
            ->where('sifra_uloge', 'korisnik')
            ->value('id_uloge');

        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'ime_korisnika' => 'Test',
            'prezime_korisnika' => 'User',
            'email' => 'test@example.com',
            'id_uloge' => $korisnikUlogaId,
        ]);
    }
}
