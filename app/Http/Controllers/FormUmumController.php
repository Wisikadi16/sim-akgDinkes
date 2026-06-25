<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

use App\Models\Pasien;
use App\Models\Form;
use App\Models\Form_Umum;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;

class FormUmumController extends Controller
{
    public function ref_form_umum(Request $request){
        $id = $request->id_form ?? $request->id;
        if($id == null){
            $data = null;
        }
        else{
            $data = Form_Umum::with('pasien')->with('form')->where('id_form', $id)->first();
            if (!$data) {
                // Fallback pencarian by primary ID (antisipasi data lama)
                $data = Form_Umum::with('pasien')->with('form')->find($id);
            }
        }
        
        return response()->json($data);
    }

    public function simpan(Request $request)
    {
        \Log::info('FormUmumController@simpan hit', ['payload' => $request->all()]);
        
        if (!empty($request->nik) && strpos($request->nik, 'NON-') !== 0) {
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
            $nik = $request->nik;

            if ($nik === null || $nik === '') {
                $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                if($cari_pasien_non_nik==null){
                    $nik = "NON-1";
                }
                else{
                    $get_nik = $cari_pasien_non_nik->nik;
                    $get_nomor = substr($get_nik, strlen("NON-"));
                    $nik = "NON-".((int)$get_nomor + 1);
                }
                $pasien = Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama_pasien,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                    'alamat_kelurahan' => $request->alamat_kelurahan,
                    'alamat_kecamatan' => $request->alamat_kecamatan,
                    'no_telepon' => $request->no_telepon,
                ]);
            }
            else{
                $pasien = Pasien::where('nik', $request->nik)->first();
                if($pasien==null){
                    $pasien = Pasien::create([
                        'nik' => $request->nik,
                        'nama' => $request->nama_pasien,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                        'alamat_kelurahan' => $request->alamat_kelurahan,
                        'alamat_kecamatan' => $request->alamat_kecamatan,
                        'no_telepon' => $request->no_telepon,
                    ]);
                }
                else{
                    $pasien->update([
                        'nama' => $request->nama_pasien,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                        'alamat_kelurahan' => $request->alamat_kelurahan,
                        'alamat_kecamatan' => $request->alamat_kecamatan,
                        'no_telepon' => $request->no_telepon,
                    ]);
                }
            }
        
