<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Form_Umum extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = [];  

    protected $table = "form_umum";
    
    function pasien(){
        return $this->belongsTo('App\Models\Pasien','id_pasien');
    }

    function form(){
        return $this->belongsTo('App\Models\Form','id_form');
    }
}