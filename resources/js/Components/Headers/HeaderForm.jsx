import React , {useState, useEffect} from "react";
import axios from 'axios';

import HeaderLogo from "@/Components/Headers/HeaderLogo";
import { toast } from "react-toastify";

export default function HeaderForm(props) {
    const [get_data, set_data] = useState({
       nik:"",
       nama_pasien: "",
       tgl_lahir:"",
       umur:"",
       alamat:"",
       alamat_kelurahan:"",
       alamat_kecamatan:"",
       no_telepon:"",
       tgl_penanganan:new Date().toISOString().split('T')[0],
    });

    const [get_semua_kelurahan_identitas_pasien, set_semua_kelurahan_identitas_pasien] = useState([]);
    const [get_semua_kecamatan_identitas_pasien, set_semua_kecamatan_identitas_pasien] = useState([]);
    const [get_kode_kecamatan_identitas_pasien, set_kode_kecamatan_identitas_pasien] = useState([]);
    const [get_kode_kelurahan_identitas_pasien, set_kode_kelurahan_identitas_pasien] = useState([]);
    const [get_kecamatan_identitas_pasien, set_kecamatan_identitas_pasien] = useState('-');
    const [get_kelurahan_identitas_pasien, set_kelurahan_identitas_pasien] = useState('-');
    const [get_data_automatis_pasien, set_data_automatis_pasien] = useState(false);
    
    useEffect(()=>{
        axios.post(window.location.origin+'/ref_kecamatan',
        {
            // kode_kecamatan:kode_kecamatan,
        }).then(function (response){
            set_semua_kecamatan_identitas_pasien(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kecamatan:get_kode_kecamatan_identitas_pasien,
        }).then(function (response){
            set_semua_kelurahan_identitas_pasien(response.data)
            // console.log(response)
        })

        console.log(props)
        if(props.id_form_umum!=null){
            console.log("id_pasien")
            console.log(props.id_form_umum)
            
            axios.post(window.location.origin+'/ref_form_umum',
            {
                id:props.id_form_umum,
            }).then(function (response){
                // console.log("gk null pasien")
                // console.log(response)
                set_data_automatis_pasien(true)
                // console.log(get_data_automatis_pasien)
                set_data(prev_data => ({
                    ...prev_data,
                    nik: response.data.pasien.nik?response.data.pasien.nik:'',
                    nama_pasien: response.data.pasien.nama?response.data.pasien.nama:'',
                    tgl_lahir: response.data.pasien.tgl_lahir,
                    umur:response.data.pasien.tgl_lahir?hit_umur(response.data.pasien.tgl_lahir):'',
                    alamat: response.data.pasien.alamat,
                    alamat_kelurahan: response.data.pasien.alamat_kelurahan,
                    alamat_kecamatan: response.data.pasien.alamat_kecamatan,
                    no_telepon: response.data.pasien.no_telepon,
                }));
                console.log("setelah")
                console.log(get_data)

                cari_kecamatan(response.data.pasien.alamat_kecamatan)
                cari_kelurahan(response.data.pasien.alamat_kelurahan)
            })
        }
    },[])
    
    const oc_kecamatan_identitas_pasien = (e) => {
        set_kecamatan_identitas_pasien(e.target.value);
        let index = e.target.selectedIndex;
	    let el = e.target.childNodes[index]
	    let option =  el.getAttribute('id');
        set_kode_kecamatan_identitas_pasien(option);
        set_data(
            {   ...get_data,
                ["alamat_kecamatan"]: option,
            });
        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kecamatan:option,
        }).then(function (response){
            set_semua_kelurahan_identitas_pasien(response.data)
        })

    }

    const oc_kelurahan_identitas_pasien = (e) => {
        set_kelurahan_identitas_pasien(e.target.value);
        let index = e.target.selectedIndex;
	    let el = e.target.childNodes[index]
	    let option =  el.getAttribute('id');
        set_kode_kelurahan_identitas_pasien(option);
        set_data(
            {   ...get_data,
                ["alamat_kelurahan"]: option,
            });
    }

    const handleChange = (e) => {
        // console.log("oc");
        // console.log("nama_target"+e.target.value)
        // const value = e.target.value;
        var value = e.target.value;
        // var value;
        if(e.target.name=="tgl_lahir"){
            // console.log("tgl_lahir"+e.target.value);
            // console.log("umur"+hit_umur(e.target.value));
            var value_umr=hit_umur(e.target.value);
            
            set_data(
                {   ...get_data,
                    ["umur"]: value_umr,
                    ["tgl_lahir"]: e.target.value,
                });
        }
        else if(e.target.name=="nik"){
            if (!/^\d*$/.test(value) || value.length > 16) {
                return;
            }
            set_data({
                ...get_data,
                [e.target.name]: value,
            });
        }
        else{
            set_data({
                ...get_data,
                [e.target.name]: value,
            });
        }
    }

    function hit_umur(tgl_lahir){
        var formattedDate = tgl_lahir.split("-")
        // console.log("date"+formattedDate)
        var birthdateTimeStamp = new Date(formattedDate[0], (formattedDate[1]-1), formattedDate[2])
        var currentDate = new Date().getTime();
        var difference = currentDate - birthdateTimeStamp;
        var currentAge = Math.floor(difference / 31557600000)
        // dividing by 1000*60*60*24*365.25
        return currentAge
    }

    function cari_kecamatan(kode_kecamatan){
        axios.post(window.location.origin+'/ref_kecamatan',
        {
            kode_kecamatan:kode_kecamatan,
        }).then(function (response){
            set_kecamatan_identitas_pasien(response.data.nama_kecamatan)
            // console.log(response)
        })
        return get_kecamatan_identitas_pasien;
    }

    function cari_kelurahan(kode_kelurahan){
        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kelurahan:kode_kelurahan,
        }).then(function (response){
            set_kelurahan_identitas_pasien(response.data.nama_kelurahan)
            // console.log(response)
        })
        return get_kelurahan_identitas_pasien;
    }

    const [tunggu, set_tunggu] = useState(false);

    const oc_cari = ()=>{
        set_tunggu(true)
        axios.post(window.location.origin+'/cari_nik',
        {
            nik:get_data.nik,
        }).then(function (response){
            set_tunggu(false)
            // console.log("cari nik")
            // console.log(response)
            if(response.data =="Nik tidak ditemukan"){
                toast.error("nik tidak ditemukan di database", { position: toast.POSITION.TOP_RIGHT })
                set_data_automatis_pasien(false)
                set_data({
                    ...get_data,
                    ["nama_pasien"]: '',
                    ["tgl_lahir"]: '',
                    ["umur"]:'',
                    ["alamat"]: '',
                    ["alamat_kelurahan"]: '',
                    ["alamat_kecamatan"]: '',
                    ["no_telepon"]: '',

                });
                cari_kecamatan('')
                cari_kelurahan('')
            }
            else{
                set_data_automatis_pasien(true)
                set_data({
                    ...get_data,
                    ["nama_pasien"]: response.data.nama,
                    ["tgl_lahir"]: response.data.tgl_lahir,
                    ["umur"]:hit_umur(response.data.tgl_lahir),
                    ["alamat"]: response.data.alamat,
                    ["alamat_kelurahan"]: response.data.alamat_kelurahan,
                    ["alamat_kecamatan"]: response.data.alamat_kecamatan,
                    ["no_telepon"]: response.data.no_telepon,

                });
                cari_kecamatan(response.data.alamat_kecamatan)
                cari_kelurahan(response.data.alamat_kelurahan)
            }
        })
    }

    console.log("get_data_kecamata")
    console.log(get_kecamatan_identitas_pasien)

    // console.log("data pasien dari")
    // console.log(get_data)
    props.onSubmit(get_data);
    
    return (
    <>
    <div className="grid grid-cols-2 text-xs md:text-sm sm:text-xs">
        <HeaderLogo />
        <div className="mt-3 mr-3 border-solid border-2 grid grid-cols-3">
            <div >NIK</div>
            <div className="flex col-span-2 h-7">
                <div>:</div>
                {
                    props.isPrinting==false && props.id == null &&
                    <div className="flex w-full">
                        <input className="w-full text-xs md:text-sm sm:text-xs p-0"
                        type="text" 
                        name = "nik"
                        value={get_data.nik}
                        onChange={handleChange}
                        maxLength="16"
                        placeholder="nik boleh kosong"
                        />
                        <button className="w-1/6 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold rounded" 
                            type="button" onClick={oc_cari}>cari</button>
                    </div>
                }
                {
                    props.isPrinting==false && props.id != null &&
                    <div>{get_data.nik}</div>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.nik}</div>
                }
            </div>
            <div >Nama Pasien</div>
            <div className="flex col-span-2 h-7">
                <div>:</div>
                {
                    tunggu &&
                    <div>Mohon Tunggu</div>
                }
                {
                    tunggu==false && props.isPrinting==false &&
                    <input className="w-full text-xs md:text-sm sm:text-xs p-0" 
                        type="text" 
                        name = "nama_pasien"
                        value={get_data.nama_pasien}
                        onChange={handleChange}
                    />
                }
                {
                    tunggu==false && props.isPrinting &&
                    <div>{get_data.nama_pasien}</div>
                }
            </div>
            <div >Tgl Lahir / Umur</div>
            <div className="flex col-span-2 h-7">
                <div>:</div>
                {
                    props.isPrinting==false &&
                    <input className="w-full text-xs md:text-sm sm:text-xs pt-0 pb-0" 
                    type="date"
                    name = "tgl_lahir"
                    value={get_data.tgl_lahir}
                    onChange={handleChange}/>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.tgl_lahir}</div>
                }
                <div className="flex ml-1">/</div>
                {
                    props.isPrinting==false &&
                    <div id="id_umur" className="flex items-center ml-1 mr-1">{get_data.umur}</div>
                }
                {
                    props.isPrinting &&
                    <div className="ml-1">{get_data.umur}</div>
                }
            </div>
            <div className="row-span-3">Alamat</div>
            <div className="row-span-3 col-span-2">
                {
                    props.isPrinting==false &&
                    <div className="flex">
                    <div>:</div>
                    
                    <select
                        id="id_select_kecamatan"
                        className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                        onChange={oc_kecamatan_identitas_pasien}
                        value={get_kecamatan_identitas_pasien}
                        
                        // defaultValue={get_kelurahan_identitas_pasien}
                        >
                        <option value="-">kecamatan</option>
                        {
                            get_semua_kecamatan_identitas_pasien.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan}>{opts.nama_kecamatan}</option>)
                        }
                    </select>
                    
                    <select
                        className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                        onChange={oc_kelurahan_identitas_pasien}
                        // defaultValue={get_kelurahan_identitas_pasien}
                        value={get_kelurahan_identitas_pasien}
                        >
                        <option value="-">Kelurahan</option>
                        {
                            get_semua_kelurahan_identitas_pasien.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan}>{opts.nama_kelurahan}</option>)
                        }
                    </select>
                </div>
                }
                <div className="flex">
                    <div>:</div>
                    {
                    props.isPrinting==false &&
                    <textarea className="w-full text-xs md:text-sm sm:text-xs" 
                        name = "alamat"
                        value={get_data.alamat}
                        onChange={handleChange}
                    />
                    }
                    {
                    props.isPrinting &&
                    <div>{get_data.alamat} kel.{get_kelurahan_identitas_pasien} kec.{get_kecamatan_identitas_pasien}</div>
                    }
                </div>
            </div>
            <div >No. Telepon</div>
            <div className="col-span-2 h-7">
                <div className="flex">
                    <div>:</div>
                    {
                    props.isPrinting==false &&
                    <input className="w-full text-xs md:text-sm sm:text-xs p-0" 
                        type="text"
                        name = "no_telepon"
                        value={get_data.no_telepon}
                        onChange={handleChange}
                    />
                    }
                    {
                    props.isPrinting &&
                    <div>{get_data.no_telepon}</div>
                    }
                </div>
            </div>
            <div >Tgl Penanganan</div>
            <div className="col-span-2 h-7">
                <div className="flex">
                    <div>:</div>
                    {
                    props.isPrinting==false && 
                    <input className="w-full text-xs md:text-sm sm:text-xs pt-0 pb-0" 
                        type="date"
                        name = "tgl_penanganan"
                        value={get_data.tgl_penanganan}
                        onChange={handleChange}
                    />
                    }
                    {
                    props.isPrinting &&
                    <div>{get_data.tgl_penanganan}</div>
                    }
                </div>
            </div>
        </div>
        
    </div>
    </>
  );
}
