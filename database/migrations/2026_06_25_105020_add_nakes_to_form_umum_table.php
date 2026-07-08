<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('form_umum', function (Blueprint $table) {
            $table->string('ita_nakes_1')->nullable()->after('ita_bidan');
            $table->string('ita_nakes_2')->nullable()->after('ita_nakes_1');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_umum', function (Blueprint $table) {
            $table->dropColumn(['ita_nakes_1', 'ita_nakes_2']);
        });
    }
};
