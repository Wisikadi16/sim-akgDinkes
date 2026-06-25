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
        Schema::table('form_umum', function (Blueprint $table) {
            $table->longText('ttd_keluarga_pasien_petugas_rs')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_umum', function (Blueprint $table) {
            $table->string('ttd_keluarga_pasien_petugas_rs', 255)->nullable()->change();
        });
    }
};
