<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Form;
use App\Models\Pasien;
use App\Models\Ref_Kecamatan;
use App\Models\Ref_Kelurahan;

class Surat_Persetujuan_Tindakan_Medis extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = "form_surat_persetujuan_tindakan_medis";

    protected $fillable = [
        'id_form',
        'id_pasien',
        'nama',
        'umur',
        'jenis_kelamin',
        'alamat',
        'alamat_kelurahan',
        'alamat_kecamatan',
        'status_surat',
        'tindakan_medis',
        'terhadap',
        'memberikan_nama',
        'memberikan_umur',
        'memberikan_jenis_kelamin',
        'memberikan_alamat_kelurahan',
        'memberikan_alamat_kecamatan',
        'memberikan_alamat',
        'tambahan_pernyataan',
        'tgl_surat',
        'nama_saksi',
        'status_ttd_dokter_paramedis',
        'nama_dokter_paramedis',
        
        // INI DIA TAMBAHANNYA BANG, BIAR TTD BISA MASUK DATABASE!
        'ttd_yang_membuat_pernyataan',
        'ttd_dokter_paramedis',
        'ttd_saksi',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class, 'id_form', 'id');
    }

    public function pasien()
    {
        return $this->belongsTo(Pasien::class, 'id_pasien', 'id');
    }

    public function kecamatan()
    {
        return $this->belongsTo(Ref_Kecamatan::class, 'alamat_kecamatan', 'kode_kecamatan');
    }

    public function kelurahan()
    {
        return $this->belongsTo(Ref_Kelurahan::class, 'alamat_kelurahan', 'kode_kelurahan');
    }

    public function memberikan_kecamatan()
    {
        return $this->belongsTo(Ref_Kecamatan::class, 'memberikan_alamat_kecamatan', 'kode_kecamatan');
    }

    public function memberikan_kelurahan()
    {
        return $this->belongsTo(Ref_Kelurahan::class, 'memberikan_alamat_kelurahan', 'kode_kelurahan');
    }
}