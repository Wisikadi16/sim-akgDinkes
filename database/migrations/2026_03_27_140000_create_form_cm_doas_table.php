<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_cm_doas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_form')->nullable();
            
            $table->string('nama_pasien')->nullable();
            $table->string('ttl')->nullable();
            $table->string('nik')->nullable();
            $table->text('alamat')->nullable();
            $table->string('no_telepon')->nullable();
            
            $table->string('nama_tim')->nullable();
            $table->string('petugas_dokter')->nullable();
            $table->string('petugas_perawat')->nullable();
            $table->string('petugas_bidan')->nullable();
            $table->string('petugas_driver')->nullable();

            $table->json('kondisi_kritis')->nullable();
            $table->json('jalan_napas')->nullable();
            $table->json('pernafasan')->nullable();
            $table->json('sirkulasi')->nullable();
            $table->json('eksposur')->nullable();
            $table->json('kesimpulan_awal')->nullable();
            
            $table->string('gcs_e')->nullable();
            $table->string('gcs_v')->nullable();
            $table->string('gcs_m')->nullable();
            $table->string('pupil')->nullable();
            $table->string('reflek_cahaya')->nullable();
            $table->string('lateralisasi')->nullable();
            
            $table->string('td')->nullable();
            $table->string('hr')->nullable();
            $table->string('rr')->nullable();
            $table->string('suhu')->nullable();
            $table->string('spo2')->nullable();
            $table->string('skala_nyeri')->nullable();
            $table->string('pukul')->nullable();

            $table->string('fu_td')->nullable();
            $table->string('fu_hr')->nullable();
            $table->string('fu_rr')->nullable();
            $table->string('fu_suhu')->nullable();
            $table->string('fu_spo2')->nullable();
            $table->string('fu_skala_nyeri')->nullable();
            $table->string('fu_pukul')->nullable();
            
            $table->text('keluhan_utama')->nullable();
            $table->text('riwayat_sekarang')->nullable();
            $table->text('riwayat_dahulu')->nullable();  // JSON encoded
            $table->text('riwayat_keluarga')->nullable();
            $table->text('riwayat_obat')->nullable();
            
            $table->string('kepala')->nullable();
            $table->string('leher')->nullable();
            $table->string('thorax_suara')->nullable();
            $table->string('thorax_jantung')->nullable();
            $table->string('abdomen_bising')->nullable();
            $table->string('abdomen_nyeri')->nullable();
            $table->string('ekstremitas_akral')->nullable();
            $table->string('ekstremitas_oedema')->nullable();
            $table->longText('anatomi_tubuh')->nullable();

            $table->string('ekg')->nullable();
            $table->string('gds')->nullable();
            $table->string('au')->nullable();
            $table->string('chol')->nullable();
            $table->string('hb')->nullable();
            
            $table->json('diagnosis_medis')->nullable();
            $table->json('terapi_tindakan')->nullable();
            
            $table->string('rs_rujukan')->nullable();
            $table->date('tgl_rujukan')->nullable();
            $table->time('jam_rujukan')->nullable();
            
            $table->string('nama_petugas')->nullable();
            $table->longText('ttd_petugas')->nullable();
            $table->string('nama_keluarga')->nullable();
            $table->longText('ttd_keluarga')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_cm_doas');
    }
};
