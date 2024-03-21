<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Ref_Kecamatan;

class Ref_KecamatanController extends Controller
{
    public function index(Request $request)
    {
        // $data = Ref_Kecamatan::all();
        if($request->kode_kecamatan!=null){
            $data = Ref_Kecamatan::where('kode_kecamatan', $request->kode_kecamatan)->first();
        }
        else{
            $data = Ref_Kecamatan::orderBy('nama_kecamatan','asc')->get();
        }
        
        return response()->json($data);
        // return response()->json("halo");
    }
}