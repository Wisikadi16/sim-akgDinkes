<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormKeluarga;
use App\Models\Form;
use App\Models\Pasien;
use Illuminate\Support\Facades\Auth;

class FormKeluargaController extends Controller
{
    public function simpan(Request $request)
    {
        try{ 
            return \DB::transaction(function () use ($request) {
                $nama_kk = $request->nama_kk ?: 'Keluarga Tanpa Nama';
                
                $pasien = Pasien::where('nama', $nama_kk)->first();
                if (!$pasien) {
                    $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                    if($cari_pasien_non_nik == null){
                        $nik = "NON-1";
                    } else {
                        $get_nik = $cari_pasien_non_nik->nik;
                        $get_nomor = substr($get_nik, strlen("NON-"));
                        $nik = "NON-".((int)$get_nomor + 1);
                    }
                
                    $pasien = Pasien::create([
                        'nik' => $nik,
                        'nama' => $nama_kk,
                        'alamat' => $request->alamat_telp,
                    ]);
                }

                $form_keluarga = FormKeluarga::create([
                    'fasilitas_yankes' => $request->fasilitas_yankes,
                    'no_register' => $request->no_register,
                    'nama_perawat' => $request->nama_perawat,
                    'tanggal_pengkajian' => $request->tanggal_pengkajian,
                    'nama_kk' => $request->nama_kk,
                    'alamat_telp' => $request->alamat_telp,
                    'agama_suku' => $request->agama_suku,
                    'bahasa' => $request->bahasa,
                    'jarak_yankes' => $request->jarak_yankes,
                    'alat_transportasi' => $request->alat_transportasi,
                    'anggota_keluarga' => is_array($request->anggota_keluarga) ? json_encode($request->anggota_keluarga) : $request->anggota_keluarga,
                    'sanitasi' => is_array($request->sanitasi) ? json_encode($request->sanitasi) : $request->sanitasi,
                    'phbs' => is_array($request->phbs) ? json_encode($request->phbs) : $request->phbs,
                    'tugas_kesehatan' => is_array($request->tugas_kesehatan) ? json_encode($request->tugas_kesehatan) : $request->tugas_kesehatan,
                    'kemandirian' => is_array($request->kemandirian) ? json_encode($request->kemandirian) : $request->kemandirian,
                    'individu_sakit' => is_array($request->individu_sakit) ? json_encode($request->individu_sakit) : $request->individu_sakit,
                    'asuhan_keperawatan' => is_array($request->asuhan_keperawatan) ? json_encode($request->asuhan_keperawatan) : $request->asuhan_keperawatan,
                    'register_perkesmas' => is_array($request->register_perkesmas) ? json_encode($request->register_perkesmas) : $request->register_perkesmas,
                ]);

                $form = Form::create([
                    'id_form' => $form_keluarga->id,
                    'id_pasien' => $pasien->id, 
                    'id_pembuat' => Auth::check() ? Auth::id() : 1,
                    'tgl_penanganan' => $request->tanggal_pengkajian ? date('Y-m-d', strtotime($request->tanggal_pengkajian)) : date('Y-m-d'),
                    'jenis' => 'form-keluarga'
                ]);

                return response()->json("Data Pengkajian Keluarga Berhasil Disimpan!", 200);
            });
        } catch (\Exception $e) {
            \Log::error('Error pada Form Keluarga: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal simpan data. Silahkan coba lagi.'], 500);
        }
    }

    public function ref_form_keluarga(Request $request)
    {
        $id = $request->id_form ?? $request->id;
        $form_induk = Form::find($id);
        
        if($form_induk){
            $data = FormKeluarga::find($form_induk->id_form);
        } else {
            $data = FormKeluarga::find($id);
        }

        if($data){
            return response()->json($data, 200);
        }else{
            return response()->json(['message' => "Data Tidak Ditemukan"], 404);
        }
    }

    public function perbarui(Request $request)
    {
        return \DB::transaction(function () use ($request) {
            $id_form = $request->id_form ?? $request->id;
            $form_induk = Form::find($id_form);
            if ($form_induk) {
                $form_keluarga = FormKeluarga::find($form_induk->id_form);
            } else {
                $form_keluarga = FormKeluarga::find($id_form);
            }
            
            if(!$form_keluarga) {
                return response()->json("Data tidak ditemukan!", 404);
            }

            $nama_kk = $request->nama_kk ?: 'Keluarga Tanpa Nama';
            $parent_form = Form::where('id_form', $form_keluarga->id)->where('jenis', 'form-keluarga')->first();
            
            if ($parent_form) {
                $pasien = Pasien::find($parent_form->id_pasien);
                if ($pasien) {
                    $pasien->update([
                        'nama' => $nama_kk,
                        'alamat' => $request->alamat_telp,
                    ]);
                } else {
                    $pasien = Pasien::firstOrCreate(['nama' => $nama_kk], [
                        'nik' => "NON-" . rand(1000, 9999), 
                        'alamat' => $request->alamat_telp,
                    ]);
                    $parent_form->update(['id_pasien' => $pasien->id]);
                }
            }

            $form_keluarga->update([
                'fasilitas_yankes' => $request->fasilitas_yankes,
                'no_register' => $request->no_register,
                'nama_perawat' => $request->nama_perawat,
                'tanggal_pengkajian' => $request->tanggal_pengkajian,
                'nama_kk' => $request->nama_kk,
                'alamat_telp' => $request->alamat_telp,
                'agama_suku' => $request->agama_suku,
                'bahasa' => $request->bahasa,
                'jarak_yankes' => $request->jarak_yankes,
                'alat_transportasi' => $request->alat_transportasi,
                'anggota_keluarga' => is_array($request->anggota_keluarga) ? json_encode($request->anggota_keluarga) : $request->anggota_keluarga,
                'sanitasi' => is_array($request->sanitasi) ? json_encode($request->sanitasi) : $request->sanitasi,
                'phbs' => is_array($request->phbs) ? json_encode($request->phbs) : $request->phbs,
                'tugas_kesehatan' => is_array($request->tugas_kesehatan) ? json_encode($request->tugas_kesehatan) : $request->tugas_kesehatan,
                'kemandirian' => is_array($request->kemandirian) ? json_encode($request->kemandirian) : $request->kemandirian,
                'individu_sakit' => is_array($request->individu_sakit) ? json_encode($request->individu_sakit) : $request->individu_sakit,
                'asuhan_keperawatan' => is_array($request->asuhan_keperawatan) ? json_encode($request->asuhan_keperawatan) : $request->asuhan_keperawatan,
                'register_perkesmas' => is_array($request->register_perkesmas) ? json_encode($request->register_perkesmas) : $request->register_perkesmas,
            ]);

            if ($parent_form) {
                $parent_form->update([
                    'tgl_penanganan' => $request->tanggal_pengkajian ? date('Y-m-d', strtotime($request->tanggal_pengkajian)) : date('Y-m-d'),
                ]);
            }

            return response()->json("Data Pengkajian Keluarga Berhasil Diperbarui!", 200);
        });
    }
    
}
