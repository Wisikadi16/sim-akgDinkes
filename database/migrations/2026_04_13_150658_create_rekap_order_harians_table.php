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
        Schema::create('rekap_order_harians', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_tim_ambulan');
            $table->date('tanggal');
            $table->integer('total_order')->default(0);
            $table->timestamps();
            $table->index(['id_tim_ambulan', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekap_order_harians');
    }
};
