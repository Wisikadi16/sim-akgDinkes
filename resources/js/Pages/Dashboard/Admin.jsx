import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";

export default function Admin() {
    const [semua_admin, set_semua_admin] = useState([]);
    const [semua_admin_cari, set_semua_admin_cari] = useState([]);

    const [edit, set_edit] = useState(false);

    useEffect(() => {
        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })
    }, [])

    const oc_hapus = (id) => {
        axios.post(window.location.origin + '/ref_admin',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nama']: response.data.name,
                    ['username']: response.data.username,
                    ['role']: response.data.role,
                })
                // console.log(response)
            })

        set_modal_hapus(true)

        // console.log("hapus"+id);
    }

    const oc_hapus_simpan = (id) => {
        // console.log("hpaus id")
        console.log(id)
        router.post('/hapus_admin', {
            id: id,
        })

        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })

        set_modal_hapus(false)
        toast.error("Akses Admin berhasil dihapus", {
            position: "top-right",
            theme: "light",
        })
    }

    const oc_edit = (id) => {
        // console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin + '/ref_admin',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nama']: response.data.name,
                    ['username']: response.data.username,
                    ['role']: response.data.role,
                })
                console.log(response)
            })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    const columns = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'Nama', selector: (row) => row.name, width: "250px" },
        { name: 'Username', selector: (row) => row.username, width: "250px" },
        { name: 'Role', selector: (row) => row.role, width: "140px" },
        {
            name: 'Action', cell: (row) =>
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

    const cari = (e) => {
        const query = e.target.value.toLowerCase();
        set_semua_admin_cari(semua_admin.filter((item) =>
            item.name.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query) ||
            item.role?.toLowerCase().includes(query)
        ))
    }

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nama: '',
        username: '',
        password: '',
        role: '',
    });

    const oc_data = (e) => {
        // console.log("oc");
        const value = e.target.value;
        set_data({
            ...data,
            [e.target.name]: value,
        })
    }

    const oc_simpan = (e) => {
        // console.log(data)
        if (edit) {
            router.post('/edit_simpan_admin', {
                id: data.id,
                nama: data.nama,
                username: data.username,
                password: data.password,
                role: data.role,
            })
            set_edit(false)
        }
        else {
            router.post('/tambah_simpan_admin', {
                nama: data.nama,
                username: data.username,
                password: data.password,
                role: data.role,
            })
        }

        set_modal(false)
        toast.success("Data berhasil disimpan", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
        });

        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })

        set_null_data()
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
            ['nama']: '',
            ['username']: '',
            ['password']: '',
            ['role']: '',
        })
    }
    console.log(edit);
    console.log(data)

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Admin Ambulan Hebat</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1">Kelola data admin dan hak akses</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input type="text" onChange={cari} placeholder="Cari Admin..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm" />
                </div>
                <button type="button" onClick={(e) => set_modal(true)} className="w-full md:w-auto h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Tambah Admin
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden mt-2">
                    <DataTable columns={columns} data={semua_admin_cari}
                        pagination onChangePage={set_page} highlightOnHover
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

            {modal &&
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden scale-100 animate-scale-up">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg">{edit ? 'Edit' : 'Tambah'} Admin</h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Nama Lengkap <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        </div>
                                        <input type="text" name="nama" value={data.nama} onChange={oc_data} placeholder="Masukkan nama" className="pl-10 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Username <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                                        </div>
                                        <input type="text" name="username" value={data.username} onChange={oc_data} placeholder="Masukkan username" className="pl-10 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Password {edit ? <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span> : <span className="text-red-500">*</span>}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                        <input type="password" name="password" value={data.password} onChange={oc_data} placeholder="Masukkan password" className="pl-10 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Role Sistem <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                        </div>
                                        <select name="role" value={data.role} onChange={oc_data} className="pl-10 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm font-medium text-gray-700 dark:text-slate-200 transition-colors duration-300 cursor-pointer">
                                            <option value="-">Pilih Role Akses</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Bidan">Bidan</option>
                                            <option value="Dokter">Dokter</option>
                                            <option value="Driver">Driver</option>
                                            <option value="Operator">Operator</option>
                                            <option value="Perawat">Perawat</option>
                                            <option value="Tim Ambulan">Tim Ambulan</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 active:scale-95 transition-all">
                                    Batal
                                </button>
                                <button type="button" onClick={oc_simpan} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-200 active:scale-95 transition-all flex justify-center items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Simpan Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

            {/* Modal Hapus */}
            {modal_hapus &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-scale-up border-[1px] border-red-50">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Akun
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda yakin ingin menghapus akses akun ini?</p>
                            <div className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between pb-1 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
                                    <span className="text-gray-500 dark:text-slate-400 transition-colors duration-300 font-semibold">Nama</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300">{data.nama}</span>
                                </div>
                                <div className="flex justify-between pb-1 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300 pt-1">
                                    <span className="text-gray-500 dark:text-slate-400 transition-colors duration-300 font-semibold">Username</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300">{data.username}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500 dark:text-slate-400 transition-colors duration-300 font-semibold">Role</span>
                                    <span className="font-medium px-2 py-0.5 bg-slate-200 dark:bg-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-200 transition-colors duration-300 rounded text-xs uppercase tracking-wider">{data.role}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 transition-all active:scale-95">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-sm shadow-red-200 flex items-center justify-center gap-2 active:scale-95">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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