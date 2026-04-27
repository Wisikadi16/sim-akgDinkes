import React , {Component, useState, useEffect} from "react";
import axios from 'axios';

import {Chart as ChartJS} from "chart.js/auto"
import { Bar, Line } from 'react-chartjs-2';
import Tim_Ambulan from "./Tim_Ambulan";

import DataTable from "react-data-table-component";


export default function Dashboard() {
  const [semua_order, set_semua_order] = useState([]);
  const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
  const [semua_tim_ambulan_order, set_semua_tim_ambulan_order] = useState([]);
  const [jenis, set_jenis] = useState("");
  
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const total_hari = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const formatted_tgl = `${year}-${month}-${day}`;
  console.log(formatted_tgl);
  var nama_bulan;
  if(month=="01"){
    nama_bulan="Januari";
  }
  else if(month=="02"){
    nama_bulan="Februari";
  }
  else if(month=="03"){
    nama_bulan="Maret";
  }
  else if(month=="04"){
    nama_bulan="April";
  }
  else if(month=="05"){
    nama_bulan="Mei";
  }
  else if(month=="06"){
    nama_bulan="Juni";
  }
  else if(month=="07"){
    nama_bulan="Juli";
  }
  else if(month=="08"){
    nama_bulan="Agustus";
  }
  else if(month=="09"){
    nama_bulan="September";
  }
  else if(month=="10"){
    nama_bulan="Oktober";
  }
  else if(month=="11"){
    nama_bulan="November";
  }
  else if(month=="12"){
    nama_bulan="Desember";
  }

  const [ar_hari, set_ar_hari] = useState([]);
  
  const ubah_ar_hari = (total_hari) => {
    if (!isNaN(total_hari) && total_hari >= 0) {
      const newArray = Array.from({ length: total_hari }, (_, index) => index + 1);
  
      set_ar_hari(newArray);
    } else {
      set_ar_hari([]);
    }
  };

  useEffect(()=>{
      axios.post(window.location.origin+'/ref_tim_ambulan').then(function (response){
        set_semua_tim_ambulan(response.data)
        // console.log(response)
      })

      
      axios.post(window.location.origin+'/ref_dashboard',{
        order:true,
        tgl:formatted_tgl,
      }).then(function (response){
        set_semua_tim_ambulan_order(response.data)
        set_jenis("Jumlah Order")
        console.log(response)
      })

      ubah_ar_hari(total_hari)
  }, [])

  const [page, set_page] = useState([0]);

  const columns = [
    {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
    {name:'Nama Tim', selector:(row)=>row.nama_tim, width:"190px"},
    {name:'Total Order Hari Ini', selector:(row)=>row.total_order_hari_ini, width:"190px"},
    {name:'Total Order Bulan Ini', selector:(row)=>row.total_order_per_hari_bulan_ini, width:"190px"},
    {name:'Total Order Tahun Ini', selector:(row)=>row.total_order_tahun_ini, width:"190px"},
  ]

  const total_semua_order_hari_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_hari_ini, 0)
  };

  const total_semua_order_bulan_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_per_hari_bulan_ini, 0)
  };

  const total_semua_order_tahun_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_tahun_ini, 0)
  };
  
  console.log(semua_tim_ambulan_order.length)
  
  const manualColors = [
    "#FF5733", "#33FF57", "#5733FF", "#FF3366", "#33CCFF",
    "#FF9900", "#9900FF", "#00FF99", "#FF0000", "#00FF00",
    "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#CCCCCC",
    "#FFCC00", "#3366FF", "#FF6699", "#66FF66", "#9966FF",
    "#FF99CC", "#FF3300", "#33FFCC", "#CCFF33", "#FF3399",
    "#996633", "#339966", "#663399", "#993366", "#FF6633",
    "#6699FF", "#33CC33"
  ];

  return (
    <div className="w-screen h-screen overflow-y-auto mt-3 relative">
      <div className="font-bold text-[20px]">Dashboard</div>
      <div className="flex justify-center font-bold text-[20px]">Order Bulan {nama_bulan+" Tahun "+year}</div>
      <div>
        <Line
          data={
            {
              labels: ar_hari,
              datasets: semua_tim_ambulan_order.map((val,index) => ({
                label:val.nama_tim,
                data:val.order_per_hari_bulan_ini,
                backgroundColor:manualColors[index],
                borderColor:manualColors[index]
              }))
            }
          }
          width={'100%'}
          height={'50%'}
        />
      </div>
      {
        jenis == "Jumlah Order" &&
        <div className="w-[70%]">
          <div className="flex">
            <div className="flex justify-center items-center w-[25%] bg-white border border-gray-300 rounded overflow-hidden shadow-lg">
              <div className="px-3 py-1">
                <div className="font-bold text-md mb-2 flex justify-center">Total Armada</div>
                <div className="text-gray-700 text-xl font-bold flex justify-center">
                  {semua_tim_ambulan_order.length}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-[25%] bg-white border border-gray-300 rounded overflow-hidden shadow-lg">
              <div className="px-3 py-1">
                <div className="font-bold text-md flex justify-center">Total Semua Order</div>
                <div className="font-bold text-md mb-2 flex justify-center">Hari Ini</div>
                <div className="text-gray-700 text-xl font-bold flex justify-center">
                  {total_semua_order_hari_ini.total}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-[25%] bg-white border border-gray-300 rounded overflow-hidden shadow-lg">
              <div className="px-3 py-1">
                <div className="font-bold text-md flex justify-center">Total Semua Order</div>
                <div className="font-bold text-md mb-2 flex justify-center">Bulan Ini</div>
                <div className="text-gray-700 text-xl font-bold flex justify-center">
                  {total_semua_order_bulan_ini.total}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-[25%] bg-white border border-gray-300 rounded overflow-hidden shadow-lg">
              <div className="px-3 py-1">
                <div className="font-bold text-md flex justify-center">Total Semua Order</div>
                <div className="font-bold text-md mb-2 flex justify-center">Tahun Ini</div>
                <div className="text-gray-700 text-xl font-bold flex justify-center">
                  {total_semua_order_tahun_ini.total}
                </div>
              </div>
            </div>
          </div>    
          <div className="w-full">
            <DataTable columns={columns} data={semua_tim_ambulan_order}
              pagination onChangePage={set_page} highlightOnHover />
          </div>
        </div>
      }
    </div>
  );
}
