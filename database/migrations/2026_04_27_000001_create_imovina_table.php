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
        Schema::create('imovina', function (Blueprint $table) {
            $table->bigIncrements('id_imovine');
            $table->string('inventarni_broj', 30)->nullable()->unique();
            $table->string('barcode_token', 60)->nullable()->unique();
            $table->string('naziv_imovine', 150);
            $table->string('serijski_broj', 100)->nullable();
            $table->string('broj_racuna', 80)->nullable();
            $table->date('datum_nabave');
            $table->decimal('cijena', 12, 2);
            $table->unsignedInteger('jamstvo_mjeseci')->default(0);
            $table->unsignedInteger('amortizacija_mjeseci')->nullable();
            $table->unsignedBigInteger('id_kategorije');
            $table->unsignedBigInteger('id_statusa');
            $table->unsignedBigInteger('id_odjela')->nullable();
            $table->unsignedBigInteger('id_lokacije');
            $table->unsignedBigInteger('id_zaposlenika')->nullable();
            $table->boolean('na_revers')->default(false);
            $table->date('datum_zaduzenja')->nullable();
            $table->date('datum_razduzenja')->nullable();
            $table->timestamp('datum_popisa')->nullable();

            $table->foreign('id_kategorije')
                ->references('id_kategorije')
                ->on('kategorije_imovine')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->foreign('id_statusa')
                ->references('id_statusa')
                ->on('status_imovine')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->foreign('id_odjela')
                ->references('id_odjela')
                ->on('odjeli')
                ->nullOnDelete()
                ->onUpdate('restrict');

            $table->foreign('id_lokacije')
                ->references('id_lokacije')
                ->on('lokacije')
                ->nullOnDelete()
                ->onUpdate('restrict');

            $table->foreign('id_zaposlenika')
                ->references('id_zaposlenika')
                ->on('zaposlenici')
                ->nullOnDelete()
                ->onUpdate('restrict');

            $table->index('id_statusa');
            $table->index('id_kategorije');
            $table->index('id_odjela');
            $table->index('id_lokacije');
            $table->index('id_zaposlenika');
            $table->index('datum_popisa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imovina');
    }
};
