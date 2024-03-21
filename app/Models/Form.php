<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;
    protected $guarded = [];  

    protected $table = "form";
    
    function pasien(){
        return $this->belongsTo('App\Models\Pasien','id_pasien');
    }

    function tim_ambulan(){
        return $this->belongsTo('App\Models\Tim_Ambulan','id_tim_ambulan');
    }

    function form_umum(){
        return $this->belongsTo('App\Models\Form_Umum','id_form');
    }

    function form_neonatal(){
        return $this->belongsTo('App\Models\Form_Neonatal','id_form');
    }

}