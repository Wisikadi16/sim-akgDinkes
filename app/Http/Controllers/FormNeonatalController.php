<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Pasien;
use App\Models\Form;
use App\Models\Form_Neonatal;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;
use Illuminate\Support\Facades\DB;

class FormNeonatalController extends Controller
{
    public function ref_form_neonatal(Request $request){
        $id = $request->id_form ?? $request->id;
        if($id == null){
            $data = Form_Neonatal::get();
        }
        else{
            $data = Form_Neonatal::with('pasien')->with('form')->where('id_form', $id)->first();
            if (!$data) {
                // Fallback pencarian by primary ID (antisipasi data lama)
                $data = Form_Neonatal::with('pasien')->with('form')->find($id);
            }
        }
        
        return response()->json($data);
    }

    public function edit($id){
        return Inertia::render('Dashboard/Index', [
            'id' => $id,
            'auth' => Auth::user(),
        ]);
    }

    public function simpan(Request $request)
    {
        \Log::info('FormNeonatalController@simpan hit', ['payload' => $request->all()]);
        
        if (!empty($request->nik) && strpos($request->nik, 'NEO-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }
        try {

            return DB::transaction(function () use ($request) {
                $nik = $request->nik;
                if ($nik === null || $nik === '') {
                    $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NEO%')->orderByDesc('id')->first();
                    if ($cari_pasien_non_nik == null) {
                        $nik = "NEO-1";
                    } else {
                        $get_nik = $cari_pasien_non_nik->nik;
                        $get_nomor = substr($get_nik, strlen("NEO-"));
                        $nik = "NEO-" . ((int)$get_nomor + 1);
                    }
                    $pasienData = [
                        'nik' => $nik,
                        'nama' => $request->nama_bayi,
                        'jenis_kelamin' => $request->jenis_kelamin,
                        'tgl_lahir' => $request->tgl_lahir_bayi,
                        'no_telepon' => $request->no_telepon,
                    ];
                    if ($request->alamat_ayah != null) {
                        $pasienData['alamat'] = $request->alamat_ayah;
                        $pasienData['alamat_kelurahan'] = $request->kelurahan_ayah;
                        $pasienData['alamat_kecamatan'] = $request->kecamatan_ayah;
                    } elseif ($request->alamat_ibu != null) {
                        $pasienData['alamat'] = $request->alamat_ibu;
                        $pasienData['alamat_kelurahan'] = $request->kelurahan_ibu;
                        $pasienData['alamat_kecamatan'] = $request->kecamatan_ibu;
                    }
                    $pasien = Pasien::create($pasienData);
                } else {
                    $pasien = Pasien::where('nik', $request->nik)->first();
                    $pasienData = [
                        'nik' => $request->nik,
                        'nama' => $request->nama_bayi,
                        'jenis_kelamin' => $request->jenis_kelamin,
                        'tgl_lahir' => $request->tgl_lahir_bayi,
                        'no_telepon' => $request->no_telepon,
                    ];
                    if ($request->alamat_ayah != null) {
                        $pasienData['alamat'] = $request->alamat_ayah;
                        $pasienData['alamat_kelurahan'] = $request->kelurahan_ayah;
                        $pasienData['alamat_kecamatan'] = $request->kecamatan_ayah;
                    } elseif ($request->alamat_ibu != null) {
                        $pasienData['alamat'] = $request->alamat_ibu;
                        $pasienData['alamat_kelurahan'] = $request->kelurahan_ibu;
                        $pasienData['alamat_kecamatan'] = $request->kecamatan_ibu;
                    }

                    if ($pasien == null) {
                        $pasien = Pasien::create($pasienData);
                    } else {
                        $pasien->update($pasienData);
                    }
                }

                $pemeriksaan_fisik_data = [];
                if ($request->pemeriksaan_fisik && is_array($request->pemeriksaan_fisik)) {
                    foreach ($request->pemeriksaan_fisik as $ind => $val) {
                        $pemeriksaan_fisik_data[$ind] = is_array($val) ? json_encode($val) : $val;
                    }
                }

                $form_neonatal = Form_Neonatal::create([
                    'id_pasien' => $pasien->id,
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d'),

                    //identitas tim ambulance
                    'ita_tim' => $request->ita_tim,
                    'ita_dokter' => $request->ita_dokter,
                    'ita_perawat' => $request->ita_perawat,
                    'ita_bidan' => $request->ita_bidan,
                    'ita_driver' => $request->ita_driver,
                    //identitas ibu
                    'nama_ibu' => $request->nama_ibu,
                    'usia_ibu' => $request->usia_ibu,
                    'pekerjaan_ibu' => $request->pekerjaan_ibu,
                    'goldar_ibu' => $request->goldar_ibu,
                    'no_telepon_ibu' => $request->no_telepon_ibu,
                    'alamat_ibu' => $request->alamat_ibu,
                    'kecamatan_ibu' => $request->kecamatan_ibu,
                    'kelurahan_ibu' => $request->kelurahan_ibu,
                    //identitas ayah
                    'nama_ayah' => $request->nama_ayah,
                    'usia_ayah' => $request->usia_ayah,
                    'pekerjaan_ayah' => $request->pekerjaan_ayah,
                    'goldar_ayah' => $request->goldar_ayah,
                    'no_telepon_ayah' => $request->no_telepon_ayah,
                    'alamat_ayah' => $request->alamat_ayah,
                    'kecamatan_ayah' => $request->kecamatan_ayah,
                    'kelurahan_ayah' => $request->kelurahan_ayah,
                    //riwayat kehamilan dan persalinan
                    'usia_gestasi' => $request->usia_gestasi,
                    'anc' => $request->anc,
                    'riwayat_penyakit_kehamilan' => $request->riwayat_penyakit_kehamilan,
                    'penolong_persalinan' => $request->penolong_persalinan,
                    'cara_persalinan' => $request->cara_persalinan,
                    'apgar_score_status' => $request->apgar_score_status,
                    'apgar_score' => $request->apgar_score,
                    'anamnesis' => $request->anamnesis,
                    // Di dalam Form_Neonatal::create atau update:
                    'jam_lahir' => $request->jam_lahir,
                    //pemeriksaan fisik
                    ...$pemeriksaan_fisik_data,
                    'pemeriksaan_penunjang' => $request->pemeriksaan_penunjang,
                    'diagnosis_medis' => json_encode($request->diagnosis_medis),
                    'terapi_tindakan_konsul' => json_encode($request->terapi_tindakan_konsul),
                    'lain_lain' => $request->lain_lain,
                    'rsr_faskes' => $request->rsr_faskes,
                    'rsr_tgl' => $request->rsr_tgl,
                    'rsr_jam' => $request->rsr_jam,
                    'rsr_alasan_rujuk' => $request->rsr_alasan_rujuk,
                    // ttd petugas ambulance hebat
                    'nama_ttd_petugas_ambulance_hebat' => $request->nama_ttd_petugas_ambulance_hebat,
                    'ttd_petugas_ambulance_hebat' => $request->ttd_petugas_ambulance_hebat,
                    'status_ttd_petugas_rs_keluarga_pasien' => $request->status_ttd_petugas_rs_keluarga_pasien,
                    'nama_ttd_petugas_rs_keluarga_pasien' => $request->nama_ttd_petugas_rs_keluarga_pasien,
                    'ttd_petugas_rs_keluarga_pasien' => $request->ttd_petugas_rs_keluarga_pasien,
                ]);

                $form = Form::create([
                    'id_pembuat' => Auth::id() ?? 1,
                    'id_tim_ambulan' => $request->ita_id_tim,
                    'id_form' => $form_neonatal->id,
                    'id_pasien' => $pasien->id,
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d'),
                    'jenis' => 'form neonatal'
                ]);

                $form_neonatal->update([
                    "id_form" => $form->id,
                ]);

                return response()->json("Berhasil simpan data");
            });
        } catch (\Exception $e) {
            \Log::error('Error pada Controller: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan data. Mohon cek kembali input Anda.'
            ], 500);
        }
    }

    public function perbarui(Request $request)
    {
        \Log::info('FormNeonatalController@perbarui hit', ['payload' => $request->all()]);
        
        if (!empty($request->nik) && strpos($request->nik, 'NEO-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }

        return DB::transaction(function () use ($request) {
            $form_neonatal = Form_Neonatal::with('pasien')->where('id_form', $request->id_form)->first();
            if (!$form_neonatal) {
                $form_neonatal = Form_Neonatal::with('pasien')->find($request->id_form);
            }

            if (!$form_neonatal) {
                return response()->json("Data tidak ditemukan", 404);
            }

            $pasienData = [
                'nik' => $request->nik,
                'nama' => $request->nama_bayi,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tgl_lahir' => $request->tgl_lahir_bayi,
                'no_telepon' => $request->no_telepon,
            ];
            if ($request->alamat_ayah != null) {
                $pasienData['alamat'] = $request->alamat_ayah;
                $pasienData['alamat_kelurahan'] = $request->kelurahan_ayah;
                $pasienData['alamat_kecamatan'] = $request->kecamatan_ayah;
            } elseif ($request->alamat_ibu != null) {
                $pasienData['alamat'] = $request->alamat_ibu;
                $pasienData['alamat_kelurahan'] = $request->kelurahan_ibu;
                $pasienData['alamat_kecamatan'] = $request->kecamatan_ibu;
            }
            if ($form_neonatal->pasien) {
                $form_neonatal->pasien->update($pasienData);
            }

            $pemeriksaan_fisik_data = [];
            if ($request->pemeriksaan_fisik && is_array($request->pemeriksaan_fisik)) {
                foreach ($request->pemeriksaan_fisik as $ind => $val) {
                    $pemeriksaan_fisik_data[$ind] = is_array($val) ? json_encode($val) : $val;
                }
            }

            $form_neonatal->update([
                'tgl_penanganan' => $request->tgl_penanganan ?? $request->tgl_lahir_bayi ?? date('Y-m-d'),
                'jam_lahir' => $request->jam_lahir,

                //identitas tim ambulance
                'ita_tim' => $request->ita_tim,
                'ita_dokter' => $request->ita_dokter,
                'ita_perawat' => $request->ita_perawat,
                'ita_bidan' => $request->ita_bidan,
                'ita_driver' => $request->ita_driver,
                //identitas ibu
                'nama_ibu' => $request->nama_ibu,
                'usia_ibu' => $request->usia_ibu,
                'pekerjaan_ibu' => $request->pekerjaan_ibu,
                'goldar_ibu' => $request->goldar_ibu,
                'no_telepon_ibu' => $request->no_telepon_ibu,
                'alamat_ibu' => $request->alamat_ibu,
                'kecamatan_ibu' => $request->kecamatan_ibu,
                'kelurahan_ibu' => $request->kelurahan_ibu,
                //identitas ayah
                'nama_ayah' => $request->nama_ayah,
                'usia_ayah' => $request->usia_ayah,
                'pekerjaan_ayah' => $request->pekerjaan_ayah,
                'goldar_ayah' => $request->goldar_ayah,
                'no_telepon_ayah' => $request->no_telepon_ayah,
                'alamat_ayah' => $request->alamat_ayah,
                'kecamatan_ayah' => $request->kecamatan_ayah,
                'kelurahan_ayah' => $request->kelurahan_ayah,
                //riwayat kehamilan dan persalinan
                'usia_gestasi' => $request->usia_gestasi,
                'anc' => $request->anc,
                'riwayat_penyakit_kehamilan' => $request->riwayat_penyakit_kehamilan,
                'penolong_persalinan' => $request->penolong_persalinan,
                'cara_persalinan' => $request->cara_persalinan,
                'apgar_score_status' => $request->apgar_score_status,
                'apgar_score' => $request->apgar_score,
                'anamnesis' => $request->anamnesis,
                //pemeriksaan fisik
                ...$pemeriksaan_fisik_data,

                'pemeriksaan_penunjang' => $request->pemeriksaan_penunjang,
                'diagnosis_medis' => json_encode($request->diagnosis_medis),
                'terapi_tindakan_konsul' => json_encode($request->terapi_tindakan_konsul),
                'lain_lain' => $request->lain_lain,

                'rsr_faskes' => $request->rsr_faskes,
                'rsr_tgl' => $request->rsr_tgl,
                'rsr_jam' => $request->rsr_jam,
                'rsr_alasan_rujuk' => $request->rsr_alasan_rujuk,

                // ttd petugas ambulance hebat
                'nama_ttd_petugas_ambulance_hebat' => $request->nama_ttd_petugas_ambulance_hebat,
                'ttd_petugas_ambulance_hebat' => $request->ttd_petugas_ambulance_hebat,

                'status_ttd_petugas_rs_keluarga_pasien' => $request->status_ttd_petugas_rs_keluarga_pasien,
                'nama_ttd_petugas_rs_keluarga_pasien' => $request->nama_ttd_petugas_rs_keluarga_pasien,
                'ttd_petugas_rs_keluarga_pasien' => $request->ttd_petugas_rs_keluarga_pasien,
            ]);

            // Update master form
            $formMaster = Form::find($form_neonatal->id_form);
            if ($formMaster) {
                $formMaster->update([
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : $formMaster->tgl_penanganan,
                    'id_tim_ambulan' => $request->ita_id_tim ?? $formMaster->id_tim_ambulan,
                ]);
            }

            return response()->json("Berhasil perbarui data");
        });
    }
}
