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
        if (Schema::hasColumn('audit_log', 'id_statusa_loga')) {
            Schema::table('audit_log', function (Blueprint $table) {
                $table->dropForeign(['id_statusa_loga']);
            });

            Schema::table('audit_log', function (Blueprint $table) {
                $table->dropColumn('id_statusa_loga');
            });
        }

        if (Schema::hasColumn('audit_log', 'ip_adresa')) {
            Schema::table('audit_log', function (Blueprint $table) {
                $table->dropColumn('ip_adresa');
            });
        }

        Schema::dropIfExists('statusi_loga');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('statusi_loga')) {
            Schema::create('statusi_loga', function (Blueprint $table) {
                $table->bigIncrements('id_statusa_loga');
                $table->string('sifra_statusa', 40)->unique();
                $table->string('naziv_statusa', 100);
                $table->timestamps();
            });
        }

        Schema::table('audit_log', function (Blueprint $table) {
            if (! Schema::hasColumn('audit_log', 'id_statusa_loga')) {
                $table->unsignedBigInteger('id_statusa_loga')->nullable()->after('id_funkcije');
            }

            if (! Schema::hasColumn('audit_log', 'ip_adresa')) {
                $table->string('ip_adresa', 45)->nullable()->after('ruta');
            }
        });

        Schema::table('audit_log', function (Blueprint $table) {
            if (Schema::hasColumn('audit_log', 'id_statusa_loga')) {
                $table->foreign('id_statusa_loga')
                    ->references('id_statusa_loga')
                    ->on('statusi_loga')
                    ->onDelete('restrict')
                    ->onUpdate('restrict');
            }
        });
    }
};
