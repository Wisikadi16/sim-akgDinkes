<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Pasien;
use App\Models\Form;
use App\Models\Form_Neonatal;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;

class FormController extends Controller
{
    public function ref_form(Request $request){
        if($request->id==null){
            $data = Form::get();
        }
        else{
            $data = Form::with('pasien')->find($request->id);
            // foreach($data as $dt){
            if($data->jenis=="form umum"){
                $data = Form::with('pasien')->with('form_umum')->find($request->id);
                
            }
            else if($data->jenis=="form neonatal"){
                $data = Form::with('pasien')->with('form_neonatal')->find($request->id);   
            }
            // }
        }
        
        return response()->json($data);
    }
}