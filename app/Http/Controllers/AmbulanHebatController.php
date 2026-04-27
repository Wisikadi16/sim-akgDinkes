<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Tim_Ambulan;
use App\Models\Petugas;

class AmbulanHebatController extends Controller
{
    // public function ambulan()
    // {
    //     $data = Tim_Ambulan::get();
    //     return response()->json($data);
    // }

    // public function petugas(Request $request)
    // {
    //     if($request->tanggung_jawab==null){
    //         $data = Petugas::get();
    //     }
    //     else{
    //         $data = Petugas::where('tanggung_jawab', $request->tanggung_jawab)->get();
    //     }
    //     return response()->json($data);
    // }
}