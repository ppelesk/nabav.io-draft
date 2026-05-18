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
        Schema::create('lokacije', function (Blueprint $table) {
            $table->bigIncrements('id_lokacije');
            $table->unsignedBigInteger('id_zgrade');
            $table->string('oznaka_sobe', 20);
            $table->string('naziv_sobe', 100)->nullable();
            $table->timestamps();

            $table->foreign('id_zgrade')
                ->references('id_zgrade')
                ->on('zgrade')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lokacije');
    }
};
