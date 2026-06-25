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
        Schema::create('form_lembar_transfer_pasiens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_form')->nullable();

            $table->string('nama_pasien')->nullable();
            $table->string('ttl')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('nik')->nullable();
            $table->string('jenis_asuransi')->nullable();
            $table->text('alamat_rumah')->nullable();
            $table->string('nama_pendamping')->nullable();
            
            // Log Masuk & Medis Dasar
            $table->date('tgl_masuk_rs')->nullable();
            $table->time('jam_masuk_rs')->nullable();
            $table->text('anamnesa')->nullable();
            $table->text('riwayat_penyakit')->nullable();
            $table->text('diagnosa')->nullable();
            $table->text('tindakan_dilakukan')->nullable();
            $table->text('terapi_diberikan')->nullable();
            
            // Ringkasan Kondisi & Status
            $table->json('ringkasan_kondisi')->nullable(); // Simpan tabel Tensi, HR, dll
            $table->text('status_sblm')->nullable();
            $table->text('status_selama')->nullable();
            $table->text('status_stlh')->nullable();
            
            // Info Petugas & Proses Transfer
            $table->string('nama_petugas_pendamping')->nullable();
            $table->string('tipe_petugas')->nullable(); 
            $table->string('rs_tujuan')->nullable();
            $table->date('tgl_serah_terima')->nullable();
            $table->time('jam_serah_terima')->nullable();
            
            // Nama & Tanda Tangan
            $table->string('nama_menyerahkan')->nullable();
            $table->longText('ttd_menyerahkan')->nullable();
            $table->string('nama_menerima')->nullable();
            $table->longText('ttd_menerima')->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_lembar_transfer_pasiens');
    }
};
