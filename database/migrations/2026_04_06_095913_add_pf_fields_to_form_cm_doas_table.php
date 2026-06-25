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
        Schema::table('form_cm_doas', function (Blueprint $table) {
            $table->string('pf_normocephal', 20)->nullable();
            $table->string('pf_sclera_ikterik_1', 20)->nullable();
            $table->string('pf_sclera_ikterik_2', 20)->nullable();
            $table->string('pf_conj_anemis_1', 20)->nullable();
            $table->string('pf_conj_anemis_2', 20)->nullable();
            $table->string('pf_perbesaran_kelenjar_getah_bening', 20)->nullable();
            $table->string('pf_deviasi_trachea', 20)->nullable();
            $table->string('pf_suara_dasar_veikuler_1', 20)->nullable();
            $table->string('pf_suara_dasar_veikuler_2', 20)->nullable();
            $table->string('pf_rhonki_1', 20)->nullable();
            $table->string('pf_rhonki_2', 20)->nullable();
            $table->string('pf_wheezing_1', 20)->nullable();
            $table->string('pf_wheezing_2', 20)->nullable();
            $table->string('pf_bunyi_jantung_1_2', 20)->nullable();
            $table->string('pf_bunyi_jantung_1_2_status', 100)->nullable();
            $table->string('pf_bising_usus', 20)->nullable();
            $table->string('pf_bising_usus_status', 100)->nullable();
            $table->string('pf_nyeri_tekan_abdomen', 20)->nullable();
            $table->text('pf_nyeri_tekan_abdomen_area')->nullable();
            $table->string('pf_akral_hangat_a_1', 20)->nullable();
            $table->string('pf_akral_hangat_a_2', 20)->nullable();
            $table->string('pf_akral_hangat_b_1', 20)->nullable();
            $table->string('pf_akral_hangat_b_2', 20)->nullable();
            $table->string('pf_oedema_a_1', 20)->nullable();
            $table->string('pf_oedema_a_2', 20)->nullable();
            $table->string('pf_oedema_b_1', 20)->nullable();
            $table->string('pf_oedema_b_2', 20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_cm_doas', function (Blueprint $table) {
            $table->dropColumn([
                'pf_normocephal',
                'pf_sclera_ikterik_1',
                'pf_sclera_ikterik_2',
                'pf_conj_anemis_1',
                'pf_conj_anemis_2',
                'pf_perbesaran_kelenjar_getah_bening',
                'pf_deviasi_trachea',
                'pf_suara_dasar_veikuler_1',
                'pf_suara_dasar_veikuler_2',
                'pf_rhonki_1',
                'pf_rhonki_2',
                'pf_wheezing_1',
                'pf_wheezing_2',
                'pf_bunyi_jantung_1_2',
                'pf_bunyi_jantung_1_2_status',
                'pf_bising_usus',
                'pf_bising_usus_status',
                'pf_nyeri_tekan_abdomen',
                'pf_nyeri_tekan_abdomen_area',
                'pf_akral_hangat_a_1',
                'pf_akral_hangat_a_2',
                'pf_akral_hangat_b_1',
                'pf_akral_hangat_b_2',
                'pf_oedema_a_1',
                'pf_oedema_a_2',
                'pf_oedema_b_1',
                'pf_oedema_b_2',
            ]);
        });
    }
};
