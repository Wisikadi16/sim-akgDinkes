<?php

// use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthUserController;
use App\Http\Controllers\CatatanMedisController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\FormUmumController;
use App\Http\Controllers\FormNeonatalController;
use App\Http\Controllers\Ref_FaskesController;
use App\Http\Controllers\Ref_KelurahanController;
use App\Http\Controllers\Ref_KecamatanController;
use App\Http\Controllers\PetugasController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\Tim_AmbulanController;
use App\Http\Controllers\AmbulanHebatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\FormSuratPersetujuanTindakanMedisController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\FormMaternalController;
use App\Http\Controllers\FormLembarTransferPasienController;
use App\Http\Controllers\FormCmDoaController;
use App\Http\Controllers\FormKeluargaController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Homepage');
// });

// Route::get('/', function () {
//     return Inertia::render('Admin/Admin');
// });

Route::get('/dashboard2', function () {
    return Inertia::render('Admin/Dashboard');
});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/', [AuthUserController::class, 'login'])->name('login');
// Route::get('/login', function () {
//     return Inertia::render('Welcome');
// });

Route::get('/daftar', [AuthUserController::class, 'daftar'])->name('auth.daftar');
Route::post('/cek_daftar', [AuthUserController::class, 'cek_daftar'])->name('auth.cek_daftar');

Route::get('/login', [AuthUserController::class, 'login'])->name('auth.login');
Route::post('/cek_login', [AuthUserController::class, 'cek_login'])->name('auth.cek_login');
Route::get('/logout', [AuthUserController::class, 'logout'])->name('auth.logout');

    
// Route::get('/dashboard', [AuthUserController::class, 'dashboard'])->name('auth.dashboard');
Route::middleware(['auth', 'user-role:admin'])->group(function () {
    // Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Route::get('/tim_ambulan', [DashboardController::class, 'dashboard'])->name('dashboard.tim_ambulan');
    // Route::post('/tambah_simpan_tim_ambulan', [Tim_AmbulanController::class, 'tambah'])->name('tim_ambulan.tambah');
    // Route::post('/tim_ambulan/edit', [Tim_AmbulanController::class, 'edit'])->name('tim_ambulan.edit');
    // Route::post('/hapus_tim_ambulan', [Tim_AmbulanController::class, 'hapus'])->name('tim_ambulan.hapus');
    // Route::get('/daftar_tim_ambulan', [AuthUserController::class, 'daftar_tim_ambulan']);

    Route::get('/admin', [DashboardController::class, 'dashboard'])->name('dashboard.admin');
    Route::post('/ref_admin', [AdminController::class, 'ref_admin'])->name('ref_admin');
    Route::post('/tambah_simpan_admin', [AdminController::class, 'tambah'])->name('admin.tambah');
    Route::post('/hapus_admin', [AdminController::class, 'hapus'])->name('admin.hapus');
    Route::post('/edit_simpan_admin', [AdminController::class, 'edit'])->name('admin.edit');
    Route::post('/ref_username_admin', [AdminController::class, 'ref_username_admin'])->name('ref_username_admin');

});

Route::middleware(['auth', 'user-role:admin|Operator'])->group(function () {
    Route::post('/ref_tim_ambulan_order', [OrderController::class, 'ref_tim_ambulan_order'])->name('order.ref_tim_ambulan_order');
});


