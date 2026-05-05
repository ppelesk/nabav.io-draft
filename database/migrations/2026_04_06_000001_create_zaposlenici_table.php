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
        Schema::create('zaposlenici', function (Blueprint $table) {
            $table->bigIncrements('id_zaposlenika');
            $table->char('oib_zaposlenika', 11)->unique();
            $table->string('ime_zaposlenika');
            $table->string('prezime_zaposlenika');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('zaposlenici');
    }
};
