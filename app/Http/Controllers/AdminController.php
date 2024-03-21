<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Response;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function ref_admin(Request $request)
    {
        // $data = Ref_Kecamatan::all();
        if($request->id!=null){
            $data = User::find($request->id);
        }
        else{
            $data = User::get();
        }

        return response()->json($data);
    }

    public function ref_username_admin(Request $request)
    {
        $data = User::where("username", $request->username)->first();
        if($data==null){
            $data="";
        }

        return response()->json($data);
    }

    public function tambah(Request $request)
    {
        // dd($request->all());
        User::create([
            'name' => $request->nama,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return Redirect::route('dashboard.admin');
    }

    public function hapus(Request $request)
    {
        // dd($request->id);
        $data = User::find($request->id);
        $data->delete();

        return Redirect::route('dashboard.admin');
    }

    public function edit(Request $request)
    {
        $data = User::find($request->id);

        // dd($petugas);
        // dd($request->all());
        if($request->password!=null){
            $data->update([
                'name' => $request->nama,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
        }
        else{
            $data->update([
                'name' => $request->nama,
                'username' => $request->username,
                'role' => $request->role,
            ]);
        }

        return Redirect::route('dashboard.admin');
    }
}
