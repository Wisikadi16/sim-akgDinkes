<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form_Umum extends Model
{
    use HasFactory;
    protected $guarded = [];  

    protected $table = "form_umum";
    
    function pasien(){
        return $this->belongsTo('App\Models\Pasien','id_pasien');
    }
}