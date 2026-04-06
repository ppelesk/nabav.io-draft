<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $defaultRoleId = DB::table('uloge')
            ->where('sifra_uloge', 'korisnik')
            ->value('id_uloge');

        if ($defaultRoleId === null) {
            return;
        }

        DB::table('users')
            ->whereNull('id_uloge')
            ->update(['id_uloge' => $defaultRoleId]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op.
    }
};
