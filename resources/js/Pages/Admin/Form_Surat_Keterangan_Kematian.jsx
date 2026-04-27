import React , {useState, useEffect, useRef, createRef} from "react";
import HeaderFormSurat from "@/Components/Headers/HeaderFormSurat";
import SignatureCanvas from 'react-signature-canvas';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import {useReactToPrint} from 'react-to-print';
import {router} from "@inertiajs/react";

export default function Form_Surat_Keterangan_Kematian(props) {
    const [nomor_surat, set_nomor_surat] = useState({
        no_1:'',
        no_2 : '',
        no_3 : '',
    });

    const oc_nomor_surat = (e) => {
        const value = e.target.value;
        
        set_nomor_surat({
            ...nomor_surat,
            [e.target.name]: value,
        });
    }

    console.log(nomor_surat)

    const [jam_meninggal, set_jam_meninggal] = React.useState(dayjs(new Date));

    const [identitas, set_identitas] = useState({
        nama :'',
        tempat_lahir : '',
        tgl_lahir : '',
        umur: '',
        jenis_kelamin: 'L',
        agama: '',
        alamat: '',
        alamat_kelurahan: '',
        alamat_kecamatan: '',
        tgl_meninggal: '',
        hari_meninggal: '',
        jam_meninggal: ((JSON.stringify(jam_meninggal.$H)).length==1?"0"+jam_meninggal.$H:jam_meninggal.$H)+":"
        +((JSON.stringify(jam_meninggal.$m)).length==1?"0"+jam_meninggal.$m:jam_meninggal.$m),
        // jam:React.useState(dayjs(new Date)),
        tgl_surat:'',
        nama_ttd_dokter:'',
    });

    const [get_nama_kecamatan, set_nama_kecamatan] = useState('-');
    const [get_nama_kelurahan, set_nama_kelurahan] = useState('-');
    const [get_semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [get_semua_kelurahan, set_semua_kelurahan] = useState([]);
    
    useEffect(()=>{
        axios.post(window.location.origin+'/ref_kecamatan',
        {
            // kode_kecamatan:kode_kecamatan,
        }).then(function (response){
            set_semua_kecamatan(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kecamatan:[],
        }).then(function (response){
            set_semua_kelurahan(response.data)
            // console.log(response)
        })
    },[])

    const oc_identitas = (e) => {     
        if(e.$H!=null){
            var jam = JSON.stringify(e.$H);
            if(jam.length==1){
            jam = "0"+jam;
            }
            var menit = JSON.stringify(e.$m);
            if(menit.length==1){
            menit = "0"+menit;
            }

            set_identitas({
              ...identitas,
              ["jam_meninggal"]: jam+":"+menit,
            });
        }
        else if(e.target.name=="alamat_kecamatan"){
            const value = e.target.value;
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_identitas(
                {   ...identitas,
                    ["alamat_kecamatan"]: option,
                });
            set_nama_kecamatan(value);

            //ganti kelurahan
            axios.post(window.location.origin+'/ref_kelurahan',
            {
                kode_kecamatan:option,
            }).then(function (response){
                set_semua_kelurahan(response.data)
                // console.log(response)
            })
        }
        else if(e.target.name=="tgl_lahir"){
            const value = e.target.value;
            set_identitas(
                {   ...identitas,
                    ["umur"]: hit_umur(value),
                    [e.target.name]: value,
                });
        }
        else if(e.target.name=="alamat_kelurahan"){
            const value = e.target.value;
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_identitas(
                {   ...identitas,
                    ["alamat_kelurahan"]: option,
                });
            set_nama_kelurahan(value);
        }
        else if(e.target.name=="tgl_meninggal"){ 
            const value = e.target.value;           
            var nama_hari = [
                "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
            ];

            set_identitas({
                ...identitas,
                [e.target.name]: value,
                ["hari_meninggal"]:nama_hari[new Date(value).getDay()],
            });
        }
        else{
            const value = e.target.value;
            set_identitas({
                ...identitas,
                [e.target.name]: value,
            });
        }
    }

    console.log(identitas)

    let ref_ttd_dokter_ambulan = useRef({})

    const oc_hapus_ttd_dokter_ambulan = () =>{
        // get_ttd_keluarga_pasien_petugas_rs.clear();
        ref_ttd_dokter_ambulan.current.clear();
    }

    const [isPrinting, setIsPrinting] = useState(false);
    const ref_print = useRef(null);
    const promiseResolveRef = useRef(null);
    
    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {   
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    function hit_umur(tgl_lahir){
        var formattedDate = tgl_lahir.split("-")
        console.log("date"+formattedDate)
        var birthdateTimeStamp = new Date(formattedDate[0], (formattedDate[1]-1), formattedDate[2])
        var currentDate = new Date().getTime();
        var difference = currentDate - birthdateTimeStamp;
        var currentAge = Math.floor(difference / 31557600000)
        // dividing by 1000*60*60*24*365.25
        return currentAge
    }

    const oc_print = useReactToPrint({
        content: () => ref_print.current,
        // documentTitle: 'emp-data',
        onBeforeGetContent: () => {
            return new Promise((resolve)=>{
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint:()=>setIsPrinting(false)
    })

    const oc_simpan = (e) => {
        console.log(e.preventDefault());

        router.post('/simpan_form_surat_keterangan_kematian', {
            no_surat_1:nomor_surat.no_1,
            no_surat_2:nomor_surat.no_2,
            no_surat_3:nomor_surat.no_3,
            nama:identitas.nama,
            tempat_lahir:identitas.tempat_lahir,
            tgl_lahir:identitas.tgl_lahir,
            jenis_kelamin:identitas.jenis_kelamin,
            agama:identitas.agama,
            alamat:identitas.alamat,
            alamat_kelurahan:identitas.alamat_kelurahan,
            alamat_kecamatan:identitas.alamat_kecamatan,
            tgl_meninggal:identitas.tgl_meninggal,
            jam_meninggal:identitas.jam_meninggal,
            tgl_surat:identitas.tgl_surat,
            nama_ttd_dokter:identitas.nama_ttd_dokter,
        })

        alert('berhasil simpan')

    }

    return (
        <div ref={ref_print}>
            <HeaderFormSurat />
            <div className="flex justify-center font-bold text-[20px] underline mt-3">SURAT KETERANGAN KEMATIAN</div>
            <div className="flex justify-center mb-3">
                <div>Nomor :</div>
                <div className="w-[20px] h-[20px]">
                    {
                        isPrinting == false &&
                        <input className="w-full h-full p-0" name="no_1" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_1}></input>
                    }
                    {
                        isPrinting &&
                        <div>{nomor_surat.no_1}</div>
                    }
                </div>
                <div>/ ADM</div>
                <div className="ml-1 mr-1">/ AH /</div>
                <div className="w-[20px] h-[20px]">
                    {
                        isPrinting == false &&
                        <input className="w-full h-full p-0" name="no_2" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_2}></input>    
                    }
                    {
                        isPrinting &&
                        <div>{nomor_surat.no_2}</div>
                    }
                </div>
                <div className="ml-1 mr-1">/</div>
                <div className="w-[20px] h-[20px]">
                    {
                        isPrinting == false &&
                        <input className="w-full h-full p-0" name="no_3" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_3}></input>
                    }
                    {
                        isPrinting &&
                        <div>{nomor_surat.no_3}</div>
                    }
                </div>
            </div>
            <div className="ml-5 mr-5">
                <div>Yang bertanda tangan dibawah ini, Dokter Ambulance Hebat Dinas Kesehatan Kota Semarang menerangkan dengan sebenarnya bahwa :</div>
                <div className="ml-3">
                    <div className="flex">
                        <div className="w-[25%]">Nama</div>
                        <div>:</div>
                        <div className="w-[75%]">
                            {
                                isPrinting == false &&
                                <input type="text" className="w-full p-0" name="nama" onChange={oc_identitas} value={identitas.nama}></input>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.nama}</div>
                            }
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Tempat / Tanggal Lahir</div>
                        <div>:</div>
                        {
                            isPrinting == false &&                        
                            <div className="w-[20%]">
                                <input type="text" className="w-full p-0" name="tempat_lahir" onChange={oc_identitas} value={identitas.tempat_lahir}></input>
                            </div>
                        }
                        {
                            isPrinting &&
                            <div>{identitas.tempat_lahir}</div>
                        }
                        {
                            isPrinting == false &&
                            <div className="w-[20%]">
                               <input type="date" className="w-full p-0" name="tgl_lahir" onChange={oc_identitas} value={identitas.tgl_lahir}></input>
                            </div>
                        }
                        {
                            isPrinting &&
                            <div className="ml-2">/ {identitas.tgl_lahir}</div>
                        }
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Umur</div>
                        <div>:</div>
                        <div className="flex w-[75%]">
                            <div>{identitas.umur}</div>
                            <div className="ml-1">Tahun</div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Jenis Kelamin</div>
                        <div>:</div>
                        <div className="w-[75%]">
                            {
                                isPrinting == false &&
                                <select className="pt-0 pb-0" name="jenis_kelamin" onChange={oc_identitas} value={identitas.jenis_kelamin}>
                                    <option value="L">L</option>
                                    <option value="P">P</option>
                                </select>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.jenis_kelamin}</div>
                            }
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Agama</div>
                        <div>:</div>
                        <div className="w-[75%]">
                            {
                                isPrinting == false &&
                                <input type="text" className="w-full p-0" name="agama" onChange={oc_identitas} value={identitas.agama}></input>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.agama}</div>
                            }
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Alamat</div>
                        <div>:</div>
                        {
                            isPrinting == false &&
                            <div className="w-[20%]">               
                                <select 
                                    name="alamat_kecamatan"
                                    className="pt-0 pb-0" 
                                    value={get_nama_kecamatan}
                                    onChange={oc_identitas}>
                                    <option value="-">Kecamatan</option>
                                    {
                                        get_semua_kecamatan.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan}>{opts.nama_kecamatan}</option>)
                                    }
                                </select>
                            </div>
                        }
                        {
                            isPrinting == false &&
                            <div className="w-[20%]">
                                <select
                                    name="alamat_kelurahan" 
                                    className="pt-0 pb-0"
                                    value={get_nama_kelurahan}
                                    onChange={oc_identitas}>
                                    <option value="-">Kelurahan</option>
                                    {
                                        get_semua_kelurahan.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan}>{opts.nama_kelurahan}</option>)
                                    }
                                </select>
                            </div>
                        }
                        {
                            isPrinting == false &&
                            <div className="w-[35%]">
                                <input type="text" className="w-full p-0" name="alamat" onChange={oc_identitas} value={identitas.alamat}></input>
                            </div>
                        }
                        {
                            isPrinting &&
                            <div>{identitas.alamat+" kel. "+get_nama_kelurahan+" kec. "+get_nama_kecamatan}</div>
                        }
                    </div>
                </div>
                <div className="mt-3">
                    Telah meninggal dunia pada :
                </div>
                <div className="ml-3">
                    <div className="flex">
                        <div className="w-[25%]">Hari / Tanggal</div>
                        <div>:</div>
                        <div className="w-[7%]">
                            {identitas.hari_meninggal}
                        </div>
                        <div className="w-[68%]">
                            {
                                isPrinting == false &&
                                <input type="date" className="w-full p-0"  name="tgl_meninggal" onChange={oc_identitas} value={identitas.tgl_meninggal}></input>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.tgl_meninggal.slice(8,10)+"/"+identitas.tgl_meninggal.slice(5,7)+"/"+identitas.tgl_meninggal.slice(0,4)}</div>
                            }
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-[25%]">Pukul</div>
                        <div>:</div>
                        <div className="w-[75%]">
                            {
                                isPrinting == false &&
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileTimePicker 
                                    value={jam_meninggal}
                                    // name="jam_meninggal"
                                    onChange={oc_identitas} ampm={false} />
                                </LocalizationProvider>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.jam_meninggal}</div>
                            }
                            
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    Demikian Surat Keterangan Kematian ini dibuat dengan sebenarnya-benarnya dan digunakan sebagaimana mestinya.
                </div>
                <div className="flex justify-end mt-3">
                    <div>Semarang,</div>
                    <div>
                        {
                            isPrinting == false &&
                            <input type="date" className="p-0" name="tgl_surat" onChange={oc_identitas} value={identitas.tgl_surat}></input>
                        }
                        {
                            isPrinting &&
                            <div>{identitas.tgl_surat.slice(8,10)+"/"+identitas.tgl_surat.slice(5,7)+"/"+identitas.tgl_surat.slice(0,4)}</div>
                        }
                    </div>
                </div>
                <div className="flex justify-end mt-3">
                    <div>
                        <div className="flex justify-center">
                        Dokter Ambulance Hebat
                        </div>
                        <div>
                            <SignatureCanvas
                            canvasProps={{className:'sigCanvas w-full h-full'} }
                            ref={ref_ttd_dokter_ambulan}
                            // onEnd={oe_ttd_saksi}
                            />
                        </div>
                        <div>
                            {
                                isPrinting == false &&
                                <input type="text" className="w-full p-0" name="nama_ttd_dokter" onChange={oc_identitas} value={identitas.nama_ttd_dokter}></input>
                            }
                            {
                                isPrinting &&
                                <div className="flex justify-center">{identitas.nama_ttd_dokter}</div>
                            }
                        </div>
                        {
                            isPrinting == false &&
                            <div className="flex justify-center">
                                <button type="button" 
                                onClick={oc_hapus_ttd_dokter_ambulan} 
                                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div>

            </div>
            {
                isPrinting == false &&
                <div className="flex justify-center mt-5 ">
                    <button type="button" onClick={oc_simpan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Simpan
                    </button>
                    <button type="button" onClick={oc_print} className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Print
                    </button>
                </div>
            }
        </div>
    )
}