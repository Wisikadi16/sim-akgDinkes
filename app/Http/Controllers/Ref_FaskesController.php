<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ref_Faskes;

class Ref_FaskesController extends Controller
{
    public function ref_faskes(Request $request)
    {
        $data = Ref_Faskes::where('jenis', $request->jenis)->get();
        return response()->json($data);
    }
}