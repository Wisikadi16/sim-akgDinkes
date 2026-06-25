<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormKeluarga extends Model
{
    use HasFactory, SoftDeletes;
    protected $guarded = ['id'];
    protected $table = 'form_keluargas';

    protected $casts = [
        'anggota_keluarga' => 'array',
        'sanitasi' => 'array',
        'phbs' => 'array',
        'tugas_kesehatan' => 'array',
        'kemandirian' => 'array',
        'individu_sakit' => 'array',
        'asuhan_keperawatan' => 'array',
        'register_perkesmas' => 'array',
    ];
}
