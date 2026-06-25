<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('form__maternals', function (Blueprint $table) {
            $table->longText('ttd_penerima')->nullable()->after('ttd_penyerah');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('form__maternals', function (Blueprint $table) {
            $table->dropColumn('ttd_penerima');
        });
    }
};
