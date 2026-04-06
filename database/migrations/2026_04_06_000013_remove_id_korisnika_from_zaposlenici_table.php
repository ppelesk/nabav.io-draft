<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('zaposlenici', 'id_korisnika')) {
            return;
        }

        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');

            Schema::create('zaposlenici_temp', function (Blueprint $table) {
                $table->bigIncrements('id_zaposlenika');
                $table->char('oib_zaposlenika', 11)->unique();
                $table->string('ime_zaposlenika');
                $table->string('prezime_zaposlenika');
                $table->timestamps();
            });

            DB::statement(
                'INSERT INTO zaposlenici_temp (id_zaposlenika, oib_zaposlenika, ime_zaposlenika, prezime_zaposlenika, created_at, updated_at)
                 SELECT id_zaposlenika, oib_zaposlenika, ime_zaposlenika, prezime_zaposlenika, created_at, updated_at
                 FROM zaposlenici'
            );

            Schema::drop('zaposlenici');
            Schema::rename('zaposlenici_temp', 'zaposlenici');

            DB::statement('PRAGMA foreign_keys = ON');

            return;
        }

        Schema::table('zaposlenici', function (Blueprint $table) {
            $table->dropColumn('id_korisnika');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('zaposlenici', 'id_korisnika')) {
            return;
        }

        if (DB::getDriverName() === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF');

            Schema::create('zaposlenici_temp', function (Blueprint $table) {
                $table->bigIncrements('id_zaposlenika');
                $table->foreignId('id_korisnika')->nullable()->constrained('users')->nullOnDelete();
                $table->char('oib_zaposlenika', 11)->unique();
                $table->string('ime_zaposlenika');
                $table->string('prezime_zaposlenika');
                $table->timestamps();
            });

            DB::statement(
                'INSERT INTO zaposlenici_temp (id_zaposlenika, oib_zaposlenika, ime_zaposlenika, prezime_zaposlenika, created_at, updated_at)
                 SELECT id_zaposlenika, oib_zaposlenika, ime_zaposlenika, prezime_zaposlenika, created_at, updated_at
                 FROM zaposlenici'
            );

            Schema::drop('zaposlenici');
            Schema::rename('zaposlenici_temp', 'zaposlenici');

            DB::statement('PRAGMA foreign_keys = ON');

            return;
        }

        Schema::table('zaposlenici', function (Blueprint $table) {
            $table->foreignId('id_korisnika')->nullable()->constrained('users')->nullOnDelete();
        });
    }
};
