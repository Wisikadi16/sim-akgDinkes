<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE form_neonatal 
            MODIFY kepala TEXT,
            MODIFY ket_kepala TEXT,
            MODIFY mata TEXT,
            MODIFY ket_mata TEXT,
            MODIFY leher TEXT,
            MODIFY ket_leher TEXT,
            MODIFY jantung TEXT,
            MODIFY ket_jantung TEXT,
            MODIFY paru TEXT,
            MODIFY ket_paru TEXT,
            MODIFY abdomen TEXT,
            MODIFY ket_abdomen TEXT,
            MODIFY ekstremitas TEXT,
            MODIFY ket_ekstremitas TEXT,
            MODIFY genitalia TEXT,
            MODIFY ket_genitalia TEXT,
            MODIFY anus TEXT,
            MODIFY ket_anus TEXT
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE form_neonatal 
            MODIFY kepala VARCHAR(255),
            MODIFY ket_kepala VARCHAR(255),
            MODIFY mata VARCHAR(255),
            MODIFY ket_mata VARCHAR(255),
            MODIFY leher VARCHAR(255),
            MODIFY ket_leher VARCHAR(255),
            MODIFY jantung VARCHAR(255),
            MODIFY ket_jantung VARCHAR(255),
            MODIFY paru VARCHAR(255),
            MODIFY ket_paru VARCHAR(255),
            MODIFY abdomen VARCHAR(255),
            MODIFY ket_abdomen VARCHAR(255),
            MODIFY ekstremitas VARCHAR(255),
            MODIFY ket_ekstremitas VARCHAR(255),
            MODIFY genitalia VARCHAR(255),
            MODIFY ket_genitalia VARCHAR(255),
            MODIFY anus VARCHAR(255),
            MODIFY ket_anus VARCHAR(255)
        ');
    }
};
