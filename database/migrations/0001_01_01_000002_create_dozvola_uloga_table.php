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
        Schema::create('dozvola_uloga', function (Blueprint $table) {
            $table->unsignedBigInteger('id_dozvole');
            $table->unsignedBigInteger('id_uloge');

            $table->primary(['id_dozvole', 'id_uloge']);

            $table->foreign('id_dozvole')
                ->references('id_dozvole')
                ->on('dozvole')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('id_uloge')
                ->references('id_uloge')
                ->on('uloge')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });

        $dozvole = DB::table('dozvole')->pluck('id_dozvole', 'sifra_dozvole');
        $uloge = DB::table('uloge')->pluck('id_uloge', 'sifra_uloge');

        // Administrator sustava → sve tri dozvole
        DB::table('dozvola_uloga')->insert([
            ['id_dozvole' => $dozvole['korisnik'], 'id_uloge' => $uloge['administrator_sustava']],
            ['id_dozvole' => $dozvole['upravitelj_imovinom'], 'id_uloge' => $uloge['administrator_sustava']],
            ['id_dozvole' => $dozvole['administrator_sustava'], 'id_uloge' => $uloge['administrator_sustava']],
        ]);

        // Upravitelj imovinom → korisnik + upravitelj_imovinom
        DB::table('dozvola_uloga')->insert([
            ['id_dozvole' => $dozvole['korisnik'], 'id_uloge' => $uloge['upravitelj_imovinom']],
            ['id_dozvole' => $dozvole['upravitelj_imovinom'], 'id_uloge' => $uloge['upravitelj_imovinom']],
        ]);

        // Korisnik → samo korisnik
        DB::table('dozvola_uloga')->insert([
            ['id_dozvole' => $dozvole['korisnik'], 'id_uloge' => $uloge['korisnik']],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dozvola_uloga');
    }
};
