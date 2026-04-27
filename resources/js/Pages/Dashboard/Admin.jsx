import React , {useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";

export default function Admin() {
    const [semua_admin, set_semua_admin] = useState([]);
    const [semua_admin_cari, set_semua_admin_cari] = useState([]);
    
    const [edit, set_edit] = useState(false);

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_admin',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_admin(response.data)
            set_semua_admin_cari(response.data)
            console.log(response)
        })
    }, [])

    const oc_hapus = (id) =>{
        axios.post(window.location.origin+'/ref_admin',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['nama']: response.data.name,
                ['username']: response.data.username,
                ['role']: response.data.role,
            })
            // console.log(response)
        })

        set_modal_hapus(true)

        // console.log("hapus"+id);
    }

    const oc_hapus_simpan = (id) =>{
        // console.log("hpaus id")
        console.log(id)
        router.post('/hapus_admin', {
            id:id,
        })

        axios.post(window.location.origin+'/ref_admin',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_admin(response.data)
            set_semua_admin_cari(response.data)
            console.log(response)
        })

        set_modal_hapus(false)
    }

    const oc_edit = (id) =>{
        // console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin+'/ref_admin',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
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
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'Nama', selector:(row)=>row.name, width:"250px"},
        {name:'Username', selector:(row)=>row.username, width:"250px"},
        {name:'Role', selector:(row)=>row.role, width:"140px"},
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
        if(edit){
            router.post('/edit_simpan_admin', {
                id:data.id,
                nama:data.nama,
                username:data.username,
                password:data.password,
                role:data.role,
            })
            set_edit(false)
        }
        else{
            router.post('/tambah_simpan_admin', {
                nama:data.nama,
                username:data.username,
                password:data.password,
                role:data.role,
            })
        }

        set_modal(false)
        alert("berhasil disimpan")

        axios.post(window.location.origin+'/ref_admin',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_petugas(response.data)
            set_semua_admin(response.data)
            set_semua_admin_cari(response.data)
            console.log(response)
        })
	
	set_null_data()
    }

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
            ['nama']: '',
            ['username']: '',
	    ['password']: '',
            ['role']: '',
        })
    }
    console.log(edit);
    console.log(data)
    
  return (
    <div className="h-screen w-screen overflow-y-auto mt-3 relative">
        <div className="mb-3 font-bold text-[20px]">Admin Ambulan Hebat</div>
        <div className="flex">
            <input type="text" className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari" 
            onChange={cari}></input>
            {/* <button>Tambah</button> */}
            <button type="button" 
            onClick={(e)=>set_modal(true)} 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Tambah</button> 
        </div>

        <DataTable columns={columns} data={semua_admin_cari} 
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />
        
        {modal && 
        <div className="flex justify-center fixed top-[25%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Admin
                </div>
                <div className="mt-3">
                    <div>Nama</div>
                    <input type="text" name="nama" value={data.nama} onChange={oc_data}></input>
                    <div>Username</div>
                    <input type="text" name="username" value={data.username} onChange={oc_data}></input>
                    <div>Password</div>
                    <input type="text" name="password" value={data.password} onChange={oc_data}></input>
                    <div>Role</div>
                    <select name="role" value={data.role} onChange={oc_data}>
                        <option value="-">Pilih</option>
                        <option value="Admin">Admin</option>
                        <option value="Bidan">Bidan</option>
                        <option value="Dokter">Dokter</option>
                        <option value="Driver">Driver</option>
                        <option value="Operator">Operator</option>
                        <option value="Perawat">Perawat</option>
                        <option value="Tim Ambulan">Tim Ambulan</option>
                    </select>
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
                    Apakah Anda Yakin Hapus Petugas Ambulan
                </div>
                <div className="mt-3">
                    <div>Nama: {data.nama}</div>
                    <div>Username: {data.username}</div>
                    <div>Role: {data.role}</div>
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
