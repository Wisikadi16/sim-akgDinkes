<?php
$tables = [
    'form__maternals',
    'form_neonatal',
    'form_lembar_transfer_pasiens',
    'form_surat_keterangan_kematian',
    'form_surat_persetujuan_tindakan_medis',
    'form_cm_doas',
    'form_umum',
];
foreach($tables as $table) {
    if(Schema::hasTable($table)) {
        echo "\n=== $table ===\n";
        $columns = Schema::getColumnListing($table);
        foreach($columns as $col) {
            if(strpos($col, 'ttd') !== false) {
                echo "- $col (" . Schema::getColumnType($table, $col) . ")\n";
            }
        }
    }
}
