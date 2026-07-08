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
        Schema::table('form_umum', function (Blueprint $table) {
            $table->longText('anatomi_tubuh')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('form_umum', function (Blueprint $table) {
            $table->dropColumn('anatomi_tubuh');
        });
    }
};
