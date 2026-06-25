<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Form; // Added for Form::class
use App\Models\Pasien; // Added for Pasien::class

class Surat_Keterangan_Kematian extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'id_form',
        'id_pasien',
        'no_surat',
        'nama',
        'tempat_lahir',
        'tgl_lahir',
        'jenis_kelamin',
        'agama',
        'alamat',
        'alamat_kelurahan',
        'alamat_kecamatan',
        'tgl_meninggal',
        'jam_meninggal',
        'tgl_surat',
        'nama_ttd_dokter',
    ];

    protected $table = "form_surat_keterangan_kematian";

    public function form()
    {
        return $this->belongsTo(Form::class, 'id_form', 'id');
    }

    public function pasien()
    {
        return $this->belongsTo(Pasien::class, 'id_pasien', 'id');
    }
}
