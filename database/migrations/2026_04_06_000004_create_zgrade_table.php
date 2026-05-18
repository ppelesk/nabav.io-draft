<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('zgrade', function (Blueprint $table) {
            $table->bigIncrements('id_zgrade');
            $table->string('naziv_zgrade', 150);
            $table->string('adresa_zgrade', 200)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zgrade');
    }
};
