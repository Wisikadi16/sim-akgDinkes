import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import ElegantStatCard from "../../Components/ElegantStatCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Laporan({ auth }) {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [jenis, set_jenis] = useState('');

    const [cari_tgl, set_cari_tgl] = useState({
        dari_tanggal: '',
        sampai_tanggal: '',
    });
    const [cari_kasus, set_cari_kasus] = useState('');
    const [cari_media, set_cari_media] = useState('');
    const [page, set_page] = useState(1);
    const [perPage, set_perPage] = useState(10);

    // STATE BARU: Untuk mengatur Tab mana yang sedang aktif
    const [tabAktif, setTabAktif] = useState('operasional');

    useEffect(() => {
        // Load default laporan data (no date filter)
        axios.post(`${window.location.origin}/ref_laporan`, {
            jenis: "jenis pelayanan"
        })
            .then((response) => {
                const rows = response.data.table_data || [];
                set_semua_order(rows);
                set_semua_order_cari(rows);
                set_jenis('jenis pelayanan');
            })
            .catch((err) => {
                console.error('Error loading laporan:', err);
            });
    }, []);

    // KOLOM TABEL 1: OPERASIONAL (Asli milikmu)
    const columnsOperasional = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'TANGGAL', selector: (row) => row.waktu_order, width: '150px', wrap: true },
        { name: 'BASECAMP TIM', selector: (row) => row.tim_ambulan?.nama_tim || '-', width: '250px', wrap: true },
        { name: 'NAMA PASIEN', selector: (row) => row.nama_pasien || '-', width: '180px', wrap: true },
        { name: 'ALAMAT', selector: (row) => row.alamat_kejadian || row.alamat || '-', width: '250px', wrap: true },
        { name: 'PENELPON', selector: (row) => row.nama_penelepon || '-', width: '150px' },
        { name: 'NO TELP', selector: (row) => row.no_penelepon || row.no_hp || '-', width: '150px' },
        { name: 'KONDISI/KELUHAN', selector: (row) => row.kasus || row.keluhan || '-', minWidth: '220px', wrap: true },
    ];

    // KOLOM TABEL 2: REKAM MEDIS (Baru, sesuai permintaan mentor)
    const columnsMedis = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'TANGGAL', selector: (row) => row.waktu_order, width: '140px', wrap: true },
        { name: 'NO. RM', selector: (row) => row.rm || '-', width: '100px' },
        { name: 'NAMA PASIEN', selector: (row) => row.nama_pasien || '-', width: '160px', wrap: true },
        { name: 'JENIS LAYANAN', selector: (row) => row.jenis_layanan || '-', width: '180px', wrap: true },
        { name: 'FASILITAS RUJUKAN', selector: (row) => row.faskes_rujukan || '-', width: '200px', wrap: true },
        { name: 'KASUS / KELUHAN', selector: (row) => row.diagnosa || row.kasus || '-', width: '200px', wrap: true },
        {
            name: 'STATUS DOA',
            selector: (row) => ((row.kasus?.toLowerCase().includes('doa') || row.kategori_kasus?.toLowerCase().includes('doa')) ? 'YA' : 'TIDAK'),
            width: '130px',
            cell: (row) => (
                <span className={`font-bold ${(row.kasus?.toLowerCase().includes('doa') || row.kategori_kasus?.toLowerCase().includes('doa')) ? 'text-red-600' : 'text-emerald-600'}`}>
                    {(row.kasus?.toLowerCase().includes('doa') || row.kategori_kasus?.toLowerCase().includes('doa')) ? 'YA' : 'TIDAK'}
                </span>
            )
        },
        { name: 'TINDAKAN MEDIS', selector: (row) => row.tindakan || '-', minWidth: '200px', wrap: true },
        { name: 'PETUGAS MEDIK', selector: (row) => row.petugas_medis || row.tim_ambulan?.nama_tim || '-', width: '180px' },
    ];

    const oc_cari = (e) => {
        e.preventDefault();
        axios.post(window.location.origin + '/ref_laporan', {
            jenis: jenis,
            dari_tanggal: cari_tgl.dari_tanggal,
            sampai_tanggal: cari_tgl.sampai_tanggal,
            kasus: cari_kasus,
            media_akses: cari_media
        })
            .then((response) => {
                // 1. Ambil data dari backend
                const rawData = response.data.table_data || [];

                // 2. PAKSA MENJADI ARRAY (Mencegah bug Object JSON dari Laravel)
                const finalData = Array.isArray(rawData) ? rawData : Object.values(rawData);

                // 3. Masukkan ke state
                set_semua_order_cari(finalData);

                // 4. RESET HALAMAN KE 1 (Sangat penting agar pagination tidak nyangkut)
                set_page(1);
            })
            .catch((err) => {
                console.error('Error fetching filtered laporan:', err);
            });
    };

    const handleExportExcel = () => {
        if (tabAktif === 'operasional') {
            // Build the query string based on current filters
            const params = new URLSearchParams({
                dari_tanggal: cari_tgl.dari_tanggal,
                sampai_tanggal: cari_tgl.sampai_tanggal,
                kasus: cari_kasus,
                media_akses: cari_media
            });
            window.open(`${window.location.origin}/laporan/export-operasional?${params.toString()}`, '_blank');
        } else {
            toast.warning('Fitur export untuk rekam medis belum tersedia.', { position: toast.POSITION.TOP_RIGHT });
        }
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* 1. HEADER UTAMA */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 pb-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Laporan SIM-AKG</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1 capitalize">Ringkasan Statistik Operasional & Rekam Medis</p>
                </div>
                <button onClick={handleExportExcel} className="w-full md:w-auto justify-center flex items-center gap-2 bg-white dark:bg-slate-800 transition-colors duration-300 border border-green-600 text-green-700 font-semibold px-4 py-2 rounded-xl shadow-sm hover:bg-green-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125zM3.375 7.5v12c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-12M3.375 7.5h17.25m-14.25 3h11.25m-11.25 3h11.25m-11.25 3h11.25" /></svg>
                    Export Excel
                </button>
            </div>

            {/* 2. MENU TAB INTERAKTIF */}
            <div className="flex flex-col sm:flex-row gap-2 bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 p-1 rounded-2xl w-full md:w-max mx-auto md:mx-0 shadow-inner mb-2">
                <button
                    onClick={() => setTabAktif('operasional')}
                    className={`flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tabAktif === 'operasional' ? 'bg-white dark:bg-slate-800 transition-colors duration-300 text-red-700 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300/50' : 'text-gray-500 dark:text-slate-400 transition-colors duration-300 hover:text-gray-700 dark:text-slate-200 transition-colors duration-300 hover:bg-gray-200 dark:bg-slate-700 transition-colors duration-300/50'}`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                    RAMAH OPERASIONAL
                </button>
                {auth?.role?.toLowerCase() !== 'operator' && (
                    <button
                        onClick={() => setTabAktif('medis')}
                        className={`flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tabAktif === 'medis' ? 'bg-white dark:bg-slate-800 transition-colors duration-300 text-blue-700 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300/50' : 'text-gray-500 dark:text-slate-400 transition-colors duration-300 hover:text-gray-700 dark:text-slate-200 transition-colors duration-300 hover:bg-gray-200 dark:bg-slate-700 transition-colors duration-300/50'}`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        REKAM MEDIS
                    </button>
                )}
            </div>

            {/* FILTER (Muncul di kedua Tab) */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col gap-4">
                <h2 className="font-bold text-gray-700 dark:text-slate-200 transition-colors duration-300 text-md border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 pb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                    Filter Pencarian Laporan
                </h2>
                <form onSubmit={oc_cari} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase mb-2">Dari Tanggal</label>
                        <input type="date" name="dari_tanggal" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 dark:text-slate-200 transition-colors duration-300 text-sm" onChange={(e) => set_cari_tgl((prev) => ({ ...prev, dari_tanggal: e.target.value }))} required />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase mb-2">Sampai Tanggal</label>
                        <input type="date" name="sampai_tanggal" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 dark:text-slate-200 transition-colors duration-300 text-sm" onChange={(e) => set_cari_tgl((prev) => ({ ...prev, sampai_tanggal: e.target.value }))} required />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase mb-2">Jenis Kasus</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 dark:text-slate-200 transition-colors duration-300 text-sm" onChange={(e) => set_cari_kasus(e.target.value)}>
                            <option value="">Semua Kasus</option>
                            <option value="Gawat Darurat">Gawat Darurat</option>
                            <option value="Transport">Transport</option>
                            <option value="KLL">Laka Lantas (KLL)</option>
                            <option value="Homecare">Homecare</option>
                            <option value="Maternal Neonatal">Maternal Neonatal</option>
                            <option value="Non Gadar">Non Gadar</option>
                            <option value="Cancel">Cancel</option>
                            <option value="DOA">DOA</option>
                        </select>
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase mb-2">Media Akses</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 dark:text-slate-200 transition-colors duration-300 text-sm" onChange={(e) => set_cari_media(e.target.value)}>
                            <option value="112">Callcenter 112</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <button type="submit" className="w-full h-[46px] bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                            Tampilkan Data
                        </button>
                    </div>
                </form>
            </div>

            {tabAktif === 'operasional' && (
                <div className="animate-fade-in flex flex-col gap-6">
                    {/* DASHBOARD CARDS OPERASIONAL */}
                    <div className="flex flex-col xl:flex-row gap-6 w-full items-stretch">
                        {/* AREA KIRI: TOTAL */}
                        <div className="w-full xl:w-4/12 flex flex-col sm:flex-row xl:flex-col gap-4">
                            <div className="flex-1 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-200 dark:border-slate-700 transition-colors duration-300 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full -z-10"></div>
                                <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3 border border-indigo-200">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <p className="text-[18px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Laporan</p>
                                <h2 className="text-5xl font-black text-gray-800 dark:text-slate-100 transition-colors duration-300 leading-none">{semua_order_cari.length || 0}</h2>
                            </div>
                        </div>

                        {/* AREA KANAN: KATEGORI KASUS MENGGUNAKAN TEMA MERAH ELEGANT */}
                        <div className="w-full xl:w-8/12 grid grid-cols-2 md:grid-cols-3 gap-5">

                            <ElegantStatCard
                                title="Gawat Darurat"
                                value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('gawat darurat') || i.kategori_kasus?.toLowerCase().includes('gawat darurat')).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                            />

                            <ElegantStatCard
                                title="Transport"
                                value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('transport') || i.kategori_kasus?.toLowerCase().includes('transport')).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
                            />

                            <ElegantStatCard
                                title="Laka Lantas"
                                value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('kll') || i.kategori_kasus?.toLowerCase().includes('kll')).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.436 3 11.998c0 2.369 1.157 4.475 2.97 5.895a7.994 7.994 0 01-1.393 2.083 1.125 1.125 0 00.916 1.832 9.073 9.073 0 004.53-1.637c.94.27 1.933.418 2.976.418z" /></svg>}
                            />

                            <ElegantStatCard
                                title="Homecare"
                                value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('homecare') || i.kategori_kasus?.toLowerCase().includes('homecare')).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                            />

                            <ElegantStatCard
                                title="Maternal"
                                value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('maternal neonatal') || i.kategori_kasus?.toLowerCase().includes('maternal neonatal')).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                            />

                            <ElegantStatCard
                                title="Cancel"
                                isNeutral={true}
                                value={semua_order_cari.filter(i =>
                                    i.kasus?.toLowerCase().includes('cancel') ||
                                    i.kategori_kasus?.toLowerCase().includes('cancel') ||
                                    i.status?.toLowerCase() === 'batal' ||
                                    i.status?.toLowerCase() === 'cancel'
                                ).length}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
                            />

                        </div>
                    </div>

                    {/* DATATABLE OPERASIONAL */}
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="mb-4 pt-2">
                            <h2 className="font-bold text-lg text-gray-800 dark:text-slate-100 transition-colors duration-300">Tabel Laporan Operasional</h2>
                        </div>
                        <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden">
                            <DataTable columns={columnsOperasional} data={semua_order_cari} pagination highlightOnHover responsive striped
                                onChangePage={(newPage) => set_page(newPage)}
                                onChangeRowsPerPage={(newPerPage, newPage) => { set_perPage(newPerPage); set_page(newPage); }}
                                customStyles={{
                                    pagination: {
                                        style: {
                                            backgroundColor: 'transparent',
                                            color: 'var(--dt-row-text, #334155)',
                                            borderTopColor: 'var(--dt-border, #f1f5f9)',
                                        },
                                        pageButtonsStyle: {
                                            color: 'var(--dt-row-text, #334155)',
                                            fill: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'transparent',
                                            '&:disabled': {
                                                cursor: 'unset',
                                                color: 'var(--dt-border, #f1f5f9)',
                                                fill: 'var(--dt-border, #f1f5f9)',
                                            },
                                            '&:hover:not(:disabled)': {
                                                backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            },
                                            '&:focus': {
                                                outline: 'none',
                                                backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            },
                                        },
                                    },
                                    table: {
                                        style: {
                                            backgroundColor: 'transparent',
                                        }
                                    },
                                    headRow: {
                                        style: {
                                            backgroundColor: 'var(--dt-header-bg, #f8fafc)',
                                            color: 'var(--dt-header-text, #64748b)',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            borderBottomWidth: '1px',
                                            borderBottomColor: 'var(--dt-border, #f1f5f9)'
                                        }
                                    },
                                    rows: {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'transparent',
                                            minHeight: '64px',
                                            '&:not(:last-of-type)': {
                                                borderBottomStyle: 'solid',
                                                borderBottomWidth: '1px',
                                                borderBottomColor: 'var(--dt-border, #f1f5f9)'
                                            }
                                        },
                                        stripedStyle: {
                                            color: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'var(--dt-striped-bg, #f8fafc)'
                                        },
                                        highlightOnHoverStyle: {
                                            color: 'var(--dt-hover-text, #0f172a)',
                                            backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            transitionDuration: '0.15s',
                                            transitionProperty: 'background-color',
                                            borderBottomColor: 'var(--dt-border)',
                                            outlineStyle: 'none',
                                        }
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                KONTEN TAB 2: REKAM MEDIS (Baru)
            ======================================================== */}
            {tabAktif === 'medis' && auth?.role?.toLowerCase() !== 'operator' && (
                <div className="animate-fade-in flex flex-col gap-6">
                    {/* STATISTIK MEDIS TEMA MERAH */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
                        <ElegantStatCard
                            title="Dirujuk ke Faskes"
                            value={semua_order_cari.filter(i => i.faskes_rujukan != null || i.status === 'rujuk').length}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                        />
                        <ElegantStatCard
                            title="Selesai di Tempat"
                            value={semua_order_cari.filter(i => i.status === 'selesai penanganan' || i.tindakan != null).length}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        />
                        <ElegantStatCard
                            title="Meninggal (DOA)"
                            isNeutral={true}
                            value={semua_order_cari.filter(i => i.kasus?.toLowerCase().includes('doa') || i.kategori_kasus?.toLowerCase().includes('doa')).length}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        />
                    </div>

                    {/* DATATABLE REKAM MEDIS */}
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="mb-4 pt-2">
                            <h2 className="font-bold text-lg text-gray-800 dark:text-slate-100 transition-colors duration-300">Tabel Laporan Medis & Klinis</h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">Rincian diagnosa awal dan tindakan pra-rumah sakit</p>
                        </div>
                        <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden">
                            <DataTable columns={columnsMedis} data={semua_order_cari} pagination highlightOnHover responsive striped
                                onChangePage={(newPage) => set_page(newPage)}
                                onChangeRowsPerPage={(newPerPage, newPage) => { set_perPage(newPerPage); set_page(newPage); }}
                                customStyles={{
                                    pagination: {
                                        style: {
                                            backgroundColor: 'transparent',
                                            color: 'var(--dt-row-text, #334155)',
                                            borderTopColor: 'var(--dt-border, #f1f5f9)',
                                        },
                                        pageButtonsStyle: {
                                            color: 'var(--dt-row-text, #334155)',
                                            fill: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'transparent',
                                            '&:disabled': {
                                                cursor: 'unset',
                                                color: 'var(--dt-border, #f1f5f9)',
                                                fill: 'var(--dt-border, #f1f5f9)',
                                            },
                                            '&:hover:not(:disabled)': {
                                                backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            },
                                            '&:focus': {
                                                outline: 'none',
                                                backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            },
                                        },
                                    },
                                    table: {
                                        style: {
                                            backgroundColor: 'transparent',
                                        }
                                    },
                                    headRow: {
                                        style: {
                                            backgroundColor: 'var(--dt-header-bg, #f8fafc)',
                                            color: 'var(--dt-header-text, #64748b)',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            borderBottomWidth: '1px',
                                            borderBottomColor: 'var(--dt-border, #f1f5f9)'
                                        }
                                    },
                                    rows: {
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'transparent',
                                            minHeight: '64px',
                                            '&:not(:last-of-type)': {
                                                borderBottomStyle: 'solid',
                                                borderBottomWidth: '1px',
                                                borderBottomColor: 'var(--dt-border, #f1f5f9)'
                                            }
                                        },
                                        stripedStyle: {
                                            color: 'var(--dt-row-text, #334155)',
                                            backgroundColor: 'var(--dt-striped-bg, #f8fafc)'
                                        },
                                        highlightOnHoverStyle: {
                                            color: 'var(--dt-hover-text, #0f172a)',
                                            backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                                            transitionDuration: '0.15s',
                                            transitionProperty: 'background-color',
                                            borderBottomColor: 'var(--dt-border)',
                                            outlineStyle: 'none',
                                        }
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}