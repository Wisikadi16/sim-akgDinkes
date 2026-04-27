<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Order;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function ref_laporan(Request $request){
        if($request->jenis=="jenis pelayanan"){
            if($request->dari_tanggal!=null && $request->sampai_tanggal!=null){
                $dari_tanggal = Carbon::createFromFormat('m/d/Y H:i', $request->dari_tanggal);
                // $sampai_tanggal = \DateTime::createFromFormat('m/d/Y H:i', $request->sampai_tanggal)->format('Y-m-d H:i:s');

                $data = $dari_tanggal;
                // $data = Order::whereBetween('waktu_order', [$dari_tanggal, $sampai_tanggal])
                // ->groupBy('cara_order')
                // ->select(DB::raw('cara_order, COUNT(*) as total'))
                // ->get();
            }
            else{
                $data = Order::groupBy('cara_order')
                ->select(DB::raw('cara_order, COUNT(*) as total'))
                ->get();
            }

        }

        return response()->json($data);
    }
}