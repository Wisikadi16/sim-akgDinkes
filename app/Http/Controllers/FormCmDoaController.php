<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\FormCmDoa;
use App\Models\Pasien;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;

class FormCmDoaController extends Controller
{
    public function index($id = null)
    {
        return Inertia::render('Form/Form_CM_DOA', [
            'id' => $id,
        ]);
    }

    public function simpan(Request $request)
    {
        if (!empty($request->nik) && strpos($request->nik, 'NON-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }
        try{ 
            return \DB::transaction(function () use ($request) {
                $nik = $request->nik;
                if ($nik === null || $nik === '') {
                    $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                    if($cari_pasien_non_nik==null){
                        $nik = "NON-1";
                    } else {
                        $get_nik = $cari_pasien_non_nik->nik;
                        $get_nomor = substr($get_nik, strlen("NON-"));
                        $nik = "NON-".((int)$get_nomor + 1);
                    }
                    $pasien = Pasien::create([
                        'nik' => $nik,
                        'nama' => $request->nama_pasien,
                        'alamat' => $request->alamat,
                        'no_telepon' => $request->no_telepon,
                    ]);
                } else {
                    $pasien = Pasien::where('nik', $nik)->first();
                    if ($pasien == null) {
                        $pasien = Pasien::create([
                            'nik' => $nik,
                            'nama' => $request->nama_pasien,
                            'alamat' => $request->alamat,
                            'no_telepon' => $request->no_telepon,
                        ]);
                    } else {
                        $pasien->update([
                            'nama' => $request->nama_pasien,
                            'alamat' => $request->alamat,
                            'no_telepon' => $request->no_telepon,
                        ]);
                    }
                }

                $form_doa = FormCmDoa::create(array_merge($request->except(['id', 'id_form']), [
                    'nik' => $nik,
                    'kondisi_kritis' => is_array($request->kondisi_kritis) ? json_encode($request->kondisi_kritis) : $request->kondisi_kritis,
                    'jalan_napas' => is_array($request->jalan_napas) ? json_encode($request->jalan_napas) : $request->jalan_napas,
                    'pernafasan' => is_array($request->pernafasan) ? json_encode($request->pernafasan) : $request->pernafasan,
                    'sirkulasi' => is_array($request->sirkulasi) ? json_encode($request->sirkulasi) : $request->sirkulasi,
                    'eksposur' => is_array($request->eksposur) ? json_encode($request->eksposur) : $request->eksposur,
                    'kesimpulan_awal' => is_array($request->kesimpulan_awal) ? json_encode($request->kesimpulan_awal) : $request->kesimpulan_awal,
                    'riwayat_dahulu' => is_array($request->riwayat_dahulu) ? json_encode($request->riwayat_dahulu) : $request->riwayat_dahulu,
                    'diagnosis_medis' => is_array($request->diagnosis_medis) ? json_encode($request->diagnosis_medis) : $request->diagnosis_medis,
                    'terapi_tindakan' => is_array($request->terapi_tindakan) ? json_encode($request->terapi_tindakan) : $request->terapi_tindakan,
                ]));

                $form = Form::create([
                    'id_form' => $form_doa->id,
                    'id_pasien' => $pasien->id,
                    'id_pembuat' => Auth::check() ? Auth::id() : 1,
                    'tgl_penanganan' => date('Y-m-d'),
                    'jenis' => 'Form CM DOA' 
                ]);

                $form_doa->update(['id_form' => $form->id]);

                return response()->json("Berhasil simpan data");
            });
        } catch (\Exception $e) {
            \Log::error('Error pada Form CM DOA: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal simpan data. Silahkan coba lagi.'], 500);
        }
    }

    public function ref_form_cm_doa(Request $request)
    {
        $id = $request->id_form ?? $request->id;
        if ($id == null) {
            $data = null;
        } else {
            $form = Form::find($id);
            if($form) {
                $data = FormCmDoa::where('id_form', $form->id)->first();
            } else {
                $data = FormCmDoa::find($id);
            }
        }
        return response()->json($data);
    }

    public function perbarui(Request $request)
    {
        if (!empty($request->nik) && strpos($request->nik, 'NON-') !== 0) {
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'nik' => ['size:16', 'regex:/^[0-9]+$/'],
            ], [
                'nik.size' => 'NIK harus terdiri dari tepat 16 digit angka.',
                'nik.regex' => 'NIK harus berupa angka.',
            ]);

            if ($validator->fails()) {
                return response($validator->errors()->first(), 422);
            }
        }

        return \DB::transaction(function () use ($request) {
            $id_form = $request->id_form ?? $request->id;
            $form = Form::find($id_form);
            $data = FormCmDoa::where('id_form', $form ? $form->id : $id_form)->first();
            if(!$data) $data = FormCmDoa::find($form ? $form->id_form : $id_form);
            
            if (!$data) {
                return response()->json(['error' => 'Data tidak ditemukan'], 404);
            }

            $pasien = Pasien::find($form ? $form->id_pasien : $data->id_pasien);
            if ($pasien) {
                $pasien->update([
                    'nik' => $request->nik,
                    'nama' => $request->nama_pasien,
                    'alamat' => $request->alamat,
                    'no_telepon' => $request->no_telepon,
                ]);
            }
            
            $data->update(array_merge($request->except(['id', 'id_form']), [
                'kondisi_kritis' => is_array($request->kondisi_kritis) ? json_encode($request->kondisi_kritis) : $request->kondisi_kritis,
                'jalan_napas' => is_array($request->jalan_napas) ? json_encode($request->jalan_napas) : $request->jalan_napas,
                'pernafasan' => is_array($request->pernafasan) ? json_encode($request->pernafasan) : $request->pernafasan,
                'sirkulasi' => is_array($request->sirkulasi) ? json_encode($request->sirkulasi) : $request->sirkulasi,
                'eksposur' => is_array($request->eksposur) ? json_encode($request->eksposur) : $request->eksposur,
                'kesimpulan_awal' => is_array($request->kesimpulan_awal) ? json_encode($request->kesimpulan_awal) : $request->kesimpulan_awal,
                'riwayat_dahulu' => is_array($request->riwayat_dahulu) ? json_encode($request->riwayat_dahulu) : $request->riwayat_dahulu,
                'diagnosis_medis' => is_array($request->diagnosis_medis) ? json_encode($request->diagnosis_medis) : $request->diagnosis_medis,
                'terapi_tindakan' => is_array($request->terapi_tindakan) ? json_encode($request->terapi_tindakan) : $request->terapi_tindakan,
            ]));
            
            if ($form) {
                $form->update([
                    'id_pasien' => $pasien ? $pasien->id : $form->id_pasien,
                ]);
            }

            return response()->json("Berhasil perbarui data");
        });
    }
}
