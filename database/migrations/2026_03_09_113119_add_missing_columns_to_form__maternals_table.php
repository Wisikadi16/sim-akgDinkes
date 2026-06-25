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
        Schema::table('form__maternals', function (Blueprint $table) {
            $table->json('monitoring')->nullable()->after('tindakan_therapy');
            $table->json('handover')->nullable()->after('monitoring');
            $table->longText('ttd_penyerah')->nullable()->after('handover');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form__maternals', function (Blueprint $table) {
            $table->dropColumn(['id_pasien', 'monitoring', 'handover', 'ttd_penyerah']);
        });
    }
};
