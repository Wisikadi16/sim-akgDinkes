<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\Tim_Ambulan;
use App\Models\RekapOrderHarian;
use Carbon\Carbon;

class HitungRekapHarian extends Command
{
    // Nama perintah saat dijalankan di terminal
    protected $signature = 'rekap:harian {--tanggal= : Tanggal spesifik format YYYY-MM-DD}';

    // Deskripsi perintah
    protected $description = 'Menghitung dan merekap total order harian semua tim ambulan';

    public function handle()
    {
        // 1. Tentukan tanggal (Default ke hari ini jika tidak ada input parameter)
        $tanggal_input = $this->option('tanggal');
        $tanggal_rekap = $tanggal_input ? Carbon::parse($tanggal_input) : Carbon::today();
        
        // Karena waktu_order di database format teksnya "dd/mm/yyyy H:i"
        $tgl_string_cari = $tanggal_rekap->format('d/m/Y'); 
        $tgl_db = $tanggal_rekap->format('Y-m-d'); // Format DATE standar untuk tabel rekap

        $this->info("Memulai rekap data order untuk tanggal: " . $tgl_string_cari);

        // 2. Tarik semua tim ambulan
        $semua_tim = Tim_Ambulan::all();
        $total_direkap = 0;

        foreach ($semua_tim as $tim) {
            // 3. Cari dan hitung order khusus HARI INI yg dimiliki ambulan tersebut
            // Cukup pakai LIKE "13/04/2026%" (Ini sangat super cepat dibanding rumus tanggal MySQL tipe lama)
            $jumlah_order = Order::where('id_tim_ambulan', $tim->id)
                                ->where('waktu_order', 'like', $tgl_string_cari . '%')
                                ->count();

            // 4. Update Jika Ada, Buat Baru Jika Belum (Anti Lengket / Anti Dobel)
            RekapOrderHarian::updateOrCreate(
                [
                    'id_tim_ambulan' => $tim->id,
                    'tanggal' => $tgl_db
                ],
                [
                    'total_order' => $jumlah_order
                ]
            );

            $total_direkap++;
        }

        $this->info("Selesai! Berhasil merekap/memperbarui data untuk {$total_direkap} Tim Ambulan.");
    }
}
