import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { toast } from 'react-toastify';

export default function Pasien() {
    const [semua_pasien, set_semua_pasien] = useState([]);
    const [semua_pasien2, set_semua_pasien2] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [edit, set_edit] = useState(false);

    useEffect(() => {
        // axios.post(window.location.origin+'/ref_pasien',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     // set_semua_pasien(response.data)
        //     set_semua_pasien(response.data)
        //     set_semua_pasien2(response.data)
        //     console.log(response)
        // })
        refresh_semua_data()

        axios.post(window.location.origin + '/ref_kecamatan',
            {
                // kode_kecamatan:kode_kecamatan,
            }).then(function (response) {
                set_semua_kecamatan(response.data)
                // console.log(response)
            })

        axios.post(window.location.origin + '/ref_kelurahan',
            {
                kode_kecamatan: kode_kecamatan,
                // kode_kecamatan:"",
            }).then(function (response) {
                set_semua_kelurahan(response.data)
                // console.log(response)
            })

    }, [])

    const oc_hapus = (id) => {
        // router.post('/hapus_petugas', {
        //     id:id,
        // })
        set_modal_hapus(true)

        axios.post(window.location.origin + '/ref_pasien',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nik']: response.data.nik,
                    ['nama']: response.data.nama,
                    ['no_telepon']: response.data.no_telepon,
                    ['alamat_domisili']: response.data.alamat,
                    ['kecamatan']: response.data.alamat_kecamatan,
                    ['kelurahan']: response.data.alamat_kelurahan,
                    ['nama_kecamatan']: response.data.ref_kecamatan?.nama_kecamatan || '',
                    ['nama_kelurahan']: response.data.ref_kelurahan?.nama_kelurahan || '',
                    ['tgl_lahir']: response.data.tgl_lahir,
                    ['jenis_kelamin']: response.data.jenis_kelamin,
                    ['status']: response.data.status,
                    ['tgl_meninggal']: response.data.tgl_meninggal,
                })

                refresh_semua_data()
                console.log(response)
            })
    }

    const oc_hapus_simpan = (id) => {
        console.log("hpaus id")
        console.log(id)
        // router.post('/pasien/hapus', {
        //     id:id,
        // })
        axios.post(window.location.origin + '/pasien/hapus',
            {
                id: id,
            }).then(function (response) {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                set_modal_hapus(false)
                set_null_data()
                refresh_semua_data()
            }).catch(function (error) {
                if (error.response && error.response.status === 409) {
                    toast.error(error.response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                } else {
                    toast.error("Terjadi kesalahan saat menghapus data.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
                set_modal_hapus(false)
                refresh_semua_data()
            });
    }

    const oc_edit = (id) => {
        console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin + '/ref_pasien',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nik']: response.data.nik,
                    ['nama']: response.data.nama,
                    ['no_telepon']: response.data.no_telepon,
                    ['alamat_domisili']: response.data.alamat,
                    ['kecamatan']: response.data.alamat_kecamatan,
                    ['nama_kecamatan']: response.data.ref_kecamatan?.nama_kecamatan || '',
                    ['kelurahan']: response.data.alamat_kelurahan,
                    ['nama_kelurahan']: response.data.ref_kelurahan?.nama_kelurahan || '',
                    ['tgl_lahir']: response.data.tgl_lahir,
                    ['jenis_kelamin']: response.data.jenis_kelamin,
                    ['status']: response.data.status,
                    ['tgl_meninggal']: response.data.tgl_meninggal,
                })
                console.log(response)

                refresh_semua_data()
            })
        // console.log("hapus"+id);
    }

    function hit_umur(tgl_lahir, tgl_meninggal) {
        var formattedDate = tgl_lahir.split("-")
        // console.log("date"+formattedDate)
        var birthdateTimeStamp = new Date(formattedDate[0], (formattedDate[1] - 1), formattedDate[2])
        if (tgl_meninggal != null) {
            var split_tgl_meninggal = tgl_meninggal.split("-")
            var tgl_meninggal = new Date(split_tgl_meninggal[0], (split_tgl_meninggal[1] - 1), split_tgl_meninggal[2])

            var difference = tgl_meninggal - birthdateTimeStamp;
        }
        else {
            var currentDate = new Date().getTime();

            var difference = currentDate - birthdateTimeStamp;
        }
        var currentAge = Math.floor(difference / 31557600000)
        // dividing by 1000*60*60*24*365.25
        return currentAge
    }

    const [page, set_page] = useState([0]);

    // console.log("page"+page)

    const columns = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'NIK', selector: (row) => row.nik, width: "170px" },
        { name: 'Nama', selector: (row) => row.nama, width: "170px" },
        { name: 'No Telepon', selector: (row) => row.no_telepon, width: "130px" },
        { name: 'Tgl Lahir', selector: (row) => row.tgl_lahir ? row.tgl_lahir.substring(8, 10) + "/" + row.tgl_lahir.substring(5, 7) + "/" + row.tgl_lahir.substring(0, 4) : "", width: "130px" },
        { name: 'Jenis Kelamin', selector: (row) => row.jenis_kelamin, width: "110px" },
        { name: 'Usia', selector: (row) => row.tgl_lahir ? hit_umur(row.tgl_lahir, row.tgl_meninggal) : "", width: "130px" },
        // {name:'Alamat', selector:(row)=>(row.alamat?row.alamat:"")+(row.ref_kelurahan?" kel. "+row.ref_kelurahan.nama_kelurahan:"")+(row.ref_kecamatan?" kec. "+row.ref_kecamatan.nama_kecamatan:""), width:"410px"},
        { name: 'Alamat', cell: (row) => (row.alamat ? row.alamat : "") + (row.ref_kelurahan ? " kel. " + row.ref_kelurahan.nama_kelurahan : "") + (row.ref_kecamatan ? " kec. " + row.ref_kecamatan.nama_kecamatan : ""), width: "410px" },
        { name: 'Status', selector: (row) => row.status },
        {
            name: 'Action',
            width: "160px",
            cell: (row) =>
                <div className="flex gap-2">
                    <button type="button" title="Edit Data" onClick={() => oc_edit(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button type="button" title="Hapus Data" onClick={() => oc_hapus(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                </div>
        },
    ]

    const conditionalRowStyles = [
    ]

    const cari = (e) => {
        const query = e.target.value.toLowerCase();
        set_semua_pasien2(semua_pasien.filter((item) =>
            item.nama.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query)
        ))
    }

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nik: '',
        nama: '',
        no_telepon: '',
        tgl_lahir: '',
        jenis_kelamin: '',
        alamat_domisili: '',
        nama_kecamatan: '',
        nama_kelurahan: '',
        kecamatan: '',
        kelurahan: '',
        status: '',
        tgl_meninggal: '',
    });

    // const oc_tambah = (e) => {
    const oc_data = (e) => {
        // console.log("oc");
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {
                    ...data,
                    ["kecamatan"]: option,
                    ["nama_kecamatan"]: e.target.value
                });
            axios.post(window.location.origin + '/ref_kelurahan',
                {
                    kode_kecamatan: option,
                }).then(function (response) {
                    set_semua_kelurahan(response.data)
                })
        }
        else if (e.target.name == "kelurahan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {
                    ...data,
                    ["kelurahan"]: option,
                    ["nama_kelurahan"]: e.target.value
                });
        }
        else if (e.target.name === "nik") {
            const value = e.target.value;
            // Izinkan input jika hanya angka, ATAU jika diawali "NON-" (termasuk saat sedang dihapus "NON-", "NON", "NO", "N")
            if (/^\d*$/.test(value) || /^NON-\d*$/.test(value) || "NON-".startsWith(value)) {
                if (value.length <= 16 || value.startsWith("NON-")) {
                    set_data({
                        ...data,
                        [e.target.name]: value,
                    });
                }
            }
        }
        else {
            const value = e.target.value;
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
    }

    const oc_tambah_simpan = (e) => {
        console.log(data)

        if (data.nik !== "" && data.nik.length !== 16 && !data.nik.startsWith("NON-")) {
            toast.error("NIK harus terdiri dari tepat 16 digit angka", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        if (edit) {
            console.log("edit3")
            axios.post(window.location.origin + '/pasien/edit',
                {
                    id: data.id,
                    nik: data.nik,
                    nama: data.nama,
                    no_telepon: data.no_telepon,
                    alamat_domisili: data.alamat_domisili,
                    kelurahan: data.kelurahan,
                    kecamatan: data.kecamatan,
                    tgl_lahir: data.tgl_lahir,
                    jenis_kelamin: data.jenis_kelamin,
                    status: data.status,
                    tgl_meninggal: data.tgl_meninggal,
                }).then(function (response) {
                    console.log("data3")
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    console.log(response)
                    set_edit(false)
                    set_modal(false)
                    set_null_data()
                    refresh_semua_data()
                })
        }
        else {
            axios.post(window.location.origin + '/pasien/tambah',
                {
                    nik: data.nik,
                    nama: data.nama,
                    no_telepon: data.no_telepon,
                    alamat_domisili: data.alamat_domisili,
                    alamat_kelurahan: data.kelurahan,
                    alamat_kecamatan: data.kecamatan,
                    tgl_lahir: data.tgl_lahir,
                    jenis_kelamin: data.jenis_kelamin,
                    status: data.status,
                    tgl_meninggal: data.tgl_meninggal,
                }).then(function (response) {
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    console.log(response)
                    set_modal(false)
                    set_null_data()
                    refresh_semua_data()
                })
        }
    }

    function x() {
        set_modal(false)
        if (edit) {
            set_edit(false)
        }
        if (modal_hapus) {
            set_modal_hapus(false)
        }

        set_null_data()
    }

    function set_null_data() {
        set_data({
            ...data,
            ['id']: '',
            ['nik']: '',
            ['nama']: '',
            ['tgl_lahir']: '',
            ['jenis_kelamin']: '',
            ['no_telepon']: '',
            ['alamat_domisili']: '',
            ['kecamatan']: '',
            ['kelurahan']: '',
            ['nama_kecamatan']: '',
            ['nama_kelurahan']: '',
            ['status']: '',
            ['tgl_meninggal']: '',
        })
    }

    function refresh_semua_data() {
        axios.post(window.location.origin + '/ref_pasien',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_pasien(response.data)
                set_semua_pasien(response.data)
                set_semua_pasien2(response.data)
                console.log(response)
            })
    }

    console.log(data);

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Manajemen Pasien</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1">Kelola data seluruh pasien dalam sistem</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input type="text"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm"
                        placeholder="Cari pasien..."
                        onChange={cari}
                    />
                </div>
                <button
                    type="button"
                    onClick={(e) => set_modal(true)}
                    className="w-full md:w-auto h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2"
                >
                    + Tambah Pasien
                </button>
            </div>
            {/* Card Wrapper Data table */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 overflow-hidden">
                {/* ... isi Datatable kamu masukkan ke sini ... */}
                <DataTable
                    columns={columns}
                    data={semua_pasien2}
                    pagination
                    onChangePage={set_page}
                    highlightOnHover
                    conditionalRowStyles={conditionalRowStyles}
                    striped
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

            {
                modal &&
                <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] relative border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col">

                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white dark:bg-slate-800 transition-colors duration-300 z-10 px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center rounded-t-2xl shadow-sm">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">
                                    {edit ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-300 mt-1">Lengkapi form identitas sesuai kartu identitas</p>
                            </div>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* --- NIK --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">NIK</label>
                                <input type="text"
                                    name="nik"
                                    value={data.nik}
                                    onChange={oc_data}
                                    placeholder="Masukkan NIK 16 Digit"
                                    maxLength="16"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            {/* --- Nama --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Nama Lengkap</label>
                                <input type="text"
                                    name="nama"
                                    value={data.nama}
                                    onChange={oc_data}
                                    placeholder="Nama Pasien"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            {/* --- No Telepon --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">No. Telepon / WA</label>
                                <input type="tel"
                                    name="no_telepon"
                                    value={data.no_telepon}
                                    onChange={oc_data}
                                    placeholder="Cth: 08123456789"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            {/* --- Tgl Lahir --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Tanggal Lahir</label>
                                <input type="date"
                                    name="tgl_lahir"
                                    value={data.tgl_lahir}
                                    onChange={oc_data}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] transition-colors duration-300"
                                />
                            </div>

                            {/* --- Jenis Kelamin --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Jenis Kelamin</label>
                                <select
                                    name="jenis_kelamin"
                                    value={data.jenis_kelamin}
                                    onChange={oc_data}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                >
                                    <option value="-">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            {/* --- Alamat Domisili --- */}
                            <div className="space-y-1 sm:col-span-2">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Alamat Lengkap</label>
                                <input type="text"
                                    name="alamat_domisili"
                                    value={data.alamat_domisili}
                                    onChange={oc_data}
                                    placeholder="Masukkan Alamat Lengkap"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                />
                            </div>

                            {/* --- Kecamatan --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Kecamatan</label>
                                <select
                                    id="id_select_kecamatan"
                                    name="kecamatan"
                                    onChange={oc_data}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                >
                                    <option value="-">Pilih Kecamatan</option>
                                    {
                                        semua_kecamatan.map((opts, i) => <option key={i} id={opts.kode_kecamatan} value={opts.nama_kecamatan} selected={opts.kode_kecamatan == data.kecamatan}>{opts.nama_kecamatan}</option>)
                                    }
                                </select>
                            </div>

                            {/* --- Kelurahan --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Kelurahan</label>
                                <select
                                    name="kelurahan"
                                    onChange={oc_data}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                >
                                    <option value="-">Pilih Kelurahan</option>
                                    {
                                        semua_kelurahan.map((opts, i) => <option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan} selected={opts.kode_kelurahan == data.kelurahan}>{opts.nama_kelurahan}</option>)
                                    }
                                </select>
                            </div>

                            {/* --- Status --- */}
                            <div className="space-y-1">
                                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Status</label>
                                <select
                                    name="status"
                                    value={data.status}
                                    onChange={oc_data}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white transition-colors duration-300"
                                >
                                    <option value="-">Pilih</option>
                                    <option value="hidup">Hidup</option>
                                    <option value="meninggal">Meninggal</option>
                                </select>
                            </div>

                            {/* --- Tgl Meninggal (kondisional) --- */}
                            {
                                data.status == "meninggal" &&
                                <div className="space-y-1">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 transition-colors duration-300">Tanggal Meninggal</label>
                                    <input type="date"
                                        name="tgl_meninggal"
                                        value={data.tgl_meninggal}
                                        onChange={oc_data}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white dark:bg-slate-800 dark:text-white dark:[color-scheme:dark] transition-colors duration-300"
                                    />
                                </div>
                            }
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 px-6 py-4 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-end gap-3 rounded-b-2xl mt-auto">
                            <button type="button" onClick={(e) => x()} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm">
                                Batal
                            </button>
                            <button type="button"
                                onClick={oc_tambah_simpan}
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm px-6 py-2.5 shadow-sm shadow-red-200 transition-all focus:ring-4 focus:ring-red-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                                </svg>
                                {edit ? 'Simpan Perubahan' : 'Simpan Data'}
                            </button>
                        </div>
                    </div>
                </div>
            }

            {
                modal_hapus &&
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300">Konfirmasi Hapus</h3>
                                <button onClick={(e) => x()} className="text-gray-400 hover:text-gray-600 dark:text-slate-300 transition-colors duration-300 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            <div className="flex items-start gap-4 mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                                <div className="text-red-500 bg-red-100 p-2 rounded-full shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <div className="mt-0.5">
                                    <p className="text-sm font-semibold text-red-800">Apakah Anda yakin menghapus pasien ini?</p>
                                    <p className="text-sm text-red-600 mt-1">Data pasien akan dihapus secara permanen dari sistem.</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-4 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                                <div className="grid grid-cols-3 gap-2"><span className="font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Nama</span> <span className="col-span-2 text-gray-800 dark:text-slate-100 transition-colors duration-300">{data.nama}</span></div>
                                <div className="grid grid-cols-3 gap-2"><span className="font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">NIK</span> <span className="col-span-2">{data.nik}</span></div>
                                <div className="grid grid-cols-3 gap-2"><span className="font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">No. Telp</span> <span className="col-span-2">{data.no_telepon}</span></div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end items-center px-6 py-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                            <button type="button" onClick={(e) => x()} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm">
                                Batal
                            </button>
                            <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm focus:ring-4 focus:ring-red-200 transition-all">
                                Ya, Hapus Data
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}
