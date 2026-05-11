<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventurne_liste', function (Blueprint $table) {
            $table->id('id_liste');
            $table->unsignedBigInteger('kreirao_korisnik_id');
            $table->string('naziv_liste');
            $table->string('status_liste')->default('u_tijeku'); // u_tijeku, zavrsena
            $table->timestamps();

            $table->foreign('kreirao_korisnik_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventurne_liste');
    }
};
