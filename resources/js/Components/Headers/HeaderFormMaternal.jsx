import React , {useState, useEffect} from "react";
import axios from 'axios';

import HeaderLogo from "@/Components/Headers/HeaderLogo";

export default function HeaderFormMaternal(props) {

    return (
        <>
        <div className="flex">
            <div className="">
                <img className="ml-3 mt-3 w-16" src={'/./assets/img/logo-kota-semarang2.png'}></img>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-full">
                <div className="mt-3 ml-1 font-bold flex justify-center">PEMERINTAH KOTA SEMARANG</div>
                <div className="ml-1 font-bold flex justify-center">DINAS KESEHATAN</div>
                <div className="ml-1 font-bold flex justify-center">AMBULANS HEBAT</div>
                <div className="ml-1 flex justify-center">Jalan Pandanaran No. 79 Telp. (024) 8415269 - 8318070 Fax. (024) 8318771 Kode Pos : 50241 SEMARANG</div>
                </div>
            </div>
        </div>
        </>
    );
}