Route::middleware(['auth', 'user-role:admin|Tim Ambulan|Operator'])->group(function () {
    Route::get('/order', [DashboardController::class, 'dashboard'])->name('dashboard.order');
    Route::post('/ref_order', [OrderController::class, 'ref_order'])->name('ref_order');
    // Route::post('/tambah_simpan_order', [OrderController::class, 'tambah'])->name('tambah.order');
    Route::post('/order/tambah', [OrderController::class, 'tambah'])->name('tambah.order');
    // Route::post('/edit_simpan_order', [OrderController::class, 'edit'])->name('edit.order');
    Route::post('/order/edit', [OrderController::class, 'edit'])->name('edit.order');
    
    Route::post('/hapus_order', [OrderController::class, 'hapus'])->name('hapus.order');

    // Route::post('/ref_tim_ambulan', [Tim_AmbulanController::class, 'ref_tim_ambulan'])->name('ref_tim_ambulan');

    Route::get('/form_umum/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.form_umum');
    Route::get('/form_neonatal/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.neonatal');
    Route::get('/form_maternal/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.maternal');
    Route::get('/form-keluarga/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.form_keluarga');
});
Route::middleware(['auth', 'user-role:admin|Tim Ambulan'])->group(function () {
    Route::post('/ref_icd_10', [CatatanMedisController::class, 'ref_icd_10'])->name('ref_icd_10');
    Route::post('/ref_icd_9', [CatatanMedisController::class, 'ref_icd_9'])->name('ref_icd_9');

    Route::get('/catatan_medis', [DashboardController::class, 'dashboard'])->name('dashboard.catatan_medis');
    // Route::get('/catatan_medis/{id}', [DashboardController::class, 'dashboard'])->name('dashboard.catatan_medis');
    Route::post('/ref_catatan_medis', [CatatanMedisController::class, 'ref_catatan_medis'])->name('ref_catatan_medis');

    // Route::get('/petugas', [DashboardController::class, 'dashboard'])->name('dashboard.petugas');
    // Route::post('/tambah_simpan_petugas', [PetugasController::class, 'tambah'])->name('petugas.tambah');
    // Route::post('/hapus_petugas', [PetugasController::class, 'hapus'])->name('petugas.hapus');
    // Route::post('/ref_petugas', [PetugasController::class, 'ref_petugas'])->name('ref_petugas');
    // Route::post('/ref_petugas_tanggung_jawab', [PetugasController::class, 'ref_petugas_tanggung_jawab'])->name('ref_petugas_tanggung_jawab');
    // Route::post('/edit_simpan_petugas', [PetugasController::class, 'edit'])->name('petugas.edit');
    Route::post('/ref_form', [FormController::class, 'ref_form'])->name('ref_form');
    Route::post('/ref_form_maternal', [FormMaternalController::class, 'ref_form_maternal'])->name('ref_form_maternal');

    Route::post('/form/hapus', [CatatanMedisController::class, 'hapus'])->name('form.hapus');

    Route::get('/form_umum/{id}', [FormUmumController::class, 'edit'])->name('form_umum.edit');
    Route::post('/ref_pasien', [PasienController::class, 'ref_pasien'])->name('ref_pasien');
    Route::post('/ref_form_umum', [FormUmumController::class, 'ref_form_umum'])->name('ref_form_umum');

    Route::post('/form_umum_simpan', [FormUmumController::class, 'simpan'])->name('form_umum.simpan');
    Route::post('/form_umum_perbarui', [FormUmumController::class, 'perbarui'])->name('form_umum.perbarui');

    Route::post('/form_keluarga/simpan', [FormKeluargaController::class, 'simpan'])->name('form_keluarga.simpan');
    Route::post('/ref_form_keluarga', [FormKeluargaController::class, 'ref_form_keluarga'])->name('ref_form_keluarga');
    Route::post('/form_keluarga/perbarui', [FormKeluargaController::class, 'perbarui'])->name('form_keluarga.perbarui');

    Route::post('/form_neonatal/simpan', [FormNeonatalController::class, 'simpan'])->name('form_neonatal.simpan');
    Route::get('/form_neonatal/{id}', [FormNeonatalController::class, 'edit'])->name('form_neonatal.edit');
    Route::post('/form_neonatal/perbarui', [FormNeonatalController::class, 'perbarui'])->name('form_neonatal.perbarui');
    Route::post('/ref_form_neonatal', [FormNeonatalController::class, 'ref_form_neonatal'])->name('ref_form_neonatal');

    Route::get('/form_surat_keterangan_kematian/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.form_surat_keterangan_kematian');
    Route::post('/form_surat_keterangan_kematian/simpan', [FormUmumController::class, 'simpan_form_surat_keterangan_kematian'])->name('form_surat_keterangan_kematian.simpan');
    Route::post('/ref_form_surat_keterangan_kematian', [FormUmumController::class, 'ref_form_surat_keterangan_kematian'])->name('ref_form_surat_keterangan_kematian');
    Route::post('/form_surat_keterangan_kematian/perbarui', [FormUmumController::class, 'perbarui_form_surat_keterangan_kematian'])->name('form_surat_keterangan_kematian.perbarui');

    Route::get('/form_lembar_transfer_pasien/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.transfer_pasien');
    Route::post('/ref_form_lembar_transfer_pasien', [FormLembarTransferPasienController::class, 'ref_form_lembar_transfer_pasien'])->name('ref_form_lembar_transfer_pasien');
    Route::post('/form_lembar_transfer_pasien/simpan', [FormLembarTransferPasienController::class, 'simpan']);
    Route::post('/form_lembar_transfer_pasien/perbarui', [FormLembarTransferPasienController::class, 'perbarui']);

    Route::get('/form_cm_doa/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.cm_doa');
    Route::post('/ref_form_cm_doa', [FormCmDoaController::class, 'ref_form_cm_doa'])->name('ref_form_cm_doa');
    Route::post('/form_cm_doa/simpan', [FormCmDoaController::class, 'simpan']);
    Route::post('/form_cm_doa/perbarui', [FormCmDoaController::class, 'perbarui']);

    Route::get('/pasien', [DashboardController::class, 'dashboard'])->name('dashboard.pasien');
    Route::post('/pasien/tambah', [PasienController::class, 'tambah'])->name('pasien.tambah');
    Route::post('/pasien/edit', [PasienController::class, 'edit'])->name('pasien.edit');
    Route::post('/pasien/hapus', [PasienController::class, 'hapus'])->name('pasien.hapus');

    Route::get('/form_surat_persetujuan_tindakan_medis/{id?}', [DashboardController::class, 'dashboard'])->name('dashboard.form_surat_persetujuan_tindakan_medis');
    Route::post('/form_surat_persetujuan_tindakan_medis/tambah', [FormSuratPersetujuanTindakanMedisController::class, 'tambah'])->name('dashboard.form_surat_persetujuan_tindakan_medis.simpan');
    Route::post('/ref_form_surat_persetujuan_tindakan_medis', [FormSuratPersetujuanTindakanMedisController::class, 'ref_form_surat_persetujuan_tindakan_medis'])->name('ref_form_surat_persetujuan_tindakan_medis');
    Route::post('/form_surat_persetujuan_tindakan_medis/perbarui', [FormSuratPersetujuanTindakanMedisController::class, 'perbarui'])->name('form_surat_persetujuan_tindakan_medis.perbarui');
    
    Route::post('/form_maternal/simpan', [FormMaternalController::class, 'store'])->name('maternal.store');
    Route::post('/form_maternal/perbarui', [FormMaternalController::class, 'perbarui'])->name('maternal.perbarui');
    Route::get('/form_maternal/{id}/print', [FormMaternalController::class, 'print'])->name('maternal.print');
    // Route::post('/ref_dashboard', [DashboardController::class, 'ref_dashboard'])->name('ref_dashboard');
    

    // Route::get('/tim_ambulan', [DashboardController::class, 'dashboard'])->name('dashboard.tim_ambulan');
    // Route::post('/ref_tim_ambulan', [Tim_AmbulanController::class, 'ref_tim_ambulan'])->name('ref_tim_ambulan');
    // Route::post('/tambah_simpan_tim_ambulan', [Tim_AmbulanController::class, 'tambah'])->name('tim_ambulan.tambah');
    // Route::post('/edit_simpan_tim_ambulan', [Tim_AmbulanController::class, 'edit'])->name('tim_ambulan.edit');
    // Route::post('/hapus_tim_ambulan', [Tim_AmbulanController::class, 'hapus'])->name('tim_ambulan.hapus');
    // Route::post('/ref_tim_ambulan_order', [OrderController::class, 'ref_tim_ambulan_order'])->name('order.ref_tim_ambulan_order');
    

});


