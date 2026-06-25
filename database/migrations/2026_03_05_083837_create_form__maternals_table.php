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
        Schema::create('form__maternals', function (Blueprint $table) {
            $table->id();
            
            $table->string('nama_pasien')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->text('alamat')->nullable();

            // Info Rujukan
            $table->string('rs_tujuan')->nullable();
            $table->string('petugas_rs_tujuan')->nullable();
            $table->date('tanggal_rujukan')->nullable();
            $table->time('jam_rujukan')->nullable();
            
            // Data array/multiple choice diset sebagai JSON
            $table->json('atas_permintaan')->nullable(); 
            $table->json('petugas_pendamping')->nullable(); 
            $table->json('kondisi_saat_ini')->nullable(); 
            $table->json('tanda_syok')->nullable(); 
            $table->json('alasan_dirujuk')->nullable(); 
            $table->json('riwayat')->nullable(); 
            $table->text('riwayat_lain')->nullable(); 
            $table->json('fisik')->nullable(); 
            $table->json('lab')->nullable(); 
            $table->text('lain_lain')->nullable();
            
            // Kesimpulan
            $table->text('diagnosa')->nullable();
            $table->text('penanganan')->nullable();
            $table->text('tindakan_therapy')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form__maternals');
    }
};
