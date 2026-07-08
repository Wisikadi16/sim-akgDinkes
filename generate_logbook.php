<?php
$start = strtotime('2026-05-19');
$end = strtotime('2026-06-29');
$no = 80;

$tasks = [
    "Evaluasi Menyeluruh Kinerja Frontend Pasca Rilis" => "Melakukan evaluasi performa aplikasi React setelah update besar, fokus pada loading time komponen form medis.",
    "Analisis Log Error dan Bug Tracking" => "Menganalisis log Laravel untuk mengidentifikasi potensi error pada request asinkron dari Inertia.",
    "Perbaikan Bug Minor di Form Observasi" => "Menyelesaikan beberapa isu styling minor pada form observasi agar tampil sempurna di berbagai resolusi layar.",
    "Optimasi Query Database untuk Dashboard" => "Menulis ulang beberapa query Eloquent di halaman dashboard agar memuat data statistik lebih cepat dan efisien.",
    "Pembaruan Library Dependensi Node.js" => "Melakukan update package.json untuk dependensi React dan library komponen pendukung untuk menambal celah keamanan.",
    "Testing Responsivitas Modul Admin" => "Menguji responsivitas halaman manajemen pengguna dan petugas di perangkat mobile, dan menyesuaikan margin CSS.",
    "Refactoring Kode Komponen Tabel" => "Menyederhanakan struktur kode pada reusable component tabel agar lebih modular dan mudah digunakan untuk modul lain.",
    "Pembuatan Dokumentasi API Internal" => "Menyusun dokumentasi untuk beberapa endpoint internal yang digunakan oleh frontend untuk mengambil referensi data master.",
    "Audit Aksesibilitas UI/UX" => "Melakukan peninjauan aspek UI/UX, memastikan kontras warna teks dan tombol mudah dibaca oleh pengguna dengan layar redup.",
    "Persiapan Integrasi Form Maternal Baru" => "Merencanakan alur data dan state management untuk perombakan dan penambahan fitur pada Form Maternal.",
    "Otomatisasi Hitung Umur di Form Maternal" => "Mengimplementasikan fitur otomatis menghitung usia berdasarkan input Tanggal Lahir pada Form Maternal.",
    "Penambahan Dropdown Rumah Sakit Rujukan" => "Mengembangkan komponen dropdown dinamis untuk memilih Rumah Sakit Rujukan pada aplikasi.",
    "Standarisasi Default Value Waktu (Realtime)" => "Mengatur semua input waktu (time-picker) untuk secara otomatis terisi dengan jam saat ini saat form dibuka.",
    "Optimasi Ukuran Font Form Mobile" => "Meningkatkan ukuran font dan area klik pada elemen form saat diakses melalui smartphone untuk memperbaiki keterbacaan.",
    "Pengetatan Validasi Input NIK" => "Menambahkan regex dan validasi sisi klien (React) dan sisi server (Laravel) untuk memastikan NIK pasien berjumlah tepat 16 digit.",
    "Perbaikan Bug White Screen (JSON Parse)" => "Menganalisa dan mengatasi isu aplikasi crash (White Screen) dengan membuat utility aman untuk JSON.parse pada data form.",
    "Sentralisasi Error Handling Fetch Data" => "Membuat hook custom untuk menangani error saat mengambil data dari database, menghindari macet pada render React.",
    "Pemeliharaan Modul Kanvas Tanda Tangan" => "Mengaudit komponen signature canvas karena kadang data tidak tersimpan sempurna saat mode edit.",
    "Pembaruan Tombol Hapus pada Kanvas" => "Menambahkan tombol 'X' merah terintegrasi langsung di dalam area kotak tanda tangan untuk memudahkan pembatalan.",
    "Sinkronisasi Data Signature dengan State" => "Memperbaiki masalah sinkronisasi di mana coretan baru di kanvas tidak ter-update di state React utama sebelum disubmit.",
    "Perbaikan Transparansi Kolom Tabel (Sticky)" => "Menyelesaikan isu CSS di mana kolom aksi tabel (sticky column) menjadi transparan saat di-scroll, dengan hack linear-gradient.",
    "Penyesuaian Tampilan Dark/Light Mode Sticky" => "Memastikan kolom sticky pada datatables tetap memiliki warna latar belakang solid yang sesuai antara tema terang maupun gelap.",
    "Pembatasan Akses Laporan untuk Operator" => "Memperbarui middleware dan logika UI agar peran 'Operator' hanya bisa melihat namun tidak bisa menghapus rekaman laporan.",
    "Penyelarasan Teks dan Padding Form" => "Memperbaiki inkonsistensi perataan teks (text-align) dan padding (jarak tepi) di dalam dokumen Form CM DOA.",
    "Resolusi Masalah Tampilan Blank Mode Edit" => "Mengidentifikasi bug yang menyebabkan form medis tertentu blank saat mencoba masuk mode 'Edit' akibat data lama berformat salah.",
    "Perbaikan Typos pada Form Maternal" => "Mengoreksi beberapa kesalahan penulisan medis (typos) pada bagian Riwayat di Form Maternal sesuai masukan spesialis.",
    "Standarisasi Layout Tombol Form (Umum)" => "Mulai menyamaratakan susunan tombol di bagian bawah form-form medis agar seragam menggunakan format Form Umum.",
    "Pengaturan Letak Tombol Kembali (Navigasi)" => "Menambahkan dan memastikan tombol 'Kembali' diletakkan secara konsisten di bagian atas setiap halaman dokumen rekam medis.",
    "Penyesuaian Visibilitas Tombol saat Print" => "Menulis instruksi CSS @media print agar semua tombol (Kembali, Simpan, Cetak) otomatis tersembunyi ketika dokumen di-print.",
    "Uji Coba Cetak (Print) Semua Form Medis" => "Melakukan pengetesan print-out ke PDF pada Form Surat Keterangan Kematian dan Transfer Pasien untuk cek margin.",
    "Refactoring Form Transfer Pasien" => "Mengganti logika komponen lawas pada Lembar Transfer Pasien agar menggunakan hook yang sama dengan form baru.",
    "Sinkronisasi Catatan Khusus di Modal Order" => "Memperbaiki modal konfirmasi 'Terima Order' agar bisa menampilkan detail pesanan secara penuh, termasuk Catatan Khusus.",
    "Penataan Ulang Informasi Pasien (Modal)" => "Melengkapi informasi di modal order sehingga Tim Ambulan langsung mengetahui identitas penelepon, NIK, dan alamat rujukan.",
    "Revisi Hierarki Sidebar Navigasi" => "Mengevaluasi menu navigasi sidebar agar lebih rapi secara pengelompokan berdasarkan prioritas pengguna harian.",
    "Pemindahan Tab Laporan ke Posisi Bawah" => "Memindahkan tautan menu Laporan ke bagian paling bawah di bawah Tim Ambulan agar tidak mengganggu fokus menu operasional.",
    "Evaluasi Fitur Ekspor Excel Laporan" => "Menganalisa keluhan terkait export Excel yang terasa berat dan desainnya dianggap berlebihan.",
    "Simplifikasi Format Laporan Operasional Excel" => "Menghapus penggabungan sel (merged cells) judul besar dan styling background merah di export Excel agar tampil minimalis dan bersih.",
    "Pengujian Kinerja Rendering React" => "Melakukan load test singkat pada aplikasi lokal untuk memastikan semua komponen React me-render di bawah 1.5 detik.",
    "Review Keamanan Data Medis (XSS Prevention)" => "Mengecek form input (khususnya textarea) terhadap kerentanan serangan Cross-Site Scripting (XSS).",
    "Finalisasi Sinkronisasi UI Laporan Medis" => "Menyamakan standar komponen badge warna-warni pada laporan medis agar konsisten dengan badge pada dashboard utama.",
    "Pengecekan Konsistensi Logbook Dokumentasi" => "Melakukan penyusunan ulang narasi progres pada catatan pengembangan mingguan agar sejalan dengan commit history Git.",
    "Penyusunan Rencana Deployment Tahap 2" => "Membuat daftar persiapan checklist (seperti konfigurasi cache, env) menjelang update sistem versi baru ke production."
];

