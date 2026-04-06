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
        $lokacije = DB::table('lokacije')
            ->select('id_lokacije', 'oznaka_sobe')
            ->get();

        foreach ($lokacije as $lokacija) {
            if ($lokacija->oznaka_sobe !== null && $lokacija->oznaka_sobe !== '') {
                continue;
            }

            DB::table('lokacije')
                ->where('id_lokacije', $lokacija->id_lokacije)
                ->update([
                    'oznaka_sobe' => (string) $lokacija->id_lokacije,
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: generated room labels should remain stable once assigned.
    }
};
