<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

// use App\Models\AmbulanHebat_Ambulan;
use App\Models\Petugas;

class PetugasController extends Controller
{
    public function ref_petugas_tanggung_jawab(Request $request)
    {
        if($request->tanggung_jawab==null){
            $data = Petugas::get();
        }
        else{
            $data = Petugas::where('tanggung_jawab', $request->tanggung_jawab)->get();
        }
        return response()->json($data);
    }

    public function tambah(Request $request)
    {
        // dd($request->all());
        Petugas::create([
            'nama' => $request->nama,
            'tanggung_jawab' => $request->tanggung_jawab,
            'status' => $request->status,
        ]);
        
        return Redirect::route('dashboard.petugas');
    }

    public function hapus(Request $request)
    {
        // dd($request->id);
        $petugas = Petugas::find($request->id);
        $petugas->delete();

        return Redirect::route('dashboard.petugas');
    }

    // public function id_petugas(Request $request)
    // {
    //     $petugas = Petugas::find($request->id);
        
    //     return response()->json($petugas);
    // }

    public function ref_petugas(Request $request)
    {
        if($request->id==null){
            $petugas = Petugas::get();
        }
        else{
            $petugas = Petugas::find($request->id);
        }
        
        return response()->json($petugas);
    }

    public function edit(Request $request)
    {
        $petugas = Petugas::find($request->id);
        
        // dd($petugas);
        // dd($request->all());
        $petugas->update([
            'nama' => $request->nama,
            'tanggung_jawab' => $request->tanggung_jawab,
            'status' => $request->status,
        ]);
        
        return Redirect::route('dashboard.petugas');
    }
}