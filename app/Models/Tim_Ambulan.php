<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tim_Ambulan extends Model
{
    use HasFactory;
    protected $guarded = [];  

    protected $table = "tim_ambulan";

    function user(){
		  return $this->belongsTo('App\Models\User','id_admin');
	}

    function order(){
        return $this->hasMany('App\Models\Order','id_tim_ambulan');
    }
    
}