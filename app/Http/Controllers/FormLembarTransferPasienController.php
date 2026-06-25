<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FormLembarTransferPasien;
use App\Models\Pasien;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;

class FormLembarTransferPasienController extends Controller
{
    public function index($id = null)
    {
        return Inertia::render('Form/Form_Lembar_Transfer_Pasien', [
            'id' => $id,
        ]);
    }

    public function simpan(Request $request)
    {
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

        return \DB::transaction(function () use ($request) {
            $nik = $request->nik;
            if ($nik === null || $nik === '') {
                $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                if($cari_pasien_non_nik==null){
                    $nik = "NON-1";
                } else {
                    $get_nik = $cari_pasien_non_nik->nik;
                    $get_nomor = substr($get_nik, strlen("NON-"));
                    $nik = "NON-".((int)$get_nomor + 1);
                }
                $pasien = Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama_pasien,
                    'alamat' => $request->alamat_rumah,
                ]);
            } else {
                $pasien = Pasien::where('nik', $nik)->first();
                if ($pasien == null) {
                    $pasien = Pasien::create([
                        'nik' => $nik,
                        'nama' => $request->nama_pasien,
                        'alamat' => $request->alamat_rumah,
                    ]);
                } else {
                    $pasien->update([
                        'nama' => $request->nama_pasien,
                        'alamat' => $request->alamat_rumah,
                    ]);
                }
            }

            $rs_tujuan = json_encode([$request->rs_1, $request->rs_2, $request->rs_3]);

            $form_transfer = FormLembarTransferPasien::create([
                'nama_pasien' => $request->nama_pasien,
                'ttl' => $request->ttl,
                'jenis_kelamin' => $request->jenis_kelamin,
                'nik' => $request->nik,
                'jenis_asuransi' => $request->jenis_asuransi,
                'alamat_rumah' => $request->alamat_rumah,
                'nama_pendamping' => $request->nama_pendamping,
                
                'tgl_masuk_rs' => $request->tgl_masuk_rs,
                'jam_masuk_rs' => $request->jam_masuk_rs,
                'anamnesa' => $request->anamnesa,
                'riwayat_penyakit' => $request->riwayat_penyakit,
                'diagnosa' => $request->diagnosa,
                'tindakan_dilakukan' => $request->tindakan_dilakukan,
                'terapi_diberikan' => $request->terapi_diberikan,
                
                'ringkasan_kondisi' => json_encode($request->ringkasan_kondisi),
                'status_sblm' => $request->status_sblm,
                'status_selama' => $request->status_selama,
                'status_stlh' => $request->status_stlh,
                
                'nama_petugas_pendamping' => json_encode([
                    $request->petugas_dokter, 
                    $request->petugas_perawat, 
                    $request->petugas_bidan, 
                    $request->petugas_driver
                ]),
                
                'rs_tujuan' => $rs_tujuan,
                'tgl_serah_terima' => $request->tgl_serah_terima,
                'jam_serah_terima' => $request->jam_serah_terima,
                
                'nama_menyerahkan' => $request->nama_menyerahkan,
                'ttd_menyerahkan' => $request->ttd_menyerahkan,
                'nama_menerima' => $request->nama_menerima,
                'ttd_menerima' => $request->ttd_menerima,
                'nama_mengetahui' => $request->nama_mengetahui,
                'ttd_mengetahui' => $request->ttd_mengetahui,
            ]);

            $form = Form::create([
                'id_form' => $form_transfer->id,
                'id_pasien' => $pasien->id,
                'id_pembuat' => Auth::check() ? Auth::id() : 1,
                'tgl_penanganan' => $request->tgl_masuk_rs ? date('Y-m-d', strtotime($request->tgl_masuk_rs)) : date('Y-m-d'),
                'jenis' => 'Form Lembar Transfer Pasien' 
            ]);

            $form_transfer->update(['id_form' => $form->id]);

            return response()->json("Berhasil simpan data");
        });
    }

    public function ref_form_lembar_transfer_pasien(Request $request)
    {
        $id = $request->id_form ?? $request->id;
        if ($id == null) {
            $data = null;
        } else {
            $form = Form::find($id);
            if($form) {
                // Return data with related Pasien manually
                $data = FormLembarTransferPasien::where('id_form', $form->id)->first();
                if(!$data) {
                    $data = FormLembarTransferPasien::find($form->id_form);
                }
            } else {
                $data = FormLembarTransferPasien::find($id);
            }
        }
        return response()->json($data);
    }

    public function perbarui(Request $request)
    {
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

        return \DB::transaction(function () use ($request) {
            $id_form = $request->id_form ?? $request->id;
            $form = Form::find($id_form);
            $data = FormLembarTransferPasien::where('id_form', $form ? $form->id : $id_form)->first();
            if(!$data) $data = FormLembarTransferPasien::find($form ? $form->id_form : $id_form);
            
            if (!$data) {
                return response()->json(['error' => 'Data tidak ditemukan'], 404);
            }

            $pasien = Pasien::find($form ? $form->id_pasien : null);
            if ($pasien) {
                $pasien->update([
                    'nik' => $request->nik,
                    'nama' => $request->nama_pasien,
                    'alamat' => $request->alamat_rumah,
                ]);
            }
            
            if ($form) {
                $form->update([
                    'tgl_penanganan' => $request->tgl_masuk_rs ? date('Y-m-d', strtotime($request->tgl_masuk_rs)) : date('Y-m-d')
                ]);
            }
            
            $data->update([
                'nama_pasien' => $request->nama_pasien,
                'ttl' => $request->ttl,
                'jenis_kelamin' => $request->jenis_kelamin,
                'nik' => $request->nik,
                'jenis_asuransi' => $request->jenis_asuransi,
                'alamat_rumah' => $request->alamat_rumah,
                'nama_pendamping' => $request->nama_pendamping,
                
                'tgl_masuk_rs' => $request->tgl_masuk_rs,
                'jam_masuk_rs' => $request->jam_masuk_rs,
                'anamnesa' => $request->anamnesa,
                'riwayat_penyakit' => $request->riwayat_penyakit,
                'diagnosa' => $request->diagnosa,
                'tindakan_dilakukan' => $request->tindakan_dilakukan,
                'terapi_diberikan' => $request->terapi_diberikan,
                
                'ringkasan_kondisi' => json_encode($request->ringkasan_kondisi),
                'status_sblm' => $request->status_sblm,
                'status_selama' => $request->status_selama,
                'status_stlh' => $request->status_stlh,
                
                'nama_petugas_pendamping' => json_encode([$request->petugas_dokter, $request->petugas_perawat, $request->petugas_bidan, $request->petugas_driver]),
                
                'rs_tujuan' => json_encode([$request->rs_1, $request->rs_2, $request->rs_3]),
                'tgl_serah_terima' => $request->tgl_serah_terima,
                'jam_serah_terima' => $request->jam_serah_terima,
                
                'nama_menyerahkan' => $request->nama_menyerahkan,
                'ttd_menyerahkan' => $request->ttd_menyerahkan,
                'nama_menerima' => $request->nama_menerima,
                'ttd_menerima' => $request->ttd_menerima,
                'nama_mengetahui' => $request->nama_mengetahui,
                'ttd_mengetahui' => $request->ttd_mengetahui,
            ]);
            
            return response()->json("Berhasil perbarui data");
        });
    }
}
