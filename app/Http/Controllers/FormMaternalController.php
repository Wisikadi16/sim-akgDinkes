<?php

namespace App\Http\Controllers;

use App\Models\Form_Maternal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class FormMaternalController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Maternal Store Payload:', $request->all());
        
        $identitas = $request->identitas_ibu; 
        $nik = $identitas['nik'] ?? null; 
        
        if (!empty($nik) && strpos($nik, 'NON-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make(['nik' => $nik], [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }

        return \DB::transaction(function () use ($request) {
            // Validasi dasar
            $validatedData = $request->validate([
                'nama_pasien' => 'nullable|string|max:255',
                'rs_tujuan' => 'nullable|string|max:255',
            ]);

            $identitas = $request->identitas_ibu; 
            $nik = $identitas['nik'] ?? null; 

            if ($nik == null || $nik == '') {
                $cari_pasien_non_nik = \App\Models\Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                if($cari_pasien_non_nik == null){
                    $nik = "NON-1";
                } else {
                    $get_nik = $cari_pasien_non_nik->nik;
                    $get_nomor = substr($get_nik, strlen("NON-"));
                    $nik = "NON-".((int)$get_nomor + 1);
                }
                $pasien = \App\Models\Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama_pasien,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                ]);
            } else {
                $pasien = \App\Models\Pasien::where('nik', $nik)->first();
                if($pasien == null){
                    $pasien = \App\Models\Pasien::create([
                        'nik' => $nik,
                        'nama' => $request->nama_pasien,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                    ]);
                }
            }

            // Simpan data semua (Laravel tahu mana yg json berkat $casts di Model)
            $maternalData = Form_Maternal::create([
                'id_pasien' => $pasien->id,
                'nama_pasien' => $request->nama_pasien,
                'tanggal_lahir' => $request->tgl_lahir,
                'alamat' => $request->alamat,
                'rs_tujuan' => $request->rumah_sakit_rujukan['rs'] ?? null,
                'petugas_rs_tujuan' => $request->rumah_sakit_rujukan['petugas'] ?? null,
                'tanggal_rujukan' => isset($request->rumah_sakit_rujukan['tgl']) ? date('Y-m-d', strtotime($request->rumah_sakit_rujukan['tgl'])) : date('Y-m-d'),
                'jam_rujukan' => $request->rumah_sakit_rujukan['jam'] ?? date('H:i'),
                'atas_permintaan' => is_array($request->atas_permintaan) ? json_encode($request->atas_permintaan) : $request->atas_permintaan,
                'petugas_pendamping' => is_array($request->petugas_pendamping) ? json_encode($request->petugas_pendamping) : $request->petugas_pendamping,
                'kondisi_saat_ini' => is_array($request->pemeriksaan_fisik) ? json_encode($request->pemeriksaan_fisik) : $request->pemeriksaan_fisik,
                'tanda_syok' => is_array($request->tanda_syok) ? json_encode($request->tanda_syok) : $request->tanda_syok,
                'alasan_dirujuk' => is_array($request->alasan_dirujuk) ? json_encode($request->alasan_dirujuk) : $request->alasan_dirujuk,
                'riwayat' => is_array($request->riwayat) ? json_encode($request->riwayat) : $request->riwayat,
                'riwayat_lain' => $request->riwayat_lain,
                'fisik' => is_array($request->fisik) ? json_encode($request->fisik) : $request->fisik,
                'lab' => is_array($request->lab) ? json_encode($request->lab) : $request->lab,
                'lain_lain' => $request->lain_lain,
                'diagnosa' => $request->diagnosa,
                'penanganan' => $request->penanganan,
                'tindakan_therapy' => $request->tindakan_therapy,
                'monitoring' => is_array($request->monitoring) ? json_encode($request->monitoring) : $request->monitoring,
                'handover' => is_array($request->handover) ? json_encode($request->handover) : $request->handover,
                'ttd_penyerah' => $request->ttd_penyerah,
                'ttd_penerima' => $request->ttd_penerima,
            ]);

            // Record ke tabel global `form` agar muncul di Catatan Medis
            $form = \App\Models\Form::create([
                'id_form' => $maternalData->id,
                'id_pembuat' => Auth::id() ?? 1,
                'id_pasien' => $pasien->id,
                'tgl_penanganan' => !empty($request->tgl_penanganan) ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d'),
                'jenis' => 'form maternal' 
            ]);

            $maternalData->update(['id_form' => $form->id]);

            return response()->json("Berhasil simpan data");
        });
    }

    public function perbarui(Request $request)
    {
        $identitas = $request->identitas_ibu ?? [];
        $nik = $identitas['nik'] ?? $request->nik;

        if (!empty($nik) && strpos($nik, 'MAT-') !== 0 && strpos($nik, 'NON-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make(['nik' => $nik], [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }

        return \DB::transaction(function () use ($request) {
            $id_form = $request->id_form ?? $request->id;
            // 1. CARI DATA LAMA (Menggunakan id_form yang dikirim dari frontend)
            $maternalData = Form_Maternal::where('id_form', $id_form)->first();
            
            // Fallback: Jika tak ketemu pakai id_form, coba pakai id utama (antisipasi data lama)
            if (!$maternalData) {
                $maternalData = Form_Maternal::find($id_form);
            }

            // Jika benar-benar tidak ada di database
            if (!$maternalData) {
                return response()->json([
                    'error' => 'Data tidak ditemukan (ID: ' . $id_form . ')', 
                ], 404);
            }

            // 2. UPDATE DATA PASIEN
            $pasien = \App\Models\Pasien::find($maternalData->id_pasien);
            if ($pasien) {
                $identitas = $request->identitas_ibu ?? [];
                $pasien->update([
                    'nik' => !empty($identitas['nik']) ? $identitas['nik'] : $pasien->nik,
                    'nama' => !empty($identitas['nama']) ? $identitas['nama'] : $pasien->nama,
                    'tgl_lahir' => !empty($identitas['tgl_lahir']) ? $identitas['tgl_lahir'] : $pasien->tgl_lahir,
                    'alamat' => !empty($identitas['alamat']) ? $identitas['alamat'] : $pasien->alamat,
                    'alamat_kelurahan' => !empty($identitas['kelurahan']) ? $identitas['kelurahan'] : $pasien->alamat_kelurahan,
                    'alamat_kecamatan' => !empty($identitas['kecamatan']) ? $identitas['kecamatan'] : $pasien->alamat_kecamatan,
                    'no_telepon' => !empty($identitas['no_telepon']) ? $identitas['no_telepon'] : $pasien->no_telepon,
                ]);
            }

            $tgl_rujukan = !empty($request->tgl_penanganan) 
                ? date('Y-m-d', strtotime($request->tgl_penanganan)) 
                : $maternalData->tanggal_rujukan;

            // 3. UPDATE DATA MATERNAL
            $maternalData->update([
                'nama_pasien' => !empty($request->nama_pasien) ? $request->nama_pasien : $maternalData->nama_pasien,
                'tanggal_lahir' => !empty($request->tgl_lahir) ? $request->tgl_lahir : $maternalData->tanggal_lahir,
                'alamat' => !empty($request->alamat) ? $request->alamat : $maternalData->alamat,
                'rs_tujuan' => $request->rumah_sakit_rujukan['rs'] ?? $maternalData->rs_tujuan,
                'petugas_rs_tujuan' => $request->rumah_sakit_rujukan['petugas'] ?? $maternalData->petugas_rs_tujuan,
                'tanggal_rujukan' => $tgl_rujukan,
                'jam_rujukan' => $request->rumah_sakit_rujukan['jam'] ?? $maternalData->jam_rujukan,
                'atas_permintaan' => is_array($request->atas_permintaan) ? json_encode($request->atas_permintaan) : $request->atas_permintaan,
                'petugas_pendamping' => is_array($request->petugas_pendamping) ? json_encode($request->petugas_pendamping) : $request->petugas_pendamping, 
                'kondisi_saat_ini' => is_array($request->pemeriksaan_fisik) ? json_encode($request->pemeriksaan_fisik) : $request->pemeriksaan_fisik,
                'tanda_syok' => is_array($request->tanda_syok) ? json_encode($request->tanda_syok) : $request->tanda_syok,
                'alasan_dirujuk' => is_array($request->alasan_dirujuk) ? json_encode($request->alasan_dirujuk) : $request->alasan_dirujuk,
                'riwayat' => is_array($request->riwayat) ? json_encode($request->riwayat) : $request->riwayat,
                'riwayat_lain' => $request->riwayat_lain,
                'fisik' => is_array($request->fisik) ? json_encode($request->fisik) : $request->fisik,
                'lab' => is_array($request->lab) ? json_encode($request->lab) : $request->lab,
                'lain_lain' => $request->lain_lain,
                'diagnosa' => $request->diagnosa,
                'penanganan' => $request->penanganan,
                'tindakan_therapy' => $request->tindakan_therapy,
                'monitoring' => is_array($request->monitoring) ? json_encode($request->monitoring) : $request->monitoring,
                'handover' => is_array($request->handover) ? json_encode($request->handover) : $request->handover,
                'ttd_penyerah' => $request->ttd_penyerah,
                'ttd_penerima' => $request->ttd_penerima,
            ]);
            // 4. UPDATE DATA FORM GLOBAL
            $formRecord = \App\Models\Form::find($maternalData->id_form);
            if ($formRecord) {
                $formRecord->update([
                    'id_pasien' => $maternalData->id_pasien,
                    'tgl_penanganan' => $tgl_rujukan, 
                ]);
            }

            return response()->json("Berhasil perbarui data");
        });
    }

    public function ref_form_maternal(Request $request){
        if($request->id_form==null){
            $data = Form_Maternal::get();
        }
        else{
            $data = Form_Maternal::with('pasien')->with('form')->where('id_form', $request->id_form)->first();
            
            // Fallback pencarian by primary ID (antisipasi data lama)
            if(!$data){
                $data = Form_Maternal::with('pasien')->with('form')->find($request->id_form);
            }
        }
        
        return response()->json($data);
    }

    public function edit($id){
        return \Inertia\Inertia::render('Dashboard/Index', [
            'id' => $id,
            'auth' => Auth::user(),
        ]);
    }

    public function print($id)
    {
        $data = Form_Maternal::findOrFail($id);
        
        // Return view print nanti, sementara kita return json untuk test
        return response()->json($data);
    }
}