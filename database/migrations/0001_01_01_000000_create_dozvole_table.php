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
        Schema::create('dozvole', function (Blueprint $table) {
            $table->bigIncrements('id_dozvole');
            $table->string('naziv_dozvole', 100);
            $table->string('sifra_dozvole', 50)->unique();
            $table->timestamps();
        });

        $now = now();

        DB::table('dozvole')->insert([
            [
                'naziv_dozvole' => 'Korisnik',
                'sifra_dozvole' => 'korisnik',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'naziv_dozvole' => 'Upravitelj imovinom',
                'sifra_dozvole' => 'upravitelj_imovinom',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'naziv_dozvole' => 'Administrator sustava',
                'sifra_dozvole' => 'administrator_sustava',
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
        Schema::dropIfExists('dozvole');
    }
};
