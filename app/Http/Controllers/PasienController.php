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
        $pasien = Pasien::where('nik', $request->nik)->first();
        if($pasien==null){
            Pasien::create([
                'nik' => $request->nik,
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
            // return redirect()->route('dashboard.pasien')->with('success', 'Pasien berhasil disimpan');
        }

        return response()->json("Pasien sudah terdaftar");
        // return Redirect::route('dashboard.pasien')->with('success', 'Pasien berhasil disimpan');
        // return redirect()->route('dashboard.pasien')->with('warning', 'Pasien sudah ada');
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
        $data = Pasien::find($request->id);

        $data->delete();

        return response()->json("Berhasil hapus data");
    }
}
