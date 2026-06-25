<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormLembarTransferPasien extends Model
{
    use HasFactory, SoftDeletes;

    // Guarded = 'id' artinya mengizinkan SEMUA kolom di database 
    // untuk diisi data dari form web, KECUALI id (karena id otomatis dari sistem).
    protected $guarded = ['id'];
}