            $form_umum = Form_Umum::create([
                'id_pasien' => $pasien->id,
                'tgl_penanganan'=> $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : null,
                'ita_tim'=> $request->ita_tim,
                'ita_dokter'=> $request->ita_dokter,
                'ita_perawat'=> $request->ita_perawat,
                'ita_bidan'=> $request->ita_bidan,
                'ita_driver'=> $request->ita_driver,
                'kondisi_kritis'=> json_encode($request->kondisi_kritis),
                'jalan_nafas'=> json_encode($request->jalan_nafas),
                'pernafasan'=> json_encode($request->pernafasan),
                'sirkulasi_nadi'=> json_encode($request->sirkulasi_nadi),
                'sirkulasi_kulit'=> json_encode($request->sirkulasi_kulit),
                'tv_td'=> $request->tv_td,
                'tv_hr'=> $request->tv_hr,
                'tv_rr'=> $request->tv_rr,
                'tv_sh'=> $request->tv_sh,
                'tv_spo2'=> $request->tv_spo2,
                'tv_skala_nyeri'=> $request->tv_skala_nyeri,
                'tv_pukul'=> $request->tv_pukul,
                'ds_gcs_e'=> $request->ds_gcs_e,
                'ds_gcs_m'=> $request->ds_gcs_m,
                'ds_gcs_v'=> $request->ds_gcs_v,
                'ds_pupil'=> $request->ds_pupil,
                'ds_reflek_cahaya'=> $request->ds_reflek_cahaya,
                'ds_lateralisasi'=> $request->ds_lateralisasi,
                'eksposur'=> json_encode($request->eksposur),
                'kesimpulan_awal'=> json_encode($request->kesimpulan_awal),
                'rk_keluhan_utama'=> $request->rk_keluhan_utama,
                'rk_riwayat_penyakit_sekarang'=> $request->rk_riwayat_penyakit_sekarang,
                'rk_riwayat_penyakit_dahulu'=> json_encode($request->rk_riwayat_penyakit_dahulu),
                'rk_riwayat_penyakit_keluarga'=> $request->rk_riwayat_penyakit_keluarga,
                'rk_riwayat_minum_obat'=> $request->rk_riwayat_minum_obat,
                'pf_normocephal'=> $request->pf_normocephal,
                'pf_sclera_ikterik_1'=> $request->pf_sclera_ikterik_1,
                'pf_sclera_ikterik_2'=> $request->pf_sclera_ikterik_2,
                'pf_conj_anemis_1'=> $request->pf_conj_anemis_1,
                'pf_conj_anemis_2'=> $request->pf_conj_anemis_2,
                'pf_perbesaran_kelenjar_getah_bening'=> $request->pf_perbesaran_kelenjar_getah_bening,
                'pf_deviasi_trachea'=> $request->pf_deviasi_trachea,
                'pf_suara_dasar_veikuler_1'=> $request->pf_suara_dasar_veikuler_1,
                'pf_suara_dasar_veikuler_2'=> $request->pf_suara_dasar_veikuler_2,
                'pf_rhonki_1'=> $request->pf_rhonki_1,
                'pf_rhonki_2'=> $request->pf_rhonki_2,
                'pf_wheezing_1'=> $request->pf_wheezing_1,
                'pf_wheezing_2'=> $request->pf_wheezing_2,
                'pf_bunyi_jantung_1_2'=> $request->pf_bunyi_jantung_1_2,
                'pf_bunyi_jantung_1_2_status'=> $request->pf_bunyi_jantung_1_2_status,
                'pf_bising_usus'=> $request->pf_bising_usus,
                'pf_bising_usus_status' => $request->pf_bising_usus_status,
                'pf_nyeri_tekan_abdomen'=> $request->pf_nyeri_tekan_abdomen,
                'pf_nyeri_tekan_abdomen_area'=> $request->pf_nyeri_tekan_abdomen_area,
                'pf_akral_hangat_a_1'=> $request->pf_akral_hangat_a_1,
                'pf_akral_hangat_a_2'=> $request->pf_akral_hangat_a_2,
                'pf_akral_hangat_b_1'=> $request->pf_akral_hangat_b_1,
                'pf_akral_hangat_b_2'=> $request->pf_akral_hangat_b_2,
                'pf_oedema_a_1'=> $request->pf_oedema_a_1,
                'pf_oedema_a_2'=> $request->pf_oedema_a_2,
                'pf_oedema_b_1'=> $request->pf_oedema_b_1,
                'pf_oedema_b_2'=> $request->pf_oedema_b_2,
                'pf_ekg'=> $request->pf_ekg,
                'pf_gds'=> $request->pf_gds,
                'pf_au'=> $request->pf_au,
                'pf_chol'=> $request->pf_chol,
                'pf_hb'=> $request->pf_hb,
                'diagnosis_medis'=> json_encode($request->diagnosis_medis),
                'terapi_tindakan_konsul'=> json_encode($request->terapi_tindakan_konsul),
                'terapi_tindakan_konsul_dr'=> $request->terapi_tindakan_konsul_dr,
                'ftv_td'=> $request->ftv_td,
                'ftv_hr'=> $request->ftv_hr,
                'ftv_rr'=> $request->ftv_rr,
                'ftv_sh'=> $request->ftv_sh,
                'ftv_spo2'=> $request->ftv_spo2,
                'ftv_nrm'=> $request->ftv_nrm,
                'ftv_gds'=> $request->ftv_gds,
                'ftv_skala_nyeri'=> $request->ftv_skala_nyeri,
                'ftv_pukul'=> $request->ftv_pukul,
                'rsr_rs'=> $request->rsr_rs,
                'rsr_tgl'=> $request->rsr_tgl,
                'rsr_jam'=> $request->rsr_jam,
                'nama_ttd_petugas_ambulance_hebat'=> $request->nama_ttd_petugas_ambulance_hebat,
                'ttd_petugas_ambulance_hebat'=> $request->ttd_petugas_ambulance_hebat,
                'keluarga_pasien_petugas_rs'=> $request->keluarga_pasien_petugas_rs,
                'nama_ttd_keluarga_pasien_petugas_rs'=> $request->nama_ttd_keluarga_pasien_petugas_rs,
                'ttd_keluarga_pasien_petugas_rs'=> $request->ttd_keluarga_pasien_petugas_rs,
            ]);

