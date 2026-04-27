import React , {useState, useEffect, useRef, createRef} from "react";
import {router} from "@inertiajs/react";
import axios from 'axios';
import HeaderFormSurat from "@/Components/Headers/HeaderFormSurat";
import SignatureCanvas from 'react-signature-canvas';
import {useReactToPrint} from 'react-to-print';


export default function Form_Surat_Persetujuan_Tindakan_Medis(props) {
    const [get_yg_bertanda_tangan, set_yg_bertanda_tangan] = useState({
        nama:'',
        umur : '',
        jenis_kelamin : 'L',
        alamat:'',
        alamat_kelurahan:'-',
        alamat_kecamatan:'',
    });

    const [get_nama_kecamatan_yg_bertanda_tangan, set_nama_kecamatan_yg_bertanda_tangan] = useState('-');
    const [get_nama_kelurahan_yg_bertanda_tangan, set_nama_kelurahan_yg_bertanda_tangan] = useState('-');
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

        axios.post(window.location.origin+'/ref_kecamatan',
        {
            // kode_kecamatan:kode_kecamatan,
        }).then(function (response){
            set_semua_kecamatan_yg_telah_memberikan(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_kelurahan',
        {
            kode_kecamatan:[],
        }).then(function (response){
            set_semua_kelurahan_yg_telah_memberikan(response.data)
            // console.log(response)
        })
    },[])

    const oc_yg_bertanda_tangan = (e) => {
        const value = e.target.value;
        
        if(e.target.name=="alamat_kecamatan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_yg_bertanda_tangan(
                {   ...get_yg_bertanda_tangan,
                    ["alamat_kecamatan"]: option,
                });
            set_nama_kecamatan_yg_bertanda_tangan(value);

            //ganti kelurahan
            axios.post(window.location.origin+'/ref_kelurahan',
            {
                kode_kecamatan:option,
            }).then(function (response){
                set_semua_kelurahan(response.data)
                // console.log(response)
            })
        }
        else if(e.target.name=="alamat_kelurahan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_yg_bertanda_tangan(
                {   ...get_yg_bertanda_tangan,
                    ["alamat_kelurahan"]: option,
                });
            set_nama_kelurahan_yg_bertanda_tangan(value);
        }
        else{
            set_yg_bertanda_tangan({
                ...get_yg_bertanda_tangan,
                [e.target.name]: value,
            });
        }
        
    }

    console.log("yang bertanda tangan")
    console.log(get_yg_bertanda_tangan)

    const [get_status_surat, set_status_surat] = useState('PERSETUJUAN');
    console.log("status surat")
    console.log(get_status_surat)

    const [get_yg_telah_memberikan, set_yg_telah_memberikan] = useState({
        tindakan_medis:'',
        terhadap:'diri saya sendiri',
        nama:'',
        umur : '',
        jenis_kelamin : 'L',
        alamat:'',
        alamat_kelurahan:'-',
        alamat_kecamatan:'',
    });

    const [get_nama_kecamatan_yg_telah_memberikan, set_nama_kecamatan_yg_telah_memberikan] = useState('-');
    const [get_nama_kelurahan_yg_telah_memberikan, set_nama_kelurahan_yg_telah_memberikan] = useState('-');
    const [get_semua_kecamatan_yg_telah_memberikan, set_semua_kecamatan_yg_telah_memberikan] = useState([]);
    const [get_semua_kelurahan_yg_telah_memberikan, set_semua_kelurahan_yg_telah_memberikan] = useState([]);
    
    const oc_yg_telah_memberikan = (e) => {
        const value = e.target.value;
        
        if(e.target.name=="alamat_kecamatan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_yg_telah_memberikan(
                {   ...get_yg_telah_memberikan,
                    ["alamat_kecamatan"]: option,
                });
            set_nama_kecamatan_yg_telah_memberikan(value);

            //ganti kelurahan
            axios.post(window.location.origin+'/ref_kelurahan',
            {
                kode_kecamatan:option,
            }).then(function (response){
                set_semua_kelurahan_yg_telah_memberikan(response.data)
                // console.log(response)
            })
        }
        else if(e.target.name=="alamat_kelurahan"){
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option =  el.getAttribute('id');
            set_yg_telah_memberikan(
                {   ...get_yg_telah_memberikan,
                    ["alamat_kelurahan"]: option,
                });
            set_nama_kelurahan_yg_telah_memberikan(value);
        }
        else{
            set_yg_telah_memberikan({
                ...get_yg_telah_memberikan,
                [e.target.name]: value,
            });
        }
        
    }

    console.log("yg telah memberikan")
    console.log(get_yg_telah_memberikan)

    const [get_tambah_pernyataan, set_tambah_pernyataan] = useState([]);
    
    const ref_ttd_tambah_saksi = useRef([])

    const oc_tambah_pernyataan=(i)=>{
        const val = [...get_tambah_pernyataan, []];
        set_tambah_pernyataan(val);

        ref_ttd_tambah_saksi.current=[get_tambah_pernyataan].map(
            (ref, index) => ref_ttd_tambah_saksi.current[index] = React.createRef()
        )
    }

    const oc_value_tambah_pernyataan=(e, i)=>{
        const val = [...get_tambah_pernyataan];
        val[i]=e.target.value;
        set_tambah_pernyataan(val);
    }

    const oc_hapus_tambah_pernyataan=(i)=>{
        const val = [...get_tambah_pernyataan];
        val.splice(i);
        set_tambah_pernyataan(val);
    }

    console.log("tambah pernyataan")
    console.log(get_tambah_pernyataan);

    const [get_tgl_surat, set_tgl_surat] = useState('');

    let ref_ttd_saksi = useRef({})

    const oc_hapus_ttd_saksi = () => {
        ref_ttd_saksi.current.clear();
    }

    
    const [get_nama_ttd_saksi, set_nama_ttd_saksi] = useState('');
    const [get_ttd_dokter_paramedis, set_ttd_dokter_paramedis] = useState('Dokter');
    const [get_nama_ttd_dokter_paramedis, set_nama_ttd_dokter_paramedis] = useState('');
    // const [get_nama_ttd_yg, set_nama_ttd_saksi] = useState('');

    console.log("nama ttd saksi")
    console.log(get_nama_ttd_saksi)

    console.log("nama ttd dokter paramedis")
    console.log(get_nama_ttd_dokter_paramedis)

    const [get_nama_tambah_saksi, set_nama_tambah_saksi] = useState([]);
    
    const [get_url_ttd_tambahan_saksi, set_url_ttd_tambahan_saksi] = useState([]);
    // const ref_ttd_tambah_saksi = useRef(get_nama_tambah_saksi.map(() => createRef()));
    
    // useEffect(() => {
    //     const value = ref_ttd_tambah_saksi.current.map(
    //         ref => ref.current.getBoundingClientRect().height
    //     );
    //     set_ttd_tambahan_saksi(value);
    // }, []);

    console.log("ttd tambahan saksi");
    // console.log(get_ttd_tambahan_saksi);
    console.log(ref_ttd_tambah_saksi);

    const oc_tambah_saksi = (data) => {
        const val = [...get_nama_tambah_saksi, []];
        set_nama_tambah_saksi(val);
    }

    const oe_ttd_tambah_saksi = (i) => {
        const val = [ref_ttd_tambah_saksi.current[i].toDataURL('image/png')]
        // const val = [ref_ttd_tambah_saksi.current[i].toDataURL()]
        
        // const val = [ref_ttd_tambah_saksi.current[i].toDataURL()]
        // ref_ttd_tambah_saksi.current[i].toDataURL()
        set_url_ttd_tambahan_saksi(val);
        // ref_ttd_tambah_saksi.current[i].toDataURL('image/png');
        // ref_ttd_tambah_saksi.current[i].toDataURL();
        // console.log("get url tambah ttd")
        // console.log(get_url_ttd_tambahan_saksi)
        // ref_ttd_tambah_saksi.current[i].fromDataURL(ref_ttd_tambah_saksi.current[i].toDataURL())
        // console.log("tambahan ttd")
        // console.log(val)
    }

    const oc_value_tambah_saksi=(e, i)=>{
        const val = [...get_nama_tambah_saksi];
        val[i]=e.target.value;
        set_nama_tambah_saksi(val);
    }

    const oc_hapus_tambah_saksi=(i)=>{
        const val = [...get_nama_tambah_saksi];
        val.splice(i);
        set_nama_tambah_saksi(val);
    }

    console.log("tambah saksi")
    console.log(get_nama_tambah_saksi)

    const [get_tgl_surat_baru, set_tgl_surat_baru] = useState('');
    const oc_tgl_surat=(e)=>{
        console.log("tgl")
        var val = e.target.value;
        var hari = val.substring(8,10);
        var bulan = val.substring(5,7);
        var tahun = val.substring(0,4);
        var nama_bulan;

        if(bulan=="01"){
            nama_bulan = "Januari";
        }
        if(bulan=="02"){
            nama_bulan = "Februari";
        }
        if(bulan=="03"){
            nama_bulan = "Maret";
        }
        if(bulan=="04"){
            nama_bulan = "April";
        }
        if(bulan=="05"){
            nama_bulan = "Mei";
        }
        if(bulan=="06"){
            nama_bulan = "Juni";
        }
        if(bulan=="07"){
            nama_bulan = "Juli";
        }
        if(bulan=="08"){
            nama_bulan = "Agustus";
        }
        if(bulan=="09"){
            nama_bulan = "September";
        }
        if(bulan=="10"){
            nama_bulan = "Oktober";
        }
        if(bulan=="11"){
            nama_bulan = "November";
        }
        if(bulan=="12"){
            nama_bulan = "Desember";
        }

        set_tgl_surat(val);
        set_tgl_surat_baru(hari+" "+nama_bulan+" "+tahun);
        
        console.log(hari+nama_bulan+tahun);

    }

    
    let ref_ttd_dokter_paramedis = useRef({})

    const oc_hapus_ttd_dokter_paramedis = () => {
        ref_ttd_dokter_paramedis.current.clear();
    }

    let ref_ttd_yang_membuat_pernyataan = useRef({})

    const oc_hapus_ttd_yang_membuat_pernyataan = () => {
        ref_ttd_yang_membuat_pernyataan.current.clear();
    }

    const [isPrinting, setIsPrinting] = useState(false);
    const ref_print = useRef(null);
    const promiseResolveRef = useRef(null);
    
    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {   
            promiseResolveRef.current();
        }
    }, [isPrinting]);

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
        // console.log(get_yg_bertanda_tangan)
        // console.log(get_status_surat)
        // console.log(get_yg_telah_memberikan)
        // console.log(get_tambah_pernyataan)
        // console.log(get_tgl_surat)
        // console.log(get_nama_ttd_saksi)
        // console.log(get_nama_tambah_saksi)
        // if(get_nama_tambah_saksi.length!=0){
        //     get_nama_tambah_saksi.push(get_nama_ttd_saksi)
        // }
        // else{

        // }
        // console.log(get_nama_tambah_saksi.push(get_nama_ttd_saksi))
        // console.log(get_nama_tambah_saksi)
        // console.log(get_ttd_dokter_paramedis)
        // console.log(get_nama_ttd_dokter_paramedis)
        // console.log(get_nama_ttd_)
        router.post('/simpan_form_surat_persetujuan_tindakan_medis', {
            yg_bertanda_tangan_nama:get_yg_bertanda_tangan.nama,
            yg_bertanda_tangan_umur:get_yg_bertanda_tangan.umur,
            yg_bertanda_tangan_jenis_kelamin:get_yg_bertanda_tangan.jenis_kelamin,
            yg_bertanda_tangan_alamat:get_yg_bertanda_tangan.alamat,
            yg_bertanda_tangan_alamat_kelurahan:get_yg_bertanda_tangan.alamat_kelurahan,
            yg_bertanda_tangan_alamat_kecamatan:get_yg_bertanda_tangan.alamat_kecamatan,

            status_surat:get_status_surat,
            yg_telah_memberikan_tindakan_medis:get_yg_telah_memberikan.tindakan_medis,
            yg_telah_memberikan_terhadap:get_yg_telah_memberikan.terhadap,
            yg_telah_memberikan_nama:get_yg_telah_memberikan.nama,
            yg_telah_memberikan_umur:get_yg_telah_memberikan.umur,
            yg_telah_memberikan_jenis_kelamin:get_yg_telah_memberikan.jenis_kelamin,
            yg_telah_memberikan_alamat:get_yg_telah_memberikan.alamat,
            yg_telah_memberikan_alamat_kelurahan:get_yg_telah_memberikan.alamat_kelurahan,
            yg_telah_memberikan_alamat_kecamatan:get_yg_telah_memberikan.alamat_kecamatan,

            tambahan_pernyataan:get_tambah_pernyataan,
            tgl_surat:get_tgl_surat,

            nama_ttd_saksi:get_nama_ttd_saksi,
            nama_ttd_tambah_saksi:get_nama_tambah_saksi,
            status_ttd_dokter_paramedis:get_ttd_dokter_paramedis,
            nama_ttd_dokter_paramedis:get_nama_ttd_dokter_paramedis,

        })
        console.log(get_nama_ttd_saksi)
        console.log(get_nama_tambah_saksi)

        alert('berhasil simpan');
    }

    return (
    <div ref={ref_print}>
    <HeaderFormSurat />
    <div className="flex justify-center font-bold mt-3 mb-3">SURAT PERSETUJUAN / PENOLAKAN TINDAKAN MEDIS</div>
    <div className="ml-5 mr-5">
        <div className="mb-3">Saya yang bertanda tangan dibawah ini :</div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Nama</div>
            <div className="grid col-start-2 col-end-6">
                {
                    isPrinting==false &&
                    <input className="p-0" type="text" name="nama" value={get_yg_bertanda_tangan.nama} onChange={oc_yg_bertanda_tangan}></input>
                }
                {
                    isPrinting &&
                    <div>{get_yg_bertanda_tangan.nama}</div>
                }
                
            </div>
        </div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Umur</div>
            <div className="grid col-start-2 col-end-6">
                <div className="flex">
                {
                    isPrinting==false &&
                    <input className="p-0 w-[40px]" type="text" name="umur" value={get_yg_bertanda_tangan.umur} onChange={oc_yg_bertanda_tangan}></input>
                }
                {
                    isPrinting &&
                    <div>{get_yg_bertanda_tangan.umur}</div>
                }
                <div className="ml-1 mr-2">Tahun</div>
                <div>/ Jenis Kelamin :</div>
                {
                    isPrinting==false &&
                    <select name="jenis_kelamin" onChange={oc_yg_bertanda_tangan} value={get_yg_bertanda_tangan.jenis_kelamin} className="pt-0 pb-0">
                        <option value="L">L</option>
                        <option value="P">P</option>
                    </select>
                }
                {
                    isPrinting &&
                    <div>{get_yg_bertanda_tangan.jenis_kelamin}</div>
                }
                </div>
            </div>
        </div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Alamat</div>
            <div className="grid col-start-2 col-end-6">
                {
                isPrinting==false &&    
                <div className="flex">
                    <div>
                        <select 
                            name="alamat_kecamatan"
                            className="pt-0 pb-0" 
                            value={get_nama_kecamatan_yg_bertanda_tangan}
                            onChange={oc_yg_bertanda_tangan}>
                            <option value="-">Kecamatan</option>
                            {
                                get_semua_kecamatan.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan}>{opts.nama_kecamatan}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <select
                            name="alamat_kelurahan" 
                            className="pt-0 pb-0"
                            value={get_nama_kelurahan_yg_bertanda_tangan}
                            onChange={oc_yg_bertanda_tangan}>
                            <option value="-">Kelurahan</option>
                            {
                                get_semua_kelurahan.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan}>{opts.nama_kelurahan}</option>)
                            }
                        </select>
                    </div>
                    <input className="w-full p-0" type="text"
                        name="alamat" 
                        value={get_yg_bertanda_tangan.alamat}
                        onChange={oc_yg_bertanda_tangan}></input>
                </div>
                }
                {isPrinting &&
                    <div>{get_yg_bertanda_tangan.alamat+" kel."+get_nama_kelurahan_yg_bertanda_tangan+" kec."+get_nama_kecamatan_yg_bertanda_tangan}</div>
                }
            </div>
        </div>
        <div className="mt-1">Dengan ini menyatakan dengan sesungguhnya telah memberikan :</div>
    </div>
    <div className="flex justify-center font-bold mt-3 mb-3">
        {
            isPrinting == false &&
            <select
                // name="status_surat"
                onChange={(e)=>set_status_surat(e.target.value)}
                value={get_status_surat}>
                <option value="PERSETUJUAN">PERSETUJUAN</option>
                <option value="PENOLAKAN">PENOLAKAN</option>
            </select>
        }
        {
            isPrinting &&
            <div>{get_status_surat}</div>
        }
    </div>
    <div className="ml-5 mr-5">
        <div className="flex">
            <div className="w-[40%]">Untuk dilakukan tindakan medis berupa :</div>
            {
                isPrinting == false &&
                <div className="w-[70%]">
                    <input className="w-[100%] p-0" type="text"
                    name="tindakan_medis"
                    onChange={oc_yg_telah_memberikan}
                    value={get_yg_telah_memberikan.tindakan_medis}></input>
                </div>
            }
            {
                isPrinting &&
                <div>{get_yg_telah_memberikan.tindakan_medis}</div>
            }
        </div>
        <div className="mb-3 flex">
            <div className="mr-1">Terhadap</div>
            <div>
                {
                    isPrinting == false &&
                    <select className="pt-0 pb-0"
                        name="terhadap"
                        onChange={oc_yg_telah_memberikan}
                        value={get_yg_telah_memberikan.terhadap}>
                        <option value="diri saya sendiri">diri saya sendiri</option>
                        <option value="istri">istri</option>
                        <option value="suami">suami</option>
                        <option value="ayah">ayah</option>
                        <option value="ibu">ibu</option>
                        <option value="anak">anak</option>
                        <option value="saudara">saudara</option>
                    </select>
                }
                {
                    isPrinting &&
                    <div className="mr-1">{get_yg_telah_memberikan.terhadap}</div>
                }
            </div>
            <div>saya, dengan</div>
        </div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Nama</div>
            <div className="grid col-start-2 col-end-6">
                {
                    isPrinting == false &&
                    <input className="p-0" type="text" name="nama"
                    onChange={oc_yg_telah_memberikan}
                    value={get_yg_telah_memberikan.nama}></input>    
                }
                {
                    isPrinting &&
                    <div>{get_yg_telah_memberikan.nama}</div>
                }
            </div>
        </div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Umur</div>
            <div className="grid col-start-2 col-end-6">
                <div className="flex">
                    {
                    isPrinting == false &&
                    <input className="p-0 w-[40px]" type="text" name="umur"
                        onChange={oc_yg_telah_memberikan}
                        value={get_yg_telah_memberikan.umur}></input>
                    }
                    {
                    isPrinting &&
                    <div>{get_yg_telah_memberikan.umur}</div>
                    }
                    <div className="ml-1 mr-2">Tahun</div>
                    <div>/ Jenis Kelamin:</div>
                    {
                    isPrinting == false &&
                    <select className="pt-0 pb-0" name="jenis_kelamin"
                        onChange={oc_yg_telah_memberikan}
                        value={get_yg_telah_memberikan.jenis_kelamin}>
                        <option value="L">L</option>
                        <option value="P">P</option>
                    </select>
                    }
                    {
                    isPrinting &&
                    <div>{get_yg_telah_memberikan.jenis_kelamin}</div>
                    }
                </div>
            </div>
        </div>
        <div className="grid grid-cols-5">
            <div className="grid col-start-1 col-end-2">Alamat</div>
            <div className="grid col-start-2 col-end-6">
                {
                isPrinting == false &&
                <div className="flex">
                    <div>
                        <select
                            name="alamat_kecamatan"
                            className="pt-0 pb-0" 
                            value={get_nama_kecamatan_yg_telah_memberikan}
                            onChange={oc_yg_telah_memberikan}>
                            <option value="-">Kecamatan</option>
                            {
                                get_semua_kecamatan_yg_telah_memberikan.map((opts,i)=><option key={i}  id={opts.kode_kecamatan} value={opts.nama_kecamatan}>{opts.nama_kecamatan}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <select
                            name="alamat_kelurahan" 
                            className="pt-0 pb-0"
                            value={get_nama_kelurahan_yg_telah_memberikan}
                            onChange={oc_yg_telah_memberikan}>
                            <option value="-">Kelurahan</option>
                            {
                                get_semua_kelurahan_yg_telah_memberikan.map((opts,i)=><option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan}>{opts.nama_kelurahan}</option>)
                            }
                        </select>
                    </div>
                    <div className="w-full"><input className="w-full p-0" type="text" name="alamat"
                        onChange={oc_yg_telah_memberikan}
                        value={get_yg_telah_memberikan.alamat}></input></div>    
                </div>
                }
                {
                    isPrinting &&
                    <div>{get_yg_telah_memberikan.alamat+" kel."+get_nama_kelurahan_yg_telah_memberikan+" kec."+get_nama_kecamatan_yg_telah_memberikan}</div>
                }
            </div>
        </div>
        <div className="mt-3 mb-3">Telah menyatakan dengan sesungguhnya tanpa paksaan bahwa :</div>
        <div>
            <div className="flex">
                <div className="w-[5%]">a.</div>
                <div className="w-[95%]">Bersedia mengikuti SOP perujukan menggunakan Ambulance Hebat (tidak bisa memilih RS yang dikehendaki).</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">b.</div>
                <div className="w-[95%]">Telah diberikan informasi dan penjelasan, bahwa penggunaan ambulance transport ini hanya mengantarkan ke RS / tempat yang dituju dan petugas akan langsung pulang setelah mengantarkan.</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">c.</div>
                <div className="w-[95%]">Seluruh berkas dan keperluan di RS telah dipersiapkan oleh keluarga pasien dan menjadi tanggung jawab kami (keluarga).</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">d.</div>
                <div className="w-[95%]">Segala akibat dan resiko yang akan terjadi menjadi tanggung jawab kami (keluarga) dan kami (keluarga) bersedia untuk menunggu dirumah sakit dan tidak akan meminta petugas ambulance untuk menemani menunggu di RS.</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">e.</div>
                <div className="w-[95%]">Bersedia mengikuti protokol kesehatan yang berlaku di RS meliputi, Skrining Covid-19, tetalaksana penanganan pasien dari awal masuk sampai selesai, ruangan isolasi dan perawatan jenazah Covid-19.</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">f.</div>
                <div className="w-[95%]">Bersedia menunggu di IGD sampai batas waktu yang tidak bisa di tentukan.</div>
            </div>
            <div className="flex">
                <div className="w-[5%]">g.</div>
                <div className="w-[95%]">Telah saya pahami sepenuhnya informasi dan penjelasan yang diberikan dokter / paramedis.</div>
            </div>
            {
                isPrinting == false &&
                <div className="flex justify-center">
                    <button type="button" onClick={oc_tambah_pernyataan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        tambah
                    </button>
                </div>
            }
            {
                isPrinting == false &&
                get_tambah_pernyataan.map((data, i)=>{
                    var arr = "ghijklmnopqrstuvwxyz".split("");

                    return(
                        <div key={i+1}>
                            <div className="flex">
                                <div className="w-[5%]">{arr[i+1]}</div>
                                <textarea className="w-[90%] text-xs md:text-sm sm:text-xs" type="text" 
                                value={get_tambah_pernyataan[i]}
                                onChange={e=>oc_value_tambah_pernyataan(e,i)}></textarea>
                                <button className="w-[5%] text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded" type="button" 
                                onClick={()=>oc_hapus_tambah_pernyataan(i)}>x</button>
                            </div>
                        </div>
                    )})
            }
            {
                isPrinting &&
                get_tambah_pernyataan.map((data, i)=>{
                    var arr = "ghijklmnopqrstuvwxyz".split("");

                    return(
                        <div key={i+1}>
                            <div className="flex">
                                <div className="w-[5%]">{arr[i+1]}</div>
                                <div>{get_tambah_pernyataan[i]}</div>
                            </div>
                        </div>
                    )})
            }
        </div>
        <div className="mt-3">Pernyataan ini kami buat dengan penuh kesadaran tanpa paksaan dari pihak manapun.</div>
        <div className="flex justify-end mt-3">
            <div>Semarang,</div>
            {
                isPrinting == false &&
                <div>
                    <input className="pt-0 pb-0" type="date" value={get_tgl_surat} onChange={oc_tgl_surat}></input>
                </div>
            }
            {
                isPrinting &&
                <div className="ml-1">{get_tgl_surat_baru}</div>
            }
        </div>
        <div className="grid grid-cols-3 mt-5">
            <div className="flex justify-center">
                <div>
                    <div className="flex justify-center">Saksi-Saksi</div>
                    <div className="flex justify-center">tanda tangan</div>
                    <div className="w-full">
                        <SignatureCanvas
                            canvasProps={{className:'sigCanvas w-full h-full'} }
                            ref={ref_ttd_saksi}
                            // onEnd={oe_ttd_saksi}
                            />
                    </div>
                    <div className="flex justify-center">
                    {
                        isPrinting == false &&
                        <input className="p-0" type="text" onChange={(e)=>set_nama_ttd_saksi(e.target.value)} value={get_nama_ttd_saksi}></input>
                    }
                    {
                        isPrinting &&
                        <div>{get_nama_ttd_saksi}</div>
                    }
                    </div>
                    {
                        isPrinting == false &&    
                        <div className="flex justify-center">
                            <button type="button" 
                            onClick={oc_hapus_ttd_saksi} 
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                        </div>
                    }
                    <div className="flex justify-center">nama jelas</div>
                    {
                        isPrinting == false &&    
                        <div className="flex justify-center">
                            <button type="button" onClick={oc_tambah_saksi} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                tambah
                            </button>
                        </div>
                    }
                    {
                        isPrinting==false &&
                        get_nama_tambah_saksi.map((data, i)=>{
                            // const get_ref = (element) => (ref_ttd_tambah_saksi.current.push(element))
                            return(
                                <div key={i} className="mt-1">
                                    <div className="w-full">
                                        <SignatureCanvas
                                            canvasProps={{className:'sigCanvas w-full h-full'} }
                                            // ref={ref_ttd_tambah_saksi.current[i]}
                                            ref={(ref)=>(ref_ttd_tambah_saksi.current[i]=ref)}
                                            onEnd={()=>oe_ttd_tambah_saksi(i)}
                                            />
                                    </div>
                                    <div className="flex">
                                        <input className="w-5/6 text-xs md:text-sm sm:text-xs" type="text" 
                                        value={get_nama_tambah_saksi[i]}
                                        onChange={e=>oc_value_tambah_saksi(e,i)}></input>
                                        <button className="w-1/6 text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded" type="button" 
                                        onClick={()=>oc_hapus_tambah_saksi(i)}>x</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        isPrinting &&
                        get_nama_tambah_saksi.map((data, i)=>{
                            // console.log('ttd tambahan 2')
                            // console.log(get_url_ttd_tambahan_saksi)
                            return(
                                <div key={i} className="mt-1">
                                    <div className="w-full">
                                        {/* <SignatureCanvas
                                            // canvasProps={{className:'sigCanvas w-full h-full'} }
                                            // ref={ref_ttd_tambah_saksi.current[i]}
                                            // value={i}
                                            // ref={get_url_ttd_tambahan_saksi[i]}
                                            
                                            // ref={(ref)=>(ref_ttd_tambah_saksi.current[i]=ref)}
                                            // onEnd={oe_ttd_saksi}
                                            /> */}
                                            <img src={get_url_ttd_tambahan_saksi[i]}></img>
                                    </div>
                                    <div className="flex justify-center">
                                        {get_nama_tambah_saksi[i]}
                                    </div>
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
            <div className="flex justify-center">
                <div>
                    <div className="flex justify-center">
                        {
                            isPrinting == false &&
                            <select className="pt-0 pb-0"
                                onChange={(e)=>set_ttd_dokter_paramedis(e.target.value)}
                                value={get_ttd_dokter_paramedis}>
                                <option value="Dokter">Dokter</option>
                                <option value="Paramedis">Paramedis</option>
                            </select>
                        }
                        {
                            isPrinting &&
                            <div>{get_ttd_dokter_paramedis}</div>
                        }
                        
                    </div>
                    <div className="flex justify-center">tanda tangan</div>
                    <div className="w-full">
                        <SignatureCanvas
                            canvasProps={{className:'sigCanvas w-full h-full'} }
                            ref={ref_ttd_dokter_paramedis}
                            // onEnd={oe_ttd_saksi}
                            />
                    </div>
                    <div className="flex justify-center">
                        {
                            isPrinting == false &&
                            <input className="p-0" type="text" value={get_nama_ttd_dokter_paramedis} onChange={(e)=>set_nama_ttd_dokter_paramedis(e.target.value)}></input>    
                        }
                        {
                            isPrinting &&
                            <div>{get_nama_ttd_dokter_paramedis}</div>
                        }
                    </div>
                    {
                        isPrinting == false &&    
                        <div className="flex justify-center">
                            <button type="button" 
                            onClick={oc_hapus_ttd_dokter_paramedis} 
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                        </div>
                    }
                </div>
            </div>
            <div className="flex justify-center">
                <div>
                    <div className="flex justify-center">Yang membuat pernyataan</div>
                    <div className="flex justify-center">tanda tangan</div>
                    <div className="w-full">
                        <SignatureCanvas
                            canvasProps={{className:'sigCanvas w-full h-full'} }
                            ref={ref_ttd_yang_membuat_pernyataan}
                            // onEnd={oe_ttd_saksi}
                            />
                    </div>
                    <div className="flex justify-center">
                        {/* <input className="p-0" type="text"></input> */}
                        {get_yg_bertanda_tangan.nama}
                    </div>
                    {
                        isPrinting == false &&    
                        <div className="flex justify-center">
                            <button type="button" 
                            onClick={oc_hapus_ttd_yang_membuat_pernyataan} 
                            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                        </div>
                    }
                </div>
            </div>
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
    </div>
    );
}