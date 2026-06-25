<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('form', function (Blueprint $table) {
            $currentSqlMode = \DB::selectOne('SELECT @@SESSION.sql_mode as mode')->mode;
            \DB::statement("SET SESSION sql_mode = REPLACE(REPLACE('$currentSqlMode', 'NO_ZERO_DATE', ''), 'NO_ZERO_IN_DATE', '')");
            \DB::statement("ALTER TABLE form MODIFY jenis VARCHAR(100) NULL");
            \DB::statement("SET SESSION sql_mode = '$currentSqlMode'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form', function (Blueprint $table) {
            $currentSqlMode = \DB::selectOne('SELECT @@SESSION.sql_mode as mode')->mode;
            \DB::statement("SET SESSION sql_mode = REPLACE(REPLACE('$currentSqlMode', 'NO_ZERO_DATE', ''), 'NO_ZERO_IN_DATE', '')");
            \DB::statement("ALTER TABLE form MODIFY jenis VARCHAR(20) NULL");
            \DB::statement("SET SESSION sql_mode = '$currentSqlMode'");
        });
    }
};
