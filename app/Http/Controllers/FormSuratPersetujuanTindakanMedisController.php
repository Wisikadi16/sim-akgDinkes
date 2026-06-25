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
use App\Models\Surat_Persetujuan_Tindakan_Medis;

class FormSuratPersetujuanTindakanMedisController extends Controller
{
    public function index()
    {
        return Inertia::render('Form/Form_Surat_Persetujuan_Tindakan_Medis');
    }

    public function tambah(Request $request)
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
                    'nama' => $request->yg_telah_memberikan_nama,
                    'no_telepon' => $request->no_telepon,
                    'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir, 
                    'alamat' => $request->yg_telah_memberikan_alamat,
                    'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                    'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                ]);
            }
            else{
                $pasien = Pasien::where('nik', $request->nik)->first();
                if($pasien==null){
                    $pasien = Pasien::create([
                        'nik' => $request->nik,
                        'nama' => $request->yg_telah_memberikan_nama,
                        'no_telepon' => $request->no_telepon,
                        'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                        'alamat' => $request->yg_telah_memberikan_alamat,
                        'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                        'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                    ]);
                }
                else{
                    $pasien->update([
                        'nama' => $request->yg_telah_memberikan_nama,
                        'no_telepon' => $request->no_telepon,
                        'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                        'alamat' => $request->yg_telah_memberikan_alamat,
                        'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                        'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                    ]);
                }
            }

            $ar_nama_saksi = [];
            if ($request->nama_ttd_saksi) {
                $ar_nama_saksi[] = $request->nama_ttd_saksi;
            }
            
            $form_surat_persetujuan_tindakan_medis = Surat_Persetujuan_Tindakan_Medis::create([
                'id_pasien' => $pasien->id,
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
                'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : null,
                'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi ?? [])),
                'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
                'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
                'ttd_yang_membuat_pernyataan' => $request->ttd_yang_membuat_pernyataan,
                'ttd_saksi' => json_encode($request->ttd_saksi),
                'ttd_dokter_paramedis' => $request->ttd_dokter_paramedis,
            ]);

            $form = Form::create([
                'id_form' => $form_surat_persetujuan_tindakan_medis->id,
                'id_pasien' => $pasien->id,
                'id_pembuat' => Auth::check() ? Auth::id() : 1,
                'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d'),
                'jenis' => 'form surat persetujuan tindakan medis' 
            ]);

            $form_surat_persetujuan_tindakan_medis->update(['id_form' => $form->id]);

            return response()->json("Berhasil simpan data");
        });
    }
    public function ref_form_surat_persetujuan_tindakan_medis(Request $request)
    {
        $id = $request->id_form ?? $request->id;
        if ($id == null) {
            $data = null;
        } else {
            $form = Form::find($id);
            if($form) {
                $data = Surat_Persetujuan_Tindakan_Medis::with(['pasien', 'form', 'kecamatan', 'kelurahan', 'memberikan_kecamatan', 'memberikan_kelurahan'])
                    ->where('id_form', $form->id)
                    ->first();
                if(!$data) {
                    $data = Surat_Persetujuan_Tindakan_Medis::with(['pasien', 'form', 'kecamatan', 'kelurahan', 'memberikan_kecamatan', 'memberikan_kelurahan'])
                        ->find($form->id_form);
                }
            } else {
                $data = Surat_Persetujuan_Tindakan_Medis::with(['pasien', 'form', 'kecamatan', 'kelurahan', 'memberikan_kecamatan', 'memberikan_kelurahan'])
                    ->find($id);
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
            $data = Surat_Persetujuan_Tindakan_Medis::where('id_form', $form ? $form->id : $id_form)->first();
            if(!$data) $data = Surat_Persetujuan_Tindakan_Medis::find($form ? $form->id_form : $id_form);
            
            if (!$data) {
                return response()->json(['error' => 'Data tidak ditemukan'], 404);
            }

            $ar_nama_saksi = [];
            if ($request->nama_ttd_saksi) {
                $ar_nama_saksi[] = $request->nama_ttd_saksi;
            }
            
            // Update data pasien jika ada
            $pasien = Pasien::find($form ? $form->id_pasien : $data->id_pasien);
            if ($pasien) {
                $pasien->update([
                    'nik' => $request->nik,
                    'nama' => $request->yg_telah_memberikan_nama,
                    'no_telepon' => $request->no_telepon,
                    'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                    'alamat' => $request->yg_telah_memberikan_alamat,
                    'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                    'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                ]);
            }

            if ($form) {
                $form->update([
                    'tgl_penanganan' => $request->tgl_penanganan ? date('Y-m-d', strtotime($request->tgl_penanganan)) : date('Y-m-d')
                ]);
            }

            $data->update([
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
                'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : null,
                'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi ?? [])),
                'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
                'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
                'ttd_yang_membuat_pernyataan' => $request->ttd_yang_membuat_pernyataan,
                'ttd_saksi' => json_encode($request->ttd_saksi),
                'ttd_dokter_paramedis' => $request->ttd_dokter_paramedis,
            ]);

            return response()->json("Berhasil perbarui data");
        });
    }
}