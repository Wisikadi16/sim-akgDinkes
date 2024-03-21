<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Pasien;

use App\Models\Tim_Ambulan;
use App\Models\Order;
use App\Models\Catatan_Medis;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;
use DateTime;

class OrderController extends Controller
{
    public function ref_tim_ambulan_order(Request $request)
    {
        $tim_ambulan = Tim_Ambulan::get();
        $data = [];

        foreach ($tim_ambulan as $ind => $val) {
            $order = Order::where('id_tim_ambulan', $val->id)->orderBy('id', 'DESC')->first();
            
            $data[] = $val;
            $data[$ind]['order'] = $order;
        }

        return response()->json($data);
    }

    public function ref_order(Request $request)
    {
        if($request->id==null){
            if(Auth::check() && Auth::user()->role!="admin"){
                if(Auth::user()->role=="Tim Ambulan"){
                    $id_ambulan = Tim_Ambulan::where('id_admin', Auth::user()->id)->first();
                    // $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_tim_ambulan', Auth::user()->id)->orderBy('id', 'DESC')->get();
                    $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_tim_ambulan', $id_ambulan->id)->orderBy('id', 'DESC')->get();
                    // dd($data);
                }
                if(Auth::user()->role=="Operator"){
                    $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_petugas_user', Auth::user()->id)->orderBy('id', 'DESC')->get();
                }
                // $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->orderBy('id', 'DESC')->get();

            }
            else{
                $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->orderBy('id', 'DESC')->get();
            }
        }
        else{
            // if(Auth::check() && Auth::user()->role!="admin"){
            //     $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->find($request->id);
            // }
            // else{
                $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->find($request->id);
            // }
        }

        return response()->json($data);
    }

    public function tambah(Request $request){
        Order::create([
            'cara_order' => $request->cara_order,
            'id_petugas_user' => Auth::user()->id,
            'nama_penelepon' => $request->nama_penelepon,
            'nama_pasien' => $request->nama_pasien,
            'no_penelepon' => $request->no_penelepon,
            // 'nama_pasien' => $request->nama_pasien,
            'kasus' => $request->kasus,
            'alamat' => $request->alamat,
            'kecamatan' => $request->kecamatan,
            'kelurahan' => $request->kelurahan,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'id_tim_ambulan' => $request->id_tim_ambulan,
            'waktu_order' => $request->waktu_order,
            'status' => "belum diterima",
        ]);

        // return Redirect::route('dashboard.order');
        return response()->json("Berhasil tambah order");
    }

    public function edit(Request $request)
    {
        $order = Order::find($request->id);

        $order->update([
            'cara_order' => $request->cara_order,
            'id_petugas_user' => Auth::user()->id,
            'nama_penelepon' => $request->nama_penelepon,
            'no_penelepon' => $request->no_penelepon,
            'kasus' => $request->kasus,
            'alamat' => $request->alamat,
            'kecamatan' => $request->kecamatan,
            'kelurahan' => $request->kelurahan,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'id_tim_ambulan' => $request->id_tim_ambulan,
            'waktu_order' => $request->waktu_order,
        ]);

        // return Redirect::route('dashboard.order');
        return response()->json("Update berhasil");
    }

    public function hapus(Request $request)
    {
        // dd($request->id);
        $order = Order::find($request->id);
        $order->delete();

        return Redirect::route('dashboard.order');
    }

