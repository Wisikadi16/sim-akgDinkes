<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = "order";

    function user(){
        return $this->belongsTo('App\Models\User','id_petugas_user');
    }

    function tim_ambulan(){
        return $this->belongsTo('App\Models\Tim_Ambulan','id_tim_ambulan');
    }

    function ref_kecamatan(){
        return $this->belongsTo('App\Models\Ref_Kecamatan', 'kecamatan', 'kode_kecamatan');
    }

    function ref_kelurahan(){
        return $this->belongsTo('App\Models\Ref_Kelurahan','kelurahan', 'kode_kelurahan');
    }

}
