<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Http;

use App\Models\Tim_Ambulan;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class Tim_AmbulanController extends Controller
{
    public function ref_tim_ambulan(Request $req)
    {
        if($req->id!=null){
            // $data = Tim_Ambulan::find($req->id);
            $data = Tim_Ambulan::with('user')->find($req->id);
            // dd($data);
        }
        else{
            // $data1 = Tim_Ambulan::get();

            // $data1 = collect($data1);
            try {
                $response = Http::timeout(3)->get("http://119.2.50.170:9094/navara/api/ambulan_hebat");
                if ($response->successful()) {
                    $data2 = $response->json();
                } else {
                    $data2 = [];
                }
            } catch (\Exception $e) {
                $data2 = [];
            }

            foreach ($data2 as $item) {
                $existingRecord = Tim_Ambulan::where('idk_navara', $item['idk'])->first();

                if (!$existingRecord) {
                    Tim_Ambulan::create([
                        'idk_navara' => $item['idk'],
                        'id_assets_navara' => $item['id_assets'],
                        'no_polisi' => $item['no_polisi'],
                        'tipe' => $item['tipe'],
                        'merk' => $item['merk'],
                        'nama_tim' => $item['merk']." ".$item['tipe'],
                        'no_stnk' => $item['no_stnk'],
                        'no_mesin' => $item['no_mesin'],
                        'no_rangka' => $item['no_rangka'],
                        'tahun_perolehan' => $item['tahun_perolehan'],
                        'jenis_bb' => $item['jenis_bb'],
                        'besar_cc' => $item['besar_cc'],
                        'masa_berlaku_stnk' => $item['masa_berlaku_stnk'],
                        'status' => 'bersiap'
                    ]);
                } else {
                    $existingRecord->update([
                        'idk_navara' => $item['idk'],
                        'id_assets_navara' => $item['id_assets'],
                        'no_polisi' => $item['no_polisi'],
                        'tipe' => $item['tipe'],
                        'merk' => $item['merk'],
                        'no_stnk' => $item['no_stnk'],
                        'no_mesin' => $item['no_mesin'],
                        'no_rangka' => $item['no_rangka'],
                        'tahun_perolehan' => $item['tahun_perolehan'],
                        'jenis_bb' => $item['jenis_bb'],
                        'besar_cc' => $item['besar_cc'],
                        'masa_berlaku_stnk' => $item['masa_berlaku_stnk'],
                    ]);
                }
            }

            $tim_ambulan = Tim_Ambulan::get();
            $data = [];

            foreach ($tim_ambulan as $ind => $val) {
                $order = Order::where('id_tim_ambulan', $val->id)->orderBy('id', 'DESC')->first();
                
                $data[] = $val;
                $data[$ind]['order'] = $order;
            }
            // $data = $data1->merge($data2);
            // $data = $data2;

        }
        return response()->json($data);
    }

    public function tambah(Request $request)
    {
        if($request->hasFile('gambar')){
            $namafile = time().$request->file('gambar')->getClientOriginalName();
            $request->file('gambar')->move(public_path('gambar/tim_ambulan'), $namafile);
            // dd($namafile);
        }
        else{
            $namafile="";
        }
        Tim_Ambulan::create([
            'gambar' => $namafile,
            'id_admin' => $request->id_admin,
            'nama_tim' => $request->nama_tim,
            'longitude' => $request->longitude,
            'latitude' => $request->latitude,
            'status' => $request->status,
        ]);

        return Redirect::route('dashboard.tim_ambulan');
    }

    public function edit(Request $request)
    {
        $data = Tim_Ambulan::find($request->id);
        // dd($data);
        if($request->hasFile('gambar_baru')){
            if(file_exists(public_path('gambar/tim_ambulan/'.$data->gambar)) && $data->gambar!=null){
                unlink(public_path('gambar/tim_ambulan/'.$data->gambar));
            }
            $namafile = time().$request->file('gambar_baru')->getClientOriginalName();
            $request->file('gambar_baru')->move(public_path('gambar/tim_ambulan'), $namafile);
            // dd($namafile);
        }
        else{
            $namafile=$data->gambar;
        }

        // dd($namafile);
        $data->update([
            'gambar' => $namafile,
            'id_admin' => $request->id_admin,
            'nama_tim' => $request->nama_tim,
            'homebase' => $request->homebase,
            'longitude' => $request->longitude,
            'latitude' => $request->latitude,
            'status' => $request->status,
        ]);

        // return Redirect::route('dashboard.tim_ambulan');
        return response()->json("Berhasil edit data");
        // return response()->json($request->hasFile('gambar_baru'));
    }

    public function hapus(Request $request)
    {
        // dd($request->id);
        $data = Tim_Ambulan::find($request->id);
        if(file_exists(public_path('gambar/tim_ambulan/'.$data->gambar))){
            unlink(public_path('gambar/tim_ambulan/'.$data->gambar));
        }
        $data->delete();

        return Redirect::route('dashboard.tim_ambulan');
    }

    public function kirim_lokasi(Request $req){
        if($req->latitude!=null && $req->longitude!=null){
            $data = Tim_Ambulan::where('id_admin', Auth::user()->id)->first();
            $data->update([
                'latitude' => $req->latitude,
                'longitude' => $req->longitude,
            ]);
        }
        else{
            $data = "Error";
        }

        return response()->json($data);
    }

    public function api_lokasi_tim_ambulan(Request $req)
    {
        if($req->id_admin!=null && $req->latitude!=null && $req->longitude!=null){
            // $data = Tim_Ambulan::find($req->id);
            $data = Tim_Ambulan::where('id_admin', $req->id_admin)->first();
            $data->update([
                'latitude' => $req->latitude,
                'longitude' => $req->longitude,
            ]);
        }
        else{
            $data = "Error";
        }

        return response()->json($data);
    }

    public function api_semua_lokasi_tim_ambulan()
    {
        $data = Tim_Ambulan::get();

        return response()->json($data);
    }
}
