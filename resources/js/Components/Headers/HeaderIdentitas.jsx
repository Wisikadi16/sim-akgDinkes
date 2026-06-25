import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderLogo from "@/Components/Headers/HeaderLogo";
import { toast } from "react-toastify";
export default function HeaderIdentitas({
    data,
    onChange,
    isPrinting,
    hideContact,
}) {
    const [tunggu, setTunggu] = useState(false);
    // Fungsi Hitung Umur Otomatis
    const hitUmur = (tglLahir) => {
        if (!tglLahir) return "";
        const formattedDate = tglLahir.split("-");
        const birthDate = new Date(
            formattedDate[0],
            formattedDate[1] - 1,
            formattedDate[2],
        );
        const difference = new Date().getTime() - birthDate.getTime();
        return Math.floor(difference / 31557600000);
    };
    // Fungsi Cari NIK
    const ocCari = () => {
        if (!data.nik) return toast.warning("Masukkan NIK terlebih dahulu", { position: toast.POSITION.TOP_RIGHT });
        setTunggu(true);
        axios
            .post(window.location.origin + "/cari_nik", { nik: data.nik })
            .then((response) => {
                setTunggu(false);
                if (response.data === "Nik tidak ditemukan") {
                    toast.error("NIK tidak ditemukan di database", { position: toast.POSITION.TOP_RIGHT });
                } else {
                    // Kirim data balik ke parent menggunakan functional update
                    onChange((prev) => ({
                        ...prev,
                        nama: response.data.nama,
                        tgl_lahir: response.data.tgl_lahir,
                        umur: hitUmur(response.data.tgl_lahir),
                        alamat: response.data.alamat,
                        no_telepon: response.data.no_telepon,
                    }));
                }
            })
            .catch(() => setTunggu(false));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "nik") {
            if (!/^\d*$/.test(value) || value.length > 16) {
                return;
                // Abaikan ketikan selain angka atau lebih dari 16
            }
        }
        // Gunakan functional update untuk memastikan state terbaru dari parent digunakan
        onChange((prev) => {
            let updated = { ...prev, [name]: value };
            if (name === "tgl_lahir") {
                updated.umur = hitUmur(value);
            }
            return updated;
        });
    };
    return (
        <div className="grid grid-cols-2 text-xs md:text-sm">
            {" "}
            <HeaderLogo />{" "}
            <div className="mt-3 mr-3 border-solid border-2 grid grid-cols-3">
                {/* NIK FIELD */}
                <div className="p-1 font-bold bg-gray-50 border-r border-b min-h-[32px] flex items-center">
                    NIK
                </div>{" "}
                <div className="flex col-span-2 border-b p-1 min-h-[32px]">
                    {" "}
                    {!isPrinting ? (
                        <div className="flex w-full items-center">
                            {" "}
                            <input
                                className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                                type="text"
                                name="nik"
                                value={data.nik || ""}
                                onChange={handleChange}
                                placeholder="NIK..."
                                maxLength="16"
                            />{" "}
                            <button
                                onClick={ocCari}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-xs ml-1 whitespace-nowrap"
                                type="button"
                            >
                                Cari
                            </button>{" "}
                        </div>
                    ) : (
                        <div className="flex items-center">: {data.nik}</div>
                    )}{" "}
                </div>
                {/* NAMA FIELD */}
                <div className="p-1 font-bold bg-gray-50 border-r border-b min-h-[32px] flex items-center">
                    Nama Pasien
                </div>{" "}
                <div className="flex col-span-2 border-b p-1 min-h-[32px]">
                    {" "}
                    {tunggu ? (
                        <div className="flex items-center">Mohon Tunggu...</div>
                    ) : !isPrinting ? (
                        <input
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                            type="text"
                            name="nama"
                            value={data.nama || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <div className="flex items-center">: {data.nama}</div>
                    )}{" "}
                </div>
                {/* TGL LAHIR & UMUR */}
                <div className="p-1 font-bold bg-gray-50 border-r border-b min-h-[32px] flex items-center">
                    Tgl Lahir / Umur
                </div>{" "}
                <div className="flex col-span-2 border-b p-1 min-h-[32px]">
                    {" "}
                    {!isPrinting ? (
                        <div className="flex w-full items-center">
                            {" "}
                            <input
                                className="p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                                type="date"
                                name="tgl_lahir"
                                value={data.tgl_lahir || ""}
                                onChange={handleChange}
                            />{" "}
                            <span className="mx-2">/</span>{" "}
                            <span>{data.umur} Tahun</span>{" "}
                        </div>
                    ) : (
                        <div className="flex items-center">
                            : {data.tgl_lahir} / {data.umur} Thn
                        </div>
                    )}{" "}
                </div>
                {/* ALAMAT */}
                {!hideContact && (
                    <>
                        {" "}
                        <div className="p-1 font-bold bg-gray-50 border-r border-b min-h-[32px] flex items-center">
                            Alamat
                        </div>{" "}
                        <div className="flex col-span-2 border-b p-1 min-h-[32px]">
                            {" "}
                            {!isPrinting ? (
                                <input
                                    className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                                    type="text"
                                    name="alamat"
                                    value={data.alamat || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="flex items-center">
                                    : {data.alamat}
                                </div>
                            )}{" "}
                        </div>
                        {/* NO TELEPON */}
                        <div className="p-1 font-bold bg-gray-50 border-r border-b min-h-[32px] flex items-center">
                            No. Telepon
                        </div>{" "}
                        <div className="flex col-span-2 border-b p-1 min-h-[32px]">
                            {" "}
                            {!isPrinting ? (
                                <input
                                    className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                                    type="text"
                                    name="no_telepon"
                                    value={data.no_telepon || ""}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="flex items-center">
                                    : {data.no_telepon}
                                </div>
                            )}{" "}
                        </div>{" "}
                    </>
                )}
                {/* TGL PENANGANAN */}
                <div className="p-1 font-bold bg-gray-50 border-r min-h-[32px] flex items-center">
                    Tgl Penanganan
                </div>{" "}
                <div className="flex col-span-2 p-1 min-h-[32px]">
                    {" "}
                    {!isPrinting ? (
                        <input
                            className="w-full p-1 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                            type="date"
                            name="tgl_penanganan"
                            value={data.tgl_penanganan || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <div className="flex items-center">
                            : {data.tgl_penanganan}
                        </div>
                    )}{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
}
