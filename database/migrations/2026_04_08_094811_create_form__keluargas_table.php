<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::create('form_keluargas', function (Blueprint $table) {
            $table->id();
            
            // Kolom Data Keluarga (Identitas Dasar)
            $table->string('fasilitas_yankes')->nullable();
            $table->string('no_register')->nullable();
            $table->string('nama_perawat')->nullable();
            $table->date('tanggal_pengkajian')->nullable();
            $table->string('nama_kk')->nullable();
            $table->string('alamat_telp')->nullable();
            $table->string('agama_suku')->nullable();
            $table->string('bahasa')->nullable();
            $table->string('jarak_yankes')->nullable();
            $table->string('alat_transportasi')->nullable();

            // Kolom JSON untuk nyimpen array tabel yang panjang-panjang tadi
            $table->json('anggota_keluarga')->nullable();
            $table->json('sanitasi')->nullable();
            $table->json('phbs')->nullable();
            $table->json('tugas_kesehatan')->nullable();
            $table->json('kemandirian')->nullable();
            $table->json('individu_sakit')->nullable();
            $table->json('asuhan_keperawatan')->nullable();
            $table->json('register_perkesmas')->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_keluargas');
    }
};
