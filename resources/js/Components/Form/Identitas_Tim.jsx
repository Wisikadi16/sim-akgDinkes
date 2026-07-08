import React , {useState, useEffect} from "react";
import axios from 'axios';

export default function Identitas_Tim(props) {
    console.log("identitas tim aaaa")
    // console.log(auth)
    // console.log(props.auth)
    console.log(props)

    const [get_data, set_data] = useState({
        id: "",
        // tim: props.auth.role=="Tim Ambulan"?props.auth.name:"",
        tim: "",
        dokter:"",
        perawat:"",
        bidan:"",
        nakes_1:"", 
        nakes_2:"", 
        driver:"",
    });

    const [get_semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [get_semua_tim_dokter, set_semua_tim_dokter] = useState([]);
    const [get_semua_tim_perawat, set_semua_tim_perawat] = useState([]);
    const [get_semua_tim_bidan, set_semua_tim_bidan] = useState([]);
    const [get_semua_tim_driver, set_semua_tim_driver] = useState([]);
    const [get_semua_tim_nakes, set_semua_tim_nakes] = useState([]); 

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_tim_ambulan',
        // axios.post(window.location.origin+'/ref_tim_ambulan',
        ).then(function (response){
            set_semua_tim_ambulan(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_petugas_tanggung_jawab',
        {
            tanggung_jawab:'Dokter',
        }).then(function (response){
            set_semua_tim_dokter(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_petugas_tanggung_jawab',
        {
            tanggung_jawab:'Perawat',
        }).then(function (response){
            set_semua_tim_perawat(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_petugas_tanggung_jawab',
        {
            tanggung_jawab:'Bidan',
        }).then(function (response){
            set_semua_tim_bidan(response.data)
            // console.log(response)
        })

        axios.post(window.location.origin+'/ref_petugas_tanggung_jawab',
        {
            tanggung_jawab:'Driver',
        }).then(function (response){
            set_semua_tim_driver(response.data)
            // console.log(response)
        })
        
        axios.post(window.location.origin + '/ref_petugas_tanggung_jawab',
        {
            tanggung_jawab: 'Nakes', 
        }).then(function (response) {
            set_semua_tim_nakes(response.data);
        });
        
        // if(props.auth.role=="Tim Ambulan"){
        //     const cari = get_semua_tim_ambulan.find((opts) => opts.nama_tim === props.auth.name);

        //     console.log("cari tim")
        //     console.log(cari)
        //     set_data(prev_data => ({
        //         ...prev_data,
        //         id: cari ? cari.id : "",
        //         tim: props.auth.name,
        //     }));
        // }
        // if(props.id!=null){
        //     axios.post(window.location.origin+'/ref_form_umum',
        //     {
        //         id:props.id,
        //     }).then(function (response){
        //         set_data(prev_data => ({
        //             ...prev_data,
        //             dokter: response.data.ita_dokter,
        //             perawat: response.data.ita_perawat,
        //             bidan: response.data.ita_bidan,
        //             driver: response.data.ita_driver,
        //         }));
        //     })  
        // }
        console.log("props");
        console.log(props);
        
    // }, [])
    }, [])
    
    useEffect(()=>{
        if(props.auth && props.auth.role=="Tim Ambulan"){
            const cari = get_semua_tim_ambulan.find((opts) => opts.nama_tim === props.auth.name);

            console.log("cari tim")
            console.log(cari)
            set_data(prev_data => ({
                ...prev_data,
                id: cari ? cari.id : "",
                tim: props.auth.name,
            }));
        }
    }, [get_semua_tim_ambulan]);
    
    useEffect(()=>{
        if(props.id_form!=null){
            axios.post(window.location.origin+'/ref_form',
            {
                id:props.id_form,
            }).then(function (response){
                console.log("response form")
                console.log(response)
                var jenis = response.data.jenis
                jenis = jenis.replace(" ", '_');
                
                set_data(prev_data => ({
                    ...prev_data,
                    id: response.data?.id_tim_ambulan,
                    tim: response.data[jenis]?.ita_tim,
                    dokter: response.data[jenis]?.ita_dokter,
                    perawat: response.data[jenis]?.ita_perawat,
                    bidan: response.data[jenis]?.ita_bidan,
                    nakes_1: response.data[jenis]?.ita_nakes_1, 
                    nakes_2: response.data[jenis]?.ita_nakes_2, 
                    driver: response.data[jenis]?.ita_driver,
                }));
            })
        }    
    }, [props.id_form]);

    /* PREFILL DARI DATA YANG SUDAH DIMUAT INDUK (ROBUST, TIDAK BERGANTUNG PADA /ref_form)
       Sebelumnya, komponen ini HANYA mengandalkan fetch internal ke endpoint generik
       '/ref_form' di atas berdasarkan id_form. Masalahnya, setiap form induk (Neonatal,
       Umum, Maternal, CM DOA) SUDAH memuat data tim ambulans yang tersimpan lewat endpoint
       masing-masing yang sudah terbukti benar, tapi data itu tidak pernah dikirim ke sini.
       Jadi field Tim/Dokter/Nakes 1/Nakes 2/Driver selalu kosong dulu saat form dibuka
       untuk edit. Di sini kita terima data itu lewat prop `initialData` dan
       menggabungkannya ke get_data HANYA SEKALI (dijaga oleh ref), supaya tidak
       menimpa input yang sedang diketik user maupun memicu loop render. */
   const sudahIsiAwal = React.useRef(false);
    useEffect(() => {
        if (props.initialData && !sudahIsiAwal.current) {
            const adaIsinya = Object.values(props.initialData).some(
                (v) => v !== undefined && v !== null && v !== ""
            );
            if (adaIsinya) {
                sudahIsiAwal.current = true;
                set_data((prev_data) => ({
                    ...prev_data,
                    tim: props.initialData.tim || "",
                    dokter: props.initialData.dokter || "",
                    perawat: props.initialData.perawat || "",
                    bidan: props.initialData.bidan || "",
                    driver: props.initialData.driver || "",
                    nakes_1: props.initialData.nakes_1 || "",
                    nakes_2: props.initialData.nakes_2 || "", 
                }));
            }
        }
    }, [props.initialData]);

    const handleChange = (e) => {
        // console.log("oc");
        // console.log("nama_target"+e.target.value)
        const value = e.target.value;
        
        if(e.target.name=="tim"){
            const cari = get_semua_tim_ambulan.find((opts) => opts.nama_tim === value);

            console.log("id tim ambulan")
            // console.log(cari.id)
            set_data({
                ...get_data,
                ["id"]: cari ? cari.id : "",
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

    useEffect(() => {
        if (props.onSubmit) {
            props.onSubmit(get_data);
        }
    }, [get_data]);

    console.log("get data tim ambulan")
    console.log(get_data)

    return (
    <>
        <div className="ml-3 mr-3 mb-3 border-solid border border-black p-2 bg-gray-50 flex flex-wrap gap-x-4 gap-y-2 items-center text-xs md:text-sm print:border-none print:p-0 print:bg-transparent">
            {/* DATALIST GABUNGAN (PASTI MUNCUL) */}
            <datalist id="dl_tim_nakes">
                {get_semua_tim_perawat.map((opts,i)=><option key={'p'+i} value={opts.nama}>{opts.nama} (Perawat)</option>)}
                {get_semua_tim_bidan.map((opts,i)=><option key={'b'+i} value={opts.nama}>{opts.nama} (Bidan)</option>)}
                {get_semua_tim_nakes.map((opts,i)=><option key={'n'+i} value={opts.nama}>{opts.nama}</option>)}
            </datalist>

            <div className="flex items-center flex-1 min-w-[140px]">
                <span className="font-bold mr-2 whitespace-nowrap">Tim:</span>
                {
                    props.isPrinting == false ?
                    <div className="flex-1">
                        <input className="w-full border-b border-gray-400 bg-transparent focus:ring-0 p-0 text-xs md:text-sm outline-none"
                            type="text"
                            name="tim"
                            value={get_data.tim}
                            list="dl_tim_ambulan"
                            onChange={handleChange} 
                        />
                        <datalist id="dl_tim_ambulan">
                            {get_semua_tim_ambulan.map((opts,i)=><option key={i} id={opts.id} value={opts.nama_tim}>{opts.nama_tim}</option>)}
                        </datalist>
                    </div>
                    :
                    <div className="flex-1 font-bold border-b border-dotted border-black">{get_data.tim || "\u00A0"}</div>
                }
            </div>
            
            <div className="flex items-center flex-1 min-w-[140px]">
                <span className="font-bold mr-2 whitespace-nowrap">Dokter:</span>
                {
                    props.isPrinting == false ?
                    <div className="flex-1">
                        <input className="w-full border-b border-gray-400 bg-transparent focus:ring-0 p-0 text-xs md:text-sm outline-none"
                            type="text"
                            name="dokter"
                            value={get_data.dokter}
                            list="dl_tim_dokter"
                            onChange={handleChange} 
                        />
                        <datalist id="dl_tim_dokter">
                            {get_semua_tim_dokter.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                        </datalist>
                    </div>
                    :
                    <div className="flex-1 font-bold border-b border-dotted border-black">{get_data.dokter || "\u00A0"}</div>
                }
            </div>
            
            <div className="flex items-center flex-1 min-w-[140px]">
                <span className="font-bold mr-2 whitespace-nowrap">Nakes 1:</span>
                {
                    props.isPrinting == false ?
                    <div className="flex-1">
                        <input className="w-full border-b border-gray-400 bg-transparent focus:ring-0 p-0 text-xs md:text-sm outline-none"
                            type="text"
                            name="nakes_1" 
                            value={get_data.nakes_1} 
                            list="dl_tim_nakes" 
                            onChange={handleChange} 
                        />
                    </div>
                    :
                    <div className="flex-1 font-bold border-b border-dotted border-black">{get_data.nakes_1 || "\u00A0"}</div>
                }
            </div>
            
            <div className="flex items-center flex-1 min-w-[140px]">
                <span className="font-bold mr-2 whitespace-nowrap">Nakes 2:</span>
                {
                    props.isPrinting == false ?
                    <div className="flex-1">
                        <input className="w-full border-b border-gray-400 bg-transparent focus:ring-0 p-0 text-xs md:text-sm outline-none"
                            type="text"
                            name="nakes_2" 
                            value={get_data.nakes_2} 
                            onChange={handleChange}
                            list="dl_tim_nakes" 
                        />
                    </div>
                    :
                    <div className="flex-1 font-bold border-b border-dotted border-black">{get_data.nakes_2 || "\u00A0"}</div>
                }
            </div>
            
            <div className="flex items-center flex-1 min-w-[140px]">
                <span className="font-bold mr-2 whitespace-nowrap">Driver:</span>
                {
                    props.isPrinting == false ?
                    <div className="flex-1">
                        <input className="w-full border-b border-gray-400 bg-transparent focus:ring-0 p-0 text-xs md:text-sm outline-none"
                            type="text"
                            name="driver"
                            value={get_data.driver}
                            onChange={handleChange}
                            list="dl_tim_driver" 
                        />
                        <datalist id="dl_tim_driver">
                            {get_semua_tim_driver.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                        </datalist>
                    </div>
                    :
                    <div className="flex-1 font-bold border-b border-dotted border-black">{get_data.driver || "\u00A0"}</div>
                }
            </div>
        </div>
    </>
    )
}