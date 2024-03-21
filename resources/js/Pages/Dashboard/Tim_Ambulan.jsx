import React , {useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from 'leaflet';

import { MapContainer, TileLayer, useMap , Marker, Popup} from 'react-leaflet'

export default function Tim_Ambulan() {
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_ambulan_cari, set_semua_ambulan_cari] = useState([]);

    const [edit, set_edit] = useState(false);

    const [val_cari, set_val_cari] = useState('');

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_tim_ambulan',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_tim_ambulan(response.data)
            set_semua_ambulan_cari(response.data)
            console.log(response)
        })
    }, [])

    useEffect(()=>{
        const invtime = setInterval(() => {
            if(!val_cari){
                // set_val_cari('');
                // axios.post(window.location.origin+'/ref_order',
                axios.post(window.location.origin+'/ref_tim_ambulan',
                {
                    // tanggung_jawab:'Dokter',
                }).then(function (response){
                    // set_semua_petugas(response.data)
                    set_semua_tim_ambulan(response.data)
                    set_semua_ambulan_cari(response.data)
                    console.log(response)
                })
            }

        }, 10000)

        return () => {
            clearInterval(invtime);
        };

    // },[])
    },[val_cari])

    const oc_hapus = (id) =>{
        // router.post('/hapus_tim_ambulan', {
        //     id:id,
        // })
        console.log(id)
        console.log("ochapus");
        set_modal_hapus(true)

        axios.post(window.location.origin+'/ref_tim_ambulan',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['id_admin']:response.data.user.id,
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

    const oc_hapus_simpan = (id) =>{
        console.log("id")
        console.log(id)
        router.post('/hapus_tim_ambulan', {
            id:id,
        })
        set_modal_hapus(false)

        axios.post(window.location.origin+'/ref_tim_ambulan',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_tim_ambulan(response.data)
            set_semua_ambulan_cari(response.data)
            console.log(response)
        })

        set_null_data()
    }

    const oc_edit = (id) =>{
        // console.log("edit"+id)
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin+'/ref_tim_ambulan',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['id_admin']:response.data.user? response.data.user.id:'',
                ['gambar']: response.data.gambar,
                ['nama_tim']: response.data.nama_tim,
                ['homebase']: response.data.homebase,
                ['longitude']: response.data.longitude,
                ['latitude']: response.data.latitude,
                ['username_admin']: response.data.user? response.data.user.username:'',
                ['status']: response.data.status,
                ['idk_navara']:response.data.idk_navara,
                ['id_assets_navara']:response.data.id_assets_navara,
                ['jenis_bb']:response.data.jenis_bb,
                ['masa_berlaku_stnk']:response.data.masa_berlaku_stnk,
                ['merk']:response.data.merk,
                ['no_mesin']:response.data.no_mesin,
                ['no_polisi']:response.data.no_polisi,
                ['no_rangka']:response.data.no_rangka,
                ['no_stnk']:response.data.no_stnk,
                ['tahun_perolehan']:response.data.tahun_perolehan,
                ['tipe']:response.data.tipe,
            })
            // console.log("editt"+id)
            // console.log(response)
        })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    const columns = [
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Gambar', selector:(row)=>
            <img src={row.gambar!=null ? "/gambar/tim_ambulan/"+row.gambar:''}></img>
            , width:"130px"},
        {name:'Nama Tim', selector:(row)=>row.nama_tim, width:"190px"},
        {name:'Homebase', selector:(row)=>row.homebase, width:"170px"},
        {name:'Merk', selector:(row)=>row.merk, width:"190px"},
        {name:'Tipe', selector:(row)=>row.tipe, width:"190px"},
        {name:'No Polisi', selector:(row)=>row.no_polisi, width:"190px"}, 
        {name:'Latitude', selector:(row)=>row.latitude, width:"150px"},
        {name:'Longitude', selector:(row)=>row.longitude, width:"150px"},
        {name:'Status', selector:(row)=>row.status, width:"130px"},
        {name:'Action', cell:(row)=>
                <div>
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
        // console.log(e.target.value)
        // console.log(semua_admin)
        set_val_cari(e.target.value);

        set_semua_ambulan_cari(semua_tim_ambulan.filter((item) =>
            item.nama_tim.toLowerCase().includes(e.target.value)
            // ||
            // item.username.toLowerCase().includes(e.target.value)
            // ||
            // item.role.includes(e.target.value)
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
        if(e.target.name=="gambar"||e.target.name=="gambar_baru"){
            const value = e.target.files[0];
            // console.log(value);
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
        else{
            const value = e.target.value;
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
    }

    const oc_simpan = (e) => {
        console.log(data)
        if(edit){
            axios.post(window.location.origin+'/tim_ambulan/edit',
            {
                id:data.id,
                gambar:data.gambar,
                gambar_baru:data.gambar_baru,
                id_admin:data.id_admin,
                nama_tim:data.nama_tim,
                homebase:data.homebase,
                longitude:data.longitude,
                latitude:data.latitude,
                status:data.status,
            },
            { 
                headers: {
                'Content-Type': 'multipart/form-data',
                }
            }).then(function (response){
                // console.log("update")
                // console.log(response)
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // console.log(response)
            })

            set_edit(false)
        }
        else{
            // console.log("tambah")
            router.post('/tambah_simpan_tim_ambulan', {
                gambar:data.gambar,
                id_admin:data.id_admin,
                nama_tim:data.nama_tim,
                longitude:data.longitude,
                latitude:data.latitude,
                status:data.status,
            })

            toast.success("Berhasil tambah data", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }


        set_modal(false)
        // alert("berhasil disimpan")


        axios.post(window.location.origin+'/ref_tim_ambulan',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_tim_ambulan(response.data)
            set_semua_ambulan_cari(response.data)
            console.log(response)
        })

        set_null_data()
    }

    const oc_cari_username_admin = () => {
        // console.log(data.username_admin)
        axios.post(window.location.origin+'/ref_username_admin',
        {
            username:data.username_admin,
        }).then(function (response){
            if(response.data==""){
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
            else{
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

    function set_icon(url){
        return new L.Icon({
            iconUrl: url,
            iconSize:[35, 37],
          });
    }

    const warna_tim_ambulan = [
        {text2:'belum diterima', warna:'#ff9292'},
        {text2:'sudah diterima', warna:'#FDE68A'},
        {text2:'sampai lokasi', warna:'#c76dfc'},
        {text2:'batal', warna:'#F43F5E'},
        {text2:'selesai', warna:'#80fa7c'},
        {text2:'rujuk', warna:'#37ffde'},
        {text2:'sampai rujuk', warna:'#00B3FF'},
        {text2:'selesai penanganan', warna:'#eefa49'},
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

    function x(){
        set_modal(false)
        if(edit){
            set_edit(false)
        }
        if(modal_hapus){
            set_modal_hapus(false)
        }

        set_null_data()
    }

    function set_null_data(){
        set_data({
            ...data,
            ['id']:'',
            ['id_admin']:'',
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
    <div className="h-screen w-screen overflow-y-auto mt-3 relative">
        <ToastContainer />

        <div className="mb-3 font-bold text-[20px]">Tim Ambulan Hebat</div>
            <MapContainer
                center={[-6.9806919, 110.3962768]}///simpang lima
                zoom="11"
                style={{width:"100%", height:"300px", zIndex:0}}
                >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                    {semua_tim_ambulan.map((value, idx) => {
                        if (value.latitude !== null) {
                            return (
                                <Marker key={idx}
                                    position={[value.latitude, value.longitude]}
                                    // icon={set_icon("gambar/tim_ambulan/" + value.gambar)}>
                                    icon={createCustomIcon("gambar/tim_ambulan/" + value.gambar, value.order?warna_status(value.order.status):warna_status("batal"))}>
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
        <div className="flex">
            <input type="text" 
                className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari"
                onChange={cari}></input>
            {/* <button type="button"
                onClick={(e)=>set_modal(true)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Tambah
            </button> */}
        </div>

        <DataTable columns={columns} data={semua_ambulan_cari}
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />

        {modal &&
        <div className="flex justify-center fixed top-0 left-0 right-0 z-10">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border-2 border-red-500 max-h-screen overflow-y-auto">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Tim Ambulan
                </div>
                <div className="mt-3">
                    {
                        edit &&
                        <div className="flex justify-center">
                            <img src={data.gambar?"/gambar/tim_ambulan/"+data.gambar:''} className="w-[90px]"></img>
                        </div>

                    }
                    <div className="text-sm">Gambar</div>
                    <input type="file" name={edit? 'gambar_baru':'gambar'}
                         onChange={oc_data}></input>
                    <div className="text-sm">Username Admin</div>
                    <div className="flex w-full">
                        <input type="text" name="username_admin" className="text-sm m-0 px-2 py-1 w-[80%]" value={edit?data.username_admin:''} onChange={oc_data}></input>
                        <button className="text-sm m-0 w-[20%] bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                                type="button"
                                onClick={oc_cari_username_admin}>cari</button>
                    </div>
                    <div className="text-sm">Nama Tim</div>
                    <input type="text" name="nama_tim" className="text-sm m-0 px-2 py-1 w-[100%]" value={data.nama_tim} onChange={oc_data}></input>
                    <div className="text-sm">Homebase</div>
                    <input type="text" name="homebase" className="text-sm m-0 px-2 py-1 w-[100%]" value={data.homebase} onChange={oc_data}></input>
                    <div className="flex w-full">
                        <div className="w-[50%]">
                            <div className="text-sm">Latitude</div>
                            <input type="text" name="latitude" className="text-sm m-0 px-2 py-1 w-full" value={data.latitude} onChange={oc_data}></input>
                        </div>
                        <div className="w-[50%]">
                            <div className="text-sm">Longitude</div>
                            <input type="text" name="longitude" className="text-sm m-0 px-2 py-1 w-full" value={data.longitude} onChange={oc_data}></input>
                        </div>
                    </div>
                    <div className="text-sm">Status</div>
                    <select name="status" className="text-sm m-0 w-full" value={data.status} onChange={oc_data}>
                        <option value="-">Pilih</option>
                        <option value="bersiap" selected={data.status=="bersiap"}>Bersiap</option>
                        <option value="non aktif" selected={data.status=="non aktif"}>Non Aktif</option>
                        <option value="sedang berjalan" selected={data.status=="sedang berjalan"}>Sedang Berjalan</option>
                    </select>
                    <div>ID Assets Navara</div>
                    <input type="text" className="text-sm m-0 bg-gray-100 px-2 py-1 border border-gray-300 rounded w-full" readOnly value={data.id_assets_navara}></input>
                    <div className="flex w-[100%]">
                        <div className="w-[50%]">
                            <div>Merk</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.merk}></input>
                        </div>
                        <div className="w-[50%]">
                            <div>Tipe</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.tipe}></input>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-[50%]">
                            <div>No Mesin</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.no_mesin}></input>
                        </div>
                        <div className="w-[50%]">
                            <div>No Polisi</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.no_polisi}></input>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="w-[50%]">
                            <div>No Rangka</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.no_rangka}></input>
                        </div>
                        <div className="w-[50%]">
                            <div>Jenis Bensin</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.jenis_bb}></input>
                        </div>
                    </div>
                    <div className="flex">
                        <div>
                            <div>No STNK</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.no_stnk}></input>
                        </div>
                        <div>
                            <div>Masa Berlaku STNK</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.masa_berlaku_stnk}></input>
                        </div>
                        <div>
                            <div>Tahun Perolehan</div>
                            <input type="text" className="text-sm m-0 w-full bg-gray-100 px-2 py-1 border border-gray-300 rounded" readOnly value={data.tahun_perolehan}></input>
                        </div>
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
            <div className="bg-white pt-2 pb-7 pl-7 pr-7">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    Apakah Anda Yakin Hapus Tim Ambulan
                </div>
                <div className="mt-3">
                    <div>Nama Tim: {data.nama_tim}</div>
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button"
                        onClick={()=>oc_hapus_simpan(data.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                </div>
                </div>
            </div>
        }

    </div>
  );
}
