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
        Schema::table('form_neonatal', function (Blueprint $table) {
            $table->string('jam_lahir', 10)->nullable()->after('tgl_penanganan');
        });
    }

    public function down(): void
    {
        Schema::table('form_neonatal', function (Blueprint $table) {
            $table->dropColumn('jam_lahir');
        });
    }
};
