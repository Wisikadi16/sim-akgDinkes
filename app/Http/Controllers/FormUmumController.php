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
use App\Models\Form_Umum;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;

class FormUmumController extends Controller
{
    public function ref_form_umum(Request $request){
        if($request->id==null){
            $data = Form_Umum::get();
        }
        else{
            $data = Form_Umum::with('pasien')->find($request->id);
        }
        
        return response()->json($data);
    }

    public function simpan(Request $request)
    {
        // dd($request->all());
        // dd("simpan", $request->all());
        $nik = $request->nik;

        if ($nik === null) {
            $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->first();
            if($cari_pasien_non_nik==null){
                $nik = "NON-1";
            }
            else{
                $get_nik = $cari_pasien_non_nik->nik;
                $get_nomor = substr($get_nik, strlen("NON-"));
                $nik = "NON-".(int)$get_nomor + 1;
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
            $cari_pasien = Pasien::where('nik', $request->nik)->first();
            if($cari_pasien==null){
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
                $pasien = Pasien::where('nik', $request->nik)->first(); 
            }
        }
     
        $form_umum = Form_Umum::create([
            // 'id_order' => $request->id_order,
            'id_pasien' => $pasien->id,
            'tgl_penanganan'=> $request->tgl_penanganan,
            //
            //identitas tim ambulance
            'ita_tim'=> $request->ita_tim,
            'ita_dokter'=> $request->ita_dokter,
            'ita_perawat'=> $request->ita_perawat,
            'ita_bidan'=> $request->ita_bidan,
            'ita_driver'=> $request->ita_driver,
            //
            //survei primer
            'kondisi_kritis'=> json_encode($request->kondisi_kritis),
            'jalan_nafas'=> json_encode($request->jalan_nafas),
            'pernafasan'=> json_encode($request->pernafasan),
            'sirkulasi_nadi'=> json_encode($request->sirkulasi_nadi),
            'sirkulasi_kulit'=> json_encode($request->sirkulasi_kulit),
            
            // //tanda vital
            'tv_td'=> $request->tv_td,
            'tv_hr'=> $request->tv_hr,
            'tv_rr'=> $request->tv_rr,
            'tv_sh'=> $request->tv_sh,
            'tv_spo2'=> $request->tv_spo2,
            'tv_skala_nyeri'=> $request->tv_skala_nyeri,
            'tv_pukul'=> $request->tv_pukul,

            // //disabilitas
            'ds_gcs_e'=> $request->ds_gcs_e,
            'ds_gcs_m'=> $request->ds_gcs_m,
            'ds_gcs_v'=> $request->ds_gcs_v,
            'ds_pupil'=> $request->ds_pupil,
            'ds_reflek_cahaya'=> $request->ds_reflek_cahaya,
            'ds_lateralisasi'=> $request->ds_lateralisasi,

            // //eksposur
            'eksposur'=> json_encode($request->eksposur),

            // //keimpulan awal
            'kesimpulan_awal'=> json_encode($request->kesimpulan_awal),

            // //riwayat kesehatan
            'rk_keluhan_utama'=> $request->rk_keluhan_utama,
            'rk_riwayat_penyakit_sekarang'=> $request->rk_riwayat_penyakit_sekarang,
            'rk_riwayat_penyakit_dahulu'=> json_encode($request->rk_riwayat_penyakit_dahulu),
            'rk_riwayat_penyakit_keluarga'=> $request->rk_riwayat_penyakit_keluarga,
            'rk_riwayat_minum_obat'=> $request->rk_riwayat_minum_obat,

            // //pemeriksaan fisik dan pemeriksaan penunjang
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

            // //follow up tanda vital
            'ftv_td'=> $request->ftv_td,
            'ftv_hr'=> $request->ftv_hr,
            'ftv_rr'=> $request->ftv_rr,
            'ftv_sh'=> $request->ftv_sh,
            'ftv_spo2'=> $request->ftv_spo2,
            'ftv_nrm'=> $request->ftv_nrm,
            'ftv_gds'=> $request->ftv_gds,
            'ftv_skala_nyeri'=> $request->ftv_skala_nyeri,
            'ftv_pukul'=> $request->ftv_pukul,

            // //rumah sakit rujukan
            'rsr_rs'=> $request->rsr_rs,
            'rsr_tgl'=> $request->rsr_tgl,
            'rsr_jam'=> $request->rsr_jam,


            // //petugas ambulance hebat
            'nama_ttd_petugas_ambulance_hebat'=> $request->nama_ttd_petugas_ambulance_hebat,
            'ttd_petugas_ambulance_hebat'=> $request->ttd_petugas_ambulance_hebat,

            'keluarga_pasien_petugas_rs'=> $request->keluarga_pasien_petugas_rs,
            //
            'nama_ttd_keluarga_pasien_petugas_rs'=> $request->nama_ttd_keluarga_pasien_petugas_rs,
            'ttd_keluarga_pasien_petugas_rs'=> $request->ttd_keluarga_pasien_petugas_rs,
        ]);

        $form = Form::create([
        //    'id_order' => $request->id_order,
           'id_form' => $form_umum->id,
           'id_pembuat' => Auth::user()->id,
           'id_pasien' => $pasien->id,
           'id_tim_ambulan' => $request->ita_id_tim,
           'tgl_penanganan' => $request->tgl_penanganan,
           'jenis' => 'form umum' 
        ]);

        $form_umum->update([
            "id_form"=>$form->id,
        ]);

        
        
        return response()->json("Berhasil simpan data");
        // return response()->json($pasien);
        
        // return Redirect::route('dashboard.form_umum');
    }

    public function perbarui(Request $request)
    {
        // dd($request->all());
        $data = Form_Umum::find($request->id_form);
        // dd($data);
        $data->update([
            'tgl_penanganan'=> $request->tgl_penanganan,
            //
            //identitas tim ambulance
            'ita_tim'=> $request->ita_tim,
            'ita_dokter'=> $request->ita_dokter,
            'ita_perawat'=> $request->ita_perawat,
            'ita_bidan'=> $request->ita_bidan,
            'ita_driver'=> $request->ita_driver,
            //
            //survei primer
            'kondisi_kritis'=> json_encode($request->kondisi_kritis),
            'jalan_nafas'=> json_encode($request->jalan_nafas),
            'pernafasan'=> json_encode($request->pernafasan),
            'sirkulasi_nadi'=> json_encode($request->sirkulasi_nadi),
            'sirkulasi_kulit'=> json_encode($request->sirkulasi_kulit),
            
            // //tanda vital
            'tv_td'=> $request->tv_td,
            'tv_hr'=> $request->tv_hr,
            'tv_rr'=> $request->tv_rr,
            'tv_sh'=> $request->tv_sh,
            'tv_spo2'=> $request->tv_spo2,
            'tv_skala_nyeri'=> $request->tv_skala_nyeri,
            'tv_pukul'=> $request->tv_pukul,

            // //disabilitas
            'ds_gcs_e'=> $request->ds_gcs_e,
            'ds_gcs_m'=> $request->ds_gcs_m,
            'ds_gcs_v'=> $request->ds_gcs_v,
            'ds_pupil'=> $request->ds_pupil,
            'ds_reflek_cahaya'=> $request->ds_reflek_cahaya,
            'ds_lateralisasi'=> $request->ds_lateralisasi,

            // //eksposur
            'eksposur'=> json_encode($request->eksposur),

            // //keimpulan awal
            'kesimpulan_awal'=> json_encode($request->kesimpulan_awal),

            // //riwayat kesehatan
            'rk_keluhan_utama'=> $request->rk_keluhan_utama,
            'rk_riwayat_penyakit_sekarang'=> $request->rk_riwayat_penyakit_sekarang,
            'rk_riwayat_penyakit_dahulu'=> json_encode($request->rk_riwayat_penyakit_dahulu),
            'rk_riwayat_penyakit_keluarga'=> $request->rk_riwayat_penyakit_keluarga,
            'rk_riwayat_minum_obat'=> $request->rk_riwayat_minum_obat,

            // //pemeriksaan fisik dan pemeriksaan penunjang
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

            // //follow up tanda vital
            'ftv_td'=> $request->ftv_td,
            'ftv_hr'=> $request->ftv_hr,
            'ftv_rr'=> $request->ftv_rr,
            'ftv_sh'=> $request->ftv_sh,
            'ftv_spo2'=> $request->ftv_spo2,
            'ftv_nrm'=> $request->ftv_nrm,
            'ftv_gds'=> $request->ftv_gds,
            'ftv_skala_nyeri'=> $request->ftv_skala_nyeri,
            'ftv_pukul'=> $request->ftv_pukul,

            // //rumah sakit rujukan
            'rsr_rs'=> $request->rsr_rs,
            'rsr_tgl'=> $request->rsr_tgl,
            'rsr_jam'=> $request->rsr_jam,


            // //petugas ambulance hebat
            'nama_ttd_petugas_ambulance_hebat'=> $request->nama_ttd_petugas_ambulance_hebat,
            'ttd_petugas_ambulance_hebat'=> $request->ttd_petugas_ambulance_hebat,

            'keluarga_pasien_petugas_rs'=> $request->keluarga_pasien_petugas_rs,
            //
            'nama_ttd_keluarga_pasien_petugas_rs'=> $request->nama_ttd_keluarga_pasien_petugas_rs,
            'ttd_keluarga_pasien_petugas_rs'=> $request->ttd_keluarga_pasien_petugas_rs,
        ]);

        // return Redirect::route('form_umum.edit',$request->id_form);
        return response()->json("Berhasil perbarui data");
    }

    public function form_surat_persetujuan_tindakan_medis()
    {
        return Inertia::render('Admin/Form_Surat_Persetujuan_Tindakan_Medis');
    }

    public function simpan_form_surat_persetujuan_tindakan_medis(Request $request)
    {
        $ar_nama_saksi[]=$request->nama_ttd_saksi;
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
            'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi)),
            // 'nama_saksi' => json_encode($request->nama_ttd_tambah_saksi),
            'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
            'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
        ]);

