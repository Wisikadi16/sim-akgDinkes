const fs = require('fs');

// File 1: Form_Surat_Persetujuan_Tindakan_Medis.jsx
// Has inner <div ref={ref_print} className="bg-white text-black p-4">
// Needs outer <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
let file1 = '/var/www/sim-akg/resources/js/Pages/Form/Form_Surat_Persetujuan_Tindakan_Medis.jsx';
let content1 = fs.readFileSync(file1, 'utf8');
const replace1 = `    return (
        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            <div className="flex justify-center print:hidden mb-6 space-x-4">
                <a href="/catatan_medis" className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none shadow-lg">
                    Kembali
                </a>
                <button type="button" onClick={oc_print} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2 shadow-lg">
                    Cetak
                </button>
            </div>
            <div ref={ref_print} className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black">`;
content1 = content1.replace(/return\s*\(\s*<div\s+ref=\{ref_print\}\s+className="bg-white text-black p-4">\s*<div className="flex justify-center">\s*<a[^>]*>\s*Kembali\s*<\/a>\s*<\/div>/g, replace1);
content1 = content1.replace(/<\/div>\s*<div className="flex justify-center mt-5 ">\s*<button type="button" onClick=\{oc_simpan\}[^>]*>\s*Simpan\s*<\/button>\s*<button type="button" onClick=\{oc_print\}[^>]*>\s*Print\s*<\/button>\s*<\/div>\s*<\/div>\s*\)\s*}/g, `</div>
            <div className="flex justify-center mt-5 print:hidden">
                <button type="button" onClick={oc_simpan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                    Simpan
                </button>
            </div>
        </div>
    )
}`);
// There is an alert("berhasil simpan") around line 456 that might be affected.
// Actually, Form_Surat_Persetujuan_Tindakan_Medis doesn't have the save/print buttons at the bottom.
fs.writeFileSync(file1, content1, 'utf8');

// File 2: Form_Surat_Keterangan_Kematian.jsx
// Missing the inner kertas wrapper.
let file2 = '/var/www/sim-akg/resources/js/Pages/Form/Form_Surat_Keterangan_Kematian.jsx';
let content2 = fs.readFileSync(file2, 'utf8');
const replace2 = `        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            <div className="flex justify-center print:hidden mb-6 space-x-4">
                <a href="/catatan_medis" className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none shadow-lg">
                    Kembali
                </a>
                <button type="button" onClick={oc_print} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2 shadow-lg">
                    Cetak
                </button>
            </div>
            <div ref={ref_print} className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black">`;
content2 = content2.replace(/<div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">/g, replace2);
// It has bottom buttons that need to be outside the paper
content2 = content2.replace(/<\/div>\s*\{isPrinting == false && \(\s*<div className="flex justify-center mt-5 ">\s*<button type="button" onClick=\{oc_simpan\}[^>]*>\s*Simpan\s*<\/button>\s*<button type="button" onClick=\{oc_print\}[^>]*>\s*Print\s*<\/button>\s*<\/div>\s*\)\}\s*<\/div>/g, 
`</div>
            <div className="flex justify-center mt-5 print:hidden">
                <button type="button" onClick={oc_simpan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg">
                    Simpan
                </button>
            </div>
        </div>`);
fs.writeFileSync(file2, content2, 'utf8');

// File 3: Form_Neonatal.jsx
let file3 = '/var/www/sim-akg/resources/js/Pages/Form/Form_Neonatal.jsx';
let content3 = fs.readFileSync(file3, 'utf8');
content3 = content3.replace(/<div ref=\{c_print_ref\} className="bg-white text-black p-4 bg-white text-black p-4">/g, `<div ref={c_print_ref} className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black">`);
fs.writeFileSync(file3, content3, 'utf8');

// File 4: Form_Umum.jsx
let file4 = '/var/www/sim-akg/resources/js/Pages/Form/Form_Umum.jsx';
let content4 = fs.readFileSync(file4, 'utf8');
content4 = content4.replace(/<div className="print-container mb-3 bg-white text-black p-4" ref=\{c_print_ref\}>/g, `<div ref={c_print_ref} className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black">`);
fs.writeFileSync(file4, content4, 'utf8');

console.log("Done updating wrappers");