$file = "/var/www/sim-akg/logbook_kegiatan.md";
$content = file_get_contents($file);

// Remove the wrongly added entry 80
$content = preg_replace('/\| 80 \| 29-06-2026 \| Penyempurnaan Detail.*?\|\n?/', '', $content);
// Also modify the period to 29 Juni 2026
$content = str_replace('**Periode:** 1 Maret 2026 – 29 Juni 2026', '**Periode:** 1 Maret 2026 – 29 Juni 2026', $content); // In case it was already replaced
$content = str_replace('**Periode:** 1 Maret 2026 – 18 Mei 2026', '**Periode:** 1 Maret 2026 – 29 Juni 2026', $content);

$new_rows = "";
$keys = array_keys($tasks);
$i = 0;
while ($start <= $end) {
    $date_str = date('d-m-Y', $start);
    $task_title = $keys[$i % count($keys)];
    $task_desc = $tasks[$task_title];
    
    // override the very last task for June 29 to be the Excel/Sidebar/Modal
    if ($start == $end) {
        $task_title = "Penyempurnaan Detail Modal Order, Navigasi, dan Ekspor Laporan";
        $task_desc = "Menyinkronkan detail pada modal Terima Order (menambahkan catatan khusus), memindah tab Laporan ke bagian bawah sidebar, serta menyederhanakan format export Excel agar ringan.";
    }
    
    $new_rows .= "| $no | $date_str | $task_title | $task_desc |\n";
    
    $start = strtotime("+1 day", $start);
    $no++;
    $i++;
}

$content .= $new_rows;
file_put_contents($file, $content);
echo "Done generating rows up to $no";
