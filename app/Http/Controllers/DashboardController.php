<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

use App\Models\User;
use App\Models\Order;
use App\Models\Tim_Ambulan;
use DateTime;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboard(Request $req)
    {
        // dd("dash");
        return Inertia::render('Dashboard/Index', [
            // 'role' => Auth::user()->role,
            'auth' => Auth::user(),
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return Redirect::route('auth.login');
    }

    public function ref_dashboard(Request $request)
    {
        if($request->order){
            $dateString = $request->tgl;

            $dateObject = new DateTime($dateString);
            $tahun = $dateObject->format('Y');
            $bulan_ini = $dateObject->format('m');
            $hari_ini = $dateObject->format('d');
            $index_hari_ini = $hari_ini-1;
            // if($index_hari_ini<10){
            //     $index_hari_ini = "0" . $index_hari_ini;
            // }

            $data = Tim_Ambulan::with(['order' => function ($query) use ($tahun) {
                $query->whereRaw("YEAR(STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i')) = ?", [$tahun]);
            }])->get();

            $newData = [];

            foreach ($data as $dt) {
                $newDt = [];
                $newDt['id'] = $dt->id;
                $newDt['nama_tim'] = $dt->nama_tim;
                // Add other properties you want to include
                $newDt['total_order_tahun_ini'] = $dt->order->count();

                $newDt['order_per_bulan'] = [];
                for ($y = 0; $y < 12; $y++) {
                    // $newDt['order_per_bulan'][$bulan - 1] = Order::where('id_tim_ambulan', $dt->id)
                    //     ->whereRaw("YEAR(STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i')) = ?", [$tahun])
                    //     ->whereRaw("MONTH(STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i')) = ?", [$bulan])
                    //     ->get();
                    if ($y < 10) {
                        $y_bulan = $y + 1;
                        $tgl_bulan = "0" . $y_bulan;
                    } else {
                        $tgl_bulan = $y + 1;
                    }
                    $order_bulan = Order::where('id_tim_ambulan', $dt->id)
                    ->whereRaw("YEAR(STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i')) = ?", [$tahun])
                    ->whereRaw("MONTH(STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i')) = ?", [$tgl_bulan])
                    ->get();
                
                    $newDt['order_per_bulan'][$y] = $order_bulan->count();
                }
                
                $cari_bulan = new DateTime($tahun . '-' . $bulan_ini . '-01');
                $total_hari_bulan = intval($cari_bulan->format('t'));

                for ($x = 0; $x < $total_hari_bulan; $x++) {
                    if ($x < 10) {
                        $x_hari = $x + 1;
                        $tgl_hari = "0" . $x_hari;
                    } else {
                        $tgl_hari = $x + 1;
                    }
                    // $tgl_hari = str_pad($hari, 2, '0', STR_PAD_LEFT);

                    $order_hari = Order::where('id_tim_ambulan', $dt->id)
                    ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') >= ?", [$tahun . '-' . $bulan_ini . '-' . $tgl_hari . ' 00:00'])
                    ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') < ?", [$tahun . '-' . $bulan_ini . '-' . $tgl_hari . ' 23:59'])
                    ->get();
         
                    $newDt['order_per_hari_bulan_ini'][$x] = $order_hari->count();

                    if($index_hari_ini==$x){
                        $newDt['total_order_hari_ini'] = $order_hari->count();    
                    }

                }
                // $newDt['total_order_per_hari_bulan_ini'] = collect($newDt['order_per_hari_bulan_ini'])->flatten()->count();
                $newDt['total_order_per_hari_bulan_ini'] = array_sum($newDt['order_per_hari_bulan_ini']);
                $newDt['total_order_per_bulan'] = array_sum($newDt['order_per_bulan']);


                $newData[] = $newDt;
            }

            // }
            // for($y=0; $y<12; $y++){
            //     if ($y < 9) {
            //         $bulan = $y + 1;
            //         $tgl_bulan = "0" . $bulan;
            //     } else {
            //         $tgl_bulan = $y + 1;
            //     }
            //     $cari_bulan = new DateTime($tahun.'-'.$tgl_bulan.'-01');
            //     $total_hari_bulan = intval($cari_bulan->format('t'));
                
            //     for($x=0; $x<$total_hari_bulan; $x++){
            //         if ($x < 9) {
            //             $hari = $x + 1;
            //             $tgl_hari = "0" . $hari;
            //         } else {
            //             $tgl_hari = $x + 1;
            //         }
            //         $data[$y][$x] = Tim_Ambulan::with(['order' => function ($query) use ($tgl_hari, $tgl_bulan, $tahun) {
            //             $query->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') >= ?", [$tahun.'-'.$tgl_bulan.'-'.$tgl_hari.' 00:00'])
            //                 ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') < ?", [$tahun.'-'.$tgl_bulan.'-'.$tgl_hari.' 23:59']);
            //         }])->get();
    
            //         $data[$y][$x]->each(function ($val) use ($total_hari_bulan) {
            //             $val->total_order = $val->order->count();
            //         });
            //     }
            // }


            // $total_hari_bulan = intval($dateObject->format('t'));
            // for($x=0; $x<$total_hari_bulan; $x++){
            //     if ($x < 9) {
            //         $hari = $x + 1;
            //         $tgl_hari = "0" . $hari;
            //     } else {
            //         $tgl_hari = $x + 1;
            //     }
            //     $data[] = Tim_Ambulan::with(['order' => function ($query) use ($tgl_hari) {
            //         $query->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') >= ?", ['2024-01-' . $tgl_hari . ' 00:00'])
            //             ->whereRaw("STR_TO_DATE(waktu_order, '%d/%m/%Y %H:%i') < ?", ['2024-01-' . $tgl_hari . ' 23:59']);
            //     }])->get();

            //     $data[$x]->each(function ($val) use ($total_hari_bulan) {
            //         $val->total_order = $val->order->count();
            //     });
            // }
        }
        else{
            $data = null;
        }

        // return response()->json($data);
        
        return response()->json($newData);
        // return response()->json(['data'=>$data, 'data2'=>$data2]);
    }
}
