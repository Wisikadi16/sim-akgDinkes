<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pasien;
use Illuminate\Support\Facades\Redirect;


class PasienController extends Controller
{
    public function ref_pasien(Request $request)
    {
        if($request->id==null){
            $data = Pasien::with('ref_kecamatan')->with('ref_kelurahan')->orderBy('id', 'DESC')->get();
        }
        else{
            $data = Pasien::with('ref_kecamatan')->with('ref_kelurahan')->find($request->id);
        }

        return response()->json($data);
    }

    public function cari_nik(Request $request)
    {
        $data = Pasien::where('nik',$request->nik)->first();
        if($data==null){
            $data = "Nik tidak ditemukan";
        }
        return response()->json($data);
        // return response()->json("halo");
    }

    public function tambah(Request $request){
        $nik = $request->nik;

        if ($nik === null || $nik === '') {
            // Auto generate NON- NIK
            $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
            if($cari_pasien_non_nik==null){
                $nik = "NON-1";
            }
            else{
                $get_nik = $cari_pasien_non_nik->nik;
                $get_nomor = substr($get_nik, strlen("NON-"));
                $nik = "NON-".((int)$get_nomor + 1);
            }

            Pasien::create([
                'nik' => $nik,
                'nama' => $request->nama,
                'no_telepon' => $request->no_telepon,
                'alamat' => $request->alamat_domisili,
                'alamat_kelurahan' => $request->alamat_kelurahan,
                'alamat_kecamatan' => $request->alamat_kecamatan,
                'tgl_lahir' => $request->tgl_lahir,
                'jenis_kelamin' => $request->jenis_kelamin,
                'status' => $request->status,
                'tgl_meninggal' => $request->tgl_meninggal,
            ]);

            return response()->json("Berhasil menambahkan data");
        } else {
            // NIK is provided, check if already exists
            $pasien = Pasien::where('nik', $nik)->first();
            if($pasien==null){
                Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama,
                    'no_telepon' => $request->no_telepon,
                    'alamat' => $request->alamat_domisili,
                    'alamat_kelurahan' => $request->alamat_kelurahan,
                    'alamat_kecamatan' => $request->alamat_kecamatan,
                    'tgl_lahir' => $request->tgl_lahir,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'status' => $request->status,
                    'tgl_meninggal' => $request->tgl_meninggal,
                ]);

                return response()->json("Berhasil menambahkan data");
            }

            return response()->json("Pasien sudah terdaftar", 409);
        }
    }

    public function edit(Request $request)
    {
        $data = Pasien::find($request->id);

        if($data->nik==$request->nik){ //tidak ada perubahan nik
            $data->update([
                'id' => $request->id,
                'nik' => $request->nik,
                'nama' => $request->nama,
                'no_telepon' => $request->no_telepon,
                'alamat' => $request->alamat_domisili,
                'alamat_kecamatan' => $request->kecamatan,
                'alamat_kelurahan' => $request->kelurahan,
                'tgl_lahir' => $request->tgl_lahir,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tgl_meninggal' => $request->tgl_meninggal,
                'status' => $request->status,
            ]);

            $status = "Berhasil perbarui data";
        }
        else{
            $cek_nik = Pasien::where('nik', $request->nik)->where('id','!=', $request->id)->first();

            if($cek_nik!=null){
                $status = "NIK sudah digunakan";
            }
            else{
                $data->update([
                    'id' => $request->id,
                    'nik' => $request->nik,
                    'nama' => $request->nama,
                    'no_telepon' => $request->no_telepon,
                    'alamat' => $request->alamat_domisili,
                    'alamat_kecamatan' => $request->kecamatan,
                    'alamat_kelurahan' => $request->kelurahan,
                    'tgl_lahir' => $request->tgl_lahir,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'tgl_meninggal' => $request->tgl_meninggal,
                    'status' => $request->status,
                ]);

                $status = "Berhasil perbarui data";
            }
        }

        return response()->json($status);
        // }

        // return response()->json($data);
    }

    public function hapus(Request $request)
    {
        try {
            $data = Pasien::find($request->id);
            if ($data) {
                $data->delete();
                return response()->json("Berhasil hapus data");
            }
            return response()->json("Data tidak ditemukan", 404);
        } catch (\Illuminate\Database\QueryException $e) {
            // Error Code 23000: Integrity constraint violation (Foreign Key fails)
            if ($e->getCode() == 23000) {
                return response()->json("Gagal: Pasien tidak dapat dihapus karena masih memiliki riwayat Catatan Medis.", 409);
            }
            return response()->json("Gagal menghapus data: Terjadi kesalahan pada database.", 500);
        }
    }
}
