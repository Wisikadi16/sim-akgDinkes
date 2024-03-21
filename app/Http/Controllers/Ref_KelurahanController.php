<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\Ref_Kelurahan;

class Ref_KelurahanController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request)
    {
        if($request->kode_kelurahan!=null){
            $data = Ref_Kelurahan::where('kode_kelurahan', $request->kode_kelurahan)->first();
        }
        else{
            $data = Ref_Kelurahan::where('kode_kecamatan', $request->kode_kecamatan)->orderBy('nama_kelurahan', 'asc')->get();
        }
        return response()->json($data);
    }
}