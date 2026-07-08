<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

use App\Models\User;
use App\Models\Order;
use App\Models\Tim_Ambulan;
use DateTime;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboard(Request $req, $id = null)
    {
        // dd("dash");
        return Inertia::render('Dashboard/Index', [
            // 'role' => Auth::user()->role,
            'auth' => Auth::user(),
            'id' => $id,
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return Redirect::route('auth.login');
    }

        public function ref_dashboard(Request $request)
    {
        if ($request->order) {
            $dateString = $request->tgl ?? date('Y-m-d');
            $dateObject = new \DateTime($dateString);
            $tahun = $dateObject->format('Y');
            $bulan_ini = $dateObject->format('m');
            $hari_ini = $dateObject->format('d');

            // Format pencarian waktu untuk "Live" HARI INI saja (contoh: "13/04/2026")
            $tgl_live_cari = $dateObject->format('d/m/Y'); 

            $semua_tim = \App\Models\Tim_Ambulan::all();

            // 1. AMBIL SEMUA DATA SEKALIGUS (Biar nggak query berulang-ulang di dalam loop)
            // Ambil semua order Live hari ini
            $semua_order_hari_ini = \App\Models\Order::where('waktu_order', 'like', $tgl_live_cari . '%')->get();
            $total_hari_ini = $semua_order_hari_ini->count();

            // Ambil Rekap untuk perhitungan Bulan & Tahun
            $total_rekap_bulan_ini = \App\Models\RekapOrderHarian::whereYear('tanggal', $tahun)
                                        ->whereMonth('tanggal', $bulan_ini)
                                        ->where('tanggal', '<', $dateObject->format('Y-m-d'))
                                        ->sum('total_order');
                                        
            $total_rekap_tahun_ini = \App\Models\RekapOrderHarian::whereYear('tanggal', $tahun)
                                        ->where('tanggal', '<', $dateObject->format('Y-m-d'))
                                        ->sum('total_order');

            // --- A. DATA KPI (Untuk 4 Kotak di Atas) ---
            $kpi = [
                'total_armada' => $semua_tim->count(),
                'total_hari_ini' => $total_hari_ini,
                'total_bulan_ini' => $total_rekap_bulan_ini + $total_hari_ini,
                'total_tahun_ini' => $total_rekap_tahun_ini + $total_hari_ini,
            ];

            // --- B. DATA GRAFIK REAL-TIME HARI INI (Per 3 Jam) ---
            $labels_jam = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
            $datasets_grafik = [];
            $rincian_tim = [];

            foreach ($semua_tim as $tim) {
                // Filter order khusus untuk tim ini dari data yang sudah diambil di atas
                $order_tim = $semua_order_hari_ini->where('id_tim_ambulan', $tim->id);
                $total_tim_hari_ini = $order_tim->count();

                // Hitung sebaran jam
                $data_per_jam = array_fill(0, 8, 0); 
                foreach ($order_tim as $ord) {
                    $parts = explode(' ', $ord->waktu_order); // Misal: "13/04/2026 14:30:00"
                    if (count($parts) > 1) {
                        $jam = (int) substr($parts[1], 0, 2); // Ambil angka "14"
                        if ($jam >= 0 && $jam < 3) $data_per_jam[0]++;
                        elseif ($jam >= 3 && $jam < 6) $data_per_jam[1]++;
                        elseif ($jam >= 6 && $jam < 9) $data_per_jam[2]++;
                        elseif ($jam >= 9 && $jam < 12) $data_per_jam[3]++;
                        elseif ($jam >= 12 && $jam < 15) $data_per_jam[4]++;
                        elseif ($jam >= 15 && $jam < 18) $data_per_jam[5]++;
                        elseif ($jam >= 18 && $jam < 21) $data_per_jam[6]++;
                        elseif ($jam >= 21) $data_per_jam[7]++;
                    }
                }

                $datasets_grafik[] = [
                    'label' => $tim->nama_tim,
                    'data' => $data_per_jam,
                    'fill' => true,
                    'tension' => 0.4
                ];

                // C. RINCIAN PER TIM (Untuk Tabel Bawah)
                $rincian_tim[] = [
                    'nama_tim' => $tim->nama_tim,
                    'hari_ini' => $total_tim_hari_ini,
                    'bulan_ini' => \App\Models\RekapOrderHarian::where('id_tim_ambulan', $tim->id)->whereYear('tanggal', $tahun)->whereMonth('tanggal', $bulan_ini)->where('tanggal', '<', $dateObject->format('Y-m-d'))->sum('total_order') + $total_tim_hari_ini,
                    'tahun_ini' => \App\Models\RekapOrderHarian::where('id_tim_ambulan', $tim->id)->whereYear('tanggal', $tahun)->where('tanggal', '<', $dateObject->format('Y-m-d'))->sum('total_order') + $total_tim_hari_ini,
                ];
            }

            // --- D. TABEL REKAP HISTORI (7 Hari Terakhir) ---
            $tabel_rekap_histori = [];
            for ($i = 1; $i <= 7; $i++) {
                // Mundur 1-7 hari ke belakang
                $tgl_mundur = \Carbon\Carbon::parse($dateObject->format('Y-m-d'))->subDays($i);
                
                $total_rekap = \App\Models\RekapOrderHarian::where('tanggal', $tgl_mundur->format('Y-m-d'))->sum('total_order');
                
                $tabel_rekap_histori[] = [
                    'tanggal' => $tgl_mundur->translatedFormat('d M Y'),
                    'total_order' => $total_rekap,
                ];
            }

            // KEMBALIKAN DALAM BENTUK JSON YANG SUDAH MATANG
            return response()->json([
                'kpi' => $kpi,
                'grafik_hari_ini' => [
                    'labels' => $labels_jam,
                    'datasets' => $datasets_grafik
                ],
                'tabel_rekap_histori' => $tabel_rekap_histori,
                'rincian_tim' => $rincian_tim
            ]);
        }
        
        return response()->json([]);
    }
}