Route::middleware(['auth', 'user-role:Tim Ambulan'])->group(function () {
    // Route::post('/terima_order', [OrderController::class, 'terima'])->name('terima.order');
    Route::post('/order/terima', [OrderController::class, 'terima'])->name('order.terima');
    Route::post('/order/selesai', [OrderController::class, 'selesai'])->name('order.selesai');
    Route::post('/order/sampai_lokasi', [OrderController::class, 'sampai_lokasi'])->name('order.sampai_lokasi');
    Route::post('/order/bersiap_kembali', [OrderController::class, 'bersiap_kembali'])->name('order.bersiap_kembali');
    Route::post('/order/catatan', [OrderController::class, 'catatan'])->name('order.catatan');
    Route::post('/order/ajukan_rujuk', [OrderController::class, 'ajukan_rujuk'])->name('order.ajukan_rujuk');
    Route::post('/order/rujuk', [OrderController::class, 'rujuk'])->name('order.rujuk');
    Route::post('/order/sampai_rujuk', [OrderController::class, 'sampai_rujuk'])->name('order.sampai_rujuk');
    Route::post('/order/batal', [OrderController::class, 'batal'])->name('order.batal');
    
    Route::post('/tim_ambulan/kirim_lokasi', [Tim_AmbulanController::class, 'kirim_lokasi'])->name('tim_ambulan.kirim_lokasi');
    
    
    // Route::get('/order', [DashboardController::class, 'dashboard'])->name('dashboard.order');
    // Route::post('/ref_order', [OrderController::class, 'ref_order'])->name('ref_order');
    // Route::post('/tambah_simpan_order', [OrderController::class, 'tambah'])->name('tambah.order');
    // Route::post('/edit_simpan_order', [OrderController::class, 'edit'])->name('edit.order');
    // Route::post('/hapus_order', [OrderController::class, 'hapus'])->name('hapus.order');

    // Route::get('/tim_ambulan', [DashboardController::class, 'dashboard'])->name('dashboard.tim_ambulan');
    // Route::post('/ref_tim_ambulan', [Tim_AmbulanController::class, 'ref_tim_ambulan'])->name('ref_tim_ambulan');
    // Route::post('/tambah_simpan_tim_ambulan', [Tim_AmbulanController::class, 'tambah'])->name('tim_ambulan.tambah');
    // Route::post('/edit_simpan_tim_ambulan', [Tim_AmbulanController::class, 'edit'])->name('tim_ambulan.edit');
    // Route::post('/hapus_tim_ambulan', [Tim_AmbulanController::class, 'hapus'])->name('tim_ambulan.hapus');

});

