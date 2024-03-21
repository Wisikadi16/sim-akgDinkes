<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthUserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Tim_AmbulanController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', [AuthUserController::class, 'api_login'])->name('auth.api.api_login');
Route::post('/notif_order', [OrderController::class, 'notif_order'])->name('api.notif_order');
Route::post('/ref_order_id', [OrderController::class, 'api_ref_order_id'])->name('api.ref_order_id');
Route::post('/ref_order', [OrderController::class, 'api_ref_order'])->name('api.ref_order');
Route::post('/terima_order', [OrderController::class, 'api_terima'])->name('api.terima_order');
Route::post('/sampai_lokasi_order', [OrderController::class, 'sampai_lokasi'])->name('api.sampai_lokasi_order');
Route::post('/selesai_order', [OrderController::class, 'api_selesai'])->name('api.selesai_order');
Route::post('/batal_order', [OrderController::class, 'api_batal'])->name('api.batal_order');
Route::post('/rujuk_order', [OrderController::class, 'api_rujuk'])->name('api.rujuk_order');
Route::post('/sampai_rujuk_order', [OrderController::class, 'api_sampai_rujuk'])->name('api.sampai_rujuk_order');
Route::post('/bersiap_kembali_order', [OrderController::class, 'api_bersiap_kembali'])->name('api.bersiap_kembali_order');
Route::post('/catatan_order', [OrderController::class, 'api_catatan'])->name('api.catatan_order');

Route::post('/lokasi_tim_ambulan', [Tim_AmbulanController::class, 'api_lokasi_tim_ambulan'])->name('api.lokasi_tim_ambulan');
Route::get('/semua_lokasi_tim_ambulan', [Tim_AmbulanController::class, 'api_semua_lokasi_tim_ambulan'])->name('api.semua_lokasi_tim_ambulan');


