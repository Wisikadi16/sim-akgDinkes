<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    use HasFactory;
    protected $guarded = [];

    // protected $table = "pasien";

    function ref_kecamatan(){
        return $this->belongsTo('App\Models\Ref_Kecamatan', 'alamat_kecamatan', 'kode_kecamatan');
    }

    function ref_kelurahan(){
        return $this->belongsTo('App\Models\Ref_Kelurahan','alamat_kelurahan', 'kode_kelurahan');
    }
}