Route::middleware(['auth', 'user-role:admin|yankes'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Route::get('/tim_ambulan', [DashboardController::class, 'dashboard'])->name('dashboard.tim_ambulan');
    Route::get('/tim_ambulan', [DashboardController::class, 'dashboard'])->name('dashboard.tim_ambulan');
    Route::post('/tambah_simpan_tim_ambulan', [Tim_AmbulanController::class, 'tambah'])->name('tim_ambulan.tambah');
    Route::post('/tim_ambulan/edit', [Tim_AmbulanController::class, 'edit'])->name('tim_ambulan.edit');
    Route::post('/hapus_tim_ambulan', [Tim_AmbulanController::class, 'hapus'])->name('tim_ambulan.hapus');
    Route::get('/daftar_tim_ambulan', [AuthUserController::class, 'daftar_tim_ambulan']);
});
Route::middleware(['auth', 'user-role:admin|Tim Ambulan|yankes'])->group(function () {
    Route::post('/ref_dashboard', [DashboardController::class, 'ref_dashboard'])->name('ref_dashboard');

    Route::get('/petugas', [DashboardController::class, 'dashboard'])->name('dashboard.petugas');
    Route::post('/tambah_simpan_petugas', [PetugasController::class, 'tambah'])->name('petugas.tambah');
    Route::post('/hapus_petugas', [PetugasController::class, 'hapus'])->name('petugas.hapus');
    Route::post('/ref_petugas', [PetugasController::class, 'ref_petugas'])->name('ref_petugas');
    Route::post('/ref_petugas_tanggung_jawab', [PetugasController::class, 'ref_petugas_tanggung_jawab'])->name('ref_petugas_tanggung_jawab');
    Route::post('/edit_simpan_petugas', [PetugasController::class, 'edit'])->name('petugas.edit');
});
Route::middleware(['auth', 'user-role:admin|Tim Ambulan|yankes|Operator'])->group(function () {
    Route::post('/ref_laporan', [LaporanController::class, 'ref_laporan'])->name('ref_laporan');
    Route::get('/laporan/export-operasional', [LaporanController::class, 'export_operasional_excel'])->name('laporan.export_operasional');
    Route::post('/ref_tim_ambulan', [Tim_AmbulanController::class, 'ref_tim_ambulan'])->name('ref_tim_ambulan');
    Route::get('/laporan', [DashboardController::class, 'dashboard'])->name('dashboard.laporan');
});


    
// Route::get('/form_umum', [FormUmumController::class, 'index'])->name('form.index');

// Route::get('/petugas', [DashboardController::class, 'petugas'])->name('dashboard.petugas');


// Route::get('/order', [DashboardController::class, 'dashboard'])->name('dashboard.order');
// Route::post('/ref_order', [OrderController::class, 'ref_order'])->name('ref_order');
// Route::post('/tambah_simpan_order', [OrderController::class, 'tambah'])->name('tambah.order');
// Route::post('/edit_simpan_order', [OrderController::class, 'edit'])->name('edit.order');
// Route::post('/hapus_order', [OrderController::class, 'hapus'])->name('hapus.order');
Route::post('/ref_faskes', [Ref_FaskesController::class, 'ref_faskes'])->name('ref_faskes');
Route::post('/ref_kelurahan', [Ref_KelurahanController::class, 'index'])->name('ref_kelurahan.index');
Route::post('/ref_kecamatan', [Ref_KecamatanController::class, 'index'])->name('ref_kecamatan.index');
Route::post('/cari_nik', [PasienController::class, 'cari_nik'])->name('cari.nik');

// Route::get('/order', [DashboardController::class, 'dashboard'])->name('dashboard.order');
// Route::post('/ref_order', [OrderController::class, 'ref_order'])->name('ref_order');
// Route::post('/tambah_simpan_order', [OrderController::class, 'tambah'])->name('tambah.order');
// Route::post('/edit_simpan_order', [OrderController::class, 'edit'])->name('edit.order');
// Route::post('/hapus_order', [OrderController::class, 'hapus'])->name('hapus.order');

// Route::post('/ref_tim_ambulan', [AmbulanHebatController::class, 'ambulan'])->name('ambulanhebat.ambulan');
// Route::post('/ref_tim_petugas', [AmbulanHebatController::class, 'petugas'])->name('ambulanhebat.petugas');

// require __DIR__.'/auth.php';
