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
        Schema::table('surat_keterangan_kematian', function (Blueprint $table) {
            $table->string('id_form')->nullable()->after('id');
            $table->string('id_pasien')->nullable()->after('id_form');
        });

        Schema::table('surat_persetujuan_tindakan_medis', function (Blueprint $table) {
            $table->string('id_form')->nullable()->after('id');
            $table->string('id_pasien')->nullable()->after('id_form');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('surat_keterangan_kematian', function (Blueprint $table) {
            $table->dropColumn(['id_form', 'id_pasien']);
        });

        Schema::table('surat_persetujuan_tindakan_medis', function (Blueprint $table) {
            $table->dropColumn(['id_form', 'id_pasien']);
        });
    }
};
