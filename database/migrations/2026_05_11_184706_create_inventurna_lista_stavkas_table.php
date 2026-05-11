<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventurne_liste_stavke', function (Blueprint $table) {
            $table->id('id_stavke');
            $table->unsignedBigInteger('id_liste');
            $table->unsignedBigInteger('id_imovine');
            $table->unsignedBigInteger('skenirao_korisnik_id');
            $table->unsignedBigInteger('id_lokacije_skeniranja');
            $table->unsignedBigInteger('prethodna_lokacija_id')->nullable();
            $table->boolean('pronadjeno')->default(true);
            $table->timestamps();

            $table->foreign('id_liste')->references('id_liste')->on('inventurne_liste')->onDelete('cascade');
            $table->foreign('id_imovine')->references('id_imovine')->on('imovina')->onDelete('cascade');
            $table->foreign('skenirao_korisnik_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_lokacije_skeniranja')->references('id_lokacije')->on('lokacije')->onDelete('cascade');
            $table->foreign('prethodna_lokacija_id')->references('id_lokacije')->on('lokacije')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventurne_liste_stavke');
    }
};
