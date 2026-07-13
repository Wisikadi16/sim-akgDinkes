import { Head, Link } from "@inertiajs/react";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

/* KOMPONEN TEXTAREA AUTOSIZE SEDERHANA
   Catatan: komponen ini SENGAJA didefinisikan di luar Form_Keluarga (module-level),
   bukan di dalam body function komponen. Jika didefinisikan di dalam, React akan
   membuat "tipe komponen" baru pada setiap render (karena referensi function-nya
   selalu berbeda), sehingga <textarea> lama di-unmount dan digantikan elemen baru
   setiap kali state berubah. Efeknya: fokus hilang setelah mengetik 1 karakter,
   karena DOM node textarea benar-benar diganti, bukan hanya diperbarui. */
const InputArea = React.memo(function InputArea({ value, onChange, placeholder, name }) {
    return (
        <textarea
            name={name}
            className="w-full border border-gray-300 p-1 text-[10px] leading-tight focus:ring-0 rounded-sm bg-transparent resize-none h-12"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
});

const kfTd = "border border-black p-[4px] align-top kf-cell";
const kfTh = "border border-black p-[4px] align-middle kf-cell font-bold text-center bg-gray-100";
const KF_CB = (val) => (val ? "☑" : "☐");

/* Baris "Ya/Tidak" bergaya form asli (kotak centang ganda) */
const YaTidak = ({ value }) => (
    <span className="whitespace-nowrap">
        {value === "Ya" ? "☑" : "☐"} Ya&nbsp;&nbsp;{value === "Tidak" ? "☑" : "☐"} Tidak
    </span>
);

/* Kotak kategori pemeriksaan fisik individu (dipakai berulang di grid 3 kolom) */
const KategoriBox = ({ label, children }) => (
    <div className="border border-black p-1.5 kf-avoid-break flex flex-col min-h-[78px]">
        <div className="font-bold bg-gray-200 text-center mb-1 -mx-1 -mt-1 p-[2px] border-b border-black">{label}</div>
        <div className="whitespace-pre-wrap break-words flex-1">{children}</div>
    </div>
);

/* ======================================================================
   TEMPLATE CETAK — dibuat mengikuti struktur & urutan halaman berkas asli
   (FORM ASKEP KELUARGA - PENGKAJIAN, KARTU ASKEP, DAN REGISTRASI):
     Hal 1-3 : Potrait, Letter (8.5" x 11"), margin 0.7875"
       - Pengkajian Keperawatan Keluarga (Data Keluarga, Data Anggota Keluarga)
       - Data Penunjang Keluarga (Sanitasi & PHBS, Tugas Kesehatan, Kemandirian)
       - Lampiran: Data Pengkajian Individu yang Sakit
     Hal 4-5 : Landscape, Letter (11" x 8.5"), margin 1"
       - Kartu Asuhan Keperawatan Keluarga
       - Register Pelayanan Perkesmas
   Semua ukuran & margin diambil langsung dari pengaturan halaman file .docx
   aslinya supaya jumlah halaman & tata letak saat print sama persis.
   ====================================================================== */
const PrintTemplateKeluarga = React.forwardRef(({ d }, ref) => {
    const {
        dataKeluarga: k,
        anggotaKeluarga: ang,
        sanitasi: s,
        daftarPhbs,
        phbs,
        daftarTugas,
        tugas,
        kemandirian: km,
        individuSakit,
        asuhan,
        register,
    } = d;

    /* Handler aman untuk gambar logo yang belum diisi/tidak ada.
       Logo sengaja belum dipasang (menunggu file logo final) — kalau <img>
       gagal dimuat, elemen disembunyikan otomatis supaya TIDAK muncul ikon
       "broken image" yang bisa merusak tinggi baris tabel & memicu halaman
       tercetak jadi salah / terpotong. Saat logo final siap, cukup isi src. */
    const hideBrokenImg = (e) => {
        e.currentTarget.style.display = "none";
    };

    return (
        <div ref={ref} className="hidden print:block bg-white text-black kf-root">
            <style>{`
                /* ===================== HALAMAN & HARDCODE UKURAN ASLI DOCX =====================
                   pgSz portrait  : 12240 x 15840 twip = 8.5in x 11in (Letter)
                   pgMar portrait : 1134 twip = 0.7875in semua sisi
                   pgSz landscape : 15840 x 12240 twip = 11in x 8.5in (Letter, untuk Kartu Asuhan & Register)
                   pgMar landscape: 1440 twip = 1in semua sisi
                */
                @page {
                    size: 8.5in 11in;
                    margin: 0.7875in;
                }
                /* "Halaman bernama" khusus untuk section landscape (Kartu Asuhan & Register).
                   Didukung Chrome/Edge (mesin cetak paling umum dipakai). Elemen yang perlu
                   dicetak landscape diberi class kf-landscape (lihat "page: kf-landscape-page;"). */
                @page kf-landscape-page {
                    size: 11in 8.5in;
                    margin: 1in;
                }

                .kf-root {
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 11px;
                    line-height: 1.35;
                }
                .kf-root * { box-sizing: border-box; }
                .kf-root img { max-width: 100%; }

                @media print {
                    /* --- Blok pendek yang MEMANG selalu muat < 1 halaman (kartu identitas,
                         kriteria kemandirian, dsb) — aman dipaksa "jangan terpotong". --- */
                    .kf-avoid-break { break-inside: avoid; page-break-inside: avoid; }

                    /* --- Baris tabel: 1 baris = 1 kesatuan data, tidak boleh kepotong di
                         tengah antar 2 halaman. Ini TIDAK memaksa seluruh tabel jadi 1 halaman,
                         hanya melindungi tiap barisnya saja, jadi tabel besar tetap bisa
                         mengalir wajar ke halaman berikutnya seperti dokumen Word aslinya. --- */
                    .kf-table tr { break-inside: avoid; page-break-inside: avoid; }
                    .kf-table thead { display: table-header-group; }
                    .kf-table tfoot { display: table-footer-group; }
                    .kf-table { table-layout: fixed; width: 100%; }

                    /* --- Semua sel tabel: teks WAJIB bisa turun baris (word-wrap), bukan
                         meluber ke kanan. Ini kunci utama supaya tabel lebar (Data Anggota
                         Keluarga, Kartu Asuhan, Register) tidak pernah terpotong horizontal
                         saat dicetak. --- */
                    .kf-cell {
                        overflow-wrap: anywhere;
                        word-break: break-word;
                        white-space: normal;
                        hyphens: auto;
                    }

                    /* --- Pemaksaan halaman baru: dipakai HANYA di batas antar "dokumen" yang
                         memang terpisah di berkas asli (mulai Lampiran individu, Kartu Asuhan,
                         dan Register). Sengaja TIDAK dipasang break-inside:avoid pada
                         section-section besar/dinamis ini (Lampiran / Kartu Asuhan / Register),
                         karena kalau isinya lebih tinggi dari 1 halaman, break-inside:avoid
                         justru memaksa browser meletakkan pemotongan halaman di titik yang
                         salah (bisa menyisakan area kosong besar atau memotong tabel di tengah). */
                    .kf-new-page { break-before: page; page-break-before: always; }

                    /* --- Section yang harus dicetak landscape (Kartu Asuhan & Register),
                         mengikuti section properties landscape pada docx asli. --- */
                    .kf-landscape { page: kf-landscape-page; }
                }
            `}</style>

            {/* ======================================================================
                HALAMAN 1 — PENGKAJIAN KEPERAWATAN KELUARGA
                ====================================================================== */}
            <div className="kf-avoid-break mb-2">
                <div className="text-center font-bold text-[17px] uppercase tracking-wide mb-1">
                    Pengkajian Keperawatan Keluarga
                </div>
                <table className="w-full border-collapse border-2 border-black kf-table" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "38%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "35%" }} />
                    </colgroup>
                    <tbody>
                        <tr className="kf-avoid-break">
                            <td className={kfTd + " text-center"} rowSpan={2}>
                                <img
                                    src="/gambar/baktihusada.png"
                                    className="w-12 h-12 object-contain mx-auto"
                                    alt="Logo"
                                    onError={hideBrokenImg}
                                />
                            </td>
                            <td className={kfTd + " font-semibold"}>Fasilitas Yankes : {k.fasilitas_yankes}</td>
                            <td className={kfTd + " font-semibold"}>No. Register</td>
                            <td className={kfTd + " font-semibold"}>{k.no_register}</td>
                        </tr>
                        <tr className="kf-avoid-break">
                            <td className={kfTd + " font-semibold"}>Nama Perawat yang mengkaji : {k.nama_perawat}</td>
                            <td className={kfTd + " font-semibold"}>Tanggal Pengkajian</td>
                            <td className={kfTd + " font-semibold"}>{k.tanggal_pengkajian}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="kf-avoid-break mb-2">
                <div className="font-bold mb-1">1. DATA KELUARGA</div>
                <table className="w-full border-collapse border-2 border-black kf-table" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "15%" }} />
                    </colgroup>
                    <tbody>
                        <tr className="kf-avoid-break">
                            <td className={kfTd}>Nama Kepala Keluarga</td>
                            <td className={kfTd + " font-bold uppercase"}>{k.nama_kk}</td>
                            <td className={kfTd}>Bahasa sehari-hari</td>
                            <td className={kfTd}>{k.bahasa}</td>
                        </tr>
                        <tr className="kf-avoid-break">
                            <td className={kfTd}>Alamat Rumah &amp; Telp</td>
                            <td className={kfTd}>{k.alamat_telp}</td>
                            <td className={kfTd}>Jarak yankes terdekat</td>
                            <td className={kfTd}>{k.jarak_yankes}</td>
                        </tr>
                        <tr className="kf-avoid-break">
                            <td className={kfTd}>Agama &amp; Suku</td>
                            <td className={kfTd}>{k.agama_suku}</td>
                            <td className={kfTd}>Alat Transportasi</td>
                            <td className={kfTd}>{k.alat_transportasi}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============ DATA ANGGOTA KELUARGA (boleh mengalir alami ke hal. 2) ============ */}
            <table className="w-full border-collapse border-2 border-black mb-2 kf-table" style={{ tableLayout: "fixed" }}>
                <colgroup>
                    <col style={{ width: "4%" }} /><col style={{ width: "10%" }} /><col style={{ width: "8%" }} />
                    <col style={{ width: "5%" }} /><col style={{ width: "4%" }} /><col style={{ width: "6%" }} />
                    <col style={{ width: "9%" }} /><col style={{ width: "9%" }} /><col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} /><col style={{ width: "12%" }} /><col style={{ width: "9%" }} />
                </colgroup>
                <thead>
                    <tr><th colSpan={12} className={kfTh}>DATA ANGGOTA KELUARGA</th></tr>
                    <tr>
                        <th className={kfTh}>No</th>
                        <th className={kfTh}>Nama</th>
                        <th className={kfTh}>Hub dgn KK</th>
                        <th className={kfTh}>Umur</th>
                        <th className={kfTh}>JK</th>
                        <th className={kfTh}>Suku</th>
                        <th className={kfTh}>Pendidikan Terakhir</th>
                        <th className={kfTh}>Pekerjaan Saat Ini</th>
                        <th className={kfTh}>Status Gizi (TB, BB, BMI)</th>
                        <th className={kfTh}>TTV (TD, N, S, P)</th>
                        <th className={kfTh}>Status Imunisasi Dasar</th>
                        <th className={kfTh}>Alat Bantu/Protesa</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(ang) ? ang : []).map((a, i) => (
                        <tr key={i}>
                            <td className={kfTd + " text-center"}>{i + 1}</td>
                            <td className={kfTd}>{a.nama}</td>
                            <td className={kfTd}>{a.hub_kk}</td>
                            <td className={kfTd}>{a.umur}</td>
                            <td className={kfTd}>{a.jk}</td>
                            <td className={kfTd}>{a.suku}</td>
                            <td className={kfTd}>{a.pendidikan}</td>
                            <td className={kfTd}>{a.pekerjaan}</td>
                            <td className={kfTd}>TB:{a.tb} BB:{a.bb} BMI:{a.bmi}</td>
                            <td className={kfTd}>TD:{a.td} N:{a.nadi} S:{a.suhu} P:{a.napas}</td>
                            <td className={kfTd}>{a.imunisasi}</td>
                            <td className={kfTd}>{a.alat_bantu}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table className="w-full border-collapse border-2 border-black mb-2 kf-table" style={{ tableLayout: "fixed" }}>
                <colgroup>
                    <col style={{ width: "4%" }} /><col style={{ width: "12%" }} /><col style={{ width: "16%" }} />
                    <col style={{ width: "20%" }} /><col style={{ width: "24%" }} /><col style={{ width: "24%" }} />
                </colgroup>
                <thead>
                    <tr><th colSpan={6} className={kfTh}>LANJUTAN DATA ANGGOTA KELUARGA</th></tr>
                    <tr>
                        <th className={kfTh}>No</th>
                        <th className={kfTh}>Nama</th>
                        <th className={kfTh}>Penampilan Umum</th>
                        <th className={kfTh}>Status Kesehatan Saat ini</th>
                        <th className={kfTh}>Riwayat Penyakit/Alergi</th>
                        <th className={kfTh}>Analisis Masalah Kesehatan Individu</th>
                    </tr>
                </thead>
                <tbody>
                    {(Array.isArray(ang) ? ang : []).map((a, i) => (
                        <tr key={i}>
                            <td className={kfTd + " text-center"}>{i + 1}</td>
                            <td className={kfTd + " font-bold uppercase"}>{a.nama}</td>
                            <td className={kfTd}>{a.penampilan}</td>
                            <td className={kfTd}>{a.status_kesehatan}</td>
                            <td className={kfTd}>{a.riwayat_penyakit}</td>
                            <td className={kfTd}>{a.analisis_masalah}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="kf-avoid-break mb-2 border border-black p-1 text-center italic">
                2. DATA PENGKAJIAN INDIVIDU YANG SAKIT (terlampir)
            </div>

            {/* ======================================================================
                3. DATA PENUNJANG KELUARGA
                ====================================================================== */}
            <div className="font-bold mb-1">3. DATA PENUNJANG KELUARGA</div>
            <table className="w-full border-collapse border-2 border-black mb-2 kf-table" style={{ tableLayout: "fixed" }}>
                <colgroup>
                    <col style={{ width: "50%" }} />
                    <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className={kfTd + " kf-avoid-break"}>
                            <div className="font-bold border-b border-black pb-[2px] mb-1 text-center">Rumah dan Sanitasi Lingkungan</div>
                            <div>Kondisi Rumah (Cukup/Kurang) : {s.kondisi}</div>
                            <div>Ventilasi (Cukup/Kurang) : {s.ventilasi}</div>
                            <div>Pencahayaan Rumah (Baik/Tidak) : {s.pencahayaan}</div>
                            <div>Saluran Buang Limbah (Baik/Cukup/Kurang) : {s.limbah}</div>
                            <div>Sumber Air Bersih (Sehat/Tidak Sehat) : {s.air}</div>
                            <div>Jamban Memenuhi Syarat (Ya/Tidak) : {s.jamban}</div>
                            <div>Tempat Sampah (Ya/Tidak) : {s.sampah}</div>
                            <div>Rasio Luas Bangunan Rumah dgn Jml Anggota Keluarga 8m²/orang (Ya/Tidak) : {s.rasio}</div>
                        </td>
                        <td className={kfTd}>
                            <div className="font-bold border-b border-black pb-[2px] mb-1 text-center">PHBS Di Rumah Tangga</div>
                            {daftarPhbs.map((item, i) => (
                                <div key={i} className="flex justify-between gap-2 border-b border-dotted border-gray-400 py-[1px] kf-avoid-break">
                                    <span>{item}</span>
                                    <span className="whitespace-nowrap"><YaTidak value={phbs[i]} /></span>
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border-collapse border-2 border-black mb-2 kf-table" style={{ tableLayout: "fixed" }}>
                <tbody>
                    <tr><td className={kfTh}>4. KEMAMPUAN KELUARGA MELAKUKAN TUGAS PEMELIHARAAN KESEHATAN ANGGOTA KELUARGA</td></tr>
                    <tr>
                        <td className={kfTd}>
                            {daftarTugas.map((soal, i) => (
                                <div key={i} className="border-b border-dotted border-gray-400 py-[2px] kf-avoid-break">
                                    <div className="font-semibold">{i + 1}. {soal}</div>
                                    <div>Jawaban: {tugas[i]?.jawaban || "\u2014"} &nbsp;&nbsp; Keterangan: {tugas[i]?.ket}</div>
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border-collapse border-2 border-black kf-table kf-avoid-break" style={{ tableLayout: "fixed" }}>
                <colgroup>
                    <col style={{ width: "65%" }} />
                    <col style={{ width: "35%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td className={kfTd}>
                            <div className="font-bold underline mb-1">KRITERIA KEMANDIRIAN KELUARGA :</div>
                            <div>{KF_CB(km.k1)} 1. Menerima petugas puskesmas</div>
                            <div>{KF_CB(km.k2)} 2. Menerima yankes sesuai rencana</div>
                            <div>{KF_CB(km.k3)} 3. Menyatakan masalah kesehatan secara benar</div>
                            <div>{KF_CB(km.k4)} 4. Memanfaatkan faskes sesuai anjuran</div>
                            <div>{KF_CB(km.k5)} 5. Melaksanakan perawatan sederhana sesuai anjuran</div>
                            <div>{KF_CB(km.k6)} 6. Melaksanakan tindakan pencegahan secara aktif</div>
                            <div>{KF_CB(km.k7)} 7. Melaksanakan tindakan promotif secara aktif</div>
                        </td>
                        <td className={kfTd}>
                            <div className="font-bold mb-1">Kesimpulan :</div>
                            <div>Kemandirian I : Jika memenuhi kriteria 1 &amp; 2</div>
                            <div>Kemandirian II : Jika memenuhi kriteria 1 s.d 5</div>
                            <div>Kemandirian III : Jika memenuhi kriteria 1 s.d 6</div>
                            <div>Kemandirian IV : Jika memenuhi kriteria 1 s.d 7</div>
                            <div className="mt-1 font-bold border-t border-black pt-1">Hasil : {km.kesimpulan}</div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* ======================================================================
                LAMPIRAN — DATA PENGKAJIAN INDIVIDU YANG SAKIT (1 per anggota sakit)
                SENGAJA TIDAK dipaksa mulai di halaman baru (tidak ada kf-new-page) —
                supaya kalau di halaman sebelumnya masih ada sisa ruang kosong (mis.
                setelah Kriteria Kemandirian), Lampiran ini langsung mengisi sisa
                ruang itu alih-alih membuang 1 halaman kosong. Kalau memang sudah
                tidak muat, browser otomatis pindah halaman sendiri (natural flow) —
                tanpa memotong konten di tengah, karena bagian dalamnya tetap
                dilindungi kf-avoid-break per elemen kecil. Setiap individu diberi
                garis pembatas tebal + judul "Lampiran" supaya tetap jelas batasnya
                walau tidak selalu mulai dari halaman baru. */}
            {(Array.isArray(individuSakit) ? individuSakit : []).map((ind, idx) => (
                <div className={idx === 0 ? "mt-3" : "mt-3 pt-2 border-t-4 border-double border-black"} key={idx}>
                    <div className="font-bold text-[14px] underline mb-1">Lampiran{individuSakit.length > 1 ? ` (${idx + 1}/${individuSakit.length})` : ""}</div>
                    <div className="font-bold mb-1">2. DATA PENGKAJIAN INDIVIDU YANG SAKIT</div>

                    <table className="w-full border-collapse border-2 border-black mb-2 kf-table" style={{ tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "50%" }} />
                        </colgroup>
                        <tbody>
                            <tr className="kf-avoid-break">
                                <td className={kfTd + " font-semibold"}>Nama Individu yang sakit : <span className="font-bold uppercase">{ind.nama}</span></td>
                                <td className={kfTd + " font-semibold"}>Diagnosa Medik : {ind.diagnosa}</td>
                            </tr>
                            <tr className="kf-avoid-break">
                                <td className={kfTd + " font-semibold"}>Sumber Dana Kesehatan : {ind.sumber_dana}</td>
                                <td className={kfTd + " font-semibold"}>Rujukan Dokter/Rumah Sakit : {ind.rujukan}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Grid pemeriksaan fisik 3 kolom x 3 baris — persis mengikuti 9 kategori
                        yang tersedia di form input (Keadaan Umum, Sirkulasi/Cairan, Perkemihan,
                        Pernapasan, Pencernaan, Muskuloskeletal, Neurosensori,
                        Kulit/Tidur/Mental, Kebersihan & Perawatan Diri). */}
                    <div className="grid grid-cols-3 gap-1 mb-2">
                        <KategoriBox label="Keadaan Umum">
                            GCS: {ind.gcs} &nbsp; TD: {ind.td} mmHg &nbsp; P: {ind.p} x/menit<br />
                            S: {ind.s} °C &nbsp; N: {ind.n} x/menit
                            {ind.umum_lain ? <div className="mt-1 border-t border-dotted pt-1">{ind.umum_lain}</div> : null}
                        </KategoriBox>
                        <KategoriBox label="Sirkulasi/Cairan">{ind.sirkulasi}</KategoriBox>
                        <KategoriBox label="Perkemihan">{ind.perkemihan}</KategoriBox>

                        <KategoriBox label="Pernapasan">{ind.pernapasan}</KategoriBox>
                        <KategoriBox label="Pencernaan">{ind.pencernaan}</KategoriBox>
                        <KategoriBox label="Muskuloskeletal">{ind.muskulo}</KategoriBox>

                        <KategoriBox label="Neurosensori">{ind.neuro}</KategoriBox>
                        <KategoriBox label="Kulit, Tidur &amp; Mental">{ind.kulit}</KategoriBox>
                        <KategoriBox label="Kebersihan &amp; Perawatan Diri">{ind.kebersihan}</KategoriBox>
                    </div>

                    <table className="w-full border-collapse border-2 border-black kf-table kf-avoid-break" style={{ tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "25%" }} /><col style={{ width: "25%" }} />
                            <col style={{ width: "25%" }} /><col style={{ width: "25%" }} />
                        </colgroup>
                        <tbody>
                            <tr><td colSpan={4} className={kfTh}>DATA PENUNJANG MEDIS INDIVIDU YANG SAKIT</td></tr>
                            <tr>
                                <td className={kfTd}>Laboratorium: {ind.lab}</td>
                                <td className={kfTd}>Radiologi: {ind.rad}</td>
                                <td className={kfTd}>EKG: {ind.ekg}</td>
                                <td className={kfTd}>USG: {ind.usg}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}

            {/* ======================================================================
                HALAMAN LANDSCAPE — KARTU ASUHAN KEPERAWATAN KELUARGA
                ====================================================================== */}
            <div className="kf-new-page kf-landscape">
                <table className="w-full border-collapse mb-2" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "12%" }} /><col style={{ width: "76%" }} /><col style={{ width: "12%" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td className="text-center align-middle">
                                <img src="/gambar/kemenkesri.png" className="h-12 object-contain mx-auto" alt="Kemenkes" onError={hideBrokenImg} />
                            </td>
                            <td className="text-center font-bold text-[17px] uppercase tracking-wide align-middle">
                                KARTU ASUHAN KEPERAWATAN KELUARGA
                            </td>
                            <td className="text-center align-middle">
                                <img src="/gambar/germas.png" className="h-12 object-contain mx-auto" alt="Germas" onError={hideBrokenImg} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border-collapse mb-2 kf-avoid-break" style={{ tableLayout: "fixed" }}>
                    <colgroup><col style={{ width: "50%" }} /><col style={{ width: "50%" }} /></colgroup>
                    <tbody>
                        <tr>
                            <td className="border-b border-black py-[2px] font-semibold">Puskesmas : {k.fasilitas_yankes}</td>
                            <td className="border-b border-black py-[2px] font-semibold">Kode : </td>
                        </tr>
                        <tr>
                            <td className="border-b border-black py-[2px] font-semibold">Nama Kepala Keluarga : {k.nama_kk}</td>
                            <td className="border-b border-black py-[2px] font-semibold">Telp/Ponsel : </td>
                        </tr>
                        <tr>
                            <td className="border-b border-black py-[2px] font-semibold">Alamat : {k.alamat_telp}</td>
                            <td className="border-b border-black py-[2px] font-semibold">Masalah Kesehatan : </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border-collapse border-2 border-black kf-table" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "7%" }} /><col style={{ width: "12%" }} /><col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} /><col style={{ width: "12%" }} />
                        <col style={{ width: "8%" }} /><col style={{ width: "8%" }} /><col style={{ width: "8%" }} /><col style={{ width: "8%" }} />
                        <col style={{ width: "13%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className={kfTh}>Tanggal</th>
                            <th className={kfTh}>Data Pengkajian</th>
                            <th className={kfTh}>Diagnosis Keperawatan</th>
                            <th className={kfTh}>Rencana Intervensi</th>
                            <th className={kfTh}>Implementasi</th>
                            <th className={kfTh} colSpan={4}>Evaluasi</th>
                            <th className={kfTh}>Petugas</th>
                        </tr>
                        <tr>
                            <th className={kfTh} colSpan={5}></th>
                            <th className={kfTh}>S</th>
                            <th className={kfTh}>O</th>
                            <th className={kfTh}>A</th>
                            <th className={kfTh}>P</th>
                            <th className={kfTh}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(asuhan) ? asuhan : []).map((ash, idx) => (
                            <tr key={idx}>
                                <td className={kfTd}>{ash.tgl}</td>
                                <td className={kfTd}>{ash.data}</td>
                                <td className={kfTd}>{ash.dx}</td>
                                <td className={kfTd}>{ash.rencana}</td>
                                <td className={kfTd}>{ash.impl}</td>
                                <td className={kfTd} colSpan={4}>{ash.eval}</td>
                                <td className={kfTd}>{ash.petugas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ======================================================================
                HALAMAN LANDSCAPE — REGISTER PELAYANAN PERKESMAS
                ====================================================================== */}
            <div className="kf-new-page kf-landscape">
                <div className="text-center font-bold text-[17px] uppercase tracking-wide mb-1 border-b-4 border-double border-black pb-1">
                    REGISTER PELAYANAN PERKESMAS — FORMULIR REGISTER 1
                </div>
                <table className="w-full border-collapse mb-2 kf-avoid-break" style={{ tableLayout: "fixed" }}>
                    <colgroup><col style={{ width: "50%" }} /><col style={{ width: "50%" }} /></colgroup>
                    <tbody>
                        <tr>
                            <td className="border-b border-black py-[2px] font-semibold">Puskesmas : {k.fasilitas_yankes}</td>
                            <td className="border-b border-black py-[2px] font-semibold">Bulan : </td>
                        </tr>
                        <tr>
                            <td className="border-b border-black py-[2px] font-semibold">Kode : </td>
                            <td className="border-b border-black py-[2px] font-semibold">Tahun : </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border-collapse border-2 border-black kf-table" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "3%" }} /><col style={{ width: "6%" }} /><col style={{ width: "12%" }} />
                        <col style={{ width: "8%" }} /><col style={{ width: "14%" }} /><col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} /><col style={{ width: "6%" }} /><col style={{ width: "6%" }} />
                        <col style={{ width: "6%" }} /><col style={{ width: "6%" }} /><col style={{ width: "9%" }} />
                    </colgroup>
                    <thead>
                        <tr><th colSpan={12} className={kfTh + " text-left"}>A. Asuhan Keperawatan Keluarga</th></tr>
                        <tr>
                            <th className={kfTh} rowSpan={2}>No</th>
                            <th className={kfTh} rowSpan={2}>Tgl</th>
                            <th className={kfTh} rowSpan={2}>Nama Kepala Keluarga</th>
                            <th className={kfTh} rowSpan={2}>NKK</th>
                            <th className={kfTh} rowSpan={2}>Alamat</th>
                            <th className={kfTh} rowSpan={2}>Masalah Kesehatan</th>
                            <th className={kfTh} rowSpan={2}>Diagnosis Keperawatan</th>
                            <th className={kfTh} colSpan={4}>Hasil Asuhan Keperawatan</th>
                            <th className={kfTh} rowSpan={2}>Lepas Bina</th>
                        </tr>
                        <tr>
                            <th className={kfTh}>KM-I</th>
                            <th className={kfTh}>KM-II</th>
                            <th className={kfTh}>KM-III</th>
                            <th className={kfTh}>KM-IV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(register) ? register : []).map((reg, idx) => (
                            <tr key={idx}>
                                <td className={kfTd + " text-center"}>{idx + 1}</td>
                                <td className={kfTd}>{reg.tgl}</td>
                                <td className={kfTd}>{reg.nama_kk}</td>
                                <td className={kfTd}>{reg.nkk}</td>
                                <td className={kfTd}>{reg.alamat}</td>
                                <td className={kfTd}>{reg.masalah}</td>
                                <td className={kfTd}>{reg.dx}{reg.hasil ? ` (${reg.hasil})` : ""}</td>
                                <td className={kfTd + " text-center"}>{KF_CB(reg.km1)}</td>
                                <td className={kfTd + " text-center"}>{KF_CB(reg.km2)}</td>
                                <td className={kfTd + " text-center"}>{KF_CB(reg.km3)}</td>
                                <td className={kfTd + " text-center"}>{KF_CB(reg.km4)}</td>
                                <td className={kfTd + " text-center"}>{KF_CB(reg.lepas_bina)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
PrintTemplateKeluarga.displayName = "PrintTemplateKeluarga";


export default function Form_Keluarga(props) {
    const { id: propsId } = props;
    const { id: urlId } = useParams();
    const id = urlId || propsId;

    /* 1. STATE: IDENTITAS KELUARGA */
    const [dataKeluarga, setDataKeluarga] = useState({
        fasilitas_yankes: "",
        no_register: "",
        nama_perawat: "",
        tanggal_pengkajian: "",
        nama_kk: "",
        alamat_telp: "",
        agama_suku: "",
        bahasa: "",
        jarak_yankes: "",
        alat_transportasi: "",
    });

    const handleInputKeluarga = (e) =>
        setDataKeluarga({
            ...dataKeluarga,
            [e.target.name]: e.target.value,
        });

    /* 2. STATE: TABEL ANGGOTA KELUARGA */
    const [anggotaKeluarga, setAnggotaKeluarga] = useState([
        {
            nama: "",
            hub_kk: "",
            umur: "",
            jk: "",
            suku: "",
            pendidikan: "",
            pekerjaan: "",
            tb: "",
            bb: "",
            bmi: "",
            td: "",
            nadi: "",
            suhu: "",
            napas: "",
            imunisasi: "",
            alat_bantu: "",
            penampilan: "",
            status_kesehatan: "",
            riwayat_penyakit: "",
            analisis_masalah: "",
        },
    ]);

    const handleAddAnggota = () =>
        setAnggotaKeluarga([
            ...anggotaKeluarga,
            {
                nama: "",
                hub_kk: "",
                umur: "",
                jk: "",
                suku: "",
                pendidikan: "",
                pekerjaan: "",
                tb: "",
                bb: "",
                bmi: "",
                td: "",
                nadi: "",
                suhu: "",
                napas: "",
                imunisasi: "",
                alat_bantu: "",
                penampilan: "",
                status_kesehatan: "",
                riwayat_penyakit: "",
                analisis_masalah: "",
            },
        ]);

    const handleRemoveAnggota = (index) => {
        const newArr = [...anggotaKeluarga];
        newArr.splice(index, 1);
        setAnggotaKeluarga(newArr);
    };

    const handleInputAnggota = (index, field, value) => {
        const newArr = [...anggotaKeluarga];
        newArr[index][field] = value;
        setAnggotaKeluarga(newArr);
    };

    /* 3. STATE: SANITASI, PHBS, KEMAMPUAN, KEMANDIRIAN */
    const [sanitasi, setSanitasi] = useState({
        kondisi: "",
        ventilasi: "",
        pencahayaan: "",
        limbah: "",
        air: "",
        jamban: "",
        sampah: "",
        rasio: "",
    });

    const handleSanitasi = (e) =>
        setSanitasi({
            ...sanitasi,
            [e.target.name]: e.target.value,
        });

    /* PHBS Array state (14 item) */
    const daftarPhbs = [
        "Jika ada Bunifas, Persalinan ditolong oleh nakes",
        "Jika ada bayi, Memberi ASI eksklusif",
        "Jika ada balita, Menimbang balita tiap bln",
        "Menggunakan air bersih untuk makan & minum",
        "Menggunakan air bersih untuk kebersihan diri",
        "Mencuci tangan dengan air bersih & sabun",
        "Melakukan pembuangan sampah pada tempatnya",
        "Menjaga lingkungan rumah tampak bersih",
        "Mengkonsumsi lauk dan pauk tiap hari",
        "Menggunakan jamban sehat",
        "Memberantas jentik di rumah sekali seminggu",
        "Makan buah dan sayur setiap hari",
        "Melakukan aktivitas fisik setiap hari",
        "Tidak merokok di dalam rumah",
    ];

    const [phbs, setPhbs] = useState(Array(14).fill(""));

    const handlePhbs = (index, val) => {
        const newArr = [...phbs];
        newArr[index] = val;
        setPhbs(newArr);
    };

    const daftarTugas = [
        "Adakah perhatian keluarga kepada anggotanya yang sakit?",
        "Apakah keluarga mengetahui masalah kesehatan yang dialami anggota?",
        "Apakah keluarga mengetahui penyebab masalah kesehatan tersebut?",
        "Apakah keluarga mengetahui tanda dan gejala masalah kesehatan tersebut?",
        "Apakah keluarga mengetahui akibat masalah kesehatan bila tidak diobati?",
        "Pada siapa keluarga biasa menggali informasi kesehatan?",
        "Keyakinan keluarga tentang masalah kesehatan yang dialami:",
        "Apakah keluarga melakukan upaya peningkatan kesehatan secara aktif?",
        "Apakah keluarga mengetahui kebutuhan pengobatan anggota yang sakit?",
        "Apakah keluarga dapat melakukan cara merawat anggota yang sakit?",
        "Apakah keluarga dapat melakukan pencegahan masalah kesehatan?",
        "Apakah keluarga mampu memelihara/memodifikasi lingkungan?",
        "Apakah keluarga mampu memanfaatkan sumber di masyarakat?",
    ];

    const [tugas, setTugas] = useState(
        Array(13).fill({ jawaban: "", ket: "" }),
    );

    const handleTugas = (index, field, val) => {
        const newArr = [...tugas];
        newArr[index] = { ...newArr[index], [field]: val };
        setTugas(newArr);
    };

    const [kemandirian, setKemandirian] = useState({
        k1: false,
        k2: false,
        k3: false,
        k4: false,
        k5: false,
        k6: false,
        k7: false,
        kesimpulan: "",
    });

    /* 4. STATE: PENGKAJIAN INDIVIDU SAKIT */
    const [individuSakit, setIndividuSakit] = useState([
        {
            nama: "",
            diagnosa: "",
            sumber_dana: "",
            rujukan: "",
            gcs: "",
            td: "",
            p: "",
            s: "",
            n: "",
            umum_lain: "",
            sirkulasi: "",
            perkemihan: "",
            pernapasan: "",
            pencernaan: "",
            muskulo: "",
            neuro: "",
            kulit: "",
            tidur: "",
            mental: "",
            komunikasi: "",
            kebersihan: "",
            perawatan: "",
            lab: "",
            rad: "",
            ekg: "",
            usg: "",
        },
    ]);

    const handleAddIndividu = () =>
        setIndividuSakit([
            ...individuSakit,
            {
                nama: "",
                diagnosa: "",
                sumber_dana: "",
                rujukan: "",
                gcs: "",
                td: "",
                p: "",
                s: "",
                n: "",
                umum_lain: "",
                sirkulasi: "",
                perkemihan: "",
                pernapasan: "",
                pencernaan: "",
                muskulo: "",
                neuro: "",
                kulit: "",
                tidur: "",
                mental: "",
                komunikasi: "",
                kebersihan: "",
                perawatan: "",
                lab: "",
                rad: "",
                ekg: "",
                usg: "",
            },
        ]);

    const handleRemoveIndividu = (index) => {
        const newArr = [...individuSakit];
        newArr.splice(index, 1);
        setIndividuSakit(newArr);
    };

    const handleInputIndividu = (index, field, value) => {
        const newArr = [...individuSakit];
        newArr[index][field] = value;
        setIndividuSakit(newArr);
    };

    /* 5. STATE: KARTU ASUHAN & REGISTER */
    const [asuhan, setAsuhan] = useState([
        {
            tgl: "",
            data: "",
            dx: "",
            rencana: "",
            impl: "",
            eval: "",
            petugas: "",
        },
    ]);

    const handleAddAsuhan = () =>
        setAsuhan([
            ...asuhan,
            {
                tgl: "",
                data: "",
                dx: "",
                rencana: "",
                impl: "",
                eval: "",
                petugas: "",
            },
        ]);

    const handleRemoveAsuhan = (index) => {
        const newArr = [...asuhan];
        newArr.splice(index, 1);
        setAsuhan(newArr);
    };

    const handleInputAsuhan = (index, field, value) => {
        const newArr = [...asuhan];
        newArr[index][field] = value;
        setAsuhan(newArr);
    };

    const [register, setRegister] = useState([
        {
            tgl: "",
            nama_kk: "",
            nkk: "",
            alamat: "",
            masalah: "",
            dx: "",
            hasil: "",
            km1: false,
            km2: false,
            km3: false,
            km4: false,
            lepas_bina: false,
        },
    ]);

    const handleAddRegister = () =>
        setRegister([
            ...register,
            {
                tgl: "",
                nama_kk: "",
                nkk: "",
                alamat: "",
                masalah: "",
                dx: "",
                hasil: "",
                km1: false,
                km2: false,
                km3: false,
                km4: false,
                lepas_bina: false,
            },
        ]);

    const handleRemoveRegister = (index) => {
        const newArr = [...register];
        newArr.splice(index, 1);
        setRegister(newArr);
    };

    const handleInputRegister = (index, field, value) => {
        const newArr = [...register];
        newArr[index][field] = value;
        setRegister(newArr);
    };

    useEffect(() => {
        /* Cek apakah ada ID di URL (Mode Edit) */
        if (id) {
            axios
                .post(window.location.origin + "/ref_form_keluarga", {
                    id_form: id,
                })
                .then(function (response) {
                    const d = response.data;
                    setDataKeluarga({
                        fasilitas_yankes: d.fasilitas_yankes || "",
                        no_register: d.no_register || "",
                        nama_perawat: d.nama_perawat || "",
                        tanggal_pengkajian: d.tanggal_pengkajian || "",
                        nama_kk: d.nama_kk || "",
                        alamat_telp: d.alamat_telp || "",
                        agama_suku: d.agama_suku || "",
                        bahasa: d.bahasa || "",
                        jarak_yankes: d.jarak_yankes || "",
                        alat_transportasi: d.alat_transportasi || "",
                    });

                    // --- FUNGSI HELPER UNTUK PARSING DATA ---
                    const safeFormatArray = (data) => {
                        if (!data) return null;

                        // 1. Jika data berupa String (JSON belum di-decode oleh backend)
                        if (typeof data === 'string') {
                            try {
                                const parsed = JSON.parse(data);
                                return Array.isArray(parsed) ? parsed : Object.values(parsed);
                            } catch (e) {
                                console.error("Gagal parse string JSON dari database:", e);
                                return null; // Kembali null agar UI tidak crash
                            }
                        }

                        return Array.isArray(data) ? data : Object.values(data);
                    };

                    const safeFormatObject = (data) => {
                        if (!data) return null;
                        if (typeof data === 'string') {
                            try {
                                return JSON.parse(data);
                            } catch (e) { return null; }
                        }
                        return data;
                    };

                    // Gunakan fungsi helper ke semua data tabel
                    if (d.anggota_keluarga) setAnggotaKeluarga(safeFormatArray(d.anggota_keluarga));
                    if (d.individu_sakit) setIndividuSakit(safeFormatArray(d.individu_sakit));
                    if (d.asuhan_keperawatan) setAsuhan(safeFormatArray(d.asuhan_keperawatan));
                    if (d.register_perkesmas) setRegister(safeFormatArray(d.register_perkesmas));
                    if (d.sanitasi) setSanitasi(safeFormatObject(d.sanitasi));
                    if (d.kemandirian) setKemandirian(safeFormatObject(d.kemandirian));
                    if (d.phbs) setPhbs(safeFormatArray(d.phbs));
                    if (d.tugas_kesehatan) setTugas(safeFormatArray(d.tugas_kesehatan));
                })
                .catch(function (error) {
                    console.error("Gagal menarik data lama:", error);
                });
        }
    }, [id]);

    /* PRINT SETUP */
    const c_print_ref = useRef(null);
    const printTemplateRef = useRef(null);

    const oc_print = useReactToPrint({
        content: () => printTemplateRef.current,
        documentTitle: "Form_Keluarga_Lengkap",
    });

    const printData = {
        dataKeluarga,
        anggotaKeluarga,
        sanitasi,
        daftarPhbs,
        phbs,
        daftarTugas,
        tugas,
        kemandirian,
        individuSakit,
        asuhan,
        register,
    };

    const oc_simpan = (e) => {
        e.preventDefault();
        const payload = {
            id_form: id /* Sertakan ID untuk pencarian saat update */,
            fasilitas_yankes: dataKeluarga.fasilitas_yankes,
            no_register: dataKeluarga.no_register,
            nama_perawat: dataKeluarga.nama_perawat,
            tanggal_pengkajian: dataKeluarga.tanggal_pengkajian,
            nama_kk: dataKeluarga.nama_kk,
            alamat_telp: dataKeluarga.alamat_telp,
            agama_suku: dataKeluarga.agama_suku,
            bahasa: dataKeluarga.bahasa,
            jarak_yankes: dataKeluarga.jarak_yankes,
            alat_transportasi: dataKeluarga.alat_transportasi,
            anggota_keluarga: anggotaKeluarga,
            sanitasi: sanitasi,
            phbs: phbs,
            tugas_kesehatan: tugas,
            kemandirian: kemandirian,
            individu_sakit: individuSakit,
            asuhan_keperawatan: asuhan,
            register_perkesmas: register,
        };
        /* Tentukan endpoint berdasarkan keberadaan ID (Simpan baru / Update) */
        const url = id
            ? window.location.origin + "/form_keluarga/perbarui"
            : window.location.origin + "/form_keluarga/simpan";

        axios
            .post(url, payload)
            .then(function (response) {
                toast.success(
                    id
                        ? "Data Keluarga berhasil diperbarui."
                        : "Data Keluarga berhasil disimpan.",
                    { position: "top-right" },
                );
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Gagal menyimpan data!", { position: "top-right" });
            });
    };

    return (
        <>
            <div className="min-h-screen bg-slate-200 py-10 print:hidden w-full font-sans text-black">

                <Head title="Form Pengkajian Keluarga" /> <ToastContainer />
                {/* Catatan: form yang bisa diedit ini SENGAJA di-hidden saat print (lihat print:hidden
                di div pembungkus paling luar). Yang benar-benar dicetak adalah komponen
                PrintTemplateKeluarga terpisah (lihat ref={printTemplateRef} di bawah).
                Style @media print di sini sudah tidak dipakai lagi (elemen di dalamnya
                tidak pernah tampil saat print), jadi sengaja dihapus supaya tidak
                membingungkan / tidak ikut ke-load ke iframe cetak react-to-print. */}
                {/* --- TOMBOL ATAS --- */}
                <div className="flex justify-center print:hidden">
                    <a
                        href="/catatan_medis"
                        className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none"
                    >
                        Kembali
                    </a>
                </div>
                <div className="w-full flex justify-center">

                    <div
                        ref={c_print_ref}
                        className="w-full mx-auto bg-white shadow-2xl p-4 md:p-10 text-xs md:text-sm leading-snug relative"
                    >

                        {/* HALAMAN 1 : DATA KELUARGA */}
                        <div className="w-full flex flex-col">

                            <div className="text-center font-bold text-xl uppercase tracking-widest mb-6">
                                Pengkajian Keperawatan Keluarga
                            </div>
                            {/* IDENTITAS PUSKESMAS */}
                            <div className="flex border-2 border-black mb-4">

                                <div className="w-[15%] flex justify-center items-center border-r-2 border-black p-2">

                                    <img
                                        src="/gambar/baktihusada.png"
                                        alt="Logo"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                                <div className="w-[85%] flex flex-col text-sm font-semibold">

                                    <div className="flex border-b-2 border-black">

                                        <div className="w-1/2 flex items-center p-2 border-r-2 border-black">
                                            <span className="w-32">
                                                Fasilitas Yankes:
                                            </span>
                                            <input
                                                type="text"
                                                name="fasilitas_yankes"
                                                value={
                                                    dataKeluarga.fasilitas_yankes
                                                }
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted bg-transparent p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                        <div className="w-1/2 flex items-center p-2">
                                            <span className="w-32">
                                                No. Register:
                                            </span>
                                            <input
                                                type="text"
                                                name="no_register"
                                                value={dataKeluarga.no_register}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted bg-transparent p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">

                                        <div className="w-1/2 flex items-center p-2 border-r-2 border-black">
                                            <span className="w-48">
                                                Nama Perawat pengkaji:
                                            </span>
                                            <input
                                                type="text"
                                                name="nama_perawat"
                                                value={dataKeluarga.nama_perawat}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted bg-transparent p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                        <div className="w-1/2 flex items-center p-2">
                                            <span className="w-36">
                                                Tanggal Pengkajian:
                                            </span>
                                            <input
                                                type="date"
                                                name="tanggal_pengkajian"
                                                value={
                                                    dataKeluarga.tanggal_pengkajian
                                                }
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted bg-transparent p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* DATA KELUARGA */}
                            <div className="border-2 border-black mb-4">

                                <div className="bg-gray-200 text-center font-bold uppercase p-1 border-b-2 border-black">
                                    Data Keluarga
                                </div>
                                <div className="flex flex-col text-sm font-medium">

                                    <div className="flex border-b border-black">

                                        <div className="w-[60%] flex items-center p-2 border-r border-black">
                                            <span className="w-40">
                                                Nama Kepala Keluarga:
                                            </span>
                                            <input
                                                type="text"
                                                name="nama_kk"
                                                value={dataKeluarga.nama_kk}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0 uppercase font-bold"
                                            />
                                        </div>
                                        <div className="w-[40%] flex items-center p-2">
                                            <span className="w-32">
                                                Bahasa sehari-hari:
                                            </span>
                                            <input
                                                type="text"
                                                name="bahasa"
                                                value={dataKeluarga.bahasa}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex border-b border-black">

                                        <div className="w-[60%] flex items-center p-2 border-r border-black">
                                            <span className="w-40">
                                                Alamat & Telp:
                                            </span>
                                            <input
                                                type="text"
                                                name="alamat_telp"
                                                value={dataKeluarga.alamat_telp}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                        <div className="w-[40%] flex items-center p-2">
                                            <span className="w-36">
                                                Jarak yankes terdekat:
                                            </span>
                                            <input
                                                type="text"
                                                name="jarak_yankes"
                                                value={dataKeluarga.jarak_yankes}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">

                                        <div className="w-[60%] flex items-center p-2 border-r border-black">
                                            <span className="w-40">
                                                Agama & Suku:
                                            </span>
                                            <input
                                                type="text"
                                                name="agama_suku"
                                                value={dataKeluarga.agama_suku}
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                        <div className="w-[40%] flex items-center p-2">
                                            <span className="w-32">
                                                Alat Transportasi:
                                            </span>
                                            <input
                                                type="text"
                                                name="alat_transportasi"
                                                value={
                                                    dataKeluarga.alat_transportasi
                                                }
                                                onChange={handleInputKeluarga}
                                                className="flex-1 border-0 border-b border-dotted p-0 h-5 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* TABEL ANGGOTA 1 */}
                            <div className="border-2 border-black mb-4">

                                <div className="bg-gray-200 text-center font-bold uppercase p-1 border-b-2 border-black text-sm">
                                    Data Anggota Keluarga
                                </div>
                                <table className="w-full text-[10px] text-center border-collapse">

                                    <thead>

                                        <tr className="bg-gray-100">

                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-6"
                                            >
                                                No
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-12"
                                            >
                                                Hub KK
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-8"
                                            >
                                                Umur
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-6"
                                            >
                                                JK
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-12"
                                            >
                                                Suku
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-14"
                                            >
                                                Pend.
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-14"
                                            >
                                                Pekerjaan
                                            </th>
                                            <th
                                                colSpan="3"
                                                className="border-b border-r border-black p-1"
                                            >
                                                Gizi
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border-b border-r border-black p-1"
                                            >
                                                TTV
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-r border-black p-1 w-12"
                                            >
                                                Imunisasi
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-black p-1 w-12"
                                            >
                                                Alat Bantu
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-b border-l border-black p-1 print:hidden w-8"
                                            >
                                                Aksi
                                            </th>
                                        </tr>
                                        <tr className="bg-gray-100">

                                            <th className="border-b border-r border-black p-1 w-6">
                                                TB
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                BB
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                BMI
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                TD
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                N
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                S
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-6">
                                                P
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(anggotaKeluarga) && anggotaKeluarga.map((a, i) => (
                                            <tr key={i}>
                                                <td className="border-b border-r border-black p-1">
                                                    {i + 1}
                                                </td>
                                                {[
                                                    "nama",
                                                    "hub_kk",
                                                    "umur",
                                                    "jk",
                                                    "suku",
                                                    "pendidikan",
                                                    "pekerjaan",
                                                    "tb",
                                                    "bb",
                                                    "bmi",
                                                    "td",
                                                    "nadi",
                                                    "suhu",
                                                    "napas",
                                                    "imunisasi",
                                                    "alat_bantu",
                                                ].map((f) => (
                                                    <td
                                                        key={f}
                                                        className="border-b border-r border-black p-0 last:border-r-0"
                                                    >
                                                        <input
                                                            type="text"
                                                            className="w-full border-0 text-center text-[10px] p-1 focus:ring-0 bg-transparent"
                                                            value={a[f] || ""}
                                                            onChange={(e) =>
                                                                handleInputAnggota(
                                                                    i,
                                                                    f,
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                                <td className="border-b border-l border-black p-1 print:hidden">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveAnggota(i)
                                                        }
                                                        className="bg-red-500 text-white px-1 py-0.5 text-[10px] rounded"
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-1 print:hidden bg-gray-100 flex justify-end border-t border-black">
                                    <button
                                        onClick={handleAddAnggota}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        + Anggota
                                    </button>
                                </div>
                            </div>
                            {/* TABEL ANGGOTA 2 (LANJUTAN) */}
                            <div className="border-2 border-black mb-4">

                                <div className="bg-gray-200 text-center font-bold uppercase p-1 border-b-2 border-black text-sm">
                                    Lanjutan Data Anggota Keluarga
                                </div>
                                <table className="w-full text-[10px] text-center border-collapse">

                                    <thead>

                                        <tr className="bg-gray-100">

                                            <th className="border-b border-r border-black p-1 w-6">
                                                No
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-32">
                                                Nama
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-[20%]">
                                                Penampilan Umum
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-[20%]">
                                                Status Kesehatan
                                            </th>
                                            <th className="border-b border-r border-black p-1 w-[25%]">
                                                Riwayat Penyakit
                                            </th>
                                            <th className="border-b border-black p-1">
                                                Analisis Masalah
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(anggotaKeluarga) && anggotaKeluarga.map((a, i) => (
                                            <tr key={i}>
                                                <td className="border-b border-r border-black p-1">
                                                    {i + 1}
                                                </td>
                                                {/* PERBAIKAN 2: Penambahan || "" sebelum toUpperCase */}
                                                <td className="border-b border-r border-black p-1 font-bold text-left bg-gray-50">
                                                    {(a.nama || "").toUpperCase()}
                                                </td>
                                                {[
                                                    "penampilan",
                                                    "status_kesehatan",
                                                    "riwayat_penyakit",
                                                    "analisis_masalah",
                                                ].map((f) => (
                                                    <td
                                                        key={f}
                                                        className="border-b border-r border-black p-0 last:border-r-0"
                                                    >
                                                        <input
                                                            type="text"
                                                            className="w-full border-0 text-center text-[10px] p-1 focus:ring-0 bg-transparent"
                                                            value={a[f] || ""}
                                                            onChange={(e) =>
                                                                handleInputAnggota(
                                                                    i,
                                                                    f,
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* ======================================================= HALAMAN 2 : DATA PENUNJANG & KEMANDIRIAN ======================================================= */}
                        <div className="w-full flex flex-col page-break">

                            <div className="bg-gray-200 text-center font-bold uppercase p-1 border-2 border-black mb-2">
                                DATA PENUNJANG KELUARGA
                            </div>
                            <div className="flex border-2 border-black mb-4">

                                {/* KIRI: SANITASI */}
                                <div className="w-1/2 border-r-2 border-black p-2 flex flex-col gap-2 text-[11px]">

                                    <div className="font-bold border-b border-gray-400 pb-1 mb-1">
                                        Rumah dan Sanitasi Lingkungan
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            Kondisi Rumah:
                                        </span>
                                        <InputArea
                                            value={sanitasi.kondisi || ""}
                                            onChange={handleSanitasi}
                                            name="kondisi"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            Ventilasi (Cukup/Kurang):
                                        </span>
                                        <InputArea
                                            value={sanitasi.ventilasi || ""}
                                            onChange={handleSanitasi}
                                            name="ventilasi"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            Pencahayaan (Baik/Tidak):
                                        </span>
                                        <InputArea
                                            value={sanitasi.pencahayaan || ""}
                                            onChange={handleSanitasi}
                                            name="pencahayaan"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            Saluran Limbah (Baik/Cukup/Kurang):
                                        </span>
                                        <InputArea
                                            value={sanitasi.limbah || ""}
                                            onChange={handleSanitasi}
                                            name="limbah"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            Sumber Air Bersih (Sehat/Tidak):
                                        </span>
                                        <InputArea
                                            value={sanitasi.air || ""}
                                            onChange={handleSanitasi}
                                            name="air"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            Jamban Memenuhi Syarat:
                                        </span>
                                        <input
                                            type="text"
                                            name="jamban"
                                            value={sanitasi.jamban || ""}
                                            onChange={handleSanitasi}
                                            className="border-b border-0 p-0 h-4 text-[10px] w-20 bg-transparent focus:ring-0"
                                            placeholder="Ya/Tidak"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            Tempat Sampah:
                                        </span>
                                        <input
                                            type="text"
                                            name="sampah"
                                            value={sanitasi.sampah || ""}
                                            onChange={handleSanitasi}
                                            className="border-b border-0 p-0 h-4 text-[10px] w-20 bg-transparent focus:ring-0"
                                            placeholder="Ya/Tidak"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            Rasio Bangunan (8m2/org):
                                        </span>
                                        <input
                                            type="text"
                                            name="rasio"
                                            value={sanitasi.rasio || ""}
                                            onChange={handleSanitasi}
                                            className="border-b border-0 p-0 h-4 text-[10px] w-20 bg-transparent focus:ring-0"
                                            placeholder="Ya/Tidak"
                                        />
                                    </div>
                                </div>
                                {/* KANAN: PHBS */}
                                <div className="w-1/2 p-2 flex flex-col gap-1 text-[11px]">

                                    <div className="font-bold border-b border-gray-400 pb-1 mb-1">
                                        PHBS Di Rumah Tangga
                                    </div>
                                    {daftarPhbs.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border-b border-dotted border-gray-300 py-0.5"
                                        >

                                            <span className="w-[75%] leading-tight">
                                                {item}
                                            </span>
                                            <div className="w-[25%] flex gap-2 justify-end">

                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`phbs_${i}`}
                                                        value="Ya"
                                                        checked={phbs[i] === "Ya"}
                                                        onChange={() =>
                                                            handlePhbs(i, "Ya")
                                                        }
                                                        className="w-3 h-3"
                                                    />
                                                    Ya
                                                </label>
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`phbs_${i}`}
                                                        value="Tidak"
                                                        checked={
                                                            phbs[i] === "Tidak"
                                                        }
                                                        onChange={() =>
                                                            handlePhbs(i, "Tidak")
                                                        }
                                                        className="w-3 h-3"
                                                    />
                                                    Tdk
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* KEMAMPUAN KELUARGA */}
                            <div className="border-2 border-black mb-4">

                                <div className="bg-gray-200 text-center font-bold uppercase p-1 border-b-2 border-black text-xs">
                                    KEMAMPUAN KELUARGA MELAKUKAN TUGAS PEMELIHARAAN
                                    KESEHATAN
                                </div>
                                <div className="flex flex-col p-2 text-[11px] gap-2">

                                    {daftarTugas.map((soal, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col border-b border-dotted pb-1"
                                        >

                                            <span className="font-semibold">
                                                {i + 1}. {soal}
                                            </span>
                                            <div className="flex items-center gap-4 mt-1">

                                                {/* PERBAIKAN 3: Optional Chaining (tugas[i]?.jawaban) dan fallback || "" */}
                                                <input
                                                    type="text"
                                                    className="border-b border-0 p-0 h-4 text-[10px] w-48 bg-transparent focus:ring-0"
                                                    placeholder="Jawaban (Ya/Tidak/Lainnya)"
                                                    value={tugas[i]?.jawaban || ""}
                                                    onChange={(e) =>
                                                        handleTugas(
                                                            i,
                                                            "jawaban",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <span className="text-gray-500">
                                                    Ket:
                                                </span>
                                                <input
                                                    type="text"
                                                    className="flex-1 border-b border-0 p-0 h-4 text-[10px] bg-transparent focus:ring-0"
                                                    placeholder="Jelaskan..."
                                                    value={tugas[i]?.ket || ""}
                                                    onChange={(e) =>
                                                        handleTugas(
                                                            i,
                                                            "ket",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* KRITERIA KEMANDIRIAN */}
                            <div className="border-2 border-black p-2 text-[11px] flex items-center bg-gray-50">

                                <div className="w-2/3 grid grid-cols-2 gap-2">

                                    <div className="font-bold col-span-2 underline mb-1">
                                        KRITERIA KEMANDIRIAN KELUARGA:
                                    </div>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k1 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k1: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        1. Menerima petugas puskesmas
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k5 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k5: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        5. Melaksanakan perwatan sederhana
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k2 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k2: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        2. Menerima yankes sesuai rencana
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k6 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k6: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        6. Melaksanakan pencegahan aktif
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k3 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k3: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        3. Menyatakan masalah dgn benar
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k7 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k7: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        7. Melaksanakan tindakan promotif
                                    </label>
                                    <label className="flex gap-1">
                                        <input
                                            type="checkbox"
                                            checked={kemandirian.k4 || false}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    k4: e.target.checked,
                                                })
                                            }
                                            className="w-3 h-3"
                                        />
                                        4. Memanfaatkan faskes ssuai anjuran
                                    </label>
                                </div>
                                <div className="w-1/3 border-l-2 border-black pl-3 flex flex-col gap-1 text-[10px]">

                                    <div className="font-bold text-sm">
                                        Kesimpulan:
                                    </div>
                                    <div>KM-I : Kriteria 1 & 2</div>
                                    <div>KM-II : Kriteria 1 s/d 5</div>
                                    <div>KM-III : Kriteria 1 s/d 6</div>
                                    <div>KM-IV : Kriteria 1 s/d 7</div>
                                    <div className="mt-2 flex items-center font-bold text-sm">
                                        Hasil:
                                        <input
                                            type="text"
                                            className="w-16 ml-2 border-b-2 border-black text-center bg-transparent p-0 focus:ring-0 uppercase text-blue-700"
                                            value={kemandirian.kesimpulan || ""}
                                            onChange={(e) =>
                                                setKemandirian({
                                                    ...kemandirian,
                                                    kesimpulan: e.target.value,
                                                })
                                            }
                                            placeholder="KM-..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ======================================================= HALAMAN 3 : LAMPIRAN INDIVIDU SAKIT ======================================================= */}
                        {Array.isArray(individuSakit) && individuSakit.map((ind, idx) => (
                            <div
                                key={idx}
                                className="w-full flex flex-col page-break relative border-2 border-black p-4 mb-4"
                            >

                                <div className="absolute top-0 right-0 p-1 print:hidden bg-white">
                                    <button
                                        onClick={() => handleRemoveIndividu(idx)}
                                        className="bg-red-500 text-white px-2 py-1 text-xs rounded shadow"
                                    >
                                        Hapus Lampiran Ini
                                    </button>
                                </div>
                                <div className="font-bold text-base underline mb-4">
                                    Lampiran: DATA PENGKAJIAN INDIVIDU YANG SAKIT
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs font-bold mb-4 bg-gray-50 p-2 border border-gray-300">

                                    <div className="flex items-center w-[45%]">
                                        Nama:
                                        <input
                                            type="text"
                                            className="flex-1 ml-2 border-b border-black p-0 h-5 bg-transparent"
                                            value={ind.nama || ""}
                                            onChange={(e) =>
                                                handleInputIndividu(
                                                    idx,
                                                    "nama",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center w-[45%]">
                                        Diagnosa Medik:
                                        <input
                                            type="text"
                                            className="flex-1 ml-2 border-b border-black p-0 h-5 bg-transparent"
                                            value={ind.diagnosa || ""}
                                            onChange={(e) =>
                                                handleInputIndividu(
                                                    idx,
                                                    "diagnosa",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center w-[45%]">
                                        Sumber Dana:
                                        <input
                                            type="text"
                                            className="flex-1 ml-2 border-b border-black p-0 h-5 bg-transparent"
                                            value={ind.sumber_dana || ""}
                                            onChange={(e) =>
                                                handleInputIndividu(
                                                    idx,
                                                    "sumber_dana",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center w-[45%]">
                                        Rujukan Dokter/RS:
                                        <input
                                            type="text"
                                            className="flex-1 ml-2 border-b border-black p-0 h-5 bg-transparent"
                                            value={ind.rujukan || ""}
                                            onChange={(e) =>
                                                handleInputIndividu(
                                                    idx,
                                                    "rujukan",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {/* GRID PENGKAJIAN FISIK */}
                                <div className="grid grid-cols-3 gap-2 text-[10px] border-t border-black pt-2">

                                    {/* KOLOM 1 */}
                                    <div className="flex flex-col gap-2 border-r border-gray-300 pr-2">

                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Keadaan Umum
                                            </div>
                                            GCS:
                                            <input
                                                type="text"
                                                className="w-10 border-b p-0 h-4 mr-2"
                                                value={ind.gcs || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "gcs",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            TD:
                                            <input
                                                type="text"
                                                className="w-10 border-b p-0 h-4 mr-2"
                                                value={ind.td || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "td",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            P:
                                            <input
                                                type="text"
                                                className="w-10 border-b p-0 h-4"
                                                value={ind.p || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "p",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <br /> S:
                                            <input
                                                type="text"
                                                className="w-10 border-b p-0 h-4 mr-2"
                                                value={ind.s || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "s",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            N:
                                            <input
                                                type="text"
                                                className="w-10 border-b p-0 h-4"
                                                value={ind.n || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "n",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputArea
                                                value={ind.umum_lain || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "umum_lain",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tanda lain (Takikardi, Menggigil, dll)..."
                                                name="umum_lain"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Sirkulasi/Cairan
                                            </div>
                                            <InputArea
                                                value={ind.sirkulasi || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "sirkulasi",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Edema, Asites, Tanda Anemia, Dehidrasi..."
                                                name="sirkulasi"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Perkemihan
                                            </div>
                                            <InputArea
                                                value={ind.perkemihan || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "perkemihan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Pola BAK, Hematuri, Disuria, Kemampuan BAB/BAK..."
                                                name="perkemihan"
                                            />
                                        </div>
                                    </div>
                                    {/* KOLOM 2 */}
                                    <div className="flex flex-col gap-2 border-r border-gray-300 pr-2">

                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Pernapasan
                                            </div>
                                            <InputArea
                                                value={ind.pernapasan || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "pernapasan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Sianosis, Slym, Wheezing, Ronki, Sesak..."
                                                name="pernapasan"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Pencernaan
                                            </div>
                                            <InputArea
                                                value={ind.pencernaan || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "pencernaan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Mual, Kembung, Nafsu makan, Bising Usus, Maag..."
                                                name="pencernaan"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Muskuloskeletal
                                            </div>
                                            <InputArea
                                                value={ind.muskulo || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "muskulo",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tonus otot, Fraktur, RPS Atas/Bawah, Berdiri, Berjalan..."
                                                name="muskulo"
                                            />
                                        </div>
                                    </div>
                                    {/* KOLOM 3 */}
                                    <div className="flex flex-col gap-2">

                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Neurosensori
                                            </div>
                                            <InputArea
                                                value={ind.neuro || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "neuro",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Fungsi Penglihatan, Pendengaran, Perasa, Perabaan..."
                                                name="neuro"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Kulit, Tidur & Mental
                                            </div>
                                            <InputArea
                                                value={ind.kulit || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "kulit",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Luka, Decubitus, Tidur, Cemas, Depresi..."
                                                name="kulit"
                                            />
                                        </div>
                                        <div className="border border-gray-400 p-1">
                                            <div className="font-bold bg-gray-200 text-center mb-1">
                                                Kebersihan & Perawatan Diri
                                            </div>
                                            <InputArea
                                                value={ind.kebersihan || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "kebersihan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Gigi, Mata, Mandi, Berpakaian (Mandiri/Tergantung)..."
                                                name="kebersihan"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* DATA PENUNJANG MEDIS INDIVIDU */}
                                <div className="mt-4 border-2 border-black">

                                    <div className="bg-gray-200 text-center font-bold uppercase p-1 border-b-2 border-black text-xs">
                                        DATA PENUNJANG MEDIS INDIVIDU
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 p-2 text-[10px] font-bold text-blue-900 bg-blue-50/20">

                                        <div className="flex flex-col">
                                            Laboratorium
                                            <input
                                                type="text"
                                                className="border-b border-black p-0 h-5 bg-transparent text-black font-normal"
                                                value={ind.lab || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "lab",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            Radiologi
                                            <input
                                                type="text"
                                                className="border-b border-black p-0 h-5 bg-transparent text-black font-normal"
                                                value={ind.rad || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "rad",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            EKG
                                            <input
                                                type="text"
                                                className="border-b border-black p-0 h-5 bg-transparent text-black font-normal"
                                                value={ind.ekg || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "ekg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            USG
                                            <input
                                                type="text"
                                                className="border-b border-black p-0 h-5 bg-transparent text-black font-normal"
                                                value={ind.usg || ""}
                                                onChange={(e) =>
                                                    handleInputIndividu(
                                                        idx,
                                                        "usg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="w-full mb-6 print:hidden flex justify-center">
                            <button
                                onClick={handleAddIndividu}
                                className="bg-blue-600 text-white px-4 py-2 rounded shadow font-bold"
                            >
                                + Tambah Lampiran Individu Sakit (Jika &gt;1 Org)
                            </button>
                        </div>
                        {/* ======================================================= HALAMAN 4 : KARTU ASUHAN KEPERAWATAN ======================================================= */}
                        <div className="w-full flex flex-col page-break">

                            <div className="flex justify-between items-center mb-6">

                                <img
                                    src="/gambar/kemenkesri.png"
                                    alt="Kemenkes"
                                    className="h-16 object-contain"
                                />
                                <div className="text-center font-bold text-xl uppercase tracking-widest flex-1">
                                    KARTU ASUHAN KEPERAWATAN KELUARGA
                                </div>
                                <img
                                    src="/gambar/germas.png"
                                    alt="Germas"
                                    className="h-16 object-contain"
                                />
                            </div>
                            <div className="flex gap-4 text-sm font-bold mb-4">

                                <div className="flex-1 flex border-b border-black">
                                    <span className="w-24">Puskesmas</span>
                                    <span>:</span>
                                    <input
                                        className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0"
                                        value={dataKeluarga.fasilitas_yankes}
                                        readOnly
                                    />
                                </div>
                                <div className="w-48 flex border-b border-black">
                                    <span className="w-12">Kode</span>
                                    <span>:</span>
                                    <input className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0" />
                                </div>
                            </div>
                            <div className="flex gap-4 text-sm font-bold mb-4">

                                <div className="flex-1 flex border-b border-black">
                                    <span className="w-40">
                                        Nama Kepala Keluarga
                                    </span>
                                    <span>:</span>
                                    <input
                                        className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0"
                                        value={dataKeluarga.nama_kk}
                                        readOnly
                                    />
                                </div>
                                <div className="w-48 flex border-b border-black">
                                    <span className="w-24">Telp/Ponsel</span>
                                    <span>:</span>
                                    <input
                                        className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0"
                                        value={dataKeluarga.alamat_telp}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 text-sm font-bold mb-6">

                                <div className="flex-1 flex border-b border-black">
                                    <span className="w-24">Alamat</span>
                                    <span>:</span>
                                    <input
                                        className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0"
                                        value={dataKeluarga.alamat_telp}
                                        readOnly
                                    />
                                </div>
                                <div className="flex-1 flex border-b border-black">
                                    <span className="w-36">Masalah Kesehatan</span>
                                    <span>:</span>
                                    <input className="flex-1 ml-2 border-0 bg-transparent p-0 focus:ring-0" />
                                </div>
                            </div>
                            <div className="border-2 border-black">

                                <table className="w-full text-xs text-center border-collapse">

                                    <thead>

                                        <tr className="bg-gray-200 border-b-2 border-black">

                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-2 w-8"
                                            >
                                                Tgl
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-2 w-32"
                                            >
                                                Data Pengkajian
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-2 w-32"
                                            >
                                                Diagnosis Keperawatan
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-2 w-32"
                                            >
                                                Rencana Intervensi
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-2 w-32"
                                            >
                                                Implementasi
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border-r border-black p-2"
                                            >
                                                Evaluasi
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="p-2 w-20 border-l border-black"
                                            >
                                                Petugas
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="p-1 print:hidden w-8 border-l border-black"
                                            >
                                                Act
                                            </th>
                                        </tr>
                                        <tr className="bg-gray-200 border-b-2 border-black">

                                            <th className="border-r border-black p-1 w-8 text-[10px]">
                                                S
                                            </th>
                                            <th className="border-r border-black p-1 w-8 text-[10px]">
                                                O
                                            </th>
                                            <th className="border-r border-black p-1 w-8 text-[10px]">
                                                A
                                            </th>
                                            <th className="border-r border-black p-1 w-8 text-[10px]">
                                                P
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(asuhan) && asuhan.map((ash, idx) => (
                                            <tr key={idx}>

                                                <td className="border-b border-r border-black p-0">
                                                    <input
                                                        type="date"
                                                        className="w-full h-20 text-[9px] border-0 text-center p-0 bg-transparent focus:ring-0"
                                                        value={ash.tgl || ""}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "tgl",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={ash.data}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "data",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={ash.dx}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "dx",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={ash.rencana}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "rencana",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={ash.impl}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "impl",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td
                                                    colSpan="4"
                                                    className="border-b border-r border-black p-0"
                                                >
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        placeholder="S:... O:... A:... P:..."
                                                        value={ash.eval}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "eval",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-l border-black p-0">
                                                    <textarea
                                                        className="w-full h-20 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0 text-center"
                                                        value={ash.petugas}
                                                        onChange={(e) =>
                                                            handleInputAsuhan(
                                                                idx,
                                                                "petugas",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-l border-black p-1 print:hidden bg-gray-50">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveAsuhan(idx)
                                                        }
                                                        className="bg-red-500 text-white rounded px-2 py-1 text-[10px]"
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-1 print:hidden bg-gray-100 flex justify-end border-t border-black">
                                    <button
                                        onClick={handleAddAsuhan}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        + Baris Asuhan
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* ======================================================= HALAMAN 5 : REGISTER PERKESMAS ======================================================= */}
                        <div className="w-full flex flex-col page-break">

                            <div className="text-center font-bold text-xl tracking-widest mb-6 border-b-4 border-double border-black pb-2">
                                REGISTER PELAYANAN PERKESMAS - FORMULIR REGISTER 1
                            </div>
                            <div className="border-2 border-black">

                                <table className="w-full text-[10px] text-center border-collapse">

                                    <thead>

                                        <tr className="bg-gray-200 border-b-2 border-black">

                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-6"
                                            >
                                                No
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-16"
                                            >
                                                Tgl
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-24"
                                            >
                                                Nama KK
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-20"
                                            >
                                                NKK
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-32"
                                            >
                                                Alamat
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-24"
                                            >
                                                Masalah Kesehatan
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-24"
                                            >
                                                Diagnosis Keperawatan
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-24"
                                            >
                                                Hasil Asuhan
                                            </th>
                                            <th
                                                colSpan="4"
                                                className="border-r border-black p-1"
                                            >
                                                Tingkat Kemandirian
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="border-r border-black p-1 w-12"
                                            >
                                                Lepas Bina
                                            </th>
                                            <th
                                                rowSpan="2"
                                                className="p-1 print:hidden w-8 border-l border-black"
                                            >
                                                Act
                                            </th>
                                        </tr>
                                        <tr className="bg-gray-200 border-b-2 border-black">

                                            <th className="border-r border-black p-1 w-8">
                                                KM-I
                                            </th>
                                            <th className="border-r border-black p-1 w-8">
                                                KM-II
                                            </th>
                                            <th className="border-r border-black p-1 w-8">
                                                KM-III
                                            </th>
                                            <th className="border-r border-black p-1 w-8">
                                                KM-IV
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {Array.isArray(register) && register.map((reg, idx) => (
                                            <tr key={idx}>

                                                <td className="border-b border-r border-black p-1">
                                                    {idx + 1}
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <input
                                                        type="date"
                                                        className="w-full h-12 text-[9px] border-0 text-center p-0 bg-transparent focus:ring-0"
                                                        value={reg.tgl || ""}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "tgl",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.nama_kk}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "nama_kk",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.nkk}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "nkk",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.alamat}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "alamat",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.masalah}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "masalah",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.dx}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "dx",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-0">
                                                    <textarea
                                                        className="w-full h-12 text-[10px] border-0 p-1 bg-transparent resize-none focus:ring-0"
                                                        value={reg.hasil}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "hasil",
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-1">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4"
                                                        checked={reg.km1 || false}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "km1",
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-1">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4"
                                                        checked={reg.km2 || false}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "km2",
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-1">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4"
                                                        checked={reg.km3 || false}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "km3",
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-1">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4"
                                                        checked={reg.km4 || false}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "km4",
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-r border-black p-1">
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4"
                                                        checked={reg.lepas_bina || false}
                                                        onChange={(e) =>
                                                            handleInputRegister(
                                                                idx,
                                                                "lepas_bina",
                                                                e.target.checked,
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="border-b border-l border-black p-1 print:hidden bg-gray-50">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveRegister(
                                                                idx,
                                                            )
                                                        }
                                                        className="bg-red-500 text-white rounded px-2 py-1 text-[10px]"
                                                    >
                                                        X
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-1 print:hidden bg-gray-100 flex justify-end border-t border-black">
                                    <button
                                        onClick={handleAddRegister}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        + Baris Register
                                    </button>
                                </div>
                            </div> {/* Tutup Wrapper Tabel */}
                        </div> {/* Tutup Wrapper Kertas */}
                    </div> {/* Tutup Background Abu */}
                </div> {/* Tutup Main Container */}
                {/* --- TOMBOL BAWAH --- */}
                <div className="grid grid-cols-4 mt-3 mb-5 text-xs md:text-sm sm:text-xs print:hidden">
                    <div></div>
                    <button
                        type="button"
                        onClick={oc_simpan}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    >
                        {id ? "Perbarui" : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={oc_print}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    >
                        Print
                    </button>
                </div>
            </div>
            <PrintTemplateKeluarga ref={printTemplateRef} d={printData} />
        </>
    );
}