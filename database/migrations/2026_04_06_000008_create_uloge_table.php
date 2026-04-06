<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('uloge', function (Blueprint $table) {
            $table->bigIncrements('id_uloge');
            $table->string('naziv_uloge', 100);
            $table->string('sifra_uloge', 50)->unique();
            $table->timestamps();
        });

        $now = now();

        DB::table('uloge')->insert([
            [
                'naziv_uloge' => 'Administrator sustava',
                'sifra_uloge' => 'administrator_sustava',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'naziv_uloge' => 'Upravitelj imovinom',
                'sifra_uloge' => 'upravitelj_imovinom',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'naziv_uloge' => 'Korisnik',
                'sifra_uloge' => 'korisnik',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uloge');
    }
};
