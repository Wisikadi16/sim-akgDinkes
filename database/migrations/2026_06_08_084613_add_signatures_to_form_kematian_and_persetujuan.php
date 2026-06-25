<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('form_surat_keterangan_kematian', function (Blueprint $table) {
            $table->longText('ttd_dokter')->nullable()->after('nama_ttd_dokter');
        });

        Schema::table('form_surat_persetujuan_tindakan_medis', function (Blueprint $table) {
            $table->longText('ttd_yang_membuat_pernyataan')->nullable()->after('nama_saksi');
            $table->longText('ttd_saksi')->nullable()->after('ttd_yang_membuat_pernyataan');
            $table->longText('ttd_dokter_paramedis')->nullable()->after('nama_dokter_paramedis');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('form_surat_keterangan_kematian', function (Blueprint $table) {
            $table->dropColumn('ttd_dokter');
        });

        Schema::table('form_surat_persetujuan_tindakan_medis', function (Blueprint $table) {
            $table->dropColumn(['ttd_yang_membuat_pernyataan', 'ttd_saksi', 'ttd_dokter_paramedis']);
        });
    }
};