    public function terima(Request $request)
    {
        // $order = Order::find($request->id);
        // // $waktu = new DateTime();
        // $order->update([
        //     'waktu_terima' => date('d/m/Y H:i'),
        //     'status' => "sudah diterima",
        // ]);

        // return Redirect::route('dashboard.order');

        try {
            $order = Order::find($request->id);

            if ($order !== null) {
                $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

                if ($tim_ambulan !== null) {
                    $tim_ambulan->update(['status' => "sedang berjalan"]);

                    $order->update([
                        'waktu_terima' => date('d/m/Y H:i'),
                        'status' => "sudah diterima",
                    ]);

                    return response()->json([
                        'status' => 'berhasil',
                        'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                        'message' => 'Order berhasil diterima'
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'data' => null,
                        'message' => 'Tim Ambulan tidak ditemukan'
                    ], 404);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function sampai_lokasi(Request $request)
    {
        try {
            $order = Order::find($request->id);

            if ($order !== null) {
                $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

                if ($tim_ambulan !== null) {
                    $tim_ambulan->update(['status' => "sedang berjalan"]);

                    $order->update([
                        'waktu_sampai_lokasi' => date('d/m/Y H:i'),
                        'status' => "sampai lokasi",
                    ]);

                    return response()->json([
                        'status' => 'berhasil',
                        'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                        'message' => 'Sampai lokasi order'
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'data' => null,
                        'message' => 'Tim Ambulan tidak ditemukan'
                    ], 404);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function selesai(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_selesai' => date('d/m/Y H:i'),
                    'status' => "selesai penanganan",
                ]);

                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order selesai'
                ]);
                // return response()->json($order);
            }
            else{
                // return response()->json("Error");
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
        // $order = Order::find($request->id);

        // // dd(date('d-m-Y H:i'));
        // $order->update([
        //     'waktu_selesai' => date('d/m/Y H:i'),
        //     'status' => "selesai",
        // ]);

        // return Redirect::route('dashboard.order');
    }

    public function bersiap_kembali(Request $request)
    {
        try{
            // $tim_ambulan = Tim_Ambulan::where('id_admin', $request->id_admin)->first();

            $order = Order::find($request->id);
            $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

            if($order!=null && $tim_ambulan!=null){
                $tim_ambulan->update([
                    'status' => "bersiap",
                ]);
                $order->update([
                    'waktu_bersiap_kembali' => date('d/m/Y H:i'),
                    'status' => "selesai",
                ]);

                // return response()->json(["tim_ambulan"=>$tim_ambulan, "order"=>$order]);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                    'message' => 'Ambulan bersiap kembali'
                ]);
            }
            else{
                // return response()->json("Error");
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function catatan(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'catatan' => $request->catatan,
                ]);

                // return response()->json($order);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Catatan berhasil diubah'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function ajukan_rujuk(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_ajukan_rujuk' => date('d/m/Y H:i'),
                    'status' => "ajukan rujuk",
                ]);

                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order ajukan rujuk'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function rujuk(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_rujuk' => date('d/m/Y H:i'),
                    'status' => "rujuk",
                    // 'status' => "sudah dirujuk",
                    // 'faskes_rujukan' => $request->faskes_rujukan,
                ]);

                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    // 'message' => 'Order sudah dirujuk'
                    'message' => 'Order rujuk'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function sampai_rujuk(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_sampai_rujuk' => date('d/m/Y H:i'),
                    'status' => "sampai rujuk",
                ]);

                // return response()->json($order);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order sampai rujuk'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function batal(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

                if ($tim_ambulan !== null) {
                    $tim_ambulan->update(['status' => "non aktif"]);

                    $order->update([
                        'waktu_terima' => date('d/m/Y H:i'),
                        'status' => "batal",
                    ]);

                    return response()->json([
                        'status' => 'berhasil',
                        'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                        'message' => 'Order dibatalkan'
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'data' => null,
                        'message' => 'Tim Ambulan tidak ditemukan'
                    ], 404);
                }

                // $order->update([
                //     'status' => "batal",
                // ]);

                // return response()->json($order);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function notif_order(Request $request)
    {
        if($request->id!=null){
            $id_ambulan = Tim_Ambulan::where('id_admin', $request->id)->first();
            // $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_tim_ambulan', Auth::user()->id)->orderBy('id', 'DESC')->get();
            $data = Order::where('id_tim_ambulan', $id_ambulan->id)->where('status', 'belum diterima')->get();
            // dd($data);
            return response()->json(["data"=>$data, "jumlah"=>count($data)]);
        }
        else{

            return response()->json("Error");
        }
    }

    public function api_ref_order(Request $request)
    {
        if($request->id!=null){
            // $data = Tim_Ambulan::where('id_admin', $request->id)->first();
            $id_ambulan = Tim_Ambulan::where('id_admin', $request->id)->first();
            // $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_tim_ambulan', $id_ambulan->id)->orderBy('id', 'DESC')->get();
            $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->with('user')->with('tim_ambulan')->where('id_tim_ambulan', $id_ambulan->id)->orderBy('id', 'DESC')->get();

            // foreach($data as $val){
            //     $val['kecamatan'] = $val['ref_kecamatan']['nama_kecamatan'];
            //     unset($val['ref_kecamatan']);
            //     $val['kelurahan'] = $val['ref_kelurahan']['nama_kelurahan'];
            //     unset($val['ref_kelurahan']);
            // }
            return response()->json($data);
        }
        else{
            return response()->json("Error");
        }
    }

    public function api_ref_order_id(Request $request)
    {
        if($request->id!=null){
            $data = Order::with('ref_kecamatan')->with('ref_kelurahan')->find($request->id);

            return response()->json($data);
        }
        else{
            return response()->json("Error");
        }
    }

    public function api_terima(Request $request)
    {
        try {
            $order = Order::find($request->id);

            if ($order !== null) {
                $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

                if ($tim_ambulan !== null) {
                    $tim_ambulan->update(['status' => "sedang berjalan"]);

                    $order->update([
                        'waktu_terima' => date('d/m/Y H:i'),
                        'status' => "sudah diterima",
                    ]);

                    return response()->json([
                        'status' => 'berhasil',
                        'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                        'message' => 'Order berhasil diterima'
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'data' => null,
                        'message' => 'Tim Ambulan tidak ditemukan'
                    ], 404);
                }
            } else {
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function api_selesai(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_selesai' => date('d/m/Y H:i'),
                    'status' => "selesai penanganan",
                ]);

                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order selesai'
                ]);
                // return response()->json($order);
            }
            else{
                // return response()->json("Error");
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function api_batal(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

                if ($tim_ambulan !== null) {
                    $tim_ambulan->update(['status' => "non aktif"]);

                    $order->update([
                        'waktu_terima' => date('d/m/Y H:i'),
                        'status' => "batal",
                    ]);

                    return response()->json([
                        'status' => 'berhasil',
                        'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                        'message' => 'Order dibatalkan'
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'data' => null,
                        'message' => 'Tim Ambulan tidak ditemukan'
                    ], 404);
                }

                // $order->update([
                //     'status' => "batal",
                // ]);

                // return response()->json($order);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }
        // $order = Order::find($request->id);

        // if($order!=null){
        //     $order->update([
        //         'status' => "batal",
        //     ]);

        //     return response()->json($order);
        // }
        // else{
        //     return response()->json("Error");
        // }
    }

    public function api_rujuk(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_rujuk' => date('d/m/Y H:i'),
                    'status' => "rujuk",
                ]);

                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order rujuk'
                ]);
                // return response()->json($order);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function api_sampai_rujuk(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'waktu_sampai_rujuk' => date('d/m/Y H:i'),
                    'status' => "sampai rujuk",
                ]);

                // return response()->json($order);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Order sampai rujuk'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function api_bersiap_kembali(Request $request)
    {
        try{
            // $tim_ambulan = Tim_Ambulan::where('id_admin', $request->id_admin)->first();

            $order = Order::find($request->id);
            $tim_ambulan = Tim_Ambulan::find($order->id_tim_ambulan);

            if($order!=null && $tim_ambulan!=null){
                $tim_ambulan->update([
                    'status' => "bersiap",
                ]);
                $order->update([
                    'waktu_bersiap_kembali' => date('d/m/Y H:i'),
                    'status' => "selesai",
                ]);

                // return response()->json(["tim_ambulan"=>$tim_ambulan, "order"=>$order]);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order, 'tim_ambulan' => $tim_ambulan],
                    'message' => 'Ambulan bersiap kembali'
                ]);
            }
            else{
                // return response()->json("Error");
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }

    public function api_catatan(Request $request)
    {
        try{
            $order = Order::find($request->id);

            if($order!=null){
                $order->update([
                    'catatan' => $request->catatan,
                ]);

                // return response()->json($order);
                return response()->json([
                    'status' => 'berhasil',
                    'data' => ['order' => $order],
                    'message' => 'Catatan berhasil diubah'
                ]);
            }
            else{
                return response()->json([
                    'status' => 'error',
                    'data' => null,
                    'message' => 'Order tidak ditemukan'
                ], 404);
                // return response()->json("Error");
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => null,
                'message' => $e->getMessage()
            ], 500);
        }

    }
}