        return Redirect::route('form.surat_persetujuan_tindakan_medis');
    }

    public function form_surat_keterangan_kematian(){
        return Inertia::render('Admin/Form_Surat_Keterangan_Kematian');
    }

    public function simpan_form_surat_keterangan_kematian(Request $request){
        $no_surat_gabung = $request->no_surat_1.",".$request->no_surat_2.",".$request->no_surat_3;
        $ar_no_surat = explode(",", $no_surat_gabung);

        Surat_Keterangan_Kematian::create([
            'no_surat' => json_encode($ar_no_surat),
            'nama' => $request->nama,
            'tempat_lahir' => $request->tempat_lahir,
            'tgl_lahir' => $request->tgl_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
            'agama' => $request->agama,
            'alamat' => $request->alamat,
            'alamat_kelurahan' => $request->alamat_kelurahan,
            'alamat_kecamatan' => $request->alamat_kecamatan,
            'tgl_meninggal' => $request->tgl_meninggal,
            'jam_meninggal' => $request->jam_meninggal,
            'tgl_surat' => $request->tgl_surat,
            'nama_ttd_dokter' => $request->nama_ttd_dokter,
        ]);

        return Redirect::route('form.surat_keterangan_kematian');
    }

    public function edit($id){
        return Inertia::render('Dashboard/Index', [
            'id' => $id,
            'auth' => Auth::user(),
        ]);
        // dd($id);
    }
}