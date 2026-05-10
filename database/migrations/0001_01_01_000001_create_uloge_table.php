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
        });

        DB::table('uloge')->insert([
            ['naziv_uloge' => 'Administrator sustava', 'sifra_uloge' => 'administrator_sustava'],
            ['naziv_uloge' => 'Upravitelj imovinom',   'sifra_uloge' => 'upravitelj_imovinom'],
            ['naziv_uloge' => 'Korisnik',              'sifra_uloge' => 'korisnik'],
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
