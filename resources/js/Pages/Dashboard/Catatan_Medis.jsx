import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { toast } from 'react-toastify';

const SelFormDanAksi = ({ row, fungsi_hapus }) => {
    const [indexTerpilih, setIndexTerpilih] = useState(0);
    const formAktif = row.forms[indexTerpilih] || {};
    const formRoutes = {
        "form umum": "/form_umum",
        "form neonatal": "/form_neonatal",
        "form maternal": "/form_maternal",
        "form cm doa": "/form_cm_doa",
        "form surat keterangan kematian": "/form_surat_keterangan_kematian",
        "form surat persetujuan tindakan medis": "/form_surat_persetujuan_tindakan_medis",
        "form lembar transfer pasien": "/form_lembar_transfer_pasien",
        "form-keluarga": "/form-keluarga",
        "form keluarga": "/form-keluarga",
    };
    const routeBase = formRoutes[(formAktif.jenis || "").toLowerCase()];
    const editLink = routeBase && formAktif.id ? `${routeBase}/${formAktif.id}` : "#";

    const getTanggal = () => {
        if (!formAktif.tgl_penanganan) return "Tanpa Tanggal";
        return formAktif.tgl_penanganan.substring(8, 10) + "/" + formAktif.tgl_penanganan.substring(5, 7) + "/" + formAktif.tgl_penanganan.substring(0, 4);
    };

    return (
        <div className="flex items-center gap-3 py-2 w-full justify-between">
            <div className="flex items-center gap-3">
                {/* 1. TANGGAL DENGAN GAYA BADGE MODERN */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-colors duration-300 bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300/50 border border-slate-200 dark:border-slate-700 transition-colors duration-300 px-2 py-1 rounded-lg min-w-max shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {getTanggal()}
                </div>

                {/* 2. DROPDOWN BENTUK KAPSUL (PILL) */}
                <div className="relative min-w-[220px]">
                    <select
                        className="appearance-none bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-200 dark:border-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-200 transition-colors duration-300 font-bold text-xs rounded-full px-4 py-2 pr-10 w-full cursor-pointer hover:border-red-300 hover:bg-red-50 focus:ring-4 focus:ring-red-500/10 focus:border-red-400 outline-none transition-all shadow-sm"
                        value={indexTerpilih}
                        onChange={(e) => setIndexTerpilih(e.target.value)}
                    >
                        {row.forms.map((form, index) => (
                            <option key={form.id || index} value={index}>
                                {form.jenis || "Form Tidak Diketahui"}
                            </option>
                        ))}
                    </select>
                    {/* Ikon Panah Kustom */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>

            {/* 3. TOMBOL AKSI IKONIK (GHOST BUTTONS) */}
            <div className="flex gap-1.5">
                <Link href={editLink}>
                    <button type="button" title="Edit Data" className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                </Link>
                <button type="button" title="Hapus Data" onClick={() => fungsi_hapus(formAktif.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
            </div>
        </div>
    );
};

export default function Catatan_Medis({ auth }) {
    // 1. Tambahkan rumus tanggal ini tepat di bawah 'export default'
    const getToday = () => new Date().toISOString().split('T')[0];
    const getSemingguLalu = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    };

    const [semua_catatan_medis, set_semua_catatan_medis] = useState([]);
    const [semua_catatan_medis_cari, set_semua_catatan_medis_cari] = useState([]);

    // State untuk Input Form
    const [val_cari, set_val_cari] = useState('');
    const [periode_dari_input, set_periode_dari_input] = useState(getSemingguLalu());
    const [periode_sampai_input, set_periode_sampai_input] = useState(getToday());

    // State yang digunakan untuk API (Applied state)
    const [search_query, set_search_query] = useState('');
    const [periode_dari, set_periode_dari] = useState(getSemingguLalu());
    const [periode_sampai, set_periode_sampai] = useState(getToday());

    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [edit, set_edit] = useState(false);

    const oc_periode_dari = (e) => {
        set_periode_dari_input(e.target.value);
    };

    const oc_periode_sampai = (e) => {
        set_periode_sampai_input(e.target.value);
    };

    const cari_data = () => {
        // Validasi 7 hari
        if (periode_dari_input && periode_sampai_input) {
            const diffInDays = (new Date(periode_sampai_input) - new Date(periode_dari_input)) / (1000 * 60 * 60 * 24);
            if (diffInDays > 7) {
                toast.warning("Pemilihan tanggal hanya satu pekan", { position: toast.POSITION.TOP_RIGHT });
                set_periode_sampai_input(periode_dari_input);
                return;
            }
            if (diffInDays < 0) {
                set_periode_sampai_input(periode_dari_input);
                return;
            }
        }

        // Apply
        set_search_query(val_cari);
        set_periode_dari(periode_dari_input);
        set_periode_sampai(periode_sampai_input);
        setCurrentPage(1); // Reset page to 1 when filtering
    };

    // 3. Tambahkan useEffect ini tepat di bawah fungsi oc_periode
    useEffect(() => {
        set_periode_dari(getSemingguLalu());
        set_periode_sampai(getToday());

        console.log("Filter Otomatis 1 Minggu Aktif");

        // fetch_ref_catatan_medis()
        // refresh_all_data()
        // axios.post(window.location.origin + '/ref_catatan_medis',
        //     {
        //         // tanggung_jawab:'Dokter',
        //         periode_dari: periode_dari,
        //         periode_sampai: periode_sampai
        //     }).then(function (response) {
        //         // set_semua_petugas(response.data)
        //         set_semua_catatan_medis(response.data)
        //         set_semua_catatan_medis_cari(response.data)
        //         console.log(response)
        //     })
    }, []);

    useEffect(() => {
        if (periode_dari && periode_sampai) {
            setLoading(true); // mulai loading
            axios
                .post(window.location.origin + "/ref_catatan_medis", {
                    periode_dari,
                    periode_sampai,
                    page: currentPage,
                    search: search_query,
                })
                .then((response) => {
                    set_semua_catatan_medis_cari(groupByPasien(response.data.data));
                    setTotalRows(response.data.total);
                    setLoading(false); // selesai loading
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false); // selesai loading meskipun error
                });
        }
    }, [periode_dari, periode_sampai, currentPage, search_query]);

    // const handlePageChange = (page) => {
    //     console.log("oc page")
    //     console.log(page)
    //     setCurrentPage(page);  // Mengubah halaman aktif
    // };

    const handlePageChange = (page) => {
        console.log("onChangePage triggered, new page:", page);  // Log jika halaman berubah
        setCurrentPage(page);  // Update halaman aktif
    };

    // function fetch_ref_catatan_medis() {
    //     axios.post(window.location.origin + '/ref_catatan_medis',
    //         {
    //             // tanggung_jawab:'Dokter',
    //             periode_dari: periode_dari,
    //             periode_sampai: periode_sampai
    //         }).then(function (response) {
    //             // set_semua_petugas(response.data)
    //             set_semua_catatan_medis(response.data)
    //             set_semua_catatan_medis_cari(response.data)
    //             console.log(response)
    //         })
    // }

    const oc_hapus = (id) => {
        // router.post('/hapus_admin', {
        //     id:id,
        // })
        console.log("hapus id")
        console.log(id)

        axios.post(window.location.origin + '/ref_catatan_medis',
            {
                id: id,
            }).then(function (response) {
                // set_semua_petugas(response.data)
                // set_semua_admin(response.data)
                // set_semua_admin_cari(response.data)
                set_data(prev_data => ({
                    ...prev_data,
                    id: response.data.id,
                    nik_pasien: response.data.pasien.nik,
                    nama_pasien: response.data.nama ? response.data.pasien.nama : '',
                    tgl_penanganan: response.data.tgl_penanganan,
                    jenis_form: response.data.jenis,
                }));
                console.log(response)
            })

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) => {
        console.log("hapus id")
        console.log(id)
        axios.post(window.location.origin + '/form/hapus',
            {
                id: id,
            }).then(function (response) {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });

                // REFRESH DATA SETELAH HAPUS SUKSES
                if (periode_dari && periode_sampai) {
                    setLoading(true);
                    axios.post(window.location.origin + "/ref_catatan_medis", {
                        periode_dari,
                        periode_sampai,
                        page: currentPage,
                    }).then((res) => {
                        set_semua_catatan_medis_cari(groupByPasien(res.data.data));
                        setTotalRows(res.data.total);
                        setLoading(false);
                    }).catch((err) => {
                        setLoading(false);
                    });
                } else {
                    refresh_all_data();
                }

            }).catch(function (error) {
                toast.error("Data gagal dihapus", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });

        set_null_data()
        set_modal_hapus(false)
    }

    const [page, set_page] = useState([0]);

    const columns = [
        { name: 'No', selector: (row, index) => ((currentPage - 1) * 10) + (index + 1), width: "60px" },
        { name: 'No. RM', selector: (row) => row.rm, width: "120px" },
        { name: 'NIK Pasien', selector: (row) => row.nik_pasien, width: "190px" },
        { name: 'Nama Pasien', selector: (row) => row.nama_pasien, width: "240px" },
        auth.role == "Admin" ? { name: 'Tim Ambulan', selector: (row) => row.tim_ambulan, width: "140px" } : '',
        {
            name: 'Riwayat Form Medis & Aksi',
            minWidth: "600px",
            cell: (row) => <SelFormDanAksi row={row} fungsi_hapus={oc_hapus} />
        }
    ].filter(Boolean);

    const conditionalRowStyles = [
        // {
        //   when: row => row.tanggung_jawab.includes('Driver'),
        //   style: {
        //     backgroundColor: 'green',
        //     color: 'white',
        //     '&:hover': {
        //       cursor: 'pointer',
        //     },
        //   },
        // },

        // {
        //   when: row => row.tanggung_jawab.includes('Dokter'),
        // //   style: row => ({
        // //     // backgroundColor: row.phone.startsWith('9') || row.phone.startsWith('1') ? 'pink' : 'inerit',
        // //   }),
        //   style: {
        //     backgroundColor: 'blue',
        //     color: 'white',
        //     '&:hover': {
        //       cursor: 'pointer',
        //     },
        //   },
        // },
    ];

    // Cari dihapus karena sudah di-handle oleh server-side dengan tombol Filter

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nik_pasien: '',
        nama_pasien: '',
        tgl_penanganan: '',
        jenis_form: '',
    });

    // Kode ini untuk mengubah data mentah dari backend menjadi terkelompok per pasien
    const groupByPasien = (dataRaw) => {
        if (!dataRaw || !Array.isArray(dataRaw)) return [];
        const grouped = {};
        dataRaw.forEach(item => {
            const nik = item.pasien?.nik || item.nik_pasien;
            const nama = item.pasien?.nama || item.nama_pasien || item.nama;
            const key = nik || nama;

            if (!grouped[key]) {
                grouped[key] = {
                    rm: item.rm || '-',
                    nik_pasien: nik || '-',
                    nama_pasien: nama || '-',
                    tim_ambulan: item.tim_ambulan || '-',
                    forms: []
                };
            }
            grouped[key].forms.push(item);
        });
        return Object.values(grouped);
    };


    function refresh_all_data() {
        axios.post(window.location.origin + '/ref_catatan_medis').then(function (response) {
            set_semua_catatan_medis(response.data)
            set_semua_catatan_medis_cari(groupByPasien(response.data))
        })
    }

    function set_null_data() {
        set_data(prev_data => ({
            ...prev_data,
            id: '',
            nama_pasien: '',
            tgl_penanganan: '',
            jenis_form: '',
        }));
    }

    function x() {
        set_modal_hapus(false)

        set_null_data()
    }

    console.log(edit);
    console.log(data)
    console.log("onChangePage triggered, new page:", currentPage);

    // --- DESAIN EMPTY STATE CUSTOM ---
    const CustomEmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4 w-fu ll animate-fade-in">
            <div className="bg-slate-50 dark:bg-red-900/20 transition-colors duration-300 p-6 rounded-full mb-4 shadow-inner dark:shadow-[inset_0_2px_15px_rgba(220,38,38,0.1)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 dark:text-red-500/50 transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <h4 className="text-lg font-extrabold text-slate-600 dark:text-slate-300 transition-colors duration-300 mb-2">Belum Ada Catatan Medis</h4>
            <p className="text-sm text-slate-400 max-w-sm text-center leading-relaxed">
                Tidak ada data pasien untuk rentang tanggal yang dipilih. Coba sesuaikan filter kalender di atas atau klik <strong className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Tambah Catatan</strong>.
            </p>
        </div>
    );

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Catatan Medis</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1">Daftar rekam medis dan penanganan pasien</p>
                </div>
            </div>

            {/* 2. CONTROL PANEL (Filter & Action Row) */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                    {/* SEARCH INPUT */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={val_cari}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-slate-50 dark:bg-slate-900 transition-colors duration-300/50 text-sm focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-400 outline-none transition-all placeholder:text-gray-400"
                            placeholder="Cari pasien atau NIK..."
                            onChange={(e) => set_val_cari(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && cari_data()}
                        />
                    </div>

                    {/* DATE FILTERS (Inline Group) */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-900 transition-colors duration-300/80 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="flex items-center gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dari</span>
                            <input
                                type="date"
                                id="periode_dari"
                                value={periode_dari_input}
                                onChange={oc_periode_dari}
                                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300 focus:ring-0 p-1 cursor-pointer w-full sm:w-auto outline-none"
                            />
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-slate-700 transition-colors duration-300"></div>
                        <div className="flex items-center gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Hingga</span>
                            <input
                                type="date"
                                id="periode_sampai"
                                value={periode_sampai_input}
                                onChange={oc_periode_sampai}
                                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300 focus:ring-0 p-1 cursor-pointer w-full sm:w-auto outline-none"
                            />
                        </div>
                    </div>

                    {/* ACTION BUTTON (Filter Data) */}
                    <button
                        type="button"
                        onClick={cari_data}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                        Filter Data
                    </button>

                    {/* ACTION BUTTON (Tambah Data) */}
                    <button
                        type="button"
                        onClick={(e) => set_modal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-200 active:scale-95 group w-full lg:w-auto whitespace-nowrap"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Catatan
                    </button>

                </div>
            </div>
            {/* DataTable Card*/}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden mt-2">
                    <DataTable
                        columns={columns}
                        data={semua_catatan_medis_cari}
                        pagination
                        paginationPerPage={10}
                        paginationTotalRows={totalRows}
                        striped
                        onChangePage={handlePageChange}
                        paginationServer
                        highlightOnHover
                        progressPending={loading}
                        noDataComponent={<CustomEmptyState />}
                        progressComponent={
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                            </div>
                        }
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
                                    noData: {
                                        style: {
                                            backgroundColor: 'transparent',
                                            color: 'var(--dt-row-text, #334155)',
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

            {/* Modal Pilihan Form */}
            {modal &&
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-[2rem] w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg">
                                {edit ? 'Edit' : 'Tambah'} Catatan Medis
                            </h3>
                            <button onClick={(e) => set_modal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {[
                                {
                                    to: "/form_umum",
                                    title: "Form Umum",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                },
                                {
                                    to: "/form_maternal",
                                    title: "Form Maternal",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                },
                                {
                                    to: "/form_cm_doa",
                                    title: "Form CM DOA",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                },
                                {
                                    to: "/form_neonatal",
                                    title: "Form Neonatal",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                },
                                {
                                    to: "/form_surat_keterangan_kematian",
                                    title: "Surat Kematian",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                },
                                {
                                    to: "/form_surat_persetujuan_tindakan_medis",
                                    title: "Persetujuan Tindakan",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                },
                                {
                                    to: "/form_lembar_transfer_pasien",
                                    title: "Transfer Pasien",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                },
                                {
                                    to: "/form-keluarga",
                                    title: "Pengkajian Keluarga",
                                    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.971 5.971 0 00-.941 3.197m0 0a5.995 5.995 0 005.058 2.772" />
                                }
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.to}
                                    className="group flex flex-col items-center justify-center gap-6 p-8 aspect-square rounded-[2rem] border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 shadow-sm hover:border-red-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-red-50 text-red-600 shadow-inner transition-all duration-300 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                            {item.icon}
                                        </svg>
                                    </div>
                                    <span className="font-extrabold text-base text-center text-gray-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-red-700 transition-colors duration-300 px-2 leading-tight tracking-tight">
                                        {item.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            }

            {/* Modal Hapus */}
            {modal_hapus &&
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Form
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4">Apakah Anda yakin ingin menghapus data form ini? Tindakan ini tidak dapat dibatalkan.</p>

                            <div className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                                <div><span className="font-medium text-gray-500 dark:text-slate-400 transition-colors duration-300">Tanggal:</span> {data.tgl_penanganan}</div>
                                <div><span className="font-medium text-gray-500 dark:text-slate-400 transition-colors duration-300">NIK:</span> {data.nik_pasien}</div>
                                <div><span className="font-medium text-gray-500 dark:text-slate-400 transition-colors duration-300">Nama:</span> {data.nama_pasien}</div>
                                <div><span className="font-medium text-gray-500 dark:text-slate-400 transition-colors duration-300">Jenis Form:</span> {data.jenis_form}</div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => x()} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 transition-colors">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200">
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
