import React , {useState, useEffect} from "react";
import axios from 'axios';

export default function HeaderFormSurat(props) {
    return (
    <>
    <div className="flex">
        <div>
            <img className="ml-3 mt-3 w-24" src={'./assets/img/logo-kota-semarang2.png'}></img>
        </div>
        <div className="w-full">
            <div className="flex justify-center mt-3 ml-1 font-bold text-[20px]">PEMERINTAH KOTA SEMARANG</div>
            <div className="flex justify-center ml-1 font-bold text-[24px]">DINAS KESEHATAN</div>
            <div className="flex justify-center ml-1 font-bold text-[18px]">AMBULANCE HEBAT</div>
            <div className="flex justify-center ml-1">Jl. Pandanaran No. 79 Telp : (024) 8415269 - 8318070 Kode Pos : 50241 SEMARANG</div>
            <div className="flex justify-center ml-1">Call Center : 112 / 119 / 1500-132</div>
        </div>
    </div>
    <div className="mt-3 h-[5px] bg-black"></div>
    </>
    );
}