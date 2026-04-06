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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('id_uloge')->nullable()->after('id');
            $table->string('ime_korisnika', 100)->nullable()->after('id_uloge');
            $table->string('prezime_korisnika', 100)->nullable()->after('ime_korisnika');
            $table->timestamp('deactivated_at')->nullable()->after('email_verified_at');
            $table->softDeletes();

            $table->foreign('id_uloge')
                ->references('id_uloge')
                ->on('uloge')
                ->onDelete('restrict')
                ->onUpdate('restrict');
        });

        $users = DB::table('users')->select('id', 'name')->get();

        foreach ($users as $user) {
            $name = trim((string) $user->name);
            if ($name === '') {
                DB::table('users')->where('id', $user->id)->update([
                    'ime_korisnika' => 'Nepoznato',
                    'prezime_korisnika' => 'Korisnik',
                ]);
                continue;
            }

            $parts = preg_split('/\\s+/', $name) ?: [];
            $ime = $parts[0] ?? 'Nepoznato';
            $prezime = count($parts) > 1
                ? implode(' ', array_slice($parts, 1))
                : 'Korisnik';

            DB::table('users')->where('id', $user->id)->update([
                'ime_korisnika' => $ime,
                'prezime_korisnika' => $prezime,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['id_uloge']);
            $table->dropColumn([
                'id_uloge',
                'ime_korisnika',
                'prezime_korisnika',
                'deactivated_at',
                'deleted_at',
            ]);
        });
    }
};
