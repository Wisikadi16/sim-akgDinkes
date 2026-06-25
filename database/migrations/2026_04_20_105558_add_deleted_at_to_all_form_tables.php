<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
        
        $tables = [
            'form', 'form_cm_doas', 'form_keluargas', 'form_lembar_transfer_pasiens',
            'form__maternals', 'form_neonatal', 'form_umum', 
            'form_surat_keterangan_kematian', 'form_surat_persetujuan_tindakan_medis'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && !Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->softDeletes();
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'form', 'form_cm_doas', 'form_keluargas', 'form_lembar_transfer_pasiens',
            'form__maternals', 'form_neonatal', 'form_umum', 
            'form_surat_keterangan_kematian', 'form_surat_persetujuan_tindakan_medis'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'deleted_at')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropSoftDeletes();
                });
            }
        }
    }
};
