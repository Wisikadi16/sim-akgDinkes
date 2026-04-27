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
use App\Models\Form_Umum;
use App\Models\Surat_Persetujuan_Tindakan_Medis;
use App\Models\Surat_Keterangan_Kematian;
use App\Models\Tim_Ambulan;
use App\Models\Icd_10;
use App\Models\Icd_9;

class CatatanMedisController extends Controller
{
    public function ref_catatan_medis(Request $request)
    {
        if ($request->id == null) {
            $periode_dari = $request->periode_dari;
            $periode_sampai = $request->periode_sampai;
            if (Auth::user()->role == "Tim Ambulan") {
                $data = Form::with('pasien')->whereBetween('tgl_penanganan', [$periode_dari, $periode_sampai])->where("id_pembuat", Auth::user()->id)->orderBy('id', 'desc')
                    // ->get();
                    ->paginate(10);
            } else {
                // $form_umum = Form_Umum::with('pasien')->get();
                $data = Form::with('pasien')->whereBetween('tgl_penanganan', [$periode_dari, $periode_sampai])->orderBy('id', 'desc')
                    // ->get();
                    ->paginate(10);
            }

            // return response()->json($data);

            return response()->json([
                'data' => $data->items(),
                'total' => $data->total(), // Total jumlah data
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
            ]);
        } else {
            // $data = Form_Umum::find($request->id);
            $data = Form::with('pasien')->orderBy('id', 'desc')->find($request->id);
        }

        return response()->json($data);
    }

    public function ref_icd_10()
    {
        $data = Icd_10::get();

        return response()->json($data);
    }

    public function ref_icd_9()
    {
        $data = Icd_9::get();

        return response()->json($data);
    }

    public function hapus(Request $request)
    {
        $data = Form::find($request->id);

        $jenis_form = $data->jenis;
        if ($jenis_form == "form umum") {
            $data2 = Form_Umum::where('id_form', $request->id)->first();

            $data2->delete();
            $data->delete();
        }
        if ($jenis_form == "form neonatal") {
            $data2 = Form_Neonatal::where('id_form', $request->id)->first();

            $data2->delete();
            $data->delete();
        }

        return response()->json("Berhasil hapus data");
    }
}
