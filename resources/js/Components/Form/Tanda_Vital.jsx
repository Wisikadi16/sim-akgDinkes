import React , {useState, useEffect} from "react";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import {TextField} from '@mui/material';

export default function Tanda_Vital(props) {
    // const [get_jam, set_jam] = React.useState(dayjs('2022-04-17T15:30'));
    const [get_jam, set_jam] = React.useState(dayjs(new Date));
    
    // const [get_jam, set_jam] = React.useState('');
    
    // console.log("tanda"+props);
    // console.log("jam::"+get_jam);
    const [get_data, set_data] = useState({
      td: "",
      hr:"",
      rr:"",
      sh:"",
      spo2:"",
      skala_nyeri:"",
      nrm:"",
      gds:"",
      // pukul:"",
      // c_pukul: dayjs(new Date),
      c_pukul: "",
      // pukul:((JSON.stringify(get_jam.$H)).length==1?"0"+get_jam.$H:get_jam.$H)+":"
      // +((JSON.stringify(get_jam.$m)).length==1?"0"+get_jam.$m:get_jam.$m),
      pukul: "",
    });

    useEffect(() => {
      if(props.id!=null){
          axios.post(window.location.origin+'/ref_form_umum',
          {
              id:props.id,
          }).then(function (response){
            if(props.judul=="TANDA VITAL"){
              set_data({
                ...get_data,
                ["td"]:response.data.tv_td,
                ["hr"]:response.data.tv_hr,
                ["rr"]:response.data.tv_rr,
                ["sh"]:response.data.tv_sh,
                ["spo2"]:response.data.tv_spo2,
                ["skala_nyeri"]:response.data.tv_skala_nyeri,
                ["c_pukul"]:dayjs(response.data.tgl_penanganan+"T"+response.data.tv_pukul),
                ["pukul"]:response.data.tv_pukul,
              })
            }
            if(props.judul=="FOLLOW UP TANDA VITAL"){
              set_data({
                ...get_data,
                ["td"]:response.data.ftv_td,
                ["hr"]:response.data.ftv_hr,
                ["rr"]:response.data.ftv_rr,
                ["sh"]:response.data.ftv_sh,
                ["spo2"]:response.data.ftv_spo2,
                ["skala_nyeri"]:response.data.ftv_skala_nyeri,
                ["nrm"]:response.data.ftv_nrm,
                ["gds"]:response.data.ftv_gds,
                ["c_pukul"]:dayjs(response.data.tgl_penanganan+"T"+response.data.ftv_pukul),
                ["pukul"]:response.data.ftv_pukul,
              })
            }
            
          })
      }
      else{
        set_data({
          ...get_data,
          ["c_pukul"]:get_jam,
          ["pukul"]:((JSON.stringify(get_jam.$H)).length==1?"0"+get_jam.$H:get_jam.$H)+":"
          +((JSON.stringify(get_jam.$m)).length==1?"0"+get_jam.$m:get_jam.$m),
        })
      }
    }, []);

    // console.log("data tanda vital")
    // console.log(get_data)

    const handleChange = (e) => {
      // console.log("oc");
      // console.log("nama_target"+e.target.value)
      // console.log("jam"+get_jam);
      // console.log(e.$d);
      if(e.$d!=null){
        // console.log(e)
        var jam = JSON.stringify(e.$H);
        if(jam.length==1){
          jam = "0"+jam;
        }
        var menit = JSON.stringify(e.$m);
        if(menit.length==1){
          menit = "0"+menit;
        }

        set_data({
          ...get_data,
          ["c_pukul"]: e,
          // ["pukul"]: e.$H+":"+e.$m,
          ["pukul"]: jam+":"+menit,
        });
      }
      else{
        const value = e.target.value;
        
        set_data({
            ...get_data,
            [e.target.name]: value,
        });
      }
    }

    const [get_show, set_show] = useState(false);
    const oc_jam = (e) => {
      set_show(current => !current);
    }

    
    // console.log("submit");
    props.onSubmit(get_data);
    // console.log(get_data);
    // console.log(get_data.pukul);
    
    return (
      <>
        <div className="border-solid border-2 text-xxs md:text-sm sm:text-xs">
            <div className="font-bold text-xxs md:text-sm sm:text-xs">{props.judul}</div>
            <div className="flex text-xss md:text-sm sm:text-xs">TD 
              <div className="flex">:
                {
                  props.isPrinting==false &&
                  <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                    type="text" 
                    name="td"
                    value={get_data.td}
                    onChange={handleChange}
                  />
                }
                {
                  props.isPrinting &&
                  <div className="mr-1">{get_data.td}</div>
                }
              </div>mmHg
            </div>
            <div className="flex">HR
              <div className="flex">:
                {
                  props.isPrinting==false &&
                  <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                      type="text" 
                      name="hr"
                      value={get_data.hr}
                      onChange={handleChange}
                  />
                }
                {
                  props.isPrinting &&
                  <div className="mr-1">{get_data.hr}</div>
                }
              </div>x/menit
            </div>
            <div className="flex">RR
              <div className="flex">:
                  {
                    props.isPrinting==false &&
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                      type="text" 
                      name="rr"
                      value={get_data.rr}
                      onChange={handleChange}
                    />
                  }
                  {
                    props.isPrinting &&
                    <div className="mr-1">{get_data.rr}</div>
                  }
              </div>x/menit
            </div>
            <div className="flex">SH
              <div className="flex">:
                  {
                    props.isPrinting==false &&    
                      <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                      type="text" 
                      name="sh"
                      value={get_data.sh}
                      onChange={handleChange}
                    />
                  }
                  {
                    props.isPrinting &&
                    <div className="mr-1">{get_data.sh}</div>
                  }
              </div>&#8451;
            </div>
            <div className="flex"><p>SpO<sub>2</sub></p>
              <div className="flex">:
                  {
                    props.isPrinting==false &&    
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                    type="text" 
                    name="spo2"
                    value={get_data.spo2}
                    onChange={handleChange}
                    />
                  }
                  {
                    props.isPrinting &&
                    <div className="mr-1">{get_data.spo2}</div>
                  }
              </div>%
            </div>
            <div className="flex text-xxs md:text-sm sm:text-xs">Skala Nyeri
              <div className="flex">:
                {
                  props.isPrinting==false &&
                  <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                  type="text" 
                  name="skala_nyeri"
                  value={get_data.skala_nyeri}
                  onChange={handleChange}
                  />
                }
                {
                  props.isPrinting &&
                  <div className="mr-1">{get_data.skala_nyeri}</div>
                }
              </div>
            </div>
            {props.judul=="FOLLOW UP TANDA VITAL" &&
            <div>
              <div className="flex">NRM
              <div className="flex">:
                  {
                    props.isPrinting==false &&    
                      <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                      type="text" 
                      name="nrm"
                      value={get_data.nrm}
                      onChange={handleChange}
                    />
                  }
                  {
                    props.isPrinting &&
                    <div className="mr-1">{get_data.nrm}</div>
                  }
              </div>lpm
              </div>
              <div className="flex">GDS
              <div className="flex">:
                  {
                    props.isPrinting==false &&    
                      <input className="w-full text-xxs md:text-sm sm:text-xs p-0" 
                      type="text" 
                      name="gds"
                      value={get_data.gds}
                      onChange={handleChange}
                    />
                  }
                  {
                    props.isPrinting &&
                    <div className="mr-1">{get_data.gds}</div>
                  }
              </div>mg/dl
              </div>
            </div>
            }
            <div className="flex text-xxs md:text-sm sm:text-xs">Pukul
              <div className="flex">:
                {
                  props.isPrinting==false &&
                  <div className="relative">
                    <LocalizationProvider  dateAdapter={AdapterDayjs}>
                        {/* <MobileTimePicker className="text-sm" value={get_jam} onChange={(newValue) => set_jam(newValue)} ampm={false} /> */}
                        <MobileTimePicker  name="c_pukul" value={get_data.c_pukul} onChange={handleChange} ampm={false} slotProps={{
                                        textField: {
                                            size: "small",
                                        },
                                    }} />
                    </LocalizationProvider>  
                  </div>
                }
                {
                  props.isPrinting &&
                  <div className="mr-1">{get_data.pukul}</div>
                }
              </div>WIB
            </div>
        </div>
      </>
    )
}