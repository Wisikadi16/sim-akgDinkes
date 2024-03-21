<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use App\Models\Tim_Ambulan;


class AuthUserController extends Controller
{
    public function daftar()
    {
        return Inertia::render('Auth/Login', [
            'daftar' => 'daftar',
        ]);
    }

    // public function daftar_tim_ambulan()
    // {
    //     $data = User::get();

    //     foreach($data as $dt)
    //     {
    //         $ar[] = $dt->name;
    //         // $user = User::create([
    //         //         'name' => $dt->nama_tim,
    //         //         'username' => $dt->nama_tim,
    //         //         'password' => Hash::make("123456"),
    //         //         'role' => "Tim Ambulan",
    //         //     ]);
    //         $us = Tim_Ambulan::where('nama_tim', $dt->name)->first();
    //         if($us!=null){
    //         $us->update([
    //             'id_admin' => $dt->id,
    //         ]);
    //         }

    //     }
    //     return json_encode($ar);
    // }

    public function cek_daftar(Request $req)
    {
        if(Auth::attempt(['username'=>$req->username, 'password'=>$req->password])){
            return Inertia::render('Auth/Login', [
                'daftar' => 'daftar',
                'status' => 'username sudah dipakai',
            ]);
        }
        else{
            // dd($req->all());
            User::create([
                'name' => $req->name,
                'username' => $req->username,
                'password' => Hash::make($req->password),
            ]);

            return Redirect::route('auth.login');       
        }
    }

    public function login()
    {
        // dd(session()->get('status'));
        if(session()->get('status')==null){
            $status = '';
        }
        else{
            $status = session()->get('status');
        }
        return Inertia::render('Auth/Login', [
            'status' => $status,
        ]);
    }

    public function cek_login(Request $req)
    {
        // dd(Auth::user());
        if(Auth::attempt(['username'=>$req->username, 'password'=>$req->password])){
            // return Redirect::route('auth.dashboard');
            if(Auth::check() && Auth::user()->role=="admin" || Auth::user()->role=="yankes"){
                return Redirect::route('dashboard');
            }
            if(Auth::check() && Auth::user()->role=="Tim Ambulan"){
                // dd("tim_ambulan");
                return Redirect::route('dashboard.order');
            }
            if(Auth::check() && Auth::user()->role=="Operator"){
                return Redirect::route('dashboard.order');
            }
        }
        else{
            return Redirect::route('auth.login')->with(
                'status','username atau password salah'
            );
        }
        
    }

    public function dashboard(Request $req)
    {
        // dd(Auth::user());
        return Inertia::render('Dashboard/Index', [
            'role' => Auth::user()->role,
        ]);
        // return Inertia::render('Dashboard/Index', [
        //     'role' => Auth::user()->role,
        // ]);
    }

    public function logout()
    {
        // dd("logut");
        Auth::logout();
        return Redirect::route('auth.login');
    }

    public function api_login(Request $req){
        if(Auth::attempt(['username'=>$req->username, 'password'=>$req->password])){
            $data = Auth::user();
            
            return response()->json($data);
        }
        else{
            return response()->json("username atau password salah");
        }
    }

    
}
