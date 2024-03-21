<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Icd_10 extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = "icd_10";

    // function ref_kecamatan(){
    //     return $this->belongsTo('App\Models\Ref_Kecamatan', 'alamat_kecamatan', 'kode_kecamatan');
    // }
}
