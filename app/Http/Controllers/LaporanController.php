<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\OperasionalExport;

class LaporanController extends Controller
{
    public function ref_laporan(Request $request) {
        // SAFE MODE: Kita hapus 'catatan_medis' dari sini sementara
        $query = Order::with(['tim_ambulan', 'ref_kecamatan', 'ref_kelurahan']);
        
        // Filter Tanggal
        if ($request->filled('dari_tanggal') && $request->filled('sampai_tanggal')) {
            // Karena waktu_order tersimpan sebagai string teks "DD/MM/YYYY HH:mm" di database, kita ubah ke format date saat query
            $query->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y') >= ?", [$request->dari_tanggal])
                  ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y') <= ?", [$request->sampai_tanggal]);
        }

        // Filter Jenis Kasus
        if ($request->filled('kasus') && $request->kasus != '-' && $request->kasus != 'semua' && $request->kasus != 'Semua Kasus') {
            $query->where('kasus', $request->kasus);
        }

        // Filter Media Akses
        if ($request->filled('media_akses') && $request->media_akses != '-' && $request->media_akses != 'semua') {
            if ($request->media_akses == 'Whatsapp') {
                $query->where(function($q) {
                    $q->where('cara_order', 'LIKE', '%WA%')
                      ->orWhere('cara_order', 'LIKE', '%Whatsapp%');
                });
            } else if ($request->media_akses == 'Aplikasi') {
                $query->where(function($q) {
                    $q->where('cara_order', 'NOT LIKE', '%112%')
                      ->where('cara_order', 'NOT LIKE', '%WA%')
                      ->where('cara_order', 'NOT LIKE', '%Whatsapp%');
                });
            } else {
                $query->where('cara_order', 'LIKE', '%' . $request->media_akses . '%');
            }
        }
        
        // Tambahkan urutan dari yang terbaru
        $query->orderBy('id', 'DESC');
        
        $table_data = $query->get()->map(function($order) {
            $diagnosa = $order->kasus;
            $tindakan = '-';
            $faskes_rujukan = '-';

            // Hubungkan dengan Rekam Medis (Form) berdasarkan NIK dan Tanggal Order
            $nik = !empty($order->nik_pasien) ? $order->nik_pasien : $order->rm;
            
            if (!empty($nik) && !empty($order->waktu_order)) {
                $pasien = \App\Models\Pasien::where('nik', $nik)->first();
                
                if ($pasien) {
                    $tanggalOrderParts = explode(' ', $order->waktu_order);
                    if (count($tanggalOrderParts) > 0) {
                        $dateParts = explode('/', $tanggalOrderParts[0]);
                        if (count($dateParts) == 3) {
                            $tglPenanganan = $dateParts[2] . '-' . $dateParts[1] . '-' . $dateParts[0]; // YYYY-MM-DD

                            // Cari form induk pada tanggal penanganan tersebut
                            $form = \App\Models\Form::where('id_pasien', $pasien->id)
                                        ->where('tgl_penanganan', $tglPenanganan)
                                        ->orderBy('id', 'DESC')
                                        ->first();
                            
                            if ($form && !empty($form->id_form)) {
                                $formUmum = \App\Models\Form_Umum::find($form->id_form);
                                if ($formUmum) {
                                    // Diagnosa
                                    if (!empty($formUmum->diagnosis_medis)) {
                                        $diagnosaArr = json_decode($formUmum->diagnosis_medis, true);
                                        if (is_array($diagnosaArr)) {
                                            $diagnosa = implode(', ', array_filter($diagnosaArr)) ?: $order->kasus;
                                        } else {
                                            $diagnosa = $formUmum->diagnosis_medis;
                                        }
                                    }

                                    // Tindakan
                                    if (!empty($formUmum->terapi_tindakan_konsul)) {
                                        $tindakanArr = json_decode($formUmum->terapi_tindakan_konsul, true);
                                        if (is_array($tindakanArr)) {
                                            $tindakan = implode(', ', array_filter($tindakanArr)) ?: '-';
                                        } else {
                                            $tindakan = $formUmum->terapi_tindakan_konsul;
                                        }
                                    }
                                    
                                    // Faskes Rujukan
                                    $faskes_rujukan = $formUmum->rsr_rs ?: '-';
                                }
                            }
                        }
                    }
                }
            }

            $order->diagnosa = $diagnosa ?: $order->kasus; 
            $order->tindakan = $tindakan ?: '-';
            $order->faskes_rujukan = $faskes_rujukan ?: '-';
            return $order;
        });

        $kpi = [
            'total_panggilan' => $table_data->count(),
            'jenis_pelayanan' => $table_data->groupBy('cara_order')->map->count(),
            'kategori_kasus'  => $table_data->groupBy('kasus')->map->count()
        ];
        
        return response()->json([
            'kpi' => $kpi,
            'table_data' => $table_data
        ]);
    }

    public function export_operasional_excel(Request $request) {
        $query = Order::with(['tim_ambulan', 'ref_kecamatan', 'ref_kelurahan', 'user']);
        
        // Filter Tanggal
        if ($request->filled('dari_tanggal') && $request->filled('sampai_tanggal')) {
            $query->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y') >= ?", [$request->dari_tanggal])
                  ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y') <= ?", [$request->sampai_tanggal]);
        }

        // Filter Jenis Kasus
        if ($request->filled('kasus') && $request->kasus != '-' && $request->kasus != 'semua' && $request->kasus != 'Semua Kasus') {
            $query->where('kasus', $request->kasus);
        }

        // Filter Media Akses
        if ($request->filled('media_akses') && $request->media_akses != '-' && $request->media_akses != 'semua') {
            if ($request->media_akses == 'Whatsapp') {
                $query->where(function($q) {
                    $q->where('cara_order', 'LIKE', '%WA%')
                      ->orWhere('cara_order', 'LIKE', '%Whatsapp%');
                });
            } else if ($request->media_akses == 'Aplikasi') {
                $query->where(function($q) {
                    $q->where('cara_order', 'NOT LIKE', '%112%')
                      ->where('cara_order', 'NOT LIKE', '%WA%')
                      ->where('cara_order', 'NOT LIKE', '%Whatsapp%');
                });
            } else {
                $query->where('cara_order', 'LIKE', '%' . $request->media_akses . '%');
            }
        }
        
        $query->orderBy('id', 'DESC');
        $data = $query->get();

        return Excel::download(new OperasionalExport($data, $request->dari_tanggal, $request->sampai_tanggal), 'Laporan_Operasional_SIMAKG.xlsx');
    }
}