            $form = Form::create([
               'id_form' => $form_umum->id,
               'id_pembuat' => Auth::check() ? Auth::id() : 1,
               'id_pasien' => $pasien->id,
               'id_tim_ambulan' => $request->ita_id_tim,
               'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : null,
               'jenis' => 'form umum' 
            ]);

            $form_umum->update([
                "id_form"=>$form->id,
            ]);

            return response()->json("Berhasil simpan data");
        });
    }

    public function perbarui(Request $request)
    {
        \Log::info('FormUmumController@perbarui hit', ['payload' => $request->all()]);
        
        if (!empty($request->nik) && strpos($request->nik, 'NON-') !== 0) {
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
            $id_form = $request->id_form ?? $request->id;
            $data = Form_Umum::where('id_form', $id_form)->first();
            if(!$data) $data = Form_Umum::find($id_form);
            
            if (!$data) {
                return response()->json("Data tidak ditemukan", 404);
            }

            // Update data pasien
            if ($data->pasien) {
                $data->pasien->update([
                    'nik' => $request->nik,
                    'nama' => $request->nama_pasien,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                    'alamat_kelurahan' => $request->alamat_kelurahan,
                    'alamat_kecamatan' => $request->alamat_kecamatan,
                    'no_telepon' => $request->no_telepon,
                ]);
            }

            $data->update([
                'tgl_penanganan'=> $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : null,
                'ita_tim'=> $request->ita_tim,
                'ita_dokter'=> $request->ita_dokter,
                'ita_perawat'=> $request->ita_perawat,
                'ita_bidan'=> $request->ita_bidan,
                'ita_driver'=> $request->ita_driver,
                'kondisi_kritis'=> json_encode($request->kondisi_kritis),
                'jalan_nafas'=> json_encode($request->jalan_nafas),
                'pernafasan'=> json_encode($request->pernafasan),
                'sirkulasi_nadi'=> json_encode($request->sirkulasi_nadi),
                'sirkulasi_kulit'=> json_encode($request->sirkulasi_kulit),
                'tv_td'=> $request->tv_td,
                'tv_hr'=> $request->tv_hr,
                'tv_rr'=> $request->tv_rr,
                'tv_sh'=> $request->tv_sh,
                'tv_spo2'=> $request->tv_spo2,
                'tv_skala_nyeri'=> $request->tv_skala_nyeri,
                'tv_pukul'=> $request->tv_pukul,
                'ds_gcs_e'=> $request->ds_gcs_e,
                'ds_gcs_m'=> $request->ds_gcs_m,
                'ds_gcs_v'=> $request->ds_gcs_v,
                'ds_pupil'=> $request->ds_pupil,
                'ds_reflek_cahaya'=> $request->ds_reflek_cahaya,
                'ds_lateralisasi'=> $request->ds_lateralisasi,
                'eksposur'=> json_encode($request->eksposur),
                'kesimpulan_awal'=> json_encode($request->kesimpulan_awal),
                'rk_keluhan_utama'=> $request->rk_keluhan_utama,
                'rk_riwayat_penyakit_sekarang'=> $request->rk_riwayat_penyakit_sekarang,
                'rk_riwayat_penyakit_dahulu'=> json_encode($request->rk_riwayat_penyakit_dahulu),
                'rk_riwayat_penyakit_keluarga'=> $request->rk_riwayat_penyakit_keluarga,
                'rk_riwayat_minum_obat'=> $request->rk_riwayat_minum_obat,
                'pf_normocephal'=> $request->pf_normocephal,
                'pf_sclera_ikterik_1'=> $request->pf_sclera_ikterik_1,
                'pf_sclera_ikterik_2'=> $request->pf_sclera_ikterik_2,
                'pf_conj_anemis_1'=> $request->pf_conj_anemis_1,
                'pf_conj_anemis_2'=> $request->pf_conj_anemis_2,
                'pf_perbesaran_kelenjar_getah_bening'=> $request->pf_perbesaran_kelenjar_getah_bening,
                'pf_deviasi_trachea'=> $request->pf_deviasi_trachea,
                'pf_suara_dasar_veikuler_1'=> $request->pf_suara_dasar_veikuler_1,
                'pf_suara_dasar_veikuler_2'=> $request->pf_suara_dasar_veikuler_2,
                'pf_rhonki_1'=> $request->pf_rhonki_1,
                'pf_rhonki_2'=> $request->pf_rhonki_2,
                'pf_wheezing_1'=> $request->pf_wheezing_1,
                'pf_wheezing_2'=> $request->pf_wheezing_2,
                'pf_bunyi_jantung_1_2'=> $request->pf_bunyi_jantung_1_2,
                'pf_bunyi_jantung_1_2_status'=> $request->pf_bunyi_jantung_1_2_status,
                'pf_bising_usus'=> $request->pf_bising_usus,
                'pf_bising_usus_status' => $request->pf_bising_usus_status,
                'pf_nyeri_tekan_abdomen'=> $request->pf_nyeri_tekan_abdomen,
                'pf_nyeri_tekan_abdomen_area'=> $request->pf_nyeri_tekan_abdomen_area,
                'pf_akral_hangat_a_1'=> $request->pf_akral_hangat_a_1,
                'pf_akral_hangat_a_2'=> $request->pf_akral_hangat_a_2,
                'pf_akral_hangat_b_1'=> $request->pf_akral_hangat_b_1,
                'pf_akral_hangat_b_2'=> $request->pf_akral_hangat_b_2,
                'pf_oedema_a_1'=> $request->pf_oedema_a_1,
                'pf_oedema_a_2'=> $request->pf_oedema_a_2,
                'pf_oedema_b_1'=> $request->pf_oedema_b_1,
                'pf_oedema_b_2'=> $request->pf_oedema_b_2,
                'pf_ekg'=> $request->pf_ekg,
                'pf_gds'=> $request->pf_gds,
                'pf_au'=> $request->pf_au,
                'pf_chol'=> $request->pf_chol,
                'pf_hb'=> $request->pf_hb,
                'diagnosis_medis'=> json_encode($request->diagnosis_medis),
                'terapi_tindakan_konsul'=> json_encode($request->terapi_tindakan_konsul),
                'terapi_tindakan_konsul_dr'=> $request->terapi_tindakan_konsul_dr,
                'ftv_td'=> $request->ftv_td,
                'ftv_hr'=> $request->ftv_hr,
                'ftv_rr'=> $request->ftv_rr,
                'ftv_sh'=> $request->ftv_sh,
                'ftv_spo2'=> $request->ftv_spo2,
                'ftv_nrm'=> $request->ftv_nrm,
                'ftv_gds'=> $request->ftv_gds,
                'ftv_skala_nyeri'=> $request->ftv_skala_nyeri,
                'ftv_pukul'=> $request->ftv_pukul,
                'rsr_rs'=> $request->rsr_rs,
                'rsr_tgl'=> $request->rsr_tgl,
                'rsr_jam'=> $request->rsr_jam,
                'nama_ttd_petugas_ambulance_hebat'=> $request->nama_ttd_petugas_ambulance_hebat,
                'ttd_petugas_ambulance_hebat'=> $request->ttd_petugas_ambulance_hebat,
                'keluarga_pasien_petugas_rs'=> $request->keluarga_pasien_petugas_rs,
                'nama_ttd_keluarga_pasien_petugas_rs'=> $request->nama_ttd_keluarga_pasien_petugas_rs,
                'ttd_keluarga_pasien_petugas_rs'=> $request->ttd_keluarga_pasien_petugas_rs,
            ]);

            $formMaster = Form::find($data->id_form);
            if($formMaster){
                $formMaster->update([
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : $formMaster->tgl_penanganan,
                    'id_tim_ambulan' => $request->ita_id_tim ?? $formMaster->id_tim_ambulan,
                ]);
            }

            return response()->json("Berhasil perbarui data");
        });
    }

    public function form_surat_persetujuan_tindakan_medis()
    {
        return Inertia::render('Admin/Form_Surat_Persetujuan_Tindakan_Medis');
    }

    public function simpan_form_surat_persetujuan_tindakan_medis(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $ar_nama_saksi[] = $request->nama_ttd_saksi;
            Surat_Persetujuan_Tindakan_Medis::create([
                'nama' => $request->yg_bertanda_tangan_nama,
                'umur' => $request->yg_bertanda_tangan_umur,
                'jenis_kelamin' => $request->yg_bertanda_tangan_jenis_kelamin,
                'alamat' => $request->yg_bertanda_tangan_alamat,
                'alamat_kelurahan' => $request->yg_bertanda_tangan_alamat_kelurahan,
                'alamat_kecamatan' => $request->yg_bertanda_tangan_alamat_kecamatan,
                'status_surat' => $request->status_surat,
                'tindakan_medis' => $request->yg_telah_memberikan_tindakan_medis,
                'terhadap' => $request->yg_telah_memberikan_terhadap,
                'memberikan_nama' => $request->yg_telah_memberikan_nama,
                'memberikan_umur' => $request->yg_telah_memberikan_umur,
                'memberikan_jenis_kelamin' => $request->yg_telah_memberikan_jenis_kelamin,
                'memberikan_alamat' => $request->yg_telah_memberikan_alamat,
                'memberikan_alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                'memberikan_alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                'tambahan_pernyataan' => json_encode($request->tambahan_pernyataan),
                'tgl_surat' => $request->tgl_surat,
                'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi ?? [])),
                // 'nama_saksi' => json_encode($request->nama_ttd_tambah_saksi),
                'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
                'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
            ]);

            return Redirect::route('form.surat_persetujuan_tindakan_medis');
        });
    }

    public function form_surat_keterangan_kematian(){
        return Inertia::render('Admin/Form_Surat_Keterangan_Kematian');
    }

    public function simpan_form_surat_keterangan_kematian(Request $request){
        return \DB::transaction(function () use ($request) {
            $no_surat_gabung = $request->no_surat_1.",".$request->no_surat_2.",".$request->no_surat_3;
            $ar_no_surat = explode(",", $no_surat_gabung);

            // NIK Handling similar to Form Umum
            $nik = $request->nik;
            if ($nik === null || $nik === '') {
                $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                if($cari_pasien_non_nik==null){
                    $nik = "NON-1";
                }
                else{
                    $get_nik = $cari_pasien_non_nik->nik;
                    $get_nomor = substr($get_nik, strlen("NON-"));
                    $nik = "NON-".((int)$get_nomor + 1);
                }
                $pasien = Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama,
                    'no_telepon' => $request->no_telepon,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                    'alamat_kelurahan' => $request->alamat_kelurahan,
                    'alamat_kecamatan' => $request->alamat_kecamatan,
                    'status' => 'meninggal',
                ]);
            }
            else{
                $pasien = Pasien::where('nik', $request->nik)->first();
                if($pasien==null){
                    $pasien = Pasien::create([
                        'nik' => $request->nik,
                        'nama' => $request->nama,
                        'no_telepon' => $request->no_telepon,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                        'alamat_kelurahan' => $request->alamat_kelurahan,
                        'alamat_kecamatan' => $request->alamat_kecamatan,
                        'status' => 'meninggal',
                    ]);
                }
                else{
                    $pasien->update([
                        'nama' => $request->nama,
                        'no_telepon' => $request->no_telepon,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                        'alamat_kelurahan' => $request->alamat_kelurahan,
                        'alamat_kecamatan' => $request->alamat_kecamatan,
                        'status' => 'meninggal',
                    ]);
                }
            }

            $surat = Surat_Keterangan_Kematian::create([
                'id_pasien' => $pasien->id,
                'no_surat' => json_encode($ar_no_surat),
                'nama' => $request->nama ?? '-',
                'tempat_lahir' => $request->tempat_lahir ?? '-',
                'tgl_lahir' => $request->tgl_lahir,
                'jenis_kelamin' => $request->jenis_kelamin ?? 'L',
                'agama' => $request->agama ?? '-',
                'alamat' => $request->alamat ?? '-',
                'alamat_kelurahan' => $request->alamat_kelurahan ?? '-',
                'alamat_kecamatan' => $request->alamat_kecamatan ?? '-',
                'tgl_meninggal' => $request->tgl_meninggal ? date('Y-m-d', strtotime($request->tgl_meninggal)) : date('Y-m-d'),
                'jam_meninggal' => $request->jam_meninggal ?? date('H:i'),
                'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : date('Y-m-d'),
                'nama_ttd_dokter' => $request->nama_ttd_dokter ?? '-',
                'ttd_dokter' => $request->ttd_dokter,
            ]);

            $form = Form::create([
                'id_form' => $surat->id,
                'id_pasien' => $pasien->id,
                'id_pembuat' => Auth::check() ? Auth::id() : 1,
                'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d'),
                'jenis' => 'form surat keterangan kematian' 
            ]);

            $surat->update(['id_form' => $form->id]);

            return response()->json("Berhasil simpan data");
        });
    }

    public function edit($id){
        return Inertia::render('Dashboard/Index', [
            'id' => $id,
            'auth' => Auth::user(),
        ]);
        // dd($id);
    }
    public function ref_form_surat_keterangan_kematian(Request $request)
    {
        $id = $request->id_form ?? $request->id;
        if ($id == null) {
            $data = null;
        } else {
            $form = Form::find($id);
            if($form) {
                $data = Surat_Keterangan_Kematian::with('pasien')->with('form')->where('id_form', $form->id)->first();
                if(!$data) $data = Surat_Keterangan_Kematian::with('pasien')->with('form')->find($form->id_form);
            } else {
                $data = Surat_Keterangan_Kematian::with('pasien')->with('form')->find($id);
            }
        }
        return response()->json($data);
    }

    public function perbarui_form_surat_keterangan_kematian(Request $request)
    {
        return \DB::transaction(function () use ($request) {
            $id_form = $request->id_form ?? $request->id;
            $form = Form::find($id_form);
            $data = Surat_Keterangan_Kematian::where('id_form', $form ? $form->id : $id_form)->first();
            if(!$data) $data = Surat_Keterangan_Kematian::find($form ? $form->id_form : $id_form);
            
            if (!$data) {
                return response()->json(['error' => 'Data tidak ditemukan'], 404);
            }

            $no_surat_gabung = $request->no_surat_1.",".$request->no_surat_2.",".$request->no_surat_3;
            $ar_no_surat = explode(",", $no_surat_gabung);

            // Update data pasien jika ada
            if ($data && $data->pasien) {
                $data->pasien->update([
                    'nik' => $request->nik,
                    'nama' => $request->nama,
                    'no_telepon' => $request->no_telepon,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                    'alamat_kelurahan' => $request->alamat_kelurahan,
                    'alamat_kecamatan' => $request->alamat_kecamatan,
                    'status' => 'meninggal',
                ]);
            }

            $data->update([
                'no_surat' => json_encode($ar_no_surat),
                'nama' => $request->nama ?? '-',
                'tempat_lahir' => $request->tempat_lahir ?? '-',
                'tgl_lahir' => $request->tgl_lahir,
                'jenis_kelamin' => $request->jenis_kelamin ?? 'L',
                'agama' => $request->agama ?? '-',
                'alamat' => $request->alamat ?? '-',
                'alamat_kelurahan' => $request->alamat_kelurahan ?? '-',
                'alamat_kecamatan' => $request->alamat_kecamatan ?? '-',
                'tgl_meninggal' => $request->tgl_meninggal ? date('Y-m-d', strtotime($request->tgl_meninggal)) : date('Y-m-d'),
                'jam_meninggal' => $request->jam_meninggal ?? date('H:i'),
                'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : date('Y-m-d'),
                'nama_ttd_dokter' => $request->nama_ttd_dokter ?? '-',
                'ttd_dokter' => $request->ttd_dokter,
            ]);

            if ($form) {
                $form->update([
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d')
                ]);
            }

            return response()->json("Berhasil perbarui data");
        });
    }
}