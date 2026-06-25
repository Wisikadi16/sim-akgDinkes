<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekapOrderHarian extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_tim_ambulan',
        'tanggal',
        'total_order'
    ];

    public function tim_ambulan()
    {
        return $this->belongsTo(Tim_Ambulan::class, 'id_tim_ambulan', 'id');
    }
}
