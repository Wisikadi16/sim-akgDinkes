<?php
$tasks = [
    ["Evaluasi Menyeluruh Kinerja Frontend", "Melakukan evaluasi performa aplikasi React setelah update besar, fokus pada loading time komponen form medis."],
    ["Analisis Log Error dan Bug Tracking", "Menganalisis log Laravel untuk mengidentifikasi potensi error pada request asinkron dari Inertia."],
    ["Perbaikan Bug Minor di Form Observasi", "Menyelesaikan beberapa isu styling minor pada form observasi agar tampil sempurna di berbagai resolusi layar."],
    ["Optimasi Query Database untuk Dashboard", "Menulis ulang beberapa query Eloquent di halaman dashboard agar memuat data statistik lebih cepat dan efisien."],
    ["Pembaruan Library Dependensi Node.js", "Melakukan update package.json untuk dependensi React dan library komponen pendukung untuk menambal celah keamanan."],
    ["Testing Responsivitas Modul Admin", "Menguji responsivitas halaman manajemen pengguna dan petugas di perangkat mobile, dan menyesuaikan margin CSS."],
    ["Refactoring Kode Komponen Tabel", "Menyederhanakan struktur kode pada reusable component tabel agar lebih modular dan mudah digunakan untuk modul lain."],
    ["Pembuatan Dokumentasi API Internal", "Menyusun dokumentasi untuk beberapa endpoint internal yang digunakan oleh frontend untuk mengambil referensi data master."],
    ["Audit Aksesibilitas UI/UX", "Melakukan peninjauan aspek UI/UX, memastikan kontras warna teks dan tombol mudah dibaca oleh pengguna dengan layar redup."],
    ["Persiapan Integrasi Form Maternal Baru", "Merencanakan alur data dan state management untuk perombakan dan penambahan fitur pada Form Maternal."],
    ["Otomatisasi Hitung Umur di Form Maternal", "Mengimplementasikan fitur otomatis menghitung usia berdasarkan input Tanggal Lahir pada Form Maternal."],
    ["Penambahan Dropdown Rumah Sakit Rujukan", "Mengembangkan komponen dropdown dinamis untuk memilih Rumah Sakit Rujukan pada aplikasi."],
    ["Standarisasi Default Value Waktu", "Mengatur semua input waktu (time-picker) untuk secara otomatis terisi dengan jam saat ini saat form dibuka."],
    ["Optimasi Ukuran Font Form Mobile", "Meningkatkan ukuran font dan area klik pada elemen form saat diakses melalui smartphone untuk memperbaiki keterbacaan."],
    ["Pengetatan Validasi Input NIK", "Menambahkan regex dan validasi sisi klien (React) dan sisi server (Laravel) untuk memastikan NIK pasien berjumlah tepat 16 digit."],
    ["Perbaikan Bug White Screen", "Menganalisa dan mengatasi isu aplikasi crash (White Screen) dengan membuat utility aman untuk JSON.parse pada data form."],
    ["Sentralisasi Error Handling Fetch Data", "Membuat hook custom untuk menangani error saat mengambil data dari database, menghindari macet pada render React."],
    ["Pemeliharaan Modul Kanvas Tanda Tangan", "Mengaudit komponen signature canvas karena kadang data tidak tersimpan sempurna saat mode edit."],
    ["Pembaruan Tombol Hapus pada Kanvas", "Menambahkan tombol 'X' merah terintegrasi langsung di dalam area kotak tanda tangan untuk memudahkan pembatalan."],
    ["Sinkronisasi Data Signature dengan State", "Memperbaiki masalah sinkronisasi di mana coretan baru di kanvas tidak ter-update di state React utama sebelum disubmit."],
    ["Perbaikan Transparansi Kolom Tabel", "Menyelesaikan isu CSS di mana kolom aksi tabel (sticky column) menjadi transparan saat di-scroll, dengan hack linear-gradient."],
    ["Penyesuaian Tampilan Dark/Light Mode Sticky", "Memastikan kolom sticky pada datatables tetap memiliki warna latar belakang solid yang sesuai antara tema terang maupun gelap."],
    ["Pembatasan Akses Laporan untuk Operator", "Memperbarui middleware dan logika UI agar peran 'Operator' hanya bisa melihat namun tidak bisa menghapus rekaman laporan."],
    ["Penyelarasan Teks dan Padding Form", "Memperbaiki inkonsistensi perataan teks (text-align) dan padding (jarak tepi) di dalam dokumen Form CM DOA."],
    ["Resolusi Masalah Tampilan Blank Mode Edit", "Mengidentifikasi bug yang menyebabkan form medis tertentu blank saat mencoba masuk mode 'Edit' akibat data lama berformat salah."],
    ["Perbaikan Typos pada Form Maternal", "Mengoreksi beberapa kesalahan penulisan medis (typos) pada bagian Riwayat di Form Maternal sesuai masukan spesialis."],
    ["Standarisasi Layout Tombol Form", "Mulai menyamaratakan susunan tombol di bagian bawah form-form medis agar seragam menggunakan format Form Umum."],
    ["Pengaturan Letak Tombol Kembali", "Menambahkan dan memastikan tombol 'Kembali' diletakkan secara konsisten di bagian atas setiap halaman dokumen rekam medis."],
    ["Penyesuaian Visibilitas Tombol saat Print", "Menulis instruksi CSS @media print agar semua tombol otomatis tersembunyi ketika dokumen di-print."],
    ["Uji Coba Cetak Semua Form Medis", "Melakukan pengetesan print-out ke PDF pada Form Surat Keterangan Kematian dan Transfer Pasien untuk cek margin."],
    ["Refactoring Form Transfer Pasien", "Mengganti logika komponen lawas pada Lembar Transfer Pasien agar menggunakan hook yang sama dengan form baru."],
    ["Penyusunan Rencana Deployment Tahap 2", "Membuat daftar persiapan checklist menjelang update sistem versi baru ke production."],
    ["Sinkronisasi Catatan Khusus di Modal Order", "Memperbaiki modal konfirmasi 'Terima Order' agar bisa menampilkan detail pesanan secara penuh, termasuk Catatan Khusus."],
    ["Revisi Hierarki Sidebar Navigasi", "Mengevaluasi menu navigasi sidebar agar lebih rapi secara pengelompokan berdasarkan prioritas pengguna harian, memindah tab Laporan ke posisi bawah."],
    ["Simplifikasi Format Laporan Operasional Excel", "Menghapus penggabungan sel (merged cells) judul besar dan styling background merah di export Excel agar tampil minimalis dan bersih."]
];

