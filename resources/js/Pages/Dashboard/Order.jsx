import React, { Component, useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { toast } from 'react-toastify';

import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet'

// Komponen mini untuk mendeteksi perubahan koordinat dan menggeser pusat kamera peta
function MapCenterUpdate({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.flyTo(center, map.getZoom(), { animate: true });
        }
    }, [center[0], center[1]]);
    return null;
}

// Komponen mini untuk menangkap klik pada peta
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function Order({ auth }) {
    // export default function Order() {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [tanggalDari, setTanggalDari] = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');
    const [tanggalDariInput, setTanggalDariInput] = useState('');
    const [tanggalSampaiInput, setTanggalSampaiInput] = useState('');

    // const [semua_rs, set_semua_rs] = useState([]);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const semua_nama_hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const index_hari = currentDate.getDay();
    const nama_hari_ini = semua_nama_hari[index_hari];

    var nama_bulan;
    if (month == "01") {
        nama_bulan = "Januari";
    }
    else if (month == "02") {
        nama_bulan = "Februari";
    }
    else if (month == "03") {
        nama_bulan = "Maret";
    }
    else if (month == "04") {
        nama_bulan = "April";
    }
    else if (month == "05") {
        nama_bulan = "Mei";
    }
    else if (month == "06") {
        nama_bulan = "Juni";
    }
    else if (month == "07") {
        nama_bulan = "Juli";
    }
    else if (month == "08") {
        nama_bulan = "Agustus";
    }
    else if (month == "09") {
        nama_bulan = "September";
    }
    else if (month == "10") {
        nama_bulan = "Oktober";
    }
    else if (month == "11") {
        nama_bulan = "November";
    }
    else if (month == "12") {
        nama_bulan = "Desember";
    }

    const [edit, set_edit] = useState(false);

    const [koorku, set_koorku] = useState({
        lat: '',
        lng: '',
    });

    const [c_cari, set_c_cari] = useState(false);
    const [val_cari, set_val_cari] = useState('');

    // console.log("lokasi")
    // console.log(window.location.origin)


    // useEffect(()=>{
    //     const invtime = setInterval(() => {
    //         if(!val_cari){
    //             // axios.post(window.location.origin+'/ref_order',
    //             // {
    //             //     tanggal_dari:tanggalDari,
    //             //     tanggal_sampai:tanggalSampai
    //             // }).then(function (response){
    //             //     set_semua_order(response.data)
    //             //     set_semua_order_cari(response.data)
    //             // })
    //             console.log("timing")
    //             refresh_all_data()

    //             // axios.post(window.location.origin+'/ref_tim_ambulan_order',
    //             // {
    //             // }).then(function (response){
    //             //     set_semua_tim_ambulan(response.data)
    //             //     // console.log(response)
    //             // })

    //         }

    //     }, 10000)

    //     return () => {
    //         clearInterval(invtime);
    //     };

    // // },[])
    // },[val_cari])

    // Gunakan Ref untuk menghindari restart Interval berkali-kali saat mengetik
    const valCariRef = React.useRef(val_cari);
    useEffect(() => { valCariRef.current = val_cari; }, [val_cari]);

    useEffect(() => {
        const invtime = setInterval(() => {
            if (!valCariRef.current && tanggalDari && tanggalSampai) {
                refresh_all_data();
                if (auth.role === "Tim Ambulan" && "geolocation" in navigator) {
                    kirim_lokasi();
                }
            }
        }, 10000);
        return () => clearInterval(invtime);
    }, [tanggalDari, tanggalSampai]);


    useEffect(() => {
        if (tanggalDari && tanggalSampai) {
            refresh_all_data();
        }
    }, [tanggalDari, tanggalSampai]);


    useEffect(() => {
        setTanggalDari(`${year}-${month}-${day}`)
        setTanggalSampai(`${year}-${month}-${day}`)
        setTanggalDariInput(`${year}-${month}-${day}`)
        setTanggalSampaiInput(`${year}-${month}-${day}`)

        // refresh_all_data()

        axios.post(window.location.origin + '/ref_kecamatan',
            {
                // kode_kecamatan:kode_kecamatan,
            }).then(function (response) {
                set_semua_kecamatan(response.data)
                // console.log(response)
            })

        // Hapus pemanggilan kelurahan awal agar tidak meload semua kelurahan di awal
        // axios.post(window.location.origin + '/ref_kelurahan', { kode_kecamatan: '' }).then(...)

        // axios.post(window.location.origin+'/ref_tim_ambulan_order',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     console.log(response)
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     // set_semua_ambulan_cari(response.data)
        //     // console.log(response)
        // })

        // if(auth.role=="Operator"){
        //     axios.post(window.location.origin+'/ref_faskes',
        //     {
        //         jenis:"rumah sakit",
        //     }).then(function (response){
        //         // console.log("rumah sakit")
        //         set_semua_rs(response.data)
        //         // console.log(response)
        //     })
        // }
        if (auth.role == "Tim Ambulan") {
            // console.log("tim ambulan posisi")
            if ("geolocation" in navigator) {
                // console.log("geolocation")
                // console.log(koorku)
                // navigator.geolocation.getCurrentPosition(position=>{
                //     const {latitude, longitude} = position.coords;

                //     set_koorku({
                //         ...koorku,
                //         ["lat"]: latitude,
                //         ["lng"]: longitude,
                //     })

                kirim_lokasi()

                //         console.log("tim ambulan role")
                //         console.log("lat"+latitude+" long"+longitude)
                //         ,(error) => console.warn(error.message),
                //     { enableHighAccuracy: true}
                // // enableHighAccuracy=true
                //     })
            }
        }
    }, [])

    const refresh_all_data = () => {
        // function refresh_all_data(){
        // axios.post(window.location.origin+'/ref_order',
        //     {

        //     }).then(function (response){
        //         set_semua_order(response.data)
        //         set_semua_order_cari(response.data)
        //     })
        console.log("refresh")
        // console.log(tanggalDari)
        axios.post(window.location.origin + '/ref_order',
            {
                tanggal_dari: tanggalDari,
                tanggal_sampai: tanggalSampai
            }).then(function (response) {
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
            })

        axios.post(window.location.origin + '/ref_tim_ambulan_order',
            {
            }).then(function (response) {
                set_semua_tim_ambulan(response.data)
            })
    }

    const oc_hapus = (id) => {
        get_id_ref_order(id)

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) => {
        // console.log("hpaus id")
        // console.log(id)
        router.post('/hapus_order', {
            id: id,
        })

        set_modal_hapus(false)

        axios.post(window.location.origin + '/ref_order',
            {
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
                // console.log(response)
            })

        get_id_ref_order(id)

        // set_data({
        //     ...data,
        //     ['id']:id,
        //     ['cara_order']: response.data.cara_order,
        //     ['no_penelepon']: response.data.no_penelepon,
        //     ['nama_penelepon']:response.data.nama_penelepon,
        //     ['nama_pasien']:response.data.nama_pasien,
        //     ['kasus']: response.data.kasus,
        //     ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
        //     ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
        //     ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
        //     ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
        //     ['alamat']:response.data.alamat,
        //     ['latitude']:response.data.latitude,
        //     ['longitude']:response.data.longitude,
        //     ['tim_ambulan']:response.data.tim_ambulan.nama_tim,
        //     ['waktu_order']:response.data.waktu_order,
        // })
    }

    const oc_edit = (id) => {
        // console.log("edit")
        set_edit(true);

        set_modal(true)
        // console.log("waktu"+data.waktu_order)

        get_id_ref_order(id)
    }

    const [page, set_page] = useState([0]);

    const [terima, set_terima] = useState(false);

    const oc_terima = (id) => {
        set_terima(true);

        // console.log("waktu"+data.waktu_order)
        get_id_ref_order(id)

        // axios.post(window.location.origin+'/ref_order',
        // {
        //     id:id,
        // }).then(function (response){
        //     set_data({
        //         ...data,
        //         ['id']:id,
        //         ['cara_order']: response.data.cara_order,
        //         ['no_penelepon']: response.data.no_penelepon,
        //         ['nama_penelepon']:response.data.nama_penelepon,
        //         ['kasus']: response.data.kasus,
        //         ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
        //         ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
        //         ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
        //         ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
        //         ['alamat']:response.data.alamat,
        //         ['latitude']:response.data.latitude,
        //         ['longitude']:response.data.longitude,
        //         ['tim_ambulan']:response.data.tim_ambulan.nama_tim,
        //         ['waktu_order']:response.data.waktu_order,
        //     })


        //     console.log("terima")
        //     console.log(response)
        // })

    }

    const oc_terima_simpan = (id) => {
        axios.post(window.location.origin + '/order/terima',
            {
                id: id,
            }).then(function (response) {
                console.log(response)
                set_null_data()

                set_terima(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });

            })

    }

    const [selesai, set_selesai] = useState(false);

    const oc_selesai = (id) => {
        set_selesai(true);
        get_id_ref_order(id)
    }

    const oc_selesai_simpan = (id) => {
        axios.post(window.location.origin + '/order/selesai',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_selesai(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
    }

    const [batal, set_batal] = useState(false);

    const oc_batal = (id) => {
        set_batal(true);
        get_id_ref_order(id)
    }

    const oc_batal_simpan = (id) => {
        axios.post(window.location.origin + '/order/batal',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_batal(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [catatan, set_catatan] = useState(false);

    const oc_catatan = (id) => {
        set_catatan(true);
        get_id_ref_order(id)
    }

    const oc_catatan_simpan = (id) => {
        axios.post(window.location.origin + '/order/catatan',
            {
                id: id,
                catatan: data.catatan,
            }).then(function (response) {
                set_null_data()

                set_catatan(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [ajukan_rujuk, set_ajukan_rujuk] = useState(false);

    const oc_ajukan_rujuk = (id) => {
        set_ajukan_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_ajukan_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/ajukan_rujuk',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_ajukan_rujuk(false)

                refresh_all_data()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [rujuk, set_rujuk] = useState(false);

    const oc_rujuk = (id) => {
        set_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/rujuk',
            {
                id: id,
                // faskes_rujukan:data.faskes_rujukan,
            }).then(function (response) {
                set_null_data()

                set_rujuk(false)

                refresh_all_data()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [sampai_rujuk, set_sampai_rujuk] = useState(false);

    const oc_sampai_rujuk = (id) => {
        set_sampai_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_sampai_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/sampai_rujuk',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_sampai_rujuk(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [bersiap_kembali, set_bersiap_kembali] = useState(false);

    const oc_bersiap_kembali = (id) => {
        set_bersiap_kembali(true);
        get_id_ref_order(id)
    }

    const oc_bersiap_kembali_simpan = (id) => {
        axios.post(window.location.origin + '/order/bersiap_kembali',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_bersiap_kembali(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [sampai_lokasi, set_sampai_lokasi] = useState(false);

    const oc_sampai_lokasi = (id) => {
        set_sampai_lokasi(true);
        get_id_ref_order(id)
    }

    const oc_sampai_lokasi_simpan = (id) => {
        axios.post(window.location.origin + '/order/sampai_lokasi',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_sampai_lokasi(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    // --- 1. FUNGSI DESAIN STATUS BADGE (Dipisah agar rapi) ---
    const renderStatusBadge = (status) => {
        const statusConfig = {
            'belum diterima': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
            'sudah diterima': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
            'sampai lokasi': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
            'selesai penanganan': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', dot: 'bg-lime-500' },
            'ajukan rujuk': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
            'rujuk': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
            'sampai rujuk': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
            'selesai': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
            'batal': { bg: 'bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300', text: 'text-slate-600 dark:text-slate-300 transition-colors duration-300', border: 'border-slate-200 dark:border-slate-700 transition-colors duration-300', dot: 'bg-slate-400' },
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig['batal'];

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} text-[10px] font-bold uppercase tracking-wider shadow-sm min-w-max`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status?.toLowerCase() === 'belum diterima' ? 'animate-pulse' : ''}`}></span>
                {status}
            </div>
        );
    };

    // --- 2. STRUKTUR KOLOM TABEL UTAMA ---
    const columns =
        auth.role == "admin" || auth.role == "Operator" ? [
            { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
            { name: 'Status', cell: (row) => renderStatusBadge(row.status), width: "160px" },
            { name: 'Tim Ambulan', cell: (row) => <div title={row.tim_ambulan?.nama_tim}>{row.tim_ambulan?.nama_tim}</div>, width: "130px" },
            { name: 'Nama Pasien', cell: (row) => <div title={row.nama_pasien}>{row.nama_pasien}</div>, width: "170px" },
            { name: 'Alamat', cell: (row) => <div title={row.alamat}>{row.alamat}</div>, width: "190px" },
            { name: 'Kelurahan', cell: (row) => <div title={row.ref_kelurahan?.nama_kelurahan}>{row.ref_kelurahan?.nama_kelurahan}</div>, width: "110px" },
            { name: 'Kecamatan', cell: (row) => <div title={row.ref_kecamatan?.nama_kecamatan}>{row.ref_kecamatan?.nama_kecamatan}</div>, width: "110px" },
            { name: 'Nama Penelepon', cell: (row) => <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width: "130px" },
            { name: 'No Penelepon', selector: (row) => row.no_penelepon, width: "135px" },
            { name: 'Kasus', cell: (row) => <div title={row.kasus}>{row.kasus}</div>, width: "250px" },
            ...(auth.role == "Operator" ? [] : [{ name: 'Petugas', selector: (row) => row.user?.name, width: "140px" }]),
            { name: 'Cara Order', selector: (row) => row.cara_order, width: "100px" },
            { name: 'Waktu Order', cell: (row) => <div title={row.waktu_order}>{row.waktu_order}</div>, width: "170px" },
            { name: 'Waktu Terima', cell: (row) => <div title={row.waktu_terima}>{row.waktu_terima}</div>, width: "170px" },
            { name: 'Waktu Rujuk', cell: (row) => <div title={row.waktu_rujuk}>{row.waktu_rujuk}</div>, width: "170px" },
            { name: 'Waktu Sampai Lokasi', cell: (row) => <div title={row.waktu_sampai_lokasi}>{row.waktu_sampai_lokasi}</div>, width: "170px" },
            { name: 'Waktu Sampai Rujuk', cell: (row) => <div title={row.waktu_sampai_rujuk}>{row.waktu_sampai_rujuk}</div>, width: "170px" },
            { name: 'Waktu Selesai', cell: (row) => <div title={row.waktu_selesai}>{row.waktu_selesai}</div>, width: "170px" },
            { name: 'Waktu Bersiap Kembali', cell: (row) => <div title={row.waktu_bersiap_kembali}>{row.waktu_bersiap_kembali}</div>, width: "170px" },
            { name: 'Catatan', cell: (row) => <div title={row.catatan}>{row.catatan}</div> },
            {
                name: 'Aksi', cell: (row) =>
                    <div className="flex gap-1.5 items-center flex-wrap py-2">
                        {row.status == "ajukan rujuk" &&
                            <button type="button" onClick={() => oc_rujuk(row.id)} className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold py-1.5 px-3 rounded-full text-xs transition-all shadow-sm active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                                Rujuk
                            </button>
                        }
                        <button type="button" title="Edit Data" onClick={() => oc_edit(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                        </button>
                        <button type="button" title="Hapus Data" onClick={() => oc_hapus(row.id)} className="flex items-center justify-center text-slate-400 bg-white dark:bg-slate-800 transition-colors duration-300 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl w-9 h-9 transition-all shadow-sm active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                    </div>
                , width: "160px"
            },
        ] :
            auth.role == "Tim Ambulan" ? [
                { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
                { name: 'Status', cell: (row) => renderStatusBadge(row.status), width: "160px" },
                { name: 'Cara Order', selector: (row) => row.cara_order, width: "130px" },
                { name: 'Petugas', cell: (row) => <div title={row.user?.name}>{row.user?.name}</div>, width: "100px" },
                { name: 'Nama Pasien', cell: (row) => <div title={row.nama_pasien}>{row.nama_pasien}</div>, width: "170px" },
                { name: 'Alamat', cell: (row) => <div title={row.alamat}>{row.alamat}</div>, width: "190px" },
                { name: 'Kelurahan', cell: (row) => <div title={row.ref_kelurahan?.nama_kelurahan}>{row.ref_kelurahan?.nama_kelurahan}</div>, width: "110px" },
                { name: 'Kecamatan', cell: (row) => <div title={row.ref_kecamatan?.nama_kecamatan}>{row.ref_kecamatan?.nama_kecamatan}</div>, width: "110px" },
                { name: 'Nama Penelepon', cell: (row) => <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width: "130px" },
                { name: 'No Penelepon', selector: (row) => row.no_penelepon, width: "130px" },
                { name: 'Kasus', cell: (row) => <div title={row.kasus}>{row.kasus}</div>, width: "250px" },
                { name: 'Waktu Order', selector: (row) => row.waktu_order, width: "170px" },
                { name: 'Waktu Terima', selector: (row) => row.waktu_terima, width: "170px" },
                { name: 'Waktu Sampai Lokasi', selector: (row) => row.waktu_sampai_lokasi, width: "170px" },
                { name: 'Waktu Rujuk', selector: (row) => row.waktu_rujuk, width: "170px" },
                { name: 'Waktu Sampai Rujuk', selector: (row) => row.waktu_sampai_rujuk, width: "170px" },
                { name: 'Waktu Selesai', selector: (row) => row.waktu_selesai, width: "170px" },
                { name: 'Waktu Bersiap Kembali', selector: (row) => row.waktu_bersiap_kembali, width: "170px" },
                { name: 'Catatan', selector: (row) => row.catatan, width: "140px" },
                {
                    name: 'Aksi', cell: (row) =>
                        <div className="flex gap-2 flex-wrap py-2">
                            {row.status == "belum diterima" &&
                                <button type="button" onClick={() => oc_terima(row.id)} className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                                    Terima
                                </button>
                            }
                            {row.status == "sudah diterima" &&
                                <button type="button" onClick={() => oc_sampai_lokasi(row.id)} className="bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>
                                    Sampai Lokasi
                                </button>
                            }
                            {row.status == "sampai lokasi" &&
                                <>
                                    <button type="button" onClick={() => oc_selesai(row.id)} className="bg-lime-100 hover:bg-lime-200 text-lime-800 border border-lime-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                        Selesai
                                    </button>
                                    <button type="button" onClick={() => oc_rujuk(row.id)} className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 border border-cyan-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" /></svg>
                                        Rujuk
                                    </button>
                                </>
                            }
                            {row.status == "rujuk" &&
                                <button type="button" onClick={() => oc_sampai_rujuk(row.id)} className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M4 4a.75.75 0 00-1.5 0v2.121a.75.75 0 001.28.53l5.59-5.59a.75.75 0 011.06 0l4.745 4.744a.75.75 0 010 1.061l-5.06 5.061a.75.75 0 01-1.06 0L4 7.56V16a.75.75 0 001.5 0V9.821a.75.75 0 00-.22-.53l-2.03-2.03 5.03-5.03L12.56 6.56l4.47-4.47L12 8l-5.53-5.53A2.25 2.25 0 014 4.062V4z" fillRule="evenodd" clipRule="evenodd" /></svg>
                                    Sampai Rujuk
                                </button>
                            }
                            {row.status == "sampai rujuk" &&
                                <button type="button" onClick={() => oc_selesai(row.id)} className="bg-lime-100 hover:bg-lime-200 text-lime-800 border border-lime-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    Selesai
                                </button>
                            }
                            {row.status == "selesai penanganan" &&
                                <button type="button" onClick={() => oc_bersiap_kembali(row.id)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 011.06 1.06 6.5 6.5 0 107.072 0 .75.75 0 111.06-1.06 8 8 0 11-9.192 0z" clipRule="evenodd" /></svg>
                                    Bersiap Kembali
                                </button>
                            }
                            {row.status == "selesai" &&
                                <button type="button" onClick={() => oc_catatan(row.id)} className="bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300 hover:bg-slate-200 dark:bg-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-200 transition-colors duration-300 border border-slate-300 dark:border-slate-600 transition-colors duration-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M15 11a.75.75 0 01-.75.75h-8.5a.75.75 0 010-1.5h8.5A.75.75 0 0115 11zm0-4a.75.75 0 01-.75.75h-8.5a.75.75 0 010-1.5h8.5A.75.75 0 0115 7zm-8.5 7.5h4a.75.75 0 010 1.5h-4a.75.75 0 010-1.5z" clipRule="evenodd" /></svg>
                                    Catatan
                                </button>
                            }
                            {row.status == "batal" &&
                                <>
                                    <button type="button" onClick={() => oc_catatan(row.id)} className="bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300 hover:bg-slate-200 dark:bg-slate-700 transition-colors duration-300 text-slate-700 dark:text-slate-200 transition-colors duration-300 border border-slate-300 dark:border-slate-600 transition-colors duration-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M15 11a.75.75 0 01-.75.75h-8.5a.75.75 0 010-1.5h8.5A.75.75 0 0115 11zm0-4a.75.75 0 01-.75.75h-8.5a.75.75 0 010-1.5h8.5A.75.75 0 0115 7zm-8.5 7.5h4a.75.75 0 010 1.5h-4a.75.75 0 010-1.5z" clipRule="evenodd" /></svg>
                                        Catatan
                                    </button>
                                    <button type="button" onClick={() => oc_bersiap_kembali(row.id)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5 mt-1 sm:mt-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2zM5.404 4.343a.75.75 0 011.06 1.06 6.5 6.5 0 107.072 0 .75.75 0 111.06-1.06 8 8 0 11-9.192 0z" clipRule="evenodd" /></svg>
                                        Bersiap Kembali
                                    </button>
                                </>
                            }
                            {row.status != "selesai" && row.status != "batal" &&
                                <button type="button" onClick={() => oc_batal(row.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold px-3 py-1.5 rounded-full text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5 mt-1 sm:mt-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                    Batal
                                </button>
                            }
                        </div>
                    , width: "190px"
                },
            ] : [];
    const conditionalRowStyles = [
        {
            when: row => row.status?.includes('belum diterima'),
            style: {
                backgroundColor: 'var(--dt-row-belum-diterima, #fff1f2)',
                '&:hover': { cursor: 'pointer' },
            },
            classNames: ['row-belum-diterima']
        }
    ];


    const cari = (e) => {
        const query = e.target.value.toLowerCase();
        set_val_cari(e.target.value);
        set_semua_order_cari(semua_order.filter((item) =>
            (item.nama_penelepon?.toLowerCase().includes(query) || false) ||
            (item.nama_pasien?.toLowerCase().includes(query) || false)
        ));
    }

    const handleTanggalDariChange = (event) => {
        setTanggalDariInput(event.target.value);
    };

    const handleTanggalSampaiChange = (event) => {
        setTanggalSampaiInput(event.target.value);
    };

    const cari_data = () => {
        // Validate date difference on button press
        if (tanggalDariInput && tanggalSampaiInput) {
            const diffInDays = (new Date(tanggalSampaiInput) - new Date(tanggalDariInput)) / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 7) {
                toast.warning("Pemilihan tanggal hanya satu pekan", { position: toast.POSITION.TOP_RIGHT });
                setTanggalSampaiInput(tanggalDariInput);
                return;
            }
            if (diffInDays < 0) {
                setTanggalSampaiInput(tanggalDariInput);
                return;
            }
        }

        // Apply inputs to trigger the useEffect
        if (tanggalDariInput === tanggalDari && tanggalSampaiInput === tanggalSampai) {
            // Force fetch if dates haven't changed but they clicked filter
            refresh_all_data();
        } else {
            setTanggalDari(tanggalDariInput);
            setTanggalSampai(tanggalSampaiInput);
        }
    };

    const cari_data_nik = () => {
        if (!data.nik_pasien) {
            toast.error("Masukkan NIK terlebih dahulu", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        axios.post(window.location.origin + '/cari_nik', {
            nik: data.nik_pasien
        }).then(function (response) {
            if (response.data === "Nik tidak ditemukan") {
                toast.error("Data pasien tidak ditemukan", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } else {
                toast.success("Data pasien ditemukan", {
                    position: toast.POSITION.TOP_RIGHT,
                });

                const dt = response.data;
                set_data(prev => ({
                    ...prev,
                    nama_pasien: dt.nama || prev.nama_pasien,

                }));

                if (dt.alamat_kecamatan) {
                    axios.post(window.location.origin + '/ref_kelurahan', {
                        kode_kecamatan: dt.alamat_kecamatan,
                    }).then(function (res_kel) {
                        set_semua_kelurahan(res_kel.data);
                        const selectedKel = res_kel.data.find(k => k.kode_kelurahan === dt.alamat_kelurahan);
                        set_data(prev => ({
                            ...prev,
                            nama_kelurahan: selectedKel ? selectedKel.nama_kelurahan : prev.nama_kelurahan,
                        }));
                    });
                }
            }
        }).catch(function (error) {
            toast.error("Terjadi kesalahan saat mencari data", {
                position: toast.POSITION.TOP_RIGHT,
            });
        });
    };

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        waktu_order: new Date().toLocaleString('en-GB', {
            hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }).replace(",", ""),
        cara_order: '112',
        no_penelepon: '',
        nama_penelepon: '',
        hubungan: '',
        nama_pasien: '',
        nik_pasien: '',
        kasus: '',
        jenis_layanan: '',
        faskes_rujukan: '',
        kecamatan: '',
        kelurahan: '',
        nama_kecamatan: '',
        nama_kelurahan: '',
        alamat: '',
        latitude: '',
        longitude: '',
        lat_long: '',
        id_tim_ambulan: '',
        tim_ambulan: '',
        catatan: '',
        riwayat_alergi: '',
        status_bpjs: '',
        status_kelas_bpjs: '',
        keterangan_lain: '',
    });

    const oc_data = (e) => {
        if (e.target.name == "kecamatan") {
            const selectedOpt = semua_kecamatan.find(opt => opt.nama_kecamatan === e.target.value);
            const option = selectedOpt ? selectedOpt.kode_kecamatan : '';
            set_data(
                {
                    ...data,
                    ["kecamatan"]: option,
                    ["nama_kecamatan"]: e.target.value,
                    ["kelurahan"]: "",       // Reset kode kelurahan
                    ["nama_kelurahan"]: "",  // Reset teks kelurahan
                });
            if (option) {
                axios.post(window.location.origin + '/ref_kelurahan',
                    {
                        kode_kecamatan: option,
                    }).then(function (response) {
                        set_semua_kelurahan(response.data)
                    })
            } else {
                set_semua_kelurahan([])
            }
        }
        else if (e.target.name == "kelurahan") {
            const selectedOpt = semua_kelurahan.find(opt => opt.nama_kelurahan === e.target.value);
            const option = selectedOpt ? selectedOpt.kode_kelurahan : '';
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {
                    ...data,
                    ["kelurahan"]: option,
                    ["nama_kelurahan"]: e.target.value,
                });
        }
        else if (e.target.name == "tim_ambulan") {
            let id;
            let ei = document.getElementById('dl_tim_ambulan');
            for (let i = 0; i < ei.childElementCount; i++) {
                if (ei.children[i].attributes.value.value == e.target.value) {
                    id = ei.children[i].attributes.id.value;
                }
            }
            set_data(
                {
                    ...data,
                    ["id_tim_ambulan"]: id,
                    ["tim_ambulan"]: e.target.value,
                });
        }
        else if (e.target.name == "lat_long") {
            const val = e.target.value
            const ar_val = val.split(',')
            const lat = ar_val[0]
            const long = ar_val[1]

            set_data(
                {
                    ...data,
                    ["lat_long"]: val,
                    ["latitude"]: lat,
                    ["longitude"]: long,
                });
        }
        else if (e.target.name === "nik_pasien") {
            const value = e.target.value;
            // Hanya izinkan angka dan maksimal 16 digit
            if (/^\d*$/.test(value) && value.length <= 16) {
                set_data({
                    ...data,
                    [e.target.name]: value,
                });
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

    function cek_no(str) {
        return /^\d+$/.test(str);
    }

    const oc_simpan = (e) => {
        let cek_cara_order = true
        if (data.cara_order == "" || data.cara_order == "-") {
            cek_cara_order = false
            toast.error("pilih cara order", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_nama_pasien = true
        if (data.nama_pasien == "") {
            cek_nama_pasien = false
            toast.error("Nama pasien wajib diisi", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_jenis_layanan = true
        if (data.jenis_layanan == "") {
            cek_jenis_layanan = false
            toast.error("Jenis layanan wajib diisi", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_no_penelepon = true
        if (data.no_penelepon && data.no_penelepon !== "-" && !cek_no(data.no_penelepon)) {
            cek_no_penelepon = false;
            toast.error("No penelepon harus angka tidak boleh simbol", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_nik = true;
        if (data.nik_pasien && data.nik_pasien !== "-" && String(data.nik_pasien).length !== 16) {
            cek_nik = false;
            toast.error("NIK harus terdiri dari tepat 16 digit angka", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_tim_ambulan = true;
        if (data.tim_ambulan && data.tim_ambulan !== "") {
            const timValid = semua_tim_ambulan.find(t => t.nama_tim === data.tim_ambulan);
            if (!timValid) {
                cek_tim_ambulan = false;
                toast.error("Tim ambulan tidak valid. Silakan pilih dari daftar.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }

        if (cek_cara_order && cek_no_penelepon && cek_nama_pasien && cek_jenis_layanan && cek_nik && cek_tim_ambulan) {
            if (edit) {
                axios.post(window.location.origin + '/order/edit',
                    {
                        id: data.id,
                        cara_order: data.cara_order,
                        nama_penelepon: data.nama_penelepon,
                        nama_pasien: data.nama_pasien,
                        no_penelepon: data.no_penelepon,
                        kasus: data.kasus,
                        alamat: data.alamat,
                        kecamatan: data.kecamatan,
                        kelurahan: data.kelurahan,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        waktu_order: data.waktu_order,
                        id_tim_ambulan: data.id_tim_ambulan,
                        nik_pasien: data.nik_pasien,
                        jenis_layanan: data.jenis_layanan,
                        riwayat_alergi: data.riwayat_alergi,
                        status_bpjs: data.status_bpjs,
                        status_kelas_bpjs: data.status_kelas_bpjs,
                        keterangan_lain: data.keterangan_lain,
                    }).then(function (response) {
                        // console.log("data3")
                        toast.success(response.data, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        set_edit(false)
                        set_null_data()
                        set_modal(false)
                        refresh_all_data()
                    }).catch(function (error) {
                        toast.error("Gagal edit order: " + (error.response?.data || error.message), {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    })
            }
            else {
                axios.post(window.location.origin + '/order/tambah',
                    {
                        cara_order: data.cara_order,
                        nama_penelepon: data.nama_penelepon,
                        nama_pasien: data.nama_pasien,
                        no_penelepon: data.no_penelepon,
                        kasus: data.kasus,
                        alamat: data.alamat,
                        kecamatan: data.kecamatan,
                        kelurahan: data.kelurahan,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        waktu_order: data.waktu_order,
                        id_tim_ambulan: data.id_tim_ambulan,
                        nik_pasien: data.nik_pasien,
                        jenis_layanan: data.jenis_layanan,
                        riwayat_alergi: data.riwayat_alergi,
                        status_bpjs: data.status_bpjs,
                        status_kelas_bpjs: data.status_kelas_bpjs,
                        keterangan_lain: data.keterangan_lain,
                    }).then(function (response) {
                        toast.success(response.data, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        set_null_data()
                        set_modal(false)
                        refresh_all_data()
                    }).catch(function (error) {
                        toast.error("Gagal tambah order", {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    });
            }
        }
    }

    function get_id_ref_order(id) {
        axios.post(window.location.origin + '/ref_order',
            {
                id: id,
            }).then(function (response) {
                console.log("get id")
                set_data({
                    ...data,
                    ['id']: id,
                    ['cara_order']: response.data.cara_order,
                    ['no_penelepon']: response.data.no_penelepon,
                    ['nama_penelepon']: response.data.nama_penelepon,
                    ['nama_pasien']: response.data.nama_pasien,
                    ['kasus']: response.data.kasus,
                    ['kecamatan']: response.data.ref_kecamatan?.kode_kecamatan || '',
                    ['kelurahan']: response.data.ref_kelurahan?.kode_kelurahan || '',
                    ['nama_kecamatan']: response.data.ref_kecamatan?.nama_kecamatan || '',
                    ['nama_kelurahan']: response.data.ref_kelurahan?.nama_kelurahan || '',
                    ['alamat']: response.data.alamat,
                    ['latitude']: response.data.latitude,
                    ['longitude']: response.data.longitude,
                    ['lat_long']: response.data.latitude + "," + response.data.longitude,
                    ['tim_ambulan']: response.data.tim_ambulan?.nama_tim || '',
                    ['id_tim_ambulan']: response.data.id_tim_ambulan,
                    ['waktu_order']: response.data.waktu_order,
                    ['catatan']: response.data.catatan,
                    ['nik_pasien']: response.data.nik_pasien,
                    ['jenis_layanan']: response.data.jenis_layanan,
                    ['riwayat_alergi']: response.data.riwayat_alergi,
                    ['status_bpjs']: response.data.status_bpjs,
                    ['status_kelas_bpjs']: response.data.status_kelas_bpjs,
                    ['keterangan_lain']: response.data.keterangan_lain,
                })
                // console.log(response)
            })
    }

    function set_null_data() {
        set_data({
            ...data,
            ['id']: '',
            ['cara_order']: '112',
            ['no_penelepon']: '',
            ['nama_penelepon']: '',
            ['nama_pasien']: '',
            // ['umur_pasien']: '',
            ['kasus']: '',
            ['kecamatan']: '',
            ['kelurahan']: '',
            ['nama_kecamatan']: '',
            ['nama_kelurahan']: '',
            ['alamat']: '',
            ['latitude']: '',
            ['longitude']: '',
            ['lat_long']: '',
            ['tim_ambulan']: '',
            ['waktu_order']: '',
            ['catatan']: '',
            ['faskes_rujukan']: '',
            ['nik_pasien']: '',
            ['jenis_layanan']: '',
            ['riwayat_alergi']: '',
            ['status_bpjs']: '',
            ['status_kelas_bpjs']: '',
            ['keterangan_lain']: '',
        })
    }

    function kirim_lokasi() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            axios.post(window.location.origin + '/tim_ambulan/kirim_lokasi',
                {
                    latitude: latitude,
                    longitude: longitude,
                }).then(function (response) {
                    set_koorku({
                        ...koorku,
                        ["lat"]: latitude,
                        ["lng"]: longitude,
                    })
                    console.log("kirim lokasi")
                    console.log("lat" + latitude + " long" + longitude)

                    // console.log(response)
                    // set_semua_order(response.data)
                    // set_semua_order_cari(response.data)
                })
                // kirim_lokasi(latitude, longitude)

                // console.log("tim ambulan role")
                , (error) => console.warn(error.message),
                { enableHighAccuracy: true }
            // enableHighAccuracy=true
        })

    }

    // console.log("auth role")
    // console.log(auth.role)
    // console.log(koorku)
    // console.log(semua_kecamatan)

    // console.log(semua_kelurahan)
    // console.log(edit);
    // console.log(data)
    console.log(semua_order)
    // console.log(semua_tim_ambulan)
    // console.log(semua_tim_ambulan);

    function set_icon(url) {
        return new L.Icon({
            iconUrl: url,
            iconSize: [35, 37],
        });
    }

    useEffect(() => {
        set_data({
            ...data,
            ["waktu_order"]: new Date().toLocaleString('en-GB', {
                hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
            }).replace(",", "")
        })
    }, [modal])

    function x() {
        set_modal(false)
        set_edit(false)
        set_modal_hapus(false)

        set_terima(false);
        set_sampai_lokasi(false);
        set_selesai(false);
        set_batal(false);
        set_catatan(false);
        set_ajukan_rujuk(false)
        set_rujuk(false)
        set_sampai_rujuk(false)
        set_bersiap_kembali(false)

        set_null_data()
    }

    const warna_tim_ambulan = [
        { text: 'Belum Diterima', text2: 'belum diterima', warna: '#ff9292' },
        { text: 'Sudah Diterima', text2: 'sudah diterima', warna: '#FDE68A' },
        { text: 'Sampai Lokasi', text2: 'sampai lokasi', warna: '#c76dfc' },
        { text: 'Batal', text2: 'batal', warna: '#F43F5E' },
        { text: 'Selesai', text2: 'selesai', warna: '#80fa7c' },
        { text: 'Rujuk', text2: 'rujuk', warna: '#37ffde' },
        { text: 'Sampai Rujuk', text2: 'sampai rujuk', warna: '#00B3FF' },
        { text: 'Selesai Penanganan', text2: 'selesai penanganan', warna: '#eefa49' },
    ];

    const warna_status = (status) => {
        const matchingStatus = warna_tim_ambulan.find(item => item.text2 == status);
        return matchingStatus ? matchingStatus.warna : '#FFFFFF'; // Default to white if no match
    };

    // --- DESAIN EMPTY STATE CUSTOM ---
    const CustomEmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4 w-full animate-fade-in">
            <div className="bg-slate-50 dark:bg-red-900/20 transition-colors duration-300 p-6 rounded-full mb-4 shadow-inner dark:shadow-[inset_0_2px_15px_rgba(220,38,38,0.1)]">
                {/* Ikon Folder Medis Besar Berwarna Abu-abu/Merah Transparan */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300 dark:text-red-500/50 transition-colors duration-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <h4 className="text-lg font-extrabold text-slate-600 dark:text-slate-300 transition-colors duration-300 mb-2">Belum Ada Order Ambulan</h4>
            <p className="text-sm text-slate-400 max-w-sm text-center leading-relaxed">
                Tidak ada data order untuk rentang tanggal yang dipilih. Coba sesuaikan filter kalender di atas atau klik <strong className="text-slate-500 dark:text-slate-400 transition-colors duration-300">Tambah Order</strong>.
            </p>
        </div>
    );

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">Order Ambulan Hebat</h1>
                    <p className="text-gray-500 dark:text-slate-400 transition-colors duration-300 text-sm mt-1 capitalize">{nama_hari_ini}, {day} {nama_bulan} {year}</p>
                </div>
            </div>

            {/* Status Terakhir Tim - Redesigned & Moved below header */}
            {(auth.role === "admin" || auth.role === "Operator") && (
                <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col md:flex-row md:items-center gap-3 overflow-hidden relative">
                    <div className="flex items-center gap-2 md:w-auto shrink-0 z-10 bg-white dark:bg-slate-800 transition-colors duration-300 pr-2">
                        <div className="p-1.5 bg-red-50 text-red-500 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-slate-300 transition-colors duration-300 uppercase tracking-wider">Status Tim Live</span>
                        <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 transition-colors duration-300 ml-2"></div>
                    </div>
                    
                    {/* Horizontal scroll container with hidden scrollbar */}
                    <div className="flex overflow-x-auto pb-1 md:pb-0 flex-1 items-center gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {semua_tim_ambulan.map((val, index) => (
                            val.order !== null && (
                                <div
                                    key={`row-${index}`}
                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-all hover:shadow-md cursor-default"
                                    style={{ 
                                        backgroundColor: `${warna_status(val.order.status)}25`, 
                                        borderColor: warna_status(val.order.status),
                                        color: 'var(--dt-row-text, #334155)'
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full animate-pulse shadow-sm" style={{ backgroundColor: warna_status(val.order.status) }}></div>
                                    <span className="text-[11px] font-bold whitespace-nowrap">{val.nama_tim}</span>
                                    <span className="text-[10px] uppercase font-bold opacity-75 border-l border-slate-300 dark:border-slate-600 transition-colors duration-300 pl-1.5 ml-0.5">{val.order.status}</span>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* 2. CONTROL PANEL (Filter & Action Row) */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col gap-4">
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-slate-50 dark:bg-slate-900 transition-colors duration-300/50 text-sm focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-4 focus:ring-red-500/10 focus:border-red-400 outline-none transition-all placeholder:text-gray-400"
                            placeholder="Cari nama pasien atau penelepon..."
                            onChange={cari}
                        />
                    </div>

                    {/* DATE FILTERS (Inline Group) */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 dark:bg-slate-900 transition-colors duration-300/80 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="flex items-center gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Dari</span>
                            <input
                                type="date"
                                id="tanggal_dari"
                                value={tanggalDariInput}
                                onChange={handleTanggalDariChange}
                                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300 focus:ring-0 p-1 cursor-pointer w-full sm:w-auto outline-none"
                            />
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-slate-200 dark:bg-slate-700 transition-colors duration-300"></div>
                        <div className="flex items-center gap-2 px-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Hingga</span>
                            <input
                                type="date"
                                id="tanggal_sampai"
                                value={tanggalSampaiInput}
                                onChange={handleTanggalSampaiChange}
                                className="bg-transparent border-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors duration-300 focus:ring-0 p-1 cursor-pointer w-full sm:w-auto outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={cari_data}
                        type="button"
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                        Filter Data
                    </button>

                    {/* ACTION BUTTON (Tambah Order) */}
                    {auth.role !== "Tim Ambulan" && (
                        <button
                            type="button"
                            onClick={(e) => {
                                set_data(prev => ({
                                    ...prev,
                                    waktu_order: new Date().toLocaleString('en-GB', {
                                        hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                    }).replace(",", "")
                                }));
                                set_modal(true);
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-red-200 active:scale-95 group whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Order
                        </button>
                    )}
                </div>

                {/* Legend Status Bar */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                    <span className="text-xs font-semibold text-gray-400 flex items-center mr-2">Indikator Warna:</span>
                    {warna_tim_ambulan.map((val, index) => (
                        <div key={index} style={{ backgroundColor: val.warna, color: 'black' }} className="text-[10px] font-bold rounded-md px-2.5 py-1 border border-black/5 flex items-center shadow-sm uppercase tracking-wider">
                            {val.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* DataTable Wrapper */}
            <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl px-6 py-4 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                <div className="border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 rounded-xl overflow-hidden mt-2">
                    <DataTable
                        columns={columns}
                        data={semua_order_cari}
                        pagination
                        onChangePage={(newPage) => set_page(newPage)}
                        highlightOnHover
                        striped
                        noDataComponent={<CustomEmptyState />}
                        conditionalRowStyles={conditionalRowStyles}
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

            {modal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in transition-all">
                    {/* Modal Container */}
                    <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 tracking-tight">
                                    {edit ? 'Edit' : 'Tambah'} Order Ambulan
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300 font-medium mt-0.5">{data.waktu_order || "Waktu otomatis ditetapkan saat simpan"}</p>
                            </div>
                            <button
                                onClick={x}
                                className="text-gray-400 bg-transparent hover:bg-gray-100 dark:bg-slate-800/50 transition-colors duration-300 hover:text-red-500 rounded-xl text-sm w-8 h-8 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                            {/* Section: DATA WAJIB */}
                            <div className="bg-red-50/30 p-5 rounded-2xl border border-red-100/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cara Order (Restricted to 112) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Asal Permintaan (Cara Order) <span className="text-red-500">*</span></label>
                                        <select
                                            name="cara_order"
                                            value={data.cara_order}
                                            onChange={oc_data}
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-red-200 text-red-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none font-bold"
                                        >
                                            <option value="112">Call Center 112</option>
                                        </select>
                                    </div>

                                    {/* Nama Pasien */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Nama Pasien <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="nama_pasien"
                                            value={data.nama_pasien}
                                            onChange={oc_data}
                                            placeholder="Masukkan nama lengkap pasien"
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>

                                    {/* NIK Pasien (Menggantikan RM) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">NIK Pasien (NIK boleh kosong)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="nik_pasien"
                                                value={data.nik_pasien}
                                                onChange={oc_data}
                                                placeholder="16 digit NIK"
                                                maxLength="16"
                                                className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={cari_data_nik}
                                                title="Cari Data Pasien"
                                                className="flex-shrink-0 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:text-blue-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                                </svg>
                                                Cari
                                            </button>
                                        </div>
                                    </div>

                                    {/* Jenis Layanan */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Jenis Layanan/Pemeriksaan <span className="text-red-500">*</span></label>
                                        <select
                                            name="jenis_layanan"
                                            value={data.jenis_layanan || ""}
                                            onChange={oc_data}
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        >
                                            <option value="" disabled hidden>Pilih jenis layanan</option>
                                            <option value="Gawat Darurat Pre-Hospital">Gawat Darurat Pre-Hospital</option>
                                            <option value="Antar Pasien Rujukan">Antar Pasien Rujukan</option>
                                            <option value="Antar Jenazah">Antar Jenazah</option>
                                            <option value="Homecare / Kunjungan Rumah">Homecare / Kunjungan Rumah</option>
                                            <option value="Pemeriksaan Kesehatan Umum">Pemeriksaan Kesehatan Umum</option>
                                            <option value="Laka Lantas (KLL)">Laka Lantas (KLL)</option>
                                            <option value="Lainnya">Lainnya...</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section: DATA OPSIONAL */}
                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* No Penelepon */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">No. Penelepon</label>
                                        <input
                                            type="text"
                                            name="no_penelepon"
                                            value={data.no_penelepon}
                                            onChange={oc_data}
                                            placeholder="08xxxxxxxxxx"
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>

                                    {/* Nama Penelepon */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Nama Penelepon</label>
                                        <input
                                            type="text"
                                            name="nama_penelepon"
                                            value={data.nama_penelepon}
                                            onChange={oc_data}
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>

                                    {/* Informasi Penjamin (BPJS) */}
                                    {/*<div className="grid grid-cols-2 gap-3">*/}
                                        {/*<div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Status BPJS</label>
                                            <select
                                                name="status_bpjs"
                                                value={data.status_bpjs}
                                                onChange={oc_data}
                                                className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                            >
                                                <option value="">Pilih</option>
                                                <option value="BPJS">BPJS</option>
                                                <option value="Umum">Umum</option>
                                                <option value="Asuransi Lain">Asuransi Lain</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Kelas BPJS</label>
                                            <select
                                                name="status_kelas_bpjs"
                                                value={data.status_kelas_bpjs}
                                                onChange={oc_data}
                                                className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                            >
                                                <option value="">Pilih</option>
                                                <option value="Kelas 1">Kelas 1</option>
                                                <option value="Kelas 2">Kelas 2</option>
                                                <option value="Kelas 3">Kelas 3</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Kasus / Keluhan */}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Kasus / Keluhan Pasien</label>
                                        <textarea
                                            name="kasus"
                                            value={data.kasus}
                                            onChange={(e) => {
                                                oc_data(e);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = (e.target.scrollHeight) + 'px';
                                            }}
                                            rows="1"
                                            placeholder="Ketik keluhan atau kasus pasien di sini..."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-3 transition-all outline-none resize-none overflow-hidden"
                                            style={{ minHeight: '46px' }}
                                        ></textarea>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {["Gawat Darurat", "Transport", "KLL", "Homecare", "Maternal Neonatal", "DOA"].map((kategori) => (
                                                <button
                                                    key={kategori}
                                                    type="button"
                                                    onClick={() => set_data(prev => ({ ...prev, kasus: prev.kasus ? prev.kasus + ', ' + kategori : kategori }))}
                                                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 dark:bg-slate-800/50 transition-colors duration-300 text-slate-600 dark:text-slate-300 transition-colors duration-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all active:scale-95"
                                                >
                                                    + {kategori}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Catatan Khusus */}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Catatan Khusus / Keterangan Lain</label>
                                        <textarea
                                            name="keterangan_lain"
                                            value={data.keterangan_lain}
                                            onChange={(e) => {
                                                oc_data(e);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = (e.target.scrollHeight) + 'px';
                                            }}
                                            rows="1"
                                            placeholder="Tambahkan catatan khusus jika diperlukan..."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-3 transition-all outline-none resize-none overflow-hidden"
                                            style={{ minHeight: '46px' }}
                                        ></textarea>
                                    </div>

                                    {/* Riwayat Alergi */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Riwayat Alergi</label>
                                        <input
                                            type="text"
                                            name="riwayat_alergi"
                                            value={data.riwayat_alergi}
                                            onChange={oc_data}
                                            placeholder="Contoh: Alergi Obat, Makanan, dsb."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: LOKASI & PENUGASAN */}
                            <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Kecamatan */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Kecamatan</label>
                                        <input
                                            type="text"
                                            name="kecamatan"
                                            list="opsi_kecamatan"
                                            value={data.nama_kecamatan}
                                            onChange={oc_data}
                                            placeholder="Ketik atau pilih kecamatan..."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                        <datalist id="opsi_kecamatan">
                                            {semua_kecamatan.map((opts, i) => (
                                                <option key={i} id={opts.kode_kecamatan} value={opts.nama_kecamatan} />
                                            ))}
                                        </datalist>
                                    </div>

                                    {/* Kelurahan */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Kelurahan</label>
                                        <input
                                            type="text"
                                            name="kelurahan"
                                            list="opsi_kelurahan"
                                            value={data.nama_kelurahan}
                                            onChange={oc_data}
                                            placeholder="Ketik atau pilih kelurahan..."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                        <datalist id="opsi_kelurahan">
                                            {semua_kelurahan.map((opts, i) => (
                                                <option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan} />
                                            ))}
                                        </datalist>
                                    </div>

                                    {/* Alamat Detail */}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Alamat Lengkap Kejadian</label>
                                        <input
                                            type="text"
                                            name="alamat"
                                            value={data.alamat}
                                            onChange={oc_data}
                                            placeholder="Misal: RT/RW, Patokan, Nama Gedung"
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>

                                    {/* Tim Ambulan */}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300">Tugaskan Tim Ambulan</label>
                                        <input
                                            type="text"
                                            name="tim_ambulan"
                                            value={data.tim_ambulan}
                                            list="dl_tim_ambulan"
                                            onChange={oc_data}
                                            placeholder="Ketik atau pilih nama tim..."
                                            className="bg-white dark:bg-slate-800 transition-colors duration-300 border border-blue-200 text-slate-900 dark:text-slate-100 font-bold text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all outline-none shadow-sm"
                                        />
                                        <datalist id="dl_tim_ambulan">
                                            {semua_tim_ambulan.map((opts, i) => (
                                                <option key={i} id={opts.id} value={opts.nama_tim}>{opts.nama_tim}</option>
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                            </div>

                            {/* Koordinat & Peta */}
                            <div className="mt-2 pt-5 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Titik Koordinat Posisi Kejadian (Latitude & Longitude)
                                    </label>
                                    <input
                                        type="text"
                                        name="lat_long"
                                        value={data.lat_long}
                                        onChange={oc_data}
                                        placeholder="-6.986802, 110.414652"
                                        className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 text-gray-900 dark:text-slate-100 transition-colors duration-300 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all font-mono outline-none"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-300">Anda dapat mengetik langsung, atau <strong>klik lokasi pada peta di bawah</strong> untuk mengisi koordinat secara otomatis.</p>
                                </div>

                                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-300 relative z-0">
                                    {(() => {
                                        const parsedLat = parseFloat(data.latitude);
                                        const parsedLng = parseFloat(data.longitude);
                                        const isValid = !isNaN(parsedLat) && !isNaN(parsedLng);
                                        const safeLat = isValid ? parsedLat : -6.986802;
                                        const safeLng = isValid ? parsedLng : 110.414652;

                                        return (
                                            <MapContainer
                                                center={[safeLat, safeLng]}
                                                zoom={14}
                                                style={{ width: "100%", height: "350px", zIndex: 0 }}
                                            >
                                                <MapCenterUpdate center={[safeLat, safeLng]} />
                                                <MapClickHandler onMapClick={(lat, lng) => {
                                                    set_data(prev => ({
                                                        ...prev,
                                                        lat_long: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                                                        latitude: lat.toFixed(6).toString(),
                                                        longitude: lng.toFixed(6).toString()
                                                    }));
                                                }} />
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                {isValid && (
                                                    <Marker
                                                        position={[safeLat, safeLng]}
                                                        icon={set_icon("assets/img/marker-map.png")}
                                                    >
                                                        <Popup>Lokasi Kejadian/Pasien</Popup>
                                                    </Marker>
                                                )}
                                                {semua_tim_ambulan.map((value, idx) => {
                                                    const timLat = parseFloat(value.latitude);
                                                    const timLng = parseFloat(value.longitude);
                                                    if (value.latitude !== null && value.status == "bersiap" && !isNaN(timLat) && !isNaN(timLng)) {
                                                        return (
                                                            <Marker
                                                                key={idx}
                                                                position={[timLat, timLng]}
                                                                icon={set_icon(value.gambar ? "gambar/tim_ambulan/" + value.gambar : "assets/img/marker-map.png")}
                                                            >
                                                                <Popup>{value.nama_tim}</Popup>
                                                            </Marker>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </MapContainer>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Footer - Sticky Bottom */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 dark:border-slate-700/50 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300/80 shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={x}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-200 dark:border-slate-700 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 hover:text-red-700 focus:ring-4 focus:ring-gray-100 transition-all outline-none"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={oc_simpan}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all shadow-sm shadow-red-200 flex items-center gap-2 outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                                Simpan Order Ambulan
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal Hapus Order */}
            {modal_hapus &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium">Apakah Anda yakin ingin <span className="font-bold text-red-600">menghapus</span> order ini secara permanen?</p>

                            <div className="bg-gray-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Waktu
                                    </span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-1 rounded border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 inline-block w-full">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-1 rounded border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 inline-block w-full text-xs line-clamp-2" title={`${data.alamat} kel. ${data.nama_kelurahan} kec. ${data.nama_kecamatan}`}>
                                        {data.alamat} kel. {data.nama_kelurahan} kec. {data.nama_kecamatan}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-1 rounded border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 inline-block w-full text-xs">
                                        {data.kasus || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 transition-colors">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {terima &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Terima Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-blue-600">menerima</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Catatan Khusus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.keterangan_lain || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_terima_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Terima</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {sampai_lokasi &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Sampai Lokasi
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-purple-600">mengonfirmasi sudah sampai di lokasi</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_sampai_lokasi_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Sampai</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {selesai &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Selesai Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-lime-600">menyelesaikan</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_selesai_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Selesai</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* Modal Batal Order */}
            {batal &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Batalkan Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-red-600">membatalkan</span> order layanan ambulan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Waktu Order
                                    </span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi Kejadian</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-2 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br />
                                        <span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus / Rincian</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs border-l-2 border-l-red-400 shadow-sm">
                                        {data.kasus || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all active:scale-95">
                                    Tidak, Kembali
                                </button>
                                <button type="button" onClick={() => oc_batal_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 active:scale-95">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Ya, Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {catatan &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border-[1.5px] border-slate-200 dark:border-slate-700 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Catatan Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 block mb-2">Tambahkan Catatan Tambahan <span className="text-red-500">*</span></label>
                                <textarea name="catatan" value={data.catatan} onChange={oc_data} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300 bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:bg-white dark:bg-slate-800 transition-colors duration-300 focus:ring-2 focus:ring-slate-100 focus:border-slate-400 outline-none transition-all text-sm" placeholder="Ketik catatan medis atau laporan operasional di sini..."></textarea>
                            </div>

                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 transition-all">Batal</button>
                                <button type="button" onClick={() => oc_catatan_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-all shadow-md shadow-slate-200">Simpan Catatan</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {rujuk &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Rujuk Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-cyan-600">merujuk</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_rujuk_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Rujuk</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {/* {
            ajukan_rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white dark:bg-slate-800 transition-colors duration-300 pt-2 pb-7 pl-7 pr-7 border border-red-500">
                    <div className="flex justify-end font-bold">
                        <button onClick={(e)=>x()}>X</button>
                    </div>
                    <div className="flex justify-center font-bold mt-2">
                        Apakah Anda Ingin Mengajukan Rujuk Order?
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-center">{data.waktu_order}</div>
                        <div>Nama Penelepon: {data.nama_penelepon}</div>
                        <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                        <div>Kasus: {data.kasus}</div>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button type="button"
                            onClick={()=>oc_ajukan_rujuk_simpan(data.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                    </div>
                </div>
            </div>
        } */}
            {sampai_rujuk &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Sampai Tempat Rujukan
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-indigo-600">mengonfirmasi sudah sampai di tempat rujukan</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_sampai_rujuk_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Sampai</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {bersiap_kembali &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 transition-colors duration-300 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/50 transition-colors duration-300 flex justify-between items-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 shrink-0">
                            <h3 className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Bersiap Kembali
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 transition-colors duration-300 rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 dark:text-slate-300 transition-colors duration-300 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-emerald-600">mengonfirmasi bersiap kembali</span> order layanan ini?</p>

                            <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300 rounded-xl p-4 text-sm text-gray-700 dark:text-slate-200 transition-colors duration-300 space-y-2 mb-6 border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300/80">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider">Waktu Order</span>
                                    <span className="font-bold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2 py-0.5 rounded shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br /><span className="text-gray-500 dark:text-slate-400 transition-colors duration-300">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 transition-colors duration-300 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 dark:text-slate-100 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-slate-700/50 transition-colors duration-300 block w-full text-xs shadow-sm border border-gray-100 dark:border-slate-700/50 transition-colors duration-300">{data.kasus || "-"}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 transition-colors duration-300 bg-white dark:bg-slate-800 transition-colors duration-300 border border-gray-300 dark:border-slate-600 transition-colors duration-300 rounded-xl hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-300 focus:ring-2 focus:ring-gray-100 transition-all">Tidak</button>
                                <button type="button" onClick={() => oc_bersiap_kembali_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm shadow-red-200 rounded-xl focus:ring-2 focus:ring-red-200 transition-all shadow-md shadow-red-200">Ya, Bersiap</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
