import React , {useState, useEffect} from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import {router} from "@inertiajs/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Pasien() {
    const [semua_pasien, set_semua_pasien] = useState([]);
    const [semua_pasien2, set_semua_pasien2] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [edit, set_edit] = useState(false);

    useEffect(()=>{
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

    }, [])

    const oc_hapus = (id) =>{
        // router.post('/hapus_petugas', {
        //     id:id,
        // })
        set_modal_hapus(true)

        axios.post(window.location.origin+'/ref_pasien',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['nik']: response.data.nik,
                ['nama']: response.data.nama,
                ['no_telepon']: response.data.no_telepon,
                ['alamat_domisili']: response.data.alamat,
                ['kecamatan']: response.data.alamat_kecamatan,
                ['kelurahan']: response.data.alamat_kelurahan,
                ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
                ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
                ['tgl_lahir']: response.data.tgl_lahir,
                ['jenis_kelamin']: response.data.jenis_kelamin,
                ['status']: response.data.status,
                ['tgl_meninggal']: response.data.tgl_meninggal,
            })

            set_null_data()
            refresh_semua_data()
            console.log(response)
        })
    }

    const oc_hapus_simpan = (id) =>{
        console.log("hpaus id")
        console.log(id)
        // router.post('/pasien/hapus', {
        //     id:id,
        // })
        axios.post(window.location.origin+'/pasien/hapus',
        {
            id:id,
        }).then(function (response){
            // console.log(response)
            toast.success(response.data, {
                position: toast.POSITION.TOP_RIGHT,
            });
        })

        set_modal_hapus(false)
        set_null_data()
        refresh_semua_data()
    }

    const oc_edit = (id) =>{
        console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin+'/ref_pasien',
        {
            id:id,
        }).then(function (response){
            set_data({
                ...data,
                ['id']:id,
                ['nik']: response.data.nik,
                ['nama']: response.data.nama,
                ['no_telepon']: response.data.no_telepon,
                ['alamat_domisili']: response.data.alamat,
                ['kecamatan']: response.data.alamat_kecamatan,
                ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
                ['kelurahan']: response.data.alamat_kelurahan,
                ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
                ['tgl_lahir']: response.data.tgl_lahir,
                ['jenis_kelamin']: response.data.jenis_kelamin,
                ['status']: response.data.status,
                ['tgl_meninggal']: response.data.tgl_meninggal,
            })
            console.log(response)

            set_null_data()
            refresh_semua_data()
        })
        // console.log("hapus"+id);
    }

    function hit_umur(tgl_lahir, tgl_meninggal){
        var formattedDate = tgl_lahir.split("-")
        // console.log("date"+formattedDate)
        var birthdateTimeStamp = new Date(formattedDate[0], (formattedDate[1]-1), formattedDate[2])
        if(tgl_meninggal!=null){
            var split_tgl_meninggal = tgl_meninggal.split("-")
            var tgl_meninggal = new Date(split_tgl_meninggal[0], (split_tgl_meninggal[1]-1), split_tgl_meninggal[2])
        
            var difference = tgl_meninggal - birthdateTimeStamp;
        }
        else{
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
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        {name:'NIK', selector:(row)=>row.nik, width:"170px"},
        {name:'Nama', selector:(row)=>row.nama, width:"170px"},
        {name:'No Telepon', selector:(row)=>row.no_telepon, width:"130px"},
        {name:'Tgl Lahir', selector:(row)=>row.tgl_lahir?row.tgl_lahir.substring(8,10)+"/"+row.tgl_lahir.substring(5,7)+"/"+row.tgl_lahir.substring(0,4):"", width:"130px"},
        {name:'Jenis Kelamin', selector:(row)=>row.jenis_kelamin, width:"110px"},
        {name:'Usia', selector:(row)=>row.tgl_lahir?hit_umur(row.tgl_lahir, row.tgl_meninggal):"", width:"130px"},
        // {name:'Alamat', selector:(row)=>(row.alamat?row.alamat:"")+(row.ref_kelurahan?" kel. "+row.ref_kelurahan.nama_kelurahan:"")+(row.ref_kecamatan?" kec. "+row.ref_kecamatan.nama_kecamatan:""), width:"410px"},
        {name:'Alamat', cell:(row)=>(row.alamat?row.alamat:"")+(row.ref_kelurahan?" kel. "+row.ref_kelurahan.nama_kelurahan:"")+(row.ref_kecamatan?" kec. "+row.ref_kecamatan.nama_kecamatan:""), width:"410px"},
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
    ]

    const cari = (e) => {
        set_semua_pasien2(semua_pasien.filter((item) =>
            item.nama.toLowerCase().includes(e.target.value) ||
            // item.tanggung_jawab.toLowerCase().includes(e.target.value) ||
            item.status.toLowerCase().includes(e.target.value)
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
        if(e.target.name=="kecamatan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {   ...data,
                    ["kecamatan"]: option,
                    ["nama_kecamatan"]: e.target.value
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
                    ["nama_kelurahan"]: e.target.value
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

    const oc_tambah_simpan = (e) => {
        console.log(data)

        if(edit){
            console.log("edit3")
            axios.post(window.location.origin+'/pasien/edit',
            {
                id:data.id,
                nik:data.nik,
                nama:data.nama,
                no_telepon:data.no_telepon,
                alamat_domisili:data.alamat_domisili,
                kelurahan:data.kelurahan,
                kecamatan:data.kecamatan,
                tgl_lahir:data.tgl_lahir,
                jenis_kelamin:data.jenis_kelamin,
                status:data.status,
                tgl_meninggal:data.tgl_meninggal,
            }).then(function (response){
                console.log("data3")
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(response)
            })
            set_edit(false)
        }
        else{
            axios.post(window.location.origin+'/pasien/tambah',
            {
                nik:data.nik,
                nama:data.nama,
                no_telepon:data.no_telepon,
                alamat_domisili:data.alamat_domisili,
                alamat_kelurahan:data.kelurahan,
                alamat_kecamatan:data.kecamatan,
                tgl_lahir:data.tgl_lahir,
                jenis_kelamin:data.jenis_kelamin,
                status:data.status,
                tgl_meninggal:data.tgl_meninggal,
            }).then(function (response){
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.log(response)
            })
        }


        set_modal(false)
        // alert("berhasil disimpan")
        set_null_data()

        refresh_semua_data()
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

    function refresh_semua_data(){
        axios.post(window.location.origin+'/ref_pasien',
        {
            // tanggung_jawab:'Dokter',
        }).then(function (response){
            // set_semua_pasien(response.data)
            set_semua_pasien(response.data)
            set_semua_pasien2(response.data)
            console.log(response)
        })
    }

    console.log(data);

  return (
    <div className="h-screen w-screen overflow-y-auto mt-3 relative">
        <ToastContainer />

        <div className="mb-3 font-bold text-[20px]">Pasien</div>
        <div className="flex">
            <input type="text" className="text-[16px] pb-0 pt-0 mr-3" placeholder="Cari"
            onChange={cari}></input>
            {/* <button>Tambah</button> */}
            <button type="button"
            onClick={(e)=>set_modal(true)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Tambah</button>
        </div>

        <DataTable columns={columns}
        data={semua_pasien2}
            pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles} />

        {modal &&
        <div className="flex justify-center fixed top-[5%] left-0 right-0">
            <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500 overflow-y-auto relative">
                <div className="flex justify-end font-bold">
                    <button onClick={(e)=>x()}>X</button>
                </div>
                <div className="flex justify-center font-bold mt-2">
                    {edit ? 'Edit':'Tambah'} Pasien
                </div>
                <div className="mt-3">
                    <div className="text-sm">NIK</div>
                    <input type="text" name="nik" className="p-0 w-[100%]" value={data.nik} onChange={oc_data}></input>
                    <div className="text-sm">Nama</div>
                    <input type="text" name="nama" className="p-0 w-[100%]" value={data.nama} onChange={oc_data}></input>
                    <div className="text-sm">No Telepon</div>
                    <input type="text" name="no_telepon" className="p-0 w-[100%]" value={data.no_telepon} onChange={oc_data}></input>
                    <div className="text-sm">Tgl Lahir</div>
                    <input type="date" name="tgl_lahir" className="p-0 w-[100%]" value={data.tgl_lahir} onChange={oc_data}></input>
                    <div className="text-sm">Jenis Kelamin</div>
                    <select name="jenis_kelamin" className="pt-0 pb-0 w-[100%] text-sm" value={data.jenis_kelamin} onChange={oc_data}>
                        <option value="-">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                    <div className="text-sm">Alamat Domisili</div>
                    <input type="text" name="alamat_domisili" className="p-0 w-[100%]" value={data.alamat_domisili} onChange={oc_data}></input>
                    <div className="text-sm">Kecamatan</div>
                    <select id="id_select_kecamatan" className="w-[100%] h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0" name="kecamatan" onChange={oc_data}>
                        <option value="-">kecamatan</option>
                        {
                            semua_kecamatan.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan} selected={opts.kode_kecamatan==data.kecamatan}>{opts.nama_kecamatan}</option>)
                        }
                    </select>
                    <div className="text-sm">Kelurahan</div>
                    <select className="w-[100%] h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0" name="kelurahan" onChange={oc_data}>
                        <option value="-">Kelurahan</option>
                        {
                            semua_kelurahan.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan} selected={opts.kode_kelurahan==data.kelurahan}>{opts.nama_kelurahan}</option>)
                        }
                    </select>
                    <div className="text-sm">Status</div>
                    <select name="status" className="pt-0 pb-0 w-[100%] text-sm" value={data.status} onChange={oc_data}>
                        <option value="-">Pilih</option>
                        <option value="hidup">hidup</option>
                        <option value="meninggal">meninggal</option>
                    </select>
                    {
                        data.status=="meninggal" &&
                        <div>
                            <div className="text-sm">Tgl Meninggal</div>
                            <input type="date" name="tgl_meninggal" className="p-0 w-[100%]" value={data.tgl_meninggal} onChange={oc_data}></input>
                        </div>
                    }
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
                    Apakah Anda Yakin Hapus Pasien
                </div>
                <div className="mt-3">
                    <div>Nama: {data.nama}</div>
                    <div>NIK: {data.nik}</div>
                    <div>No Telepon: {data.no_telepon}</div>
                    <div>Alamat Domisili: {data.alamat_domisili}</div>
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
