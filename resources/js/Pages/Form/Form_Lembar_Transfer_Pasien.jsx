import React, { useState, useRef, useEffect } from "react";
import HeaderLogo from "@/Components/Headers/HeaderLogo"; /* KITA HANYA MENGAMBIL LOGonya SAJA! */
import { Head, useForm } from "@inertiajs/react";
import SignatureCanvas from "react-signature-canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Form_Lembar_Transfer_Pasien(props) {
    const id = props.id; /* SEMUA FIELD SESUAI DENGAN KERTAS .DOCX */
    const { data, setData, post, processing } = useForm({
        nama_pasien: "",
        ttl: "",
        jenis_kelamin: "L",
        nik: "",
        jenis_asuransi: "",
        alamat_rumah: "",
        nama_pendamping: "",
        tgl_masuk_rs: "",
        jam_masuk_rs: "",
        rs_1: "",
        rs_2: "",
        rs_3: "",
        anamnesa: "",
        riwayat_penyakit: "",
        diagnosa: "",
        tindakan_dilakukan: "",
        terapi_diberikan: "",
        ringkasan_kondisi: [
            {
                pukul: "",
                keadaan: "",
                td: "",
                hr: "",
                rr: "",
                suhu: "",
                spo2: "",
                gds: "",
                ekg: "",
                nyeri: "",
                ket: "",
            },
            {
                pukul: "",
                keadaan: "",
                td: "",
                hr: "",
                rr: "",
                suhu: "",
                spo2: "",
                gds: "",
                ekg: "",
                nyeri: "",
                ket: "",
            },
            {
                pukul: "",
                keadaan: "",
                td: "",
                hr: "",
                rr: "",
                suhu: "",
                spo2: "",
                gds: "",
                ekg: "",
                nyeri: "",
                ket: "",
            },
            {
                pukul: "",
                keadaan: "",
                td: "",
                hr: "",
                rr: "",
                suhu: "",
                spo2: "",
                gds: "",
                ekg: "",
                nyeri: "",
                ket: "",
            },
        ],
        status_sblm: "",
        status_selama: "",
        status_stlh: "",
        petugas_dokter: "",
        petugas_perawat: "",
        petugas_bidan: "",
        petugas_driver: "",
        tgl_serah_terima: "",
        jam_serah_terima: "",
        nama_menyerahkan: "",
        nama_menerima: "",
        nama_mengetahui: "" /* DIKOSONGKAN AGAR BISA DIKETIK */,
    });
    const [isPrinting, setIsPrinting] = useState(false);
    const ref_print = useRef(null);
    const sigMenyerahkan = useRef({});
    const sigMenerima = useRef({});
    const sigMengetahui = useRef({});
    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 300);
    };
    useEffect(() => {
        if (id) {
            window.axios
                .post(
                    window.location.origin + "/ref_form_lembar_transfer_pasien",
                    { id_form: id },
                )
                .then((response) => {
                    const row = response.data;
                    if (row) {
                        const parseJSON = (val, fallback) => {
                            let parsed = val;
                            if (typeof val === 'string') {
                                try { parsed = val ? JSON.parse(val) : fallback; } 
                                catch (e) { parsed = fallback; }
                            }
                            if (!parsed) return fallback;
                            if (Array.isArray(fallback)) {
                                if (!Array.isArray(parsed)) return fallback;
                                if (parsed.length === 0 && fallback.length > 0) return fallback;
                                return parsed;
                            }
                            if (typeof fallback === 'object' && fallback !== null) {
                                if (Array.isArray(parsed)) return fallback;
                                if (typeof parsed !== 'object') return fallback;
                                return { ...fallback, ...parsed }; 
                            }
                            return parsed;
                        };

                        let parsedRingkasan = parseJSON(row.ringkasan_kondisi, []);
                        let parsedPetugas = parseJSON(row.nama_petugas_pendamping, ["", "", "", ""]);
                        let parsedRs = parseJSON(row.rs_tujuan, ["", "", ""]);
                        setData({
                            id: id,
                            nama_pasien: row.nama_pasien || "",
                            ttl: row.ttl || "",
                            jenis_kelamin: row.jenis_kelamin || "L",
                            nik: row.nik || "",
                            jenis_asuransi: row.jenis_asuransi || "",
                            alamat_rumah: row.alamat_rumah || "",
                            nama_pendamping: row.nama_pendamping || "",
                            tgl_masuk_rs: row.tgl_masuk_rs || "",
                            jam_masuk_rs: row.jam_masuk_rs || "",
                            rs_1: parsedRs[0] || "",
                            rs_2: parsedRs[1] || "",
                            rs_3: parsedRs[2] || "",
                            anamnesa: row.anamnesa || "",
                            riwayat_penyakit: row.riwayat_penyakit || "",
                            diagnosa: row.diagnosa || "",
                            tindakan_dilakukan: row.tindakan_dilakukan || "",
                            terapi_diberikan: row.terapi_diberikan || "",
                            ringkasan_kondisi:
                                parsedRingkasan &&
                                Array.isArray(parsedRingkasan)
                                    ? parsedRingkasan
                                    : [
                                          {
                                              pukul: "",
                                              keadaan: "",
                                              td: "",
                                              hr: "",
                                              rr: "",
                                              suhu: "",
                                              spo2: "",
                                              gds: "",
                                              ekg: "",
                                              nyeri: "",
                                              ket: "",
                                          },
                                          {
                                              pukul: "",
                                              keadaan: "",
                                              td: "",
                                              hr: "",
                                              rr: "",
                                              suhu: "",
                                              spo2: "",
                                              gds: "",
                                              ekg: "",
                                              nyeri: "",
                                              ket: "",
                                          },
                                          {
                                              pukul: "",
                                              keadaan: "",
                                              td: "",
                                              hr: "",
                                              rr: "",
                                              suhu: "",
                                              spo2: "",
                                              gds: "",
                                              ekg: "",
                                              nyeri: "",
                                              ket: "",
                                          },
                                          {
                                              pukul: "",
                                              keadaan: "",
                                              td: "",
                                              hr: "",
                                              rr: "",
                                              suhu: "",
                                              spo2: "",
                                              gds: "",
                                              ekg: "",
                                              nyeri: "",
                                              ket: "",
                                          },
                                      ],
                            status_sblm: row.status_sblm || "",
                            status_selama: row.status_selama || "",
                            status_stlh: row.status_stlh || "",
                            petugas_dokter: parsedPetugas[0] || "",
                            petugas_perawat: parsedPetugas[1] || "",
                            petugas_bidan: parsedPetugas[2] || "",
                            petugas_driver: parsedPetugas[3] || "",
                            tgl_serah_terima: row.tgl_serah_terima || "",
                            jam_serah_terima: row.jam_serah_terima || "",
                            nama_menyerahkan: row.nama_menyerahkan || "",
                            nama_menerima: row.nama_menerima || "",
                            nama_mengetahui: row.nama_mengetahui || "",
                        });
                        if (row.ttd_menyerahkan) {
                            setTimeout(() => {
                                if (sigMenyerahkan && sigMenyerahkan.current && typeof sigMenyerahkan.current.fromDataURL === 'function') {
                                    sigMenyerahkan.current.fromDataURL(row.ttd_menyerahkan);
                                }
                            }, 500);
                        }
                        if (row.ttd_menerima) {
                            setTimeout(() => {
                                if (sigMenerima && sigMenerima.current && typeof sigMenerima.current.fromDataURL === 'function') {
                                    sigMenerima.current.fromDataURL(row.ttd_menerima);
                                }
                            }, 500);
                        }
                        if (row.ttd_mengetahui) {
                            setTimeout(() => {
                                if (sigMengetahui && sigMengetahui.current && typeof sigMengetahui.current.fromDataURL === 'function') {
                                    sigMengetahui.current.fromDataURL(row.ttd_mengetahui);
                                }
                            }, 500);
                        }
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [id]);
    const simpanData = () => {
        if (data.nik && data.nik.length !== 16) {
            toast.error("NIK harus terdiri dari tepat 16 digit angka", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        const formData = {
            ...data,
            id_form: id,
            ttd_menyerahkan: sigMenyerahkan.current && typeof sigMenyerahkan.current.isEmpty === 'function' && !sigMenyerahkan.current.isEmpty()
                ? sigMenyerahkan.current.getCanvas().toDataURL("image/png")
                : null,
            ttd_menerima: sigMenerima.current && typeof sigMenerima.current.isEmpty === 'function' && !sigMenerima.current.isEmpty()
                ? sigMenerima.current.getCanvas().toDataURL("image/png")
                : null,
            ttd_mengetahui: sigMengetahui.current && typeof sigMengetahui.current.isEmpty === 'function' && !sigMengetahui.current.isEmpty()
                ? sigMengetahui.current.getCanvas().toDataURL("image/png")
                : null,
        };
        const url = id
            ? window.location.origin + "/form_lembar_transfer_pasien/perbarui"
            : window.location.origin + "/form_lembar_transfer_pasien/simpan";
        window.axios
            .post(url, formData)
            .then((response) => {
                toast.success("Berhasil simpan data form", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setTimeout(
                    () => (window.location.href = "/catatan_medis"),
                    2000,
                );
            })
            .catch((error) => {
                toast.error("Gagal menyimpan data", {
                    position: toast.POSITION.TOP_RIGHT,
                });
                console.error(error);
            });
    };
    const oc_ringkasan = (index, field, value) => {
        let newRingkasan = [...data.ringkasan_kondisi];
        newRingkasan[index][field] = value;
        setData("ringkasan_kondisi", newRingkasan);
    }; /* Class Utilities agar tulisan ringkas mirip Word */
    const inputClasses =
        "w-full p-1 border-none focus:ring-0 text-xs text-black bg-transparent outline-none";
    const headerClasses = "p-1 font-bold text-xs flex items-center";
    return (
        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            {" "}
            <ToastContainer /> {/* CSS PENGATURAN KERTAS & ZOOM PRINT */}{" "}
            <style>{` @media print { @page { size: A4 portrait; margin: 0mm !important; } body, html { margin: 0 !important; padding: 0 !important; background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .kertas-a4 { width: 1000px !important; max-width: 1000px !important; /* Turunkan angka zoom jadi 0.65 kalau misal tabel terbawah masih kepotong ke halaman 2 */ zoom: 0.68 !important; padding: 10mm 15mm !important; margin: 0 auto !important; box-shadow: none !important; border: none !important; } } `}</style>{" "}
            {/* --- TOMBOL ATAS --- */}
            <div className="flex justify-center print:hidden">
                <a
                    href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none"
                >
                    Kembali
                </a>
            </div>{" "}
            <div
                ref={ref_print}
                className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black bg-white text-black p-4"
            >
                {" "}
                <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
                    {" "}
                    <HeaderLogo />{" "}
                    {/* HeaderLogo sudah meng-output gambar & tulisan Pemerintah Kota Semarang */}{" "}
                </div>{" "}
                <div className="text-center font-extrabold uppercase my-4 mt-2 text-sm underline underline-offset-2">
                    {" "}
                    LEMBAR TRANSFER PASIEN{" "}
                </div>{" "}
                {/* 2. TABEL BIODATA UTAMA (Persis .docx) */}{" "}
                <div className="border border-black text-xs font-serif mb-2">
                    {" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1">Nama Pasien</div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[78%] border-l border-black">
                            <input
                                type="text"
                                className={inputClasses}
                                value={data.nama_pasien}
                                onChange={(e) =>
                                    setData("nama_pasien", e.target.value)
                                }
                            />
                        </div>{" "}
                    </div>{" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1">TTL</div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[48%] border-l border-black">
                            <input
                                type="text"
                                className={inputClasses}
                                value={data.ttl}
                                onChange={(e) => setData("ttl", e.target.value)}
                            />
                        </div>{" "}
                        <div className="w-[15%] p-1 border-l border-black border-r flex items-center justify-end">
                            Jenis Kelamin :
                        </div>{" "}
                        <div className="w-[15%] flex justify-center items-center font-bold cursor-pointer">
                            {" "}
                            <div
                                className={`${data.jenis_kelamin === "P" ? "line-through decoration-[1.5px] decoration-black text-gray-500 " : "text-black"} px-1`}
                                onClick={() => setData("jenis_kelamin", "L")}
                            >
                                {" "}
                                L{" "}
                            </div>{" "}
                            <div className="px-1">/</div>{" "}
                            <div
                                className={`${data.jenis_kelamin === "L" ? "line-through decoration-[1.5px] decoration-black text-gray-500 " : "text-black"} px-1`}
                                onClick={() => setData("jenis_kelamin", "P")}
                            >
                                {" "}
                                P{" "}
                            </div>{" "}
                        </div>{" "}
                    </div>{" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1">NIK</div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[78%] border-l border-black">
                            <input
                                type="text"
                                className={inputClasses}
                                value={data.nik}
                                maxLength="16"
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 16) {
                                        setData("nik", e.target.value);
                                    }
                                }}
                            />
                        </div>{" "}
                    </div>{" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1 leading-none flex items-center">
                            Jenis / Nomor Asuransi
                        </div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[78%] border-l border-black flex items-center">
                            {" "}
                            <input
                                type="text"
                                className={`w-[48%] h-full p-1 border-none focus:ring-0 text-xs text-black bg-transparent outline-none`}
                                placeholder="..."
                                value={
                                    (data.jenis_asuransi || "").split(
                                        " / ",
                                    )[0] || ""
                                }
                                onChange={(e) => {
                                    const parts = (
                                        data.jenis_asuransi || ""
                                    ).split(" / ");
                                    setData(
                                        "jenis_asuransi",
                                        `${e.target.value} / ${parts[1] || ""}`,
                                    );
                                }}
                            />{" "}
                            <div className="w-[4%] text-center font-bold">
                                /
                            </div>{" "}
                            <input
                                type="text"
                                className={`w-[48%] h-full p-1 border-none focus:ring-0 text-xs text-black bg-transparent outline-none`}
                                placeholder="..."
                                value={
                                    (data.jenis_asuransi || "").split(
                                        " / ",
                                    )[1] || ""
                                }
                                onChange={(e) => {
                                    const parts = (
                                        data.jenis_asuransi || ""
                                    ).split(" / ");
                                    setData(
                                        "jenis_asuransi",
                                        `${parts[0] || ""} / ${e.target.value}`,
                                    );
                                }}
                            />{" "}
                        </div>{" "}
                    </div>{" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1">Alamat Rumah</div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[78%] border-l border-black">
                            <input
                                type="text"
                                className={`${inputClasses} resize-none mb-0 min-h-[25px]`}
                                value={data.alamat_rumah}
                                onChange={(e) =>
                                    setData("alamat_rumah", e.target.value)
                                }
                            />
                        </div>{" "}
                    </div>{" "}
                    <div className="flex border-b border-black min-h-[25px]">
                        {" "}
                        <div className="w-[20%] p-1">Nama Pendamping</div>{" "}
                        <div className="w-[2%] p-1 text-center">:</div>{" "}
                        <div className="w-[78%] border-l border-black">
                            <input
                                type="text"
                                className={inputClasses}
                                value={data.nama_pendamping}
                                onChange={(e) =>
                                    setData("nama_pendamping", e.target.value)
                                }
                            />
                        </div>{" "}
                    </div>{" "}
                    {/* TGL MASUK RS / PUKUL */}{" "}
                    <div className="flex min-h-[40px]">
                        {" "}
                        <div className="w-[44%] flex">
                            {" "}
                            <div className="w-1/2 p-1 font-bold flex flex-col justify-center text-center">
                                Tanggal Masuk
                                <br />
                                RS :
                            </div>{" "}
                            <div className="w-1/2 border-l border-black">
                                <input
                                    type="date"
                                    className={`h-full text-center ${inputClasses}`}
                                    value={data.tgl_masuk_rs}
                                    onChange={(e) =>
                                        setData("tgl_masuk_rs", e.target.value)
                                    }
                                />
                            </div>{" "}
                        </div>{" "}
                        <div className="w-[55%] flex border-l border-black">
                            {" "}
                            <div className="w-[15%] p-1 font-bold flex flex-col justify-center text-center">
                                Pukul
                                <br />:
                            </div>{" "}
                            <div className="w-[85%] border-l border-black">
                                <input
                                    type="time"
                                    className={`h-full text-center ${inputClasses}`}
                                    value={data.jam_masuk_rs}
                                    onChange={(e) =>
                                        setData("jam_masuk_rs", e.target.value)
                                    }
                                />
                            </div>{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
                {/* 3. TABEL KOLOM MEDIS (Anamnesa dst) */}{" "}
                <div className="border border-black text-xs font-serif mb-2">
                    {" "}
                    {[
                        ["Anamnesa", "anamnesa"],
                        ["Riwayat Penyakit Sebelumnya", "riwayat_penyakit"],
                        ["Diagnosa", "diagnosa"],
                        ["Tindakan yang telah dilakukan", "tindakan_dilakukan"],
                        ["Terapi yang telah diberikan", "terapi_diberikan"],
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`flex flex-col md:flex-row print:flex-row min-h-[40px] ${i < 4 ? "border-b border-black" : ""}`}
                        >
                            {" "}
                            <div className="w-full md:w-[30%] print:w-[30%] p-1 border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-black bg-gray-50 md:bg-transparent print:bg-transparent font-bold md:font-normal print:font-normal">
                                {item[0]}
                            </div>{" "}
                            <div className="w-full md:w-[70%] print:w-[70%]">
                                <textarea
                                    className={`w-full p-1 border-none focus:ring-0 text-xs bg-transparent outline-none overflow-hidden block ${isPrinting ? "min-h-[40px]" : ""}`}
                                    value={data[item[1]]}
                                    onChange={(e) =>
                                        setData(item[1], e.target.value)
                                    }
                                    rows="2"
                                ></textarea>
                            </div>{" "}
                        </div>
                    ))}{" "}
                </div>{" "}
                {/* 4. TABEL BESAR: RINGKASAN KONDISI PASIEN & STATUS PASIEN */}{" "}
                <div className="border border-black text-xs font-serif mb-2 overflow-x-auto">
                    {" "}
                    <div className="min-w-[800px] md:min-w-0">
                        {" "}
                        <div className="text-center font-bold border-b border-black py-1">
                            RINGKASAN KONDISI PASIEN
                        </div>{" "}
                        {/* Header Kolom */}{" "}
                        <div className="flex font-bold text-center border-b border-black text-[10px]">
                            {" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                Pukul
                            </div>{" "}
                            <div className="w-[12%] border-r border-black flex items-center justify-center p-1">
                                Keadaan
                                <br />
                                Umum
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                TD
                                <br />
                                (mmHg)
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                HR
                                <br />
                                (x/mnt)
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                RR
                                <br />
                                (x/mnt)
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                Suhu
                                <br />
                                (°C)
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                SpO2
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                GDS
                            </div>{" "}
                            <div className="w-[8%] border-r border-black flex items-center justify-center p-1">
                                EKG
                            </div>{" "}
                            <div className="w-[10%] border-r border-black flex items-center justify-center p-1">
                                Skala
                                <br />
                                Nyeri
                            </div>{" "}
                            <div className="w-[14%] flex items-center justify-center p-1">
                                Keterangan
                                <br />
                                Lain
                            </div>{" "}
                        </div>{" "}
                        {/* Rendering Baris Input Secara Selang-seling */}{" "}
                        {data.ringkasan_kondisi.map((row, idx) => {
                            const states = [
                                "status_sblm",
                                "status_selama",
                                "status_stlh",
                            ];
                            const placeholders = [
                                "STATUS PASIEN SEBELUM TRANSFER",
                                "STATUS PASIEN SELAMA TRANSFER",
                                "STATUS PASIEN SETELAH TRANSFER",
                            ];
                            return (
                                <React.Fragment key={idx}>
                                    {" "}
                                    {/* Baris Input Vital Sign Kosong */}{" "}
                                    <div
                                        className={`flex min-h-[30px] ${idx < 3 ? "border-b border-black" : ""}`}
                                    >
                                        {" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="time"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.pukul}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "pukul",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[12%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.keadaan}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "keadaan",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.td}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "td",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.hr}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "hr",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.rr}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "rr",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.suhu}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "suhu",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.spo2}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "spo2",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.gds}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "gds",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[8%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.ekg}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "ekg",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[10%] border-r border-black">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.nyeri}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "nyeri",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                        <div className="w-[14%]">
                                            <input
                                                type="text"
                                                className={`text-center h-full ${inputClasses}`}
                                                value={row.ket}
                                                onChange={(e) =>
                                                    oc_ringkasan(
                                                        idx,
                                                        "ket",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>{" "}
                                    </div>{" "}
                                    {/* Baris Text Status (Full-width text input) */}{" "}
                                    {idx < 3 && (
                                        <div className="border-b border-black text-center relative bg-white">
                                            {" "}
                                            <input
                                                type="text"
                                                placeholder={placeholders[idx]}
                                                className={`text-center font-bold w-full p-0 bg-transparent border-none focus:ring-0 uppercase block tracking-wider ${inputClasses}`}
                                                value={data[states[idx]]}
                                                onChange={(e) =>
                                                    setData(
                                                        states[idx],
                                                        e.target.value,
                                                    )
                                                }
                                            />{" "}
                                        </div>
                                    )}{" "}
                                </React.Fragment>
                            );
                        })}{" "}
                    </div>{" "}
                </div>{" "}
                {/* 6. NAMA PETUGAS PENDAMPING */}{" "}
                <div className="border border-black text-xs font-serif mb-2">
                    {" "}
                    <div className="text-center font-bold border-b border-black py-1 uppercase">
                        NAMA PETUGAS PENDAMPING
                    </div>{" "}
                    <div className="flex flex-col md:flex-row print:flex-row border-b border-black font-bold text-center">
                        {" "}
                        <div className="w-full md:w-[30%] print:w-[30%] border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-black py-1 bg-gray-50 md:bg-transparent print:bg-transparent">
                            Petugas Pendamping :
                        </div>{" "}
                        <div className="w-full md:w-[70%] print:w-[70%] py-1">
                            NAMA
                        </div>{" "}
                    </div>{" "}
                    {["Dokter", "Perawat", "Bidan", "Driver"].map((role, i) => {
                        const k = `petugas_${role.toLowerCase()}`;
                        return (
                            <div
                                key={i}
                                className={`flex flex-col md:flex-row print:flex-row min-h-[25px] ${i < 3 ? "border-b border-black" : ""}`}
                            >
                                {" "}
                                <div className="w-full md:w-[30%] print:w-[30%] border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-black px-1 py-1 flex items-center bg-gray-50 md:bg-transparent print:bg-transparent font-bold md:font-normal print:font-normal">
                                    {role}
                                </div>{" "}
                                <div className="w-full md:w-[70%] print:w-[70%]">
                                    <input
                                        type="text"
                                        className={`px-2 ${inputClasses}`}
                                        value={data[k]}
                                        onChange={(e) =>
                                            setData(k, e.target.value)
                                        }
                                    />
                                </div>{" "}
                            </div>
                        );
                    })}{" "}
                </div>{" "}
                {/* 7. TANDA TANGAN */}{" "}
                <div className="border border-black text-xs font-serif mb-2">
                    {" "}
                    <div className="text-center font-bold border-b border-black py-1 uppercase">
                        NAMA DAN TANDA TANGAN PETUGAS
                    </div>{" "}
                    <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 min-h-[120px]">
                        {" "}
                        {/* KOLOM KIRI (GABUNGAN TANGGAL, PUKUL, DAN RS) */}{" "}
                        <div className="border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-black p-1 flex flex-col justify-center gap-2">
                            {" "}
                            <div className="flex items-center">
                                {" "}
                                <div className="w-16 font-bold">Tanggal</div>
                                <div className="mx-1">:</div>{" "}
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        className={inputClasses}
                                        value={data.tgl_serah_terima}
                                        onChange={(e) =>
                                            setData(
                                                "tgl_serah_terima",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>{" "}
                            </div>{" "}
                            <div className="flex items-center">
                                {" "}
                                <div className="w-16 font-bold">Pukul</div>
                                <div className="mx-1">:</div>{" "}
                                <div className="flex-1">
                                    <input
                                        type="time"
                                        className={inputClasses}
                                        value={data.jam_serah_terima}
                                        onChange={(e) =>
                                            setData(
                                                "jam_serah_terima",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>{" "}
                            </div>{" "}
                            <div className="flex items-center">
                                {" "}
                                <div className="w-16 font-bold">RS</div>
                                <div className="mx-1">:</div>{" "}
                                <div className="flex-1 border-b border-black">
                                    <input
                                        type="text"
                                        className={`w-full p-1 bg-transparent outline-none focus:ring-0 text-xs font-bold uppercase block`}
                                        placeholder="NAMA RS"
                                        value={data.rs_1}
                                        onChange={(e) =>
                                            setData("rs_1", e.target.value)
                                        }
                                    />
                                </div>{" "}
                            </div>{" "}
                        </div>{" "}
                        {/* KOLOM TENGAH (YANG MENYERAHKAN) */}{" "}
                        <div className="border-b md:border-b-0 print:border-b-0 md:border-r print:border-r border-black p-1 flex flex-col text-center relative">
                            {" "}
                            <div className="mb-1 text-center font-bold">
                                Yang Menyerahkan:
                            </div>{" "}
                            <div className="w-full h-20 relative border border-dashed border-gray-300 overflow-hidden">
                                {" "}
                                {isPrinting ? (
                                    <div className="w-full h-full" />
                                ) : (
                                    <SignatureCanvas
                                        ref={sigMenyerahkan}
                                        canvasProps={{
                                            className:
                                                "w-full h-full absolute inset-0 cursor-crosshair",
                                        }}
                                    />
                                )}{" "}
                            </div>{" "}
                            <input
                                type="text"
                                className={`mt-1 text-center font-bold uppercase ${inputClasses}`}
                                placeholder="NAMA TERANG"
                                value={data.nama_menyerahkan}
                                onChange={(e) =>
                                    setData("nama_menyerahkan", e.target.value)
                                }
                            />{" "}
                            {!isPrinting && (
                                <button
                                    className="absolute top-1 right-1 text-[10px] text-red-500 bg-red-100 px-1 rounded"
                                    onClick={() =>
                                        sigMenyerahkan.current.clear()
                                    }
                                >
                                    Hapus
                                </button>
                            )}{" "}
                        </div>{" "}
                        {/* KOLOM KANAN (YANG MENERIMA) */}{" "}
                        <div className="p-1 flex flex-col text-center relative">
                            {" "}
                            <div className="mb-1 text-center font-bold">
                                Yang Menerima:
                            </div>{" "}
                            <div className="w-full h-20 relative border border-dashed border-gray-300 overflow-hidden">
                                {" "}
                                {isPrinting ? (
                                    <div className="w-full h-full" />
                                ) : (
                                    <SignatureCanvas
                                        ref={sigMenerima}
                                        canvasProps={{
                                            className:
                                                "w-full h-full absolute inset-0 cursor-crosshair",
                                        }}
                                    />
                                )}{" "}
                            </div>{" "}
                            <input
                                type="text"
                                className={`mt-1 text-center font-bold uppercase ${inputClasses}`}
                                placeholder="NAMA TERANG"
                                value={data.nama_menerima}
                                onChange={(e) =>
                                    setData("nama_menerima", e.target.value)
                                }
                            />{" "}
                            {!isPrinting && (
                                <button
                                    className="absolute top-1 right-1 text-[10px] text-red-500 bg-red-100 px-1 rounded"
                                    onClick={() => sigMenerima.current.clear()}
                                >
                                    Hapus
                                </button>
                            )}{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
                {/* 8. KOP MENGETAHUI BAWAH (NAMA & TTD BEBAS) */}{" "}
                <div className="mt-8 flex justify-end text-xs font-serif print:mr-10">
                    {" "}
                    <div className="text-center w-64 pb-8 flex flex-col items-center">
                        {" "}
                        <div className="flex mb-1 w-full justify-center">
                            {" "}
                            <span>Semarang, </span>{" "}
                            <span className="w-32 border-b border-dotted border-black">
                                {" "}
                                <input
                                    type="text"
                                    className="w-full p-0 text-center border-none bg-transparent focus:ring-0 text-xs h-4 mb-1"
                                />{" "}
                            </span>{" "}
                        </div>{" "}
                        <div className="my-8 text-center leading-tight">
                            Mengetahui,
                        </div>{" "}
                        <div className="w-48 h-24 relative border border-dashed border-gray-300 mb-2 overflow-hidden">
                            {" "}
                            {isPrinting ? (
                                <div className="w-full h-full" />
                            ) : (
                                <SignatureCanvas
                                    ref={sigMengetahui}
                                    canvasProps={{
                                        className:
                                            "w-full h-full absolute inset-0 cursor-crosshair",
                                    }}
                                />
                            )}{" "}
                            {!isPrinting && (
                                <button
                                    className="absolute top-1 right-1 text-[10px] text-red-500 bg-red-100 px-1 rounded z-10"
                                    onClick={() =>
                                        sigMengetahui.current.clear()
                                    }
                                >
                                    Hapus
                                </button>
                            )}{" "}
                        </div>{" "}
                        {/* KOTAK UNTUK NAMA MENGETAHUI AGAR BISA DIKETIK */}{" "}
                        <div className="w-full px-4">
                            {" "}
                            <input
                                type="text"
                                placeholder="( NAMA TERANG )"
                                className="w-full text-center font-bold border-none underline decoration-1 underline-offset-4 bg-transparent outline-none focus:ring-0 p-0 text-xs uppercase"
                                value={data.nama_mengetahui}
                                onChange={(e) =>
                                    setData("nama_mengetahui", e.target.value)
                                }
                            />{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
            </div>{" "}
            {/* --- TOMBOL BAWAH --- */}
            <div className="grid grid-cols-4 mt-3 mb-5 text-xs md:text-sm sm:text-xs print:hidden">
                <div></div>
                <button
                    type="button"
                    onClick={simpanData}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                    {id ? "Perbarui" : "Simpan"}
                </button>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                    Print
                </button>
            </div>
        </div>
    );
}
