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
        driver:"",
    });

    const [get_semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [get_semua_tim_dokter, set_semua_tim_dokter] = useState([]);
    const [get_semua_tim_perawat, set_semua_tim_perawat] = useState([]);
    const [get_semua_tim_bidan, set_semua_tim_bidan] = useState([]);
    const [get_semua_tim_driver, set_semua_tim_driver] = useState([]);

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
        if(props.auth.role=="Tim Ambulan"){
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
                    driver: response.data[jenis]?.ita_driver,
                }));
            })
        }    
    }, [props.id_form]);
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
    {/* <div className="grid grid-cols-5"> */}
        <div className="ml-3 mr-3 mb-3 border-solid border-2 grid grid-cols-5 text-xxs md:text-sm sm:text-xs">
            <div className="flex col-span-2">Tim</div>
            <div className="flex col-span-3">:
                {
                    props.isPrinting == false &&
                    <div >
                    {/* <input className="w-full text-xs p-0" 
                        type = "text"
                        name = "tim"
                        value={get_data.tim}
                        onChange={handleChange} 
                        /> */}
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                        type = "text"
                        name = "tim"
                        value={get_data.tim}
                        list="dl_tim_ambulan"
                        onChange={handleChange} 
                        />
                        <datalist id="dl_tim_ambulan">
                            {get_semua_tim_ambulan.map((opts,i)=><option key={i} id={opts.id} value={opts.nama_tim}>{opts.nama_tim}</option>)}
                        </datalist>
                    </div>
                    

                }
                {
                    props.isPrinting &&
                    <div>{get_data.tim}</div>
                }
            </div>
            <div className="flex col-span-2">Dokter</div>
            <div className="flex col-span-3">:
                {
                    props.isPrinting == false &&
                    <div >
                    {/* <input className="w-full text-xs p-0" 
                        type = "text"
                        name = "dokter"
                        value={get_data.dokter}
                        onChange={handleChange} 
                        /> */}
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                    type = "text"
                    name = "dokter"
                    value={get_data.dokter}
                    list="dl_tim_dokter"
                    onChange={handleChange} 
                    />
                    <datalist id="dl_tim_dokter">
                        {get_semua_tim_dokter.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                    </datalist>
                    </div>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.dokter}</div>
                }
            </div>
            <div className="flex col-span-2">Nakes 1</div>
            <div className="flex col-span-3">:
                {
                    props.isPrinting == false &&
                    <div >
                    {/* <input className="w-full text-xs p-0" 
                        type = "text"
                        name = "perawat"
                        value={get_data.perawat}
                        onChange={handleChange} 
                        /> */}
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                        type = "text"
                        name = "perawat"
                        value={get_data.perawat}
                        list="dl_tim_perawat"
                        onChange={handleChange} 
                        />
                    <datalist id="dl_tim_perawat">
                        {get_semua_tim_perawat.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                    </datalist>
                    
                    </div>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.perawat}</div>
                }
            </div>
            <div className="flex col-span-2">Nakes 2</div>
            <div className="flex col-span-3">:
                {
                    props.isPrinting == false &&
                    <div >
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                        type = "text"
                        name = "bidan"
                        value={get_data.bidan}
                        onChange={handleChange}
                        list="dl_tim_bidan" 
                        />
                    <datalist id="dl_tim_bidan">
                        {get_semua_tim_bidan.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                    </datalist>
                    </div>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.bidan}</div>
                }
            </div>
            <div className="flex col-span-2">Driver</div>
            <div className="flex col-span-3">
                :
                {
                    props.isPrinting == false &&
                    <div >
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                        type = "text"
                        name = "driver"
                        value={get_data.driver}
                        onChange={handleChange}
                        list="dl_tim_driver" 
                        />
                    <datalist id="dl_tim_driver">
                        {get_semua_tim_driver.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                    </datalist>
                    </div>
                }
                {
                    props.isPrinting &&
                    <div>{get_data.driver}</div>
                }
            </div>
        </div>
    </>
    )
}