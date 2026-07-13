
Anda adalah seorang Senior React Developer. Tugas Anda adalah melakukan REFACTORING TOTAL pada file form medis React (JSX) yang saya berikan di bagian bawah prompt ini.

TUJUAN UTAMA:
Mempertahankan antarmuka pengguna (UI) modern di layar (Web) untuk pengisian data, namun merombak total sistem cetaknya (Print) agar 100% *pixel-perfect* menyerupai dokumen fisik resmi (PDF/Word) dari Dinas Kesehatan.

MASALAH (BUG) PADA KODE LAMA YANG HARUS DIPERBAIKI:

1. Bug Tanda Tangan Hilang: Pada kode lama, saat `isPrinting` bernilai true, canvas diganti dengan div kosong sehingga tanda tangan tidak ikut tercetak.
2. Input Form Ikut Tercetak: Kode lama masih menggunakan `<input>`, `<textarea>`, `<input type="date">` saat di-print. Ini rawan memunculkan ikon kalender/jam atau memotong teks panjang saat dicetak browser.
3. Layout Flexbox Berantakan: Kode lama menggunakan kumpulan `<div>` dengan atribut `flex` dan persentase `w-[8%]` untuk membuat grid. Saat di-print, ini sering bergeser atau hancur.
4. Teks Statis Hilang: Teks baku dokumen resmi seperti jabatan ("Mengetahui, Kepala Seksi Pelayanan", dll) tidak di-hardcode.

ATURAN KETAT REFACTORING (WAJIB DIIKUTI):

Aturan 1: Separation of Concerns (Pemisah UI & Cetak)

- JANGAN MENCAMPUR UI web dengan tampilan print menggunakan ternary operator sederhana `isPrinting ? A : B` pada level elemen.
- BUAT KOMPONEN BARU bernama `<PrintTemplate>` yang disembunyikan dari layar (`className="hidden"`). Komponen ini khusus ditarik oleh `react-to-print`.
- Biarkan UI form utama tetap menggunakan gaya bawaannya (Tailwind, input, dll) tapi beri class `print:hidden` agar hilang saat dicetak.

Aturan 2: Aturan Khusus Komponen `<PrintTemplate>`

- WAJIB menggunakan tabel HTML murni (`<table>`, `<tr>`, `<td>`, `<tbody>`) dengan kombinasi `border-collapse border border-black` untuk membuat kotak/grid tata letak. JANGAN gunakan Flexbox (`div.flex`) untuk menyusun layout yang berbentuk tabel/grid.
- JANGAN ADA tag `<input>`, `<textarea>`, atau `<select>` di dalam PrintTemplate. Semua data harus ditampilkan sebagai teks statis biasa `{data.nama_pasien}`.
- Untuk Checkbox di kertas cetak, gunakan karakter unicode: `data.status === 'Ya' ? '☑' : '☐'` atau input checkbox statis `<input type="checkbox" checked={...} readOnly />`.

Aturan 3: Penanganan Signature Canvas (SANGAT KRUSIAL)

- Tanda tangan (dari `react-signature-canvas`) tidak boleh hilang.
- Di dalam konfigurasi `useReactToPrint`, gunakan properti `onBeforeGetContent`.
- Sebelum get content, ekstrak data dari ref canvas (misal: `sigMenyerahkan.current.getCanvas().toDataURL("image/png")`) dan simpan ke state `signatureImg`.
- Kirim `signatureImg` ini sebagai *props* ke `<PrintTemplate>` dan render menggunakan `<img src={signatureImg} />`.

STANDAR STRUKTUR KODE YANG DIHARAPKAN:

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import SignatureCanvas from 'react-signature-canvas';
// ... import lainnya ...

// --- 1. KOMPONEN CETAK (Hanya Muncul di Kertas, Layout Tabel Murni) ---
const PrintTemplate = React.forwardRef(({ data, sigMenyerahkanImg }, ref) => (
  <div ref={ref} className="hidden print:block bg-white text-black p-8 text-sm font-serif">
    {/* Contoh KOP Surat */}
    <table className="w-full mb-4">...</table>
  
    {/* Contoh Biodata Teks Statis */}
    <table className="w-full border-collapse border border-black mb-2">
       <tbody>
          <tr>
             <td className="border border-black p-1 w-1/4">Nama Pasien</td>
             <td className="border border-black p-1 font-bold">{data.nama_pasien}</td>
          </tr>
       </tbody>
    </table>

    {/* Contoh Tanda Tangan */}
    <div className="flex justify-end mt-8">
       <div className="text-center">
          <p>Semarang, {data.tgl_serah_terima}</p>
          <p>Mengetahui,</p>
          <p>Kepala Seksi Pelayanan</p>
          {sigMenyerahkanImg ? <img src={sigMenyerahkanImg} className="h-20 mx-auto" alt="TTD" /> : <div className="h-20"></div>}
          <p className="font-bold underline uppercase">{data.nama_mengetahui}</p>
       </div>
    </div>
  </div>
));

// --- 2. KOMPONEN UTAMA (UI Layar) ---
export default function FormMedis(props) {
  const { data, setData, post } = useForm({...});
  const printComponentRef = useRef();
  const sigMenyerahkanRef = useRef();
  const [sigMenyerahkanImg, setSigMenyerahkanImg] = useState(null);

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    onBeforeGetContent: () => {
       // Konversi canvas ke image base64 sebelum render print
       if (sigMenyerahkanRef.current && !sigMenyerahkanRef.current.isEmpty()) {
           setSigMenyerahkanImg(sigMenyerahkanRef.current.getCanvas().toDataURL('image/png'));
       }
       return Promise.resolve();
    }
  });

  return (
    <div className="w-full print:hidden">
       {/* --- TAMPILAN WEB UI LAMA ANDA (Tetap Gunakan Flex, Input, dsb) --- */}
       <SignatureCanvas ref={sigMenyerahkanRef} />
       <button onClick={handlePrint}>Cetak PDF</button>

       {/* --- TEMPLATE CETAK TERSEMBUNYI --- */}
       <PrintTemplate ref={printComponentRef} data={data} sigMenyerahkanImg={sigMenyerahkanImg} />
    </div>
  );
}
```
