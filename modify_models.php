<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$models = [
    'Form', 'FormCmDoa', 'FormKeluarga', 'FormLembarTransferPasien',
    'Form_Maternal', 'Form_Neonatal', 'Form_Umum', 
    'Surat_Keterangan_Kematian', 'Surat_Persetujuan_Tindakan_Medis'
];

$tables = [];

foreach($models as $modelName) {
    // 1. Modify Model file
    $path = "app/Models/$modelName.php";
    if (!file_exists($path)) continue;
    
    $content = file_get_contents($path);
    if (strpos($content, 'SoftDeletes') === false) {
        $content = str_replace('use Illuminate\Database\Eloquent\Model;', "use Illuminate\Database\Eloquent\Model;\nuse Illuminate\Database\Eloquent\SoftDeletes;", $content);
        
        if (strpos($content, 'use HasFactory;') !== false) {
            $content = str_replace('use HasFactory;', "use HasFactory, SoftDeletes;", $content);
        } else {
            $content = preg_replace('/(class \w+ extends Model\s*\{)/', "$1\n    use SoftDeletes;", $content);
        }
        file_put_contents($path, $content);
        echo "Updated $modelName.php\n";
    }
    
    // 2. Get table name
    $class = "\\App\\Models\\$modelName";
    if (class_exists($class)) {
        $tables[] = (new $class())->getTable();
    }
}

// 3. Update migration file
$migs = glob('database/migrations/*_add_deleted_at_to_all_form_tables.php');
if (count($migs) > 0) {
    $migPath = $migs[0];
    $tablesExport = var_export($tables, true);

    $upLogic = <<<PHP
        \$tables = $tablesExport;
        foreach (\$tables as \$table) {
            if (Schema::hasTable(\$table) && !Schema::hasColumn(\$table, 'deleted_at')) {
                Schema::table(\$table, function (Blueprint \$t) {
                    \$t->softDeletes();
                });
            }
        }
PHP;

    $downLogic = <<<PHP
        \$tables = $tablesExport;
        foreach (\$tables as \$table) {
            if (Schema::hasTable(\$table) && Schema::hasColumn(\$table, 'deleted_at')) {
                Schema::table(\$table, function (Blueprint \$t) {
                    \$t->dropSoftDeletes();
                });
            }
        }
PHP;

    $migContent = file_get_contents($migPath);
    // Be careful with replacing if it already contains the logic
    if (strpos($migContent, 'Schema::hasTable') === false) {
        $migContent = preg_replace('/(public function up\(\): void\s*\{\s*)/', "$1\$upLogic\n", $migContent);
        $migContent = preg_replace('/(public function down\(\): void\s*\{\s*)/', "$1\$downLogic\n", $migContent);
        file_put_contents($migPath, $migContent);
        echo "Updated migration.\n";
    }
}
