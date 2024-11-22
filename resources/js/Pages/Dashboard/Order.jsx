import React , {Component, useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MapContainer, TileLayer, useMap , Marker, Popup} from 'react-leaflet'

export default function Order({auth}) {
// export default function Order() {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);
    
    const [tanggalDari, setTanggalDari] = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');

    // const [semua_rs, set_semua_rs] = useState([]);
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    const semua_nama_hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const index_hari = currentDate.getDay();
    const nama_hari_ini = semua_nama_hari[index_hari];

    var nama_bulan;
    if(month=="01"){
        nama_bulan="Januari";
    }
    else if(month=="02"){
        nama_bulan="Februari";
    }
    else if(month=="03"){
        nama_bulan="Maret";
    }
    else if(month=="04"){
        nama_bulan="April";
    }
    else if(month=="05"){
        nama_bulan="Mei";
    }
    else if(month=="06"){
        nama_bulan="Juni";
    }
    else if(month=="07"){
        nama_bulan="Juli";
    }
    else if(month=="08"){
        nama_bulan="Agustus";
    }
    else if(month=="09"){
        nama_bulan="September";
    }
    else if(month=="10"){
        nama_bulan="Oktober";
    }
    else if(month=="11"){
        nama_bulan="November";
    }
    else if(month=="12"){
        nama_bulan="Desember";
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

    useEffect(() => {
        const invtime = setInterval(() => {
            if (!val_cari) {
                if (tanggalDari && tanggalSampai) {
                    refresh_all_data();
                    // console.log("geolocation")
                    // console.log(koorku)
                    if(auth.role=="Tim Ambulan"){
                        // console.log("tim ambulan posisi")
                        if ("geolocation" in navigator) {
                            kirim_lokasi()
                        }
                    }
                } 
                // else {
                //     console.log("Tanggal dari atau tanggal sampai belum diatur.");
                // }
            }
        }, 10000);
    
        return () => {
            clearInterval(invtime);
        };
    
    // },[]); // Uncomment if needed
    }, [val_cari, tanggalDari, tanggalSampai]);

    
    useEffect(() => {
        if (tanggalDari && tanggalSampai) {
            refresh_all_data();
        }
    }, [tanggalDari, tanggalSampai]);

    
    useEffect(()=>{
        setTanggalDari(`${year}-${month}-${day}`)
        setTanggalSampai(`${year}-${month}-${day}`)

        // refresh_all_data()

        axios.post(window.location.origin+'/ref_kecamatan',
        {
            // kode_kecamatan:kode_kecamatan,
        }).then(function (response){
            set_semua_kecamatan(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kecamatan:kode_kecamatan,
            // kode_kecamatan:"",
        }).then(function (response){
            set_semua_kelurahan(response.data)
            // console.log(response)
        })

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
        if(auth.role=="Tim Ambulan"){
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
        axios.post(window.location.origin+'/ref_order',
            {
                tanggal_dari:tanggalDari,
                tanggal_sampai:tanggalSampai
            }).then(function (response){
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
            })

        axios.post(window.location.origin+'/ref_tim_ambulan_order',
            {
            }).then(function (response){
                set_semua_tim_ambulan(response.data)
            })
    }

    const oc_hapus = (id) =>{
        get_id_ref_order(id)

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) =>{
        // console.log("hpaus id")
        // console.log(id)
        router.post('/hapus_order', {
            id:id,
        })

        set_modal_hapus(false)

        axios.post(window.location.origin+'/ref_order',
        {
        }).then(function (response){
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

    const oc_edit = (id) =>{
        // console.log("edit")
        set_edit(true);

        set_modal(true)
        // console.log("waktu"+data.waktu_order)

        get_id_ref_order(id)
    }

    const [page, set_page] = useState([0]);

    const [terima, set_terima] = useState(false);

    const oc_terima = (id) =>{
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

    const oc_terima_simpan = (id) =>{
        axios.post(window.location.origin+'/order/terima',
        {
            id:id,
        }).then(function (response){
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

    const oc_selesai = (id) =>{
        set_selesai(true);
        get_id_ref_order(id)
    }

    const oc_selesai_simpan = (id) =>{
        axios.post(window.location.origin+'/order/selesai',
        {
            id:id,
        }).then(function (response){
            set_null_data()
            
            set_selesai(false)
        
            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })
    }

    const [batal, set_batal] = useState(false);

    const oc_batal = (id) =>{
        set_batal(true);
        get_id_ref_order(id)
    }

    const oc_batal_simpan = (id) =>{
        axios.post(window.location.origin+'/order/batal',
        {
            id:id,
        }).then(function (response){
            set_null_data()

            set_batal(false)

            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [catatan, set_catatan] = useState(false);

    const oc_catatan = (id) =>{
        set_catatan(true);
        get_id_ref_order(id)
    }

    const oc_catatan_simpan = (id) =>{
        axios.post(window.location.origin+'/order/catatan',
        {
            id:id,
            catatan:data.catatan,
        }).then(function (response){
            set_null_data()

            set_catatan(false)

            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [ajukan_rujuk, set_ajukan_rujuk] = useState(false);

    const oc_ajukan_rujuk = (id) =>{
        set_ajukan_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_ajukan_rujuk_simpan = (id) =>{
        axios.post(window.location.origin+'/order/ajukan_rujuk',
        {
            id:id,
        }).then(function (response){
            set_null_data()

            set_ajukan_rujuk(false)

            refresh_all_data()
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [rujuk, set_rujuk] = useState(false);

    const oc_rujuk = (id) =>{
        set_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_rujuk_simpan = (id) =>{
        axios.post(window.location.origin+'/order/rujuk',
        {
            id:id,
            // faskes_rujukan:data.faskes_rujukan,
        }).then(function (response){
            set_null_data()

            set_rujuk(false)

            refresh_all_data()
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [sampai_rujuk, set_sampai_rujuk] = useState(false);

    const oc_sampai_rujuk = (id) =>{
        set_sampai_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_sampai_rujuk_simpan = (id) =>{
        axios.post(window.location.origin+'/order/sampai_rujuk',
        {
            id:id,
        }).then(function (response){
            set_null_data()

            set_sampai_rujuk(false)

            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [bersiap_kembali, set_bersiap_kembali] = useState(false);

    const oc_bersiap_kembali = (id) =>{
        set_bersiap_kembali(true);
        get_id_ref_order(id)
    }

    const oc_bersiap_kembali_simpan = (id) =>{
        axios.post(window.location.origin+'/order/bersiap_kembali',
        {
            id:id,
        }).then(function (response){
            set_null_data()

            set_bersiap_kembali(false)
            
            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }

    const [sampai_lokasi, set_sampai_lokasi] = useState(false);

    const oc_sampai_lokasi = (id) =>{
        set_sampai_lokasi(true);
        get_id_ref_order(id)
    }

    const oc_sampai_lokasi_simpan = (id) =>{
        axios.post(window.location.origin+'/order/sampai_lokasi',
        {
            id:id,
        }).then(function (response){
            set_null_data()

            set_sampai_lokasi(false)
            
            refresh_all_data()

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

    }
    
    const columns =
    auth.role=="admin"||auth.role=="Operator"?[
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Status', cell:(row)=>
            <div title={row.status}>{row.status}</div>, width:"100px"},
        {name:'Tim Ambulan', cell:(row)=>
            <div title={row.tim_ambulan.nama_tim}>{row.tim_ambulan.nama_tim}</div>, width:"130px"},
        {name:'Nama Pasien', cell:(row)=>
        <div title={row.nama_pasien}>{row.nama_pasien}</div>, width:"170px"},
        {name:'Alamat', cell:(row)=>
            <div title={row.alamat}>{row.alamat}</div>, width:"190px"},
        {name:'Kelurahan', cell:(row)=>
            <div title={row.ref_kelurahan.nama_kelurahan}>{row.ref_kelurahan.nama_kelurahan}</div>, width:"110px"},
        {name:'Kecamatan', cell:(row)=>
            <div title={row.ref_kecamatan.nama_kecamatan}>{row.ref_kecamatan.nama_kecamatan}</div>, width:"110px"},
        {name:'Nama Penelepon', cell:(row)=>
            <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width:"130px"},
        {name:'No Penelepon', selector:(row)=>row.no_penelepon, width:"135px"},
        {name:'Kasus', cell:(row)=>
            <div title={row.kasus}>{row.kasus}</div>,width:"250px"},
        auth.role=="Operator"?"":{name:'Petugas', selector:(row)=>row.user.name, width:"140px"},
        {name:'Cara Order', selector:(row)=>row.cara_order, width:"100px"},
        {name:'Waktu Order', cell:(row)=>
            <div title={row.waktu_order}>{row.waktu_order}</div>, width:"170px"},
        {name:'Waktu Terima', cell:(row)=>
            <div title={row.waktu_terima}>{row.waktu_terima}</div>, width:"170px"},
        {name:'Waktu Rujuk', cell:(row)=>
            <div title={row.waktu_rujuk}>{row.waktu_rujuk}</div>, width:"170px"},
        {name:'Waktu Sampai Lokasi', cell:(row)=>
            <div title={row.waktu_sampai_lokasi}>{row.waktu_sampai_lokasi}</div>, width:"170px"},
        // {name:'Waktu Ajukan Rujuk', cell:(row)=>
        //     <div title={row.waktu_terima}>
        //         {row.waktu_terima} 
        //     </div>
        //     },
        {name:'Waktu Sampai Rujuk', cell:(row)=>
            <div title={row.waktu_sampai_rujuk}>{row.waktu_sampai_rujuk}</div>, width:"170px"},  
        {name:'Waktu Selesai', cell:(row)=>
            <div title={row.waktu_selesai}>{row.waktu_selesai}</div>, width:"170px"}, 
        {name:'Waktu Bersiap Kembali', cell:(row)=>
            <div title={row.waktu_bersiap_kembali}>{row.waktu_bersiap_kembali}</div>, width:"170px"}, 
        {name:'Catatan', cell:(row)=>
            <div title={row.catatan}>
                {row.catatan} 
            </div>
            }, 
        {name:'Aksi', cell:(row)=>
                <div>
                    {row.status == "ajukan rujuk" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_rujuk(row.id)}
                                className="text-white bg-[#4138ca] hover:bg-[#4138ca] focus:ring-4 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none">
                                Rujuk
                        </button>
                    }
                    <button type="button"
                        id={row.id}
                        onClick={()=>oc_hapus(row.id)}
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                            Hapus
                        </button>
                    <button type="button"
                        id={row.id}
                        onClick={()=>oc_edit(row.id)}
                            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">
                            Edit
                        </button>
                </div>
                , width:"130px"},
    ]:
    auth.role=="Tim Ambulan"?[
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Status', cell:(row)=>
            <div title={row.status}>{row.status}</div>, width:"100px"},
        {name:'Cara Order', selector:(row)=>row.cara_order, width:"130px"},
        {name:'Petugas', cell:(row)=>
            <div title={row.user.name}>{row.user.name}</div>, width:"100px"},
        {name:'Nama Pasien', cell:(row)=>
            <div title={row.nama_pasien}>{row.nama_pasien}</div>, width:"170px"},
        {name:'Alamat', cell:(row)=>
            <div title={row.alamat}>{row.alamat}</div>, width:"190px"},
        {name:'Kelurahan', cell:(row)=>
            <div title={row.ref_kelurahan.nama_kelurahan}>{row.ref_kelurahan.nama_kelurahan}</div>, width:"110px"},
        {name:'Kecamatan', cell:(row)=>
            <div title={row.ref_kecamatan.nama_kecamatan}>{row.ref_kecamatan.nama_kecamatan}</div>, width:"110px"},
        {name:'Nama Penelepon', cell:(row)=>
            <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width:"130px"},
        {name:'No Penelepon', selector:(row)=>row.no_penelepon, width:"130px"},
        {name:'Kasus', cell:(row)=>
            <div title={row.kasus}>{row.kasus}</div>,width:"250px"},
        {name:'Waktu Order', selector:(row)=>row.waktu_order, width:"170px"},
        {name:'Waktu Terima', selector:(row)=>row.waktu_terima, width:"170px"},
        {name:'Waktu Sampai Lokasi', selector:(row)=>row.waktu_sampai_lokasi, width:"170px"},
        {name:'Waktu Rujuk', selector:(row)=>row.waktu_rujuk, width:"170px"},
        {name:'Waktu Sampai Rujuk', selector:(row)=>row.waktu_sampai_rujuk, width:"170px"}, 
        {name:'Waktu Selesai', selector:(row)=>row.waktu_selesai, width:"170px"},
        {name:'Waktu Bersiap Kembali', selector:(row)=>row.waktu_bersiap_kembali, width:"170px"},
        {name:'Catatan', selector:(row)=>row.catatan, width:"140px"},
        {name:'Aksi', cell:(row)=>
                <div>
                    {row.status=="belum diterima" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_terima(row.id)}
                                className="text-black bg-[#FDE68A] hover:bg-[#FDE68A] focus:ring-4 focus:ring-[#FDE68A] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#FDE68A] dark:hover:bg-[#FDE68A] focus:outline-none dark:focus:ring-[#FDE68A]">
                                Terima
                        </button>
                    }
                    {row.status=="sudah diterima" &&
                        <div>
                            <button type="button"
                                id={row.id}
                                onClick={()=>oc_sampai_lokasi(row.id)}
                                    className="text-black mb-1 bg-[#c76dfc] hover:bg-[#c76dfc] focus:ring-4 focus:ring-[#c76dfc] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#c76dfc] dark:hover:bg-[#c76dfc] focus:outline-none dark:focus:ring-[#c76dfc]">
                                    Sampai Lokasi
                            </button>
                        </div>
                    }
                    {row.status=="sampai lokasi" &&
                        <div>
                            <button 
                                type="button"
                                id={row.id}
                                onClick={()=>oc_selesai(row.id)}
                                    className="text-black mb-1 bg-[#eefa49] hover:bg-[#eefa49] focus:ring-4 focus:ring-[#eefa49] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#eefa49] dark:hover:bg-[#eefa49] focus:outline-none dark:focus:ring-[#eefa49]">
                                    Selesai
                            </button>
                            {/* <button type="button"
                                id={row.id}
                                onClick={()=>oc_ajukan_rujuk(row.id)}
                                    className="text-black bg-[#37ffde] hover:bg-[#37ffde] focus:ring-4 focus:ring-[#37ffde] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#37ffde] dark:hover:bg-[#37ffde] focus:outline-none dark:focus:ring-[#37ffde]">
                                    Ajukan Rujuk
                            </button> */}
                            <button type="button"
                                id={row.id}
                                onClick={()=>oc_rujuk(row.id)}
                                    className="text-black bg-[#37ffde] hover:bg-[#37ffde] focus:ring-4 focus:ring-[#37ffde] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#37ffde] dark:hover:bg-[#37ffde] focus:outline-none dark:focus:ring-[#37ffde]">
                                    Rujuk
                            </button>
                        </div>
                    }
                    {row.status=="rujuk" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_sampai_rujuk(row.id)}
                                className="text-black mb-1 bg-[#00B3FF] hover:bg-[#00B3FF] focus:ring-4 focus:ring-[#00B3FF] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#00B3FF] dark:hover:bg-[#00B3FF] focus:outline-none dark:focus:ring-[#00B3FF]">
                                Sampai Rujuk
                        </button>
                    }
                    {row.status=="sampai rujuk" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_selesai(row.id)}
                                className="text-black mb-1 bg-[#eefa49] hover:bg-[#eefa49] focus:ring-4 focus:ring-[#eefa49] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#eefa49] dark:hover:bg-[#eefa49] focus:outline-none dark:focus:ring-[#eefa49]">
                                Selesai
                        </button>
                    }
                    {row.status=="selesai penanganan" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_bersiap_kembali(row.id)}
                                className="text-black bg-[#80fa7c] hover:bg-[#80fa7c] focus:ring-4 focus:ring-[#80fa7c] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#80fa7c] dark:hover:bg-[#80fa7c] focus:outline-none dark:focus:ring-[#80fa7c]">
                                Bersiap Kembali
                        </button>
                    }
                    {row.status=="selesai" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_catatan(row.id)}
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                Catatan
                        </button>
                    }
                    {row.status=="batal" &&
                        <div>
                            <button type="button"
                                id={row.id}
                                onClick={()=>oc_catatan(row.id)}
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                    Catatan
                            </button>
                            <button type="button"
                                id={row.id}
                                onClick={()=>oc_bersiap_kembali(row.id)}
                                    className="text-black bg-[#80fa7c] hover:bg-[#80fa7c] focus:ring-4 focus:ring-[#80fa7c] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#80fa7c] dark:hover:bg-[#80fa7c] focus:outline-none dark:focus:ring-[#80fa7c]">
                                    Bersiap Kembali
                            </button>
                        </div>
                    }
                    {row.status!="selesai" && row.status!="batal" &&
                        <button type="button"
                            id={row.id}
                            onClick={()=>oc_batal(row.id)}
                                className="text-white mt-1 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                Batal
                        </button>
                    }
                </div>
                , width:"130px"},
    ]:
    []

    const conditionalRowStyles = [
        {
          when: row => row.status.includes('belum diterima'),
          style: {
            backgroundColor: '#ff9292',
            color: 'black',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },

        {
            when: row => row.status.includes('sampai lokasi'),
            style: {
              backgroundColor: '#c76dfc',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
        },

        {
            when: row => row.status.includes('sudah diterima'),
            style: {
              backgroundColor: '#FDE68A',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
        },

        {
            when: row => row.status === 'selesai penanganan',
            style: {
              backgroundColor: '#eefa49',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
        },

        {
            when: row => row.status ==='selesai',
            style: {
              backgroundColor: '#BEF264',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
        },
        
        {
            when: row => row.status.includes('batal'),
            style: {
            backgroundColor: '#F43F5E',
            color: 'black',
            '&:hover': {
            cursor: 'pointer',
            },
        },
        },

        // {
        //     when: row => row.status=='ajukan rujuk',
        //     style: {
        //         backgroundColor: '#37ffde',
        //         color: 'black',
        //         '&:hover': {
        //         cursor: 'pointer',
        //         },
        //     },
        // },

        {
            when: row => row.status=='rujuk',
            style: {
                backgroundColor: '#37ffde',
                color: 'black',
                '&:hover': {
                cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status.includes('sampai rujuk'),
            style: {
                backgroundColor: '#00B3FF',
                color: 'black',
                '&:hover': {
                cursor: 'pointer',
                },
            },
        },

    ];

    const cari = (e) => {
        // console.log("cariii")
        // console.log(e.target.value)
        set_val_cari(e.target.value);
        set_semua_order_cari(semua_order.filter((item) =>
            (item.nama_penelepon?.toLowerCase().includes(e.target.value) || false) ||
            (item.nama_pasien?.toLowerCase().includes(e.target.value) || false)
        ));
    }

    const handleTanggalDariChange = (event) => {
        setTanggalDari(event.target.value);
    };

    const handleTanggalSampaiChange = (event) => {
        setTanggalSampai(event.target.value);
    };

    const cari_data = () => {
        console.log('Tanggal Dari:', tanggalDari);
        console.log('Tanggal Sampai:', tanggalSampai);
        axios.post(window.location.origin+'/ref_order',
            {
                tanggal_dari:tanggalDari,
                tanggal_sampai:tanggalSampai
            }).then(function (response){
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
            })
    };

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        waktu_order: new Date().toLocaleString('en-GB', {
            hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
          }).replace(",", ""),
        cara_order: '1500-132',
        no_penelepon: '',
        nama_penelepon: '',
        hubungan: '',
        nama_pasien: '',
        // umur_pasien: '',
        kasus: '',
        jenis_layanan: '',
        faskes_rujukan: '',
        kecamatan:'',
        kelurahan:'',
        nama_kecamatan:'',
        nama_kelurahan:'',
        alamat:'',
        latitude: '',
        longitude: '',
        lat_long: '',
        id_tim_ambulan: '',
        tim_ambulan: '',
        catatan:'',
    });

    const oc_data = (e) => {
        if(e.target.name=="kecamatan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_data(
                {   ...data,
                    ["kecamatan"]: option,
                });
            axios.post(window.location.origin+'/ref_kelurahan',
            {
                kode_kecamatan:option,
            }).then(function (response){
                set_semua_kelurahan(response.data)
            })
        }
        else if(e.target.name=="kelurahan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {   ...data,
                    ["kelurahan"]: option,
                });
        }
        else if(e.target.name=="tim_ambulan"){
            let id;
            let ei = document.getElementById('dl_tim_ambulan');
            for (let i = 0; i < ei.childElementCount; i++) {
                if (ei.children[i].attributes.value.value == e.target.value) {
                  id = ei.children[i].attributes.id.value;
                }
            }
            set_data(
                {   ...data,
                    ["id_tim_ambulan"]: id,
                    ["tim_ambulan"]: e.target.value,
                });
        }
        else if(e.target.name=="lat_long"){
            const val = e.target.value
            const ar_val = val.split(',')
            const lat = ar_val[0]
            const long = ar_val[1]

            set_data(
                {   ...data,
                    ["lat_long"]: val,
                    ["latitude"]: lat,
                    ["longitude"]: long,
                });
        }
        else{
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
        let cek_cara_order=true
        if(data.cara_order=="" || data.cara_order=="-"){
            cek_cara_order=false
            toast.error("pilih cara order", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_no_penelepon=true
        if (data.no_penelepon != "" && !cek_no(data.no_penelepon)) {
            cek_no_penelepon = false;
            toast.error("No penelepon harus angka tidak boleh simbol", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        if(cek_cara_order && cek_no_penelepon){
            if(edit){
                axios.post(window.location.origin+'/order/edit',
                {
                    id:data.id,
                    cara_order:data.cara_order,
                    nama_penelepon:data.nama_penelepon,
                    nama_pasien:data.nama_pasien,
                    no_penelepon:data.no_penelepon,
                    kasus:data.kasus,
                    alamat:data.alamat,
                    kecamatan:data.kecamatan,
                    kelurahan:data.kelurahan,
                    latitude:data.latitude,
                    longitude:data.longitude,
                    waktu_order:data.waktu_order,
                    id_tim_ambulan:data.id_tim_ambulan,
                }).then(function (response){
                    // console.log("data3")
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                })
                set_edit(false)
            }
            else{
                axios.post(window.location.origin+'/order/tambah',
                {
                    cara_order:data.cara_order,
                    nama_penelepon:data.nama_penelepon,
                    nama_pasien:data.nama_pasien,
                    no_penelepon:data.no_penelepon,
                    kasus:data.kasus,
                    alamat:data.alamat,
                    kecamatan:data.kecamatan,
                    kelurahan:data.kelurahan,
                    latitude:data.latitude,
                    longitude:data.longitude,
                    waktu_order:data.waktu_order,
                    id_tim_ambulan:data.id_tim_ambulan,
                }).then(function (response){
                    // console.log("data3")
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                }).catch(function (error) {
                    // Handle error
                    toast.error("Gagal tambah order", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            }

            set_null_data()
            set_modal(false)
            refresh_all_data()
        }
    }

    function get_id_ref_order(id){
        axios.post(window.location.origin+'/ref_order',
        {
            id:id,
        }).then(function (response){
            console.log("get id")
            set_data({
                ...data,
                ['id']:id,
                ['cara_order']: response.data.cara_order,
                ['no_penelepon']: response.data.no_penelepon,
                ['nama_penelepon']:response.data.nama_penelepon,
                ['nama_pasien']:response.data.nama_pasien,
                ['kasus']: response.data.kasus,
                ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
                ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
                ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
                ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
                ['alamat']:response.data.alamat,
                ['latitude']:response.data.latitude,
                ['longitude']:response.data.longitude,
                ['lat_long']:response.data.latitude+","+response.data.longitude,
                ['tim_ambulan']:response.data.tim_ambulan.nama_tim,
                ['waktu_order']:response.data.waktu_order,
                ['catatan']:response.data.catatan,
            })
            // console.log(response)
        })
    }

    function set_null_data(){
        set_data({
            ...data,
            ['id']:'',
            ['cara_order']: '',
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
        })
    }

    function kirim_lokasi(){
        navigator.geolocation.getCurrentPosition(position=>{
            const {latitude, longitude} = position.coords;
            
            axios.post(window.location.origin+'/tim_ambulan/kirim_lokasi',
            {
                latitude:latitude,
                longitude:longitude,
            }).then(function (response){
                set_koorku({
                    ...koorku,
                    ["lat"]: latitude,
                    ["lng"]: longitude,
                })
                console.log("kirim lokasi")
                console.log("lat"+latitude+" long"+longitude)
            
                // console.log(response)
                // set_semua_order(response.data)
                // set_semua_order_cari(response.data)
            })
            // kirim_lokasi(latitude, longitude)

            // console.log("tim ambulan role")
            ,(error) => console.warn(error.message),
        { enableHighAccuracy: true}
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

    function set_icon(url){
        return new L.Icon({
            iconUrl: url,
            iconSize:[35, 37],
          });
    }

    useEffect(()=>{
        set_data({
            ...data,
            ["waktu_order"]: new Date().toLocaleString('en-GB', {
                hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
              }).replace(",", "")
        })
    }, [modal])

    function x(){
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
        {text:'Belum Diterima', text2:'belum diterima', warna:'#ff9292'},
        {text:'Sudah Diterima', text2:'sudah diterima', warna:'#FDE68A'},
        {text:'Sampai Lokasi', text2:'sampai lokasi', warna:'#c76dfc'},
        {text:'Batal', text2:'batal', warna:'#F43F5E'},
        {text:'Selesai', text2:'selesai', warna:'#80fa7c'},
        {text:'Rujuk', text2:'rujuk', warna:'#37ffde'},
        {text:'Sampai Rujuk', text2:'sampai rujuk', warna:'#00B3FF'},
        {text:'Selesai Penanganan', text2:'selesai penanganan', warna:'#eefa49'},
    ];

    const warna_status = (status) => {
        const matchingStatus = warna_tim_ambulan.find(item => item.text2 == status);
        return matchingStatus ? matchingStatus.warna : '#FFFFFF'; // Default to white if no match
    };

  return (
    <div className="h-screen w-screen overflow-x-auto mt-3 relative">
        <ToastContainer />
        <div>
            <div className="flex mb-3 font-bold text-[20px]">
                <div>
                    Order Ambulan Hebat
                </div>
                <div className="ml-[50%]">
                    {nama_hari_ini+", "+day+" "+nama_bulan+" "+year}
                </div>
            </div>
            <div className="flex">
                <div>
                    <input type="text" className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari"
                        onChange={cari}></input>
                    {auth.role!="Tim Ambulan" &&
                        <button type="button"
                        onClick={(e)=>set_modal(true)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Tambah</button>
                    }
                </div>
                <div className="flex ml-3">
                    {warna_tim_ambulan.map((val, index) => (
                        <div key={index} style={{ backgroundColor: val.warna }} className="text-sm rounded-full border px-1 py-1 flex items-center justify-center">
                            {val.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex mt-3">
                <div className="mr-3">Waktu Order Tanggal Dari</div>
                <div>
                    <input
                        type="date"
                        id="tanggal_dari"
                        className="pb-0 pt-0 mr-3"
                        value={tanggalDari}
                        onChange={handleTanggalDariChange}
                    />
                </div>
                <div className="mr-3">Tanggal Sampai</div>
                <div>
                    <input
                        type="date"
                        id="tanggal_sampai"
                        className="pb-0 pt-0 mr-3"
                        value={tanggalSampai}
                        onChange={handleTanggalSampaiChange}
                    />
                </div>
                <div>
                    <button
                        onClick={cari_data} 
                        type="button"
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">
                            Cari
                    </button>
                </div>
            </div>
        </div>
        
        
        <DataTable columns={columns}
            data={semua_order_cari}
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />

        {auth.role === "admin" || auth.role === "Operator" ? (
        <>
            <div className="font-bold">Status Terakhir Tim</div>
            <div className="flex flex-wrap gap-2">
            {semua_tim_ambulan.map((val, index) => (
                val.order !== null && (
                <div
                    key={`row-${index}`}
                    style={{ backgroundColor: warna_status(val.order.status) }}
                    className={`col text-sm rounded-full border px-1 py-1 flex items-center justify-center`}
                >
                    {val.nama_tim}
                </div>
                )
            ))}
            </div>
        </>
        ) : null}

        
        {modal &&
        <div className="flex justify-center fixed top-0 right-0 left-0 ">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 fixed border-2 border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Order
                </div>
                <div className="flex justify-center">{data.waktu_order}</div>
                <div className="mt-3 text-sm">
                    <div className="flex mb-1">
                        <div className="mr-1 w-[15%]">Cara Order</div>
                        <select className="w-[30%] pb-0 pt-0 text-sm" name="cara_order" value={data.cara_order} onChange={oc_data}>
                            <option value="-">Pilih</option>
                            <option value="1500-132">1500-132</option>
                            <option value="119">119</option>
                            <option value="112">112</option>
                            <option value="WA">WA</option>
                            <option value="permintaan khusus">permintaan khusus</option>
                        </select>
                        <div className="ml-1 w-[20%]">No Penelepon</div>
                        <input className="w-[35%] text-sm p-0" type="text" name="no_penelepon" value={data.no_penelepon} onChange={oc_data} placeholder="081234543218"></input>
                    </div>
                    <div className="flex mb-1">
                        <div className="w-[15%]">Nama Penelepon</div>
                        <input className="w-[85%] text-sm p-0" type="text" name="nama_penelepon" value={data.nama_penelepon} onChange={oc_data}></input>
                    </div>
                    <div className="flex mb-1">
                        <div className="w-[15%]">Nama Pasien</div>
                        <input className="w-[85%] text-sm p-0" type="text" name="nama_pasien" value={data.nama_pasien} onChange={oc_data}></input>
                    </div>
                    <div className="flex mb-1">
                        <div className="mr-1 w-[15%]">Kasus</div>
                        <textarea className="w-[85%] text-sm"  name="kasus" value={data.kasus} onChange={oc_data}></textarea>
                    </div>
                    <div className="flex mb-1">
                        <div className="mr-1 w-[15%]">Kecamatan</div>
                        <select
                        id="id_select_kecamatan"
                        className="w-[30%] h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                        name="kecamatan"
                        onChange={oc_data}>
                        <option value="-">kecamatan</option>
                        {
                            semua_kecamatan.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan} selected={opts.kode_kecamatan==data.kecamatan}>{opts.nama_kecamatan}</option>)
                        }
                        </select>
                        <div className="ml-1 mr-1 w-[20%]">Kelurahan</div>
                        <select
                        className="w-[35%] h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                        name="kelurahan"
                        onChange={oc_data}>
                        <option value="-">Kelurahan</option>
                        {
                            semua_kelurahan.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan} selected={opts.kode_kelurahan==data.kelurahan}>{opts.nama_kelurahan}</option>)
                        }
                    </select>
                    </div>
                    <div className="flex mb-1">
                        <div className="mr-1 w-[15%]">Alamat</div>
                        <input type="text" className="w-[85%] text-sm p-0" name="alamat" value={data.alamat} onChange={oc_data}></input>
                    </div>
                    <div className="flex mb-1">
                        <div className="w-[35%]"></div>    
                        <div className="w-full">
                            <div className="mr-1">Latitude</div>
                        </div>
                        <div className="w-full">
                            <div className="mr-1 ml-1">Longitude</div>
                        </div>
                    </div>
                    <div className="flex mb-1">
                        <div className="w-[17%]"></div>
                        <input className="w-full text-sm p-0" type="text" name="lat_long" value={data.lat_long} onChange={oc_data} placeholder="-6.986802, 110.414652"></input>
                    </div>
                    <div className="flex">
                        <div className="mr-1 w-[15%]">Tim Ambulan</div>
                        <div className="w-[85%]">
                            <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                                type = "text"
                                name = "tim_ambulan"
                                value={data.tim_ambulan}
                                list="dl_tim_ambulan"
                                onChange={oc_data}
                                />
                                <datalist id="dl_tim_ambulan">
                                    {semua_tim_ambulan.map((opts,i)=><option key={i} id={opts.id} value={opts.nama_tim}>{opts.nama_tim}</option>)}
                                </datalist>
                        </div>
                    </div>
                    <div>
                    {
                        // koorku.lat && koorku.lng &&

                        data.latitude && data.longitude &&
                        <iframe src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&h1=es;&output=embed`} width="600" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    }
                    {
                        // koorku.lat && koorku.lng &&
                        data.latitude && data.longitude &&

                    <MapContainer
                    center={[-6.9806919, 110.3962768]}///simpang lima
                    zoom="11"
                    style={{width:"100%", height:"300px"}}
                    // scrollWheelZoom={false}
                    // ref={mapRef}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={[data.latitude, data.longitude]}
                            icon={set_icon("assets/img/marker-map.png")}>
                            <Popup>
                                Lokasi Pasien
                            </Popup>
                        </Marker>
                        {semua_tim_ambulan.map((value, idx) => {
                            if (value.latitude !== null && value.status=="bersiap") {
                                return (
                                    <Marker key={idx}
                                        position={[value.latitude, value.longitude]}
                                        icon={set_icon("gambar/tim_ambulan/" + value.gambar)}>
                                        <Popup>
                                            {value.nama_tim}
                                        </Popup>
                                    </Marker>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </MapContainer>
                    }
                    </div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={oc_simpan}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Simpan</button>
                </div>
            </div>
        </div>}

        {
            modal_hapus &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Anda Yakin Hapus Order?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_hapus_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            terima &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Anda Ingin Menerima Order?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_terima_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            sampai_lokasi &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Sudah Sampai Lokasi Order?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_sampai_lokasi_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            selesai &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Order Sudah Selesai?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_selesai_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            batal &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Anda Ingin Membatalkan Order?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_batal_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            catatan &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Catatan Order
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                    <div>Catatan: <input type="text" name="catatan" value={data.catatan} onChange={oc_data}></input></div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_catatan_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Anda Ingin Merujuk Order?
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">{data.waktu_order}</div>
                    <div>Nama Penelepon: {data.nama_penelepon}</div>
                    <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                    <div>Kasus: {data.kasus}</div>
                    {/* <div>Rumah Sakit: 
                        <input className="text-xxs md:text-sm sm:text-xs p-0"
                            type = "text"
                            name = "faskes_rujukan"
                            value={data.faskes_rujukan}
                            list="dl_rs"
                            onChange={oc_data}
                            />
                            <datalist id="dl_rs">
                                {semua_rs.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                            </datalist>
                    </div> */}
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_rujuk_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }
        {
            rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                    <div className="flex justify-end font-bold">
                        <button onClick={(e)=>x()}>X</button>
                    </div>
                    <div className="flex justify-center font-bold mt-2">
                        Apakah Anda Ingin Rujuk Order?
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-center">{data.waktu_order}</div>
                        <div>Nama Penelepon: {data.nama_penelepon}</div>
                        <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                        <div>Kasus: {data.kasus}</div>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button type="button"
                            onClick={()=>oc_rujuk_simpan(data.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                    </div>
                </div>
            </div>
        }
        {/* {
            ajukan_rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
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
        {
            sampai_rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                    <div className="flex justify-end font-bold">
                        <button onClick={(e)=>x()}>X</button>
                    </div>
                    <div className="flex justify-center font-bold mt-2">
                        Apakah Sudah Sampai Tempat Rujuk?
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-center">{data.waktu_order}</div>
                        <div>Nama Penelepon: {data.nama_penelepon}</div>
                        <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                        <div>Kasus: {data.kasus}</div>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button type="button"
                            onClick={()=>oc_sampai_rujuk_simpan(data.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                    </div>
                </div>
            </div>
        }
        {
            bersiap_kembali &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                    <div className="flex justify-end font-bold">
                        <button onClick={(e)=>x()}>X</button>
                    </div>
                    <div className="flex justify-center font-bold mt-2">
                        Apakah Anda Sudah Bersiap Kembali?
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-center">{data.waktu_order}</div>
                        <div>Nama Penelepon: {data.nama_penelepon}</div>
                        <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                        <div>Kasus: {data.kasus}</div>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button type="button"
                            onClick={()=>oc_bersiap_kembali_simpan(data.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                    </div>
                </div>
            </div>
        }
    </div>
  );
}
