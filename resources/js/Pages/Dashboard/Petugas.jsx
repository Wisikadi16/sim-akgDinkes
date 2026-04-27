import React , {useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";

export default function Petugas() {    
    const [semua_petugas, set_semua_petugas] = useState([]);
    const [semua_petugas2, set_semua_petugas2] = useState([]);
    
    const [edit, set_edit] = useState(false);

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_petugas',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_petugas(response.data)
            set_semua_petugas2(response.data)
            console.log(response)
        })
    }, [])

    const oc_hapus = (id) =>{
        // router.post('/hapus_petugas', {
        //     id:id,
        // })
        set_modal_hapus(true)

        axios.post(window.location.origin+'/ref_petugas',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['nama']: response.data.nama,
                ['tanggung_jawab']: response.data.tanggung_jawab,
                ['status']: response.data.status,
            })
            console.log(response)
        })
    }

    const oc_hapus_simpan = (id) =>{
        console.log("hpaus id")
        console.log(id)
        router.post('/hapus_petugas', {
            id:id,
        })

        set_modal_hapus(false)

        axios.post(window.location.origin+'/ref_petugas',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_petugas(response.data)
            set_semua_petugas2(response.data)
            console.log(response)
        })
    }

    const oc_edit = (id) =>{
        console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin+'/ref_petugas',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['nama']: response.data.nama,
                ['tanggung_jawab']: response.data.tanggung_jawab,
                ['status']: response.data.status,
            })
            console.log(response)
        })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    // console.log("page"+page)

    const columns = [
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Nama', selector:(row)=>row.nama, width:"250px"},
        {name:'Tanggung Jawab', selector:(row)=>row.tanggung_jawab, width:"140px"},
        {name:'Status', selector:(row)=>row.status},
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
        {
          when: row => row.tanggung_jawab.includes('Driver'),
          style: {
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
        
        {
          when: row => row.tanggung_jawab.includes('Dokter'),
        //   style: row => ({
        //     // backgroundColor: row.phone.startsWith('9') || row.phone.startsWith('1') ? 'pink' : 'inerit',
        //   }),
          style: {
            backgroundColor: 'blue',
            color: 'white',
            '&:hover': {
              cursor: 'pointer',
            },
          },
        },
    ];

    const cari = (e) => {
        set_semua_petugas2(semua_petugas.filter((item) => 
            item.nama.toLowerCase().includes(e.target.value) ||
            item.tanggung_jawab.toLowerCase().includes(e.target.value) ||
            item.status.toLowerCase().includes(e.target.value)
            ))
    }
    
    const [modal, set_modal] = useState(false);
    
    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nama : '',
        tanggung_jawab: '',
        status: '',
    });

    const oc_tambah = (e) => {
        // console.log("oc");
        const value = e.target.value;
        set_data({
            ...data,
            [e.target.name]: value,
        })
    }

    const oc_tambah_simpan = (e) => {
        console.log(data)

        if(edit){
            router.post('/edit_simpan_petugas', {
                id:data.id,
                nama:data.nama,
                tanggung_jawab:data.tanggung_jawab,
                status:data.status,
            })
            set_edit(false)
        }
        else{
            router.post('/tambah_simpan_petugas', {
                nama:data.nama,
                tanggung_jawab:data.tanggung_jawab,
                status:data.status,
            })
        }

        set_modal(false)
        alert("berhasil disimpan")

        axios.post(window.location.origin+'/ref_petugas',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_petugas(response.data)
            set_semua_petugas2(response.data)
            console.log(response)
        })
    }

    function x(){
        set_modal(false)
        if(edit){
            set_edit(false)
        }
        if(modal_hapus){
            set_modal_hapus(false)
        }
        set_data({
            ...data,
            ['id']:'',
            ['nama']: '',
            ['tanggung_jawab']: '',
            ['status']: '',
        })
    }

    console.log(data);
    
  return (
    <div className="h-screen w-screen overflow-y-auto mt-3 relative">
        <div className="mb-3 font-bold text-[20px]">Petugas Ambulan Hebat</div>
        <div className="flex">
            <input type="text" className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari" 
            onChange={cari}></input>
            {/* <button>Tambah</button> */}
            <button type="button" 
            onClick={(e)=>set_modal(true)} 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Tambah</button> 
        </div>

        <DataTable columns={columns} data={semua_petugas2} 
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />
        
        {modal && 
        <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Petugas Ambulan
                </div>
                <div className="mt-3">
                    <div>Nama</div>
                    <input type="text" name="nama" value={set_edit?data.nama:''} onChange={oc_tambah}></input>
                    <div>Tanggung Jawab</div>
                    <select name="tanggung_jawab" value={set_edit?data.tanggung_jawab:''} onChange={oc_tambah}>
                        <option value="-">Pilih</option>
                        <option value="Bidan">Bidan</option>
                        <option value="Dokter">Dokter</option>
                        <option value="Driver">Driver</option>
                        <option value="Operator">Operator</option>
                        <option value="Perawat">Perawat</option>
                    </select>
                    <div>Status</div>
                    <select name="status" value={set_edit?data.status:''} onChange={oc_tambah}>
                        <option value="-">Pilih</option>
                        <option value="aktif">aktif</option>
                        <option value="tidak aktif">tidak aktif</option>
                    </select>
                    {/* <input type="text" name="tanggung_jawab" onChange={oc_tambah}></input> */}
                </div>
                <div className="mt-2 flex justify-center">
                    <button type="button" 
                        onClick={oc_tambah_simpan}
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
                    Apakah Anda Yakin Hapus Petugas Ambulan
                </div>
                <div className="mt-3">
                    <div>Nama: {data.nama}</div>
                    <div>Tanggung Jawab: {data.tanggung_jawab}</div>
                    <div>Status: {data.status}</div>
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
