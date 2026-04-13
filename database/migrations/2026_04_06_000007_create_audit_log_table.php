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
        Schema::create('funkcije', function (Blueprint $table) {
            $table->bigIncrements('id_funkcije');
            $table->string('sifra_funkcije', 120)->unique();
            $table->string('naziv_funkcije', 200);
            $table->timestamps();
        });

        Schema::create('audit_log', function (Blueprint $table) {
            $table->bigIncrements('id_loga');
            $table->unsignedBigInteger('id_funkcije');
            $table->foreignId('id_korisnika')->nullable()->constrained('users')->nullOnDelete();
            $table->string('metoda', 10)->nullable();
            $table->string('ruta', 255)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('detalji')->nullable();
            $table->timestamp('vrijeme_dogadaja')->useCurrent();

            $table->foreign('id_funkcije')
                ->references('id_funkcije')
                ->on('funkcije')
                ->onDelete('restrict')
                ->onUpdate('restrict');

            $table->index(['id_korisnika', 'vrijeme_dogadaja']);
            $table->index(['id_funkcije', 'vrijeme_dogadaja']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_log');
        Schema::dropIfExists('funkcije');
    }
};