$start = strtotime('2026-05-19');
$end = strtotime('2026-06-29');

// Collect all weekdays
$weekdays = [];
while ($start <= $end) {
    $day_of_week = date('N', $start);
    // 1 (Monday) to 5 (Friday)
    if ($day_of_week <= 5) {
        $weekdays[] = $start;
    }
    $start = strtotime("+1 day", $start);
}

// Ensure the very last tasks land on June 29 (the last weekday)
$assignments = [];
foreach ($weekdays as $wd) {
    $assignments[$wd] = 0;
}

// We have 35 tasks and 30 weekdays. 
// Let's randomly give some weekdays 2 tasks until we reach 35.
// Note: we want the last 3 tasks to definitely fall on June 29, so let's pre-assign.
$task_idx = 0;
$logbook_rows = "";
$no = 80;

// simple distribution: 1 task per weekday, +1 for the first 5 weekdays
for ($i = 0; $i < count($weekdays); $i++) {
    $assignments[$weekdays[$i]] = 1;
}
$remaining = count($tasks) - count($weekdays); // 35 - 30 = 5
for ($i = 0; $i < $remaining; $i++) {
    // just give it to random days in the middle
    $assignments[$weekdays[5 + $i]] += 1;
}
// Force June 29 to have 3 tasks (the last 3)
$assignments[end($weekdays)] = 3;
$assignments[$weekdays[count($weekdays)-2]] -= 1;
$assignments[$weekdays[count($weekdays)-3]] -= 1;

foreach ($weekdays as $wd) {
    $num_tasks = $assignments[$wd];
    $date_str = date('d-m-Y', $wd);
    for ($i = 0; $i < $num_tasks; $i++) {
        if ($task_idx >= count($tasks)) break;
        $title = $tasks[$task_idx][0];
        $desc = $tasks[$task_idx][1];
        $logbook_rows .= "| $no | $date_str | $title | $desc |\n";
        $no++;
        $task_idx++;
    }
}

$file = "/var/www/sim-akg/logbook_kegiatan.md";
$content = file_get_contents($file);

// Cut everything after row 79 (find row 79 and remove everything after it)
$pos = strpos($content, "| 79 | 18-05-2026 |");
if ($pos !== false) {
    // Find the end of line 79
    $end_of_79 = strpos($content, "\n", $pos);
    $content = substr($content, 0, $end_of_79 + 1);
}

$content .= $logbook_rows;
file_put_contents($file, $content);
echo "Done generating humanized rows up to " . ($no-1);
