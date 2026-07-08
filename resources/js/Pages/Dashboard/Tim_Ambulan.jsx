import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { toast } from 'react-toastify';
import L from 'leaflet';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

function MapBoundsUpdate({ markers }) {
    const map = useMap();
    useEffect(() => {
        const validMarkers = markers.filter(m => m.latitude && m.longitude);
        if (validMarkers.length > 0) {
            const bounds = L.latLngBounds(validMarkers.map(m => [parseFloat(m.latitude), parseFloat(m.longitude)]));
            map.fitBounds(bounds, { animate: true, padding: [50, 50], maxZoom: 15 });
        }
    }, [markers]);
    return null;
}

export default function Tim_Ambulan() {
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_ambulan_cari, set_semua_ambulan_cari] = useState([]);

    const [edit, set_edit] = useState(false);
    const [active_tab, set_active_tab] = useState('dasar');


    const [val_cari, set_val_cari] = useState('');

    useEffect(() => {
        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })
    }, [])

    // Gunakan Ref untuk menghindari restart Interval setiap kali mengetik
    const valCariRef = React.useRef(val_cari);
    useEffect(() => { valCariRef.current = val_cari; }, [val_cari]);

    useEffect(() => {
        const invtime = setInterval(() => {
            if (!valCariRef.current) {
                axios.post(window.location.origin + '/ref_tim_ambulan', {})
                    .then(function (response) {
                        set_semua_tim_ambulan(response.data)
                        set_semua_ambulan_cari(response.data)
                    });
            }
        }, 10000);
        return () => clearInterval(invtime);
    }, [])

    const oc_hapus = (id) => {
        // router.post('/hapus_tim_ambulan', {
        //     id:id,
        // })
        console.log(id)
        console.log("ochapus");
        set_modal_hapus(true)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['id_admin']: response.data.user.id,
                    ['gambar']: response.data.gambar,
                    ['nama_tim']: response.data.nama_tim,
                    ['latitude']: response.data.latitude,
                    ['longitude']: response.data.longitude,
                    ['username_admin']: response.data.user.username,
                    ['status']: response.data.status,
                })
                console.log(response)
            })


        // axios.post(window.location.origin+'/ref_tim_ambulan',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     set_semua_ambulan_cari(response.data)
        //     console.log(response)
        // })
    }

    const oc_hapus_simpan = (id) => {
        console.log("id")
        console.log(id)
        router.post('/hapus_tim_ambulan', {
            id: id,
        })
        set_modal_hapus(false)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })

        set_null_data()
    }

    const oc_edit = (id) => {
        // console.log("edit"+id)
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['id_admin']: response.data.user ? response.data.user.id : '',
                    ['gambar']: response.data.gambar,
                    ['nama_tim']: response.data.nama_tim,
                    ['homebase']: response.data.homebase,
                    ['longitude']: response.data.longitude,
                    ['latitude']: response.data.latitude,
                    ['username_admin']: response.data.user ? response.data.user.username : '',
                    ['status']: response.data.status,
                    ['idk_navara']: response.data.idk_navara,
                    ['id_assets_navara']: response.data.id_assets_navara,
                    ['jenis_bb']: response.data.jenis_bb,
                    ['masa_berlaku_stnk']: response.data.masa_berlaku_stnk,
                    ['merk']: response.data.merk,
                    ['no_mesin']: response.data.no_mesin,
                    ['no_polisi']: response.data.no_polisi,
                    ['no_rangka']: response.data.no_rangka,
                    ['no_stnk']: response.data.no_stnk,
                    ['tahun_perolehan']: response.data.tahun_perolehan,
                    ['tipe']: response.data.tipe,
                })
                // console.log("editt"+id)
                // console.log(response)
            })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    const renderStatusBadge = (status) => {
        if (!status) return <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 text-gray-600 dark:text-slate-300 transition-colors duration-300">-</span>;

        const statusLower = status.toLowerCase();
        let bg = 'bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300';
        let text = 'text-gray-600 dark:text-slate-300 transition-colors duration-300';

        if (statusLower.includes('bersiap')) { bg = 'bg-blue-100'; text = 'text-blue-700'; }
        else if (statusLower.includes('non aktif') || statusLower.includes('batal')) { bg = 'bg-red-100'; text = 'text-red-700'; }
        else if (statusLower.includes('berjalan') || statusLower.includes('sedang')) { bg = 'bg-green-100'; text = 'text-green-700'; }
        else if (statusLower.includes('selesai')) { bg = 'bg-emerald-100'; text = 'text-emerald-700'; }
        else if (statusLower.includes('rujuk')) { bg = 'bg-purple-100'; text = 'text-purple-700'; }
        else if (statusLower.includes('diterima')) { bg = 'bg-yellow-100'; text = 'text-yellow-700'; }

        return <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${bg} ${text}`}>{status}</span>;
    }

    const columns = [
        { name: 'NO', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        {
            name: 'FOTO', selector: (row) =>
                row.gambar ? <img src={"/gambar/tim_ambulan/" + row.gambar} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300" /> : <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 flex items-center justify-center text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            , width: "90px"
        },
        { name: 'NAMA TIM', selector: (row) => <div className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300">{row.nama_tim}</div>, width: "200px" },
        { name: 'HOMEBASE', selector: (row) => <div className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm">{row.homebase}</div>, width: "180px" },
        { name: 'NO POLISI', selector: (row) => <div className="font-mono bg-gray-50 dark:bg-slate-900 transition-colors duration-300 px-2 py-1 rounded text-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-700 dark:text-slate-200 transition-colors duration-300 inline-block">{row.no_polisi || '-'}</div>, width: "160px" },
        { name: 'STATUS', selector: (row) => renderStatusBadge(row.status), width: "160px" },
        {
            name: 'AKSI', cell: (row) =>
                <div className="flex gap-2">
                    <button type="button" title="Edit Data" onClick={() => oc_edit(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-xl w-8 h-8 transition-all shadow-sm active:scale-90">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button type="button" title="Hapus Data" onClick={() => oc_hapus(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl w-8 h-8 transition-all shadow-sm active:scale-90">
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
        set_val_cari(e.target.value);

        set_semua_ambulan_cari(semua_tim_ambulan.filter((item) =>
            item.nama_tim?.toLowerCase().includes(query) ||
            item.username_admin?.toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query)
        ))
    }

    const [modal, set_modal] = useState(false);

    const [data, set_data] = useState({
        id: '',
        id_admin: '',
        username_admin: '',
        gambar: '',
        gambar_baru: '',
        nama_tim: '',
        longitude: '',
        latitude: '',
        status: '',
        idk_navara: '',
        id_assets_navara: '',
        jenis_bb: '',
        masa_berlaku_stnk: '',
        merk: '',
        no_mesin: '',
        no_polisi: '',
        no_rangka: '',
        tahun_perolehan: '',
        tipe: '',
        homebase: '',
    });

    const oc_data = (e) => {
        // console.log("oc");
        if (e.target.name == "gambar" || e.target.name == "gambar_baru") {
            const value = e.target.files[0];
            // console.log(value);
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
        else {
            const value = e.target.value;
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
    }

    const oc_simpan = (e) => {
        console.log(data)
        if (edit) {
            axios.post(window.location.origin + '/tim_ambulan/edit',
                {
                    id: data.id,
                    gambar: data.gambar,
                    gambar_baru: data.gambar_baru,
                    id_admin: data.id_admin,
                    nama_tim: data.nama_tim,
                    homebase: data.homebase,
                    longitude: data.longitude,
                    latitude: data.latitude,
                    status: data.status,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(function (response) {
                    // console.log("update")
                    // console.log(response)
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                })

            set_edit(false)
        }
        else {
            // console.log("tambah")
            router.post('/tambah_simpan_tim_ambulan', {
                gambar: data.gambar,
                id_admin: data.id_admin,
                nama_tim: data.nama_tim,
                longitude: data.longitude,
                latitude: data.latitude,
                status: data.status,
            })

            toast.success("Berhasil tambah data", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }


        set_modal(false)
        // alert("berhasil disimpan")


        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })

        set_null_data()
    }

    const oc_cari_username_admin = () => {
        // console.log(data.username_admin)
        axios.post(window.location.origin + '/ref_username_admin',
            {
                username: data.username_admin,
            }).then(function (response) {
                if (response.data == "") {
                    set_data({
                        ...data,
                        ['id_admin']: '',
                        ['username_admin']: '',
                    })
                    toast.error("username tidak ditemukan harap buat akun admin dengan role tim ambulan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // alert("username tidak ditemukan harap buat akun admin dengan role tim ambulan")
                }
                else {
                    set_data({
                        ...data,
                        ['id_admin']: response.data.id,
                    })
                    toast.success("username berhasil ditemukan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // alert("username berhasil ditemukan")
                }
                console.log(response)
            })
    }

    const [modal_hapus, set_modal_hapus] = useState(false);

    function set_icon(url) {
        return new L.Icon({
            iconUrl: url,
            iconSize: [35, 37],
        });
    }

    const warna_tim_ambulan = [
        { text2: 'belum diterima', warna: '#ff9292' },
        { text2: 'sudah diterima', warna: '#FDE68A' },
        { text2: 'sampai lokasi', warna: '#c76dfc' },
        { text2: 'batal', warna: '#F43F5E' },
        { text2: 'selesai', warna: '#80fa7c' },
        { text2: 'rujuk', warna: '#37ffde' },
        { text2: 'sampai rujuk', warna: '#00B3FF' },
        { text2: 'selesai penanganan', warna: '#eefa49' },
    ];

    const warna_status = (status) => {
        console.log(status)
        const matchingStatus = warna_tim_ambulan.find(item => item.text2 == status);
        console.log(matchingStatus)
        return matchingStatus ? matchingStatus.warna : '#FFFFFF'; // Default to white if no match
    };

    const createCustomIcon = (imageUrl, warna) =>
        new L.divIcon({
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            html: `<div style="position: relative; width: 100%; height: 100%;">
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; overflow: hidden;">
                            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
                        </div>
                    </div>
                    <div class="w-[15px] h-[15px]">
                        <div class="w-[15px] h-[15px] rounded-full bg-[${warna}]"></div>
                    </div>`,
        });

    function x() {
        set_modal(false)
        if (edit) {
            set_edit(false)
        }
        set_active_tab('dasar')
        if (modal_hapus) {
            set_modal_hapus(false)
        }

        set_null_data()
    }

    function set_null_data() {
        set_data({
            ...data,
            ['id']: '',
            ['id_admin']: '',
            ['gambar']: '',
            ['gambar_baru']: '',
            ['nama_tim']: '',
            ['homebase']: '',
            ['latitude']: '',
            ['longitude']: '',
            ['username_admin']: '',
            ['status']: '',
            ['idk_navara']: '',
            ['id_assets_navara']: '',
            ['jenis_bb']: '',
            ['masa_berlaku_stnk']: '',
            ['merk']: '',
            ['no_mesin']: '',
            ['no_polisi']: '',
            ['no_rangka']: '',
            ['tahun_perolehan']: '',
            ['tipe']: '',
        })
    }

    // console.log(edit);
    // console.log(data)

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Tim Ambulan Hebat</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1">Pantau lokasi tim dan kelola armada</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 overflow-hidden isolate">
                <MapContainer
                    center={[-6.9806919, 110.3962768]}///simpang lima
                    zoom="11"
                    style={{ width: "100%", height: "300px", zIndex: 0, borderRadius: "12px" }}
                >
                    <MapBoundsUpdate markers={semua_tim_ambulan} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {semua_tim_ambulan.map((value, idx) => {
                        if (value.latitude !== null && value.longitude !== null) {
                            return (
                                <Marker key={idx}
                                    position={[value.latitude, value.longitude]}
                                    icon={createCustomIcon(value.gambar ? "gambar/tim_ambulan/" + value.gambar : "assets/img/marker-map.png", value.order ? warna_status(value.order.status) : warna_status("batal"))}>
                                    <Popup>
                                        <div className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300">{value.nama_tim}</div>
                                        <div className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-300 capitalize">{value.order ? value.order.status : 'Standby / Batal'}</div>
                                    </Popup>
                                </Marker>
                            );
                        } else {
                            return null;
                        }
                    })}
                </MapContainer>
            </div>
            {/* Action & Filter Card 
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input type="text" onChange={cari} placeholder="Cari tim ambulan..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm" />
                </div>

                <button type="button" onClick={(e) => set_modal(true)} className="h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                    + Tambah Tim
                </button>
            </div> */}

            {/* DataTable */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden mt-2">
                    <DataTable columns={columns} data={semua_ambulan_cari}
                        pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} striped
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

            {/* Modal Tambah/Edit */}
            {modal &&
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden scale-100 animate-scale-up max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg">{edit ? 'Edit' : 'Tambah'} Tim Ambulan</h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex border-b border-gray-200 dark:border-slate-700 transition-colors duration-300 px-6 pt-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0 gap-6">
                            <button type="button" onClick={() => set_active_tab('dasar')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${active_tab === 'dasar' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 dark:text-slate-400 transition-colors duration-300 hover:text-gray-700 dark:text-slate-200 transition-colors duration-300 hover:border-gray-300 dark:border-slate-600 transition-colors duration-300'}`}>Informasi Dasar</button>
                            <button type="button" onClick={() => set_active_tab('aset')} className={`pb-3 text-sm font-bold transition-all border-b-2 ${active_tab === 'aset' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 dark:text-slate-400 transition-colors duration-300 hover:text-gray-700 dark:text-slate-200 transition-colors duration-300 hover:border-gray-300 dark:border-slate-600 transition-colors duration-300'}`}>Spesifikasi Kendaraan</button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar min-h-[300px]">
                            {active_tab === 'dasar' ? (
                                <div className="flex flex-col gap-5 max-w-lg mx-auto w-full">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Foto Tim</label>
                                        <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-slate-600 transition-colors duration-300 border-dashed rounded-2xl bg-gray-50 dark:bg-slate-900 transition-colors duration-300 hover:bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 transition-colors cursor-pointer group overflow-hidden">
                                            {edit && data.gambar && !data.gambar_baru ? (
                                                <>
                                                    <img src={"/gambar/tim_ambulan/" + data.gambar} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
                                                    <div className="z-10 flex flex-col items-center">
                                                        <img src={"/gambar/tim_ambulan/" + data.gambar} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white mb-2" />
                                                        <p className="text-xs font-medium text-gray-600 dark:text-slate-300 transition-colors duration-300">Klik untuk mengganti foto</p>
                                                    </div>
                                                </>
                                            ) : data.gambar || data.gambar_baru ? (
                                                <div className="z-10 flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                    <p className="text-xs font-medium text-green-600">Foto dipilih</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                                    <p className="mb-1 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 font-semibold"><span className="text-red-600">Klik untuk unggah</span> atau drag and drop</p>
                                                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
                                                </div>
                                            )}
                                            <input type="file" name={edit ? 'gambar_baru' : 'gambar'} onChange={oc_data} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Username Admin</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="username_admin" placeholder="Ketik username lalu cari..." className="flex-1 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={edit ? data.username_admin : ''} onChange={oc_data} />
                                            <button className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm active:scale-95 flex items-center justify-center" type="button" onClick={oc_cari_username_admin}>Cari Akun</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Nama Tim</label>
                                        <input type="text" name="nama_tim" placeholder="Masukkan nama tim..." className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.nama_tim} onChange={oc_data} />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Homebase</label>
                                        <input type="text" name="homebase" placeholder="Lokasi homebase (mis: RSUD Dr. Moewardi)" className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.homebase} onChange={oc_data} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Latitude</label>
                                            <input type="text" name="latitude" placeholder="-6.0000" className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm font-mono" value={data.latitude} onChange={oc_data} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Longitude</label>
                                            <input type="text" name="longitude" placeholder="110.0000" className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm font-mono" value={data.longitude} onChange={oc_data} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Status Tim</label>
                                        <select name="status" className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm cursor-pointer" value={data.status} onChange={oc_data}>
                                            <option value="-">Pilih Status</option>
                                            <option value="bersiap">Bersiap</option>
                                            <option value="non aktif">Non Aktif</option>
                                            <option value="sedang berjalan">Sedang Berjalan</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5 max-w-lg mx-auto w-full">
                                    <div className="bg-blue-50 border border-blue-100 text-blue-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p>Data spesifikasi aset ini terhubung dengan Navara dan saat ini bersifat <strong>Read-Only</strong> (hanya baca).</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">ID Assets Navara</label>
                                        <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner font-mono" readOnly value={data.id_assets_navara || '-'} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Merk</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner" readOnly value={data.merk || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Tipe</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner" readOnly value={data.tipe || '-'} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">No Polisi</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner font-mono font-bold" readOnly value={data.no_polisi || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Jenis Bensin</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner" readOnly value={data.jenis_bb || '-'} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">No STNK</label>
                                        <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner font-mono" readOnly value={data.no_stnk || '-'} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">No Mesin</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner font-mono" readOnly value={data.no_mesin || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">No Rangka</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner font-mono" readOnly value={data.no_rangka || '-'} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Masa Berlaku STNK</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner" readOnly value={data.masa_berlaku_stnk || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wide">Tahun Perolehan</label>
                                            <input type="text" className="bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 cursor-not-allowed shadow-inner" readOnly value={data.tahun_perolehan || '-'} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex gap-3 justify-end bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <button type="button" onClick={() => x()} className="px-5 py-2 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 active:scale-95 transition-all">
                                Batal
                            </button>
                            <button type="button" onClick={oc_simpan} className="px-8 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-200 active:scale-95 transition-all flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {edit ? 'Simpan Perubahan' : 'Tambah Tim'}
                            </button>
                        </div>
                    </div>
                </div>}

            {modal_hapus &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border-[1px] border-red-50">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                Hapus Tim Ambulan
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda yakin ingin menghapus tim ini?</p>
                            <div className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner text-center font-bold">
                                {data.nama_tim}
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
