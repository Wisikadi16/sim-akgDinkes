<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form_Neonatal extends Model
{
    use HasFactory;
    protected $guarded = [];  

    protected $table = "form_neonatal";
    
    function pasien(){
        return $this->belongsTo('App\Models\Pasien','id_pasien');
    }

    function form(){
        return $this->belongsTo('App\Models\Form','id_form');
    }
}