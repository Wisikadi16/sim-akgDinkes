import React , {useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Catatan_Medis({auth}) {
    const [semua_catatan_medis, set_semua_catatan_medis] = useState([]);
    const [semua_catatan_medis_cari, set_semua_catatan_medis_cari] = useState([]);

    const [edit, set_edit] = useState(false);

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_catatan_medis',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_catatan_medis(response.data)
            set_semua_catatan_medis_cari(response.data)
            console.log(response)
        })
    }, [])

    const oc_hapus = (id) =>{
        // router.post('/hapus_admin', {
        //     id:id,
        // })
        console.log("hapus id")
        console.log(id)

        axios.post(window.location.origin+'/ref_catatan_medis',
        {
            id:id,
        }).then(function (response){
            // set_semua_petugas(response.data)
            // set_semua_admin(response.data)
            // set_semua_admin_cari(response.data)
            set_data(prev_data => ({
                ...prev_data,
                id: response.data.id,
                nik_pasien: response.data.pasien.nik,
                nama_pasien: response.data.nama?response.data.pasien.nama:'',
                tgl_penanganan: response.data.tgl_penanganan,
                jenis_form: response.data.jenis,
            }));
            console.log(response)
        })

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) =>{
        console.log("hpaus id")
        console.log(id)
        axios.post(window.location.origin+'/form/hapus',
        {
            id:id,
        }).then(function (response){
            toast.success(response.data, {
                position: toast.POSITION.TOP_RIGHT,
            });
            
        }).catch(function (error) {
            toast.error("Data gagal dihapus", {
                position: toast.POSITION.TOP_RIGHT,
            });
        });

        refresh_all_data()
        set_null_data()
        set_modal_hapus(false)
    }

    const [page, set_page] = useState([0]);

    const columns = [
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Tanggal', selector:(row)=>row.tgl_penanganan.substring(8,10)+"/"+row.tgl_penanganan.substring(5,7)+"/"+row.tgl_penanganan.substring(0,4), width:"140px"},
        {name:'NIK Pasien', selector:(row)=>row.pasien.nik, width:"200px"},
        {name:'Nama Pasien', selector:(row)=>row.pasien.nama, width:"250px"},
        auth.role=="Admin"?{name:'Tim Ambulan', selector:(row)=>row.tim_ambulan, width:"140px"}:'',
        {name:'Jenis Form', selector:(row)=>row.jenis, width:"190px"},
        {name:'Action', cell:(row)=>
                <div>
                    <button type="button"
                        id={row.id}
                        onClick={()=>oc_hapus(row.id)}
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                            Hapus
                        </button>
                    <a href={"/"+row.jenis.replace(" ", "_")+"/"+row.id_form}>
                    
                        <button type="button"
                            id={row.id}
                            // onClick={()=>oc_edit(row.id)}
                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800">
                                Edit
                        </button>
                    </a>
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
        console.log(e.target.value)
        console.log(semua_admin)
        set_semua_admin_cari(semua_admin.filter((item) =>
            item.name.toLowerCase().includes(e.target.value)
            ||
            item.username.toLowerCase().includes(e.target.value)
            // ||
            // item.role.includes(e.target.value)
            ))
    }

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nik_pasien: '',
        nama_pasien: '',
        tgl_penanganan: '',
        jenis_form: '',
    });

    function refresh_all_data(){
        axios.post(window.location.origin+'/ref_catatan_medis').then(function (response){
            set_semua_catatan_medis(response.data)
            set_semua_catatan_medis_cari(response.data)
        })
    }

    function set_null_data(){
        set_data(prev_data => ({
            ...prev_data,
            id:'',
            nama_pasien:'',
            tgl_penanganan: '',
            jenis_form:'',
        }));
    }

    function x(){
        set_modal_hapus(false)

        set_null_data()
    }

    console.log(edit);
    console.log(data)

  return (
    <div className="h-screen w-screen overflow-y-auto mt-3 relative">
        <ToastContainer />
        <div className="mb-3 font-bold text-[20px]">Catatan Medis</div>
        <div className="flex">
            <input type="text" className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari"
            onChange={cari}></input>
            {/* <button>Tambah</button> */}
            <button type="button"
            onClick={(e)=>set_modal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Tambah</button>
        </div>

        <DataTable columns={columns}
         data={semua_catatan_medis_cari}
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />
        {modal &&
        <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>set_modal(false)}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Catatan Medis
                </div>
                <div className="mt-3">
                    <div className="flex justify-center">
                        <Link to="/form_umum"
                            className="mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Form Umum
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <Link to="/form_maternal"
                            className="mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Form Maternal
                        </Link>
                        {/* <button type="button"
                            // onClick={oc_simpan}
                            className="block mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Form Maternal
                        </button> */}
                    </div>

                    <div className="flex justify-center">
                        <button type="button"
                        // onClick={oc_simpan}
                            className="block mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Form CM Maternal
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <Link to="/form_neonatal"
                            className="block mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Form Neonatal
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Link to="/form_surat_keterangan_kematian"
                            className="block mb-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Form Surat Keterangan Kematian
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Link to="/form_surat_persetujuan_tindakan_medis"
                            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Form Surat Persetujuan Tindakan Medis
                        </Link>
                    </div>
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
                    Apakah Anda Yakin Hapus Form
                </div>
                <div className="mt-3">
                    <div>Tanggal Penanganan: {data.tgl_penanganan}</div>
                    <div>NIK: {data.nik_pasien}</div>
                    <div>Nama: {data.nama_pasien}</div>
                    <div>Jenis Form: {data.jenis_form}</div>
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
