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
        // Fix both invalid timestamp defaults in one statement
        DB::statement("ALTER TABLE `order` 
            MODIFY `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            MODIFY `updated_at` TIMESTAMP NULL DEFAULT NULL");

        Schema::table('order', function (Blueprint $table) {
            $table->string('rm')->nullable()->after('nama_pasien');
            $table->string('jenis_layanan')->nullable()->after('rm');
            $table->text('riwayat_alergi')->nullable()->after('jenis_layanan');
            $table->text('keterangan_lain')->nullable()->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order', function (Blueprint $table) {
            $table->dropColumn(['rm', 'jenis_layanan', 'riwayat_alergi', 'keterangan_lain']);
        });
    }
};
