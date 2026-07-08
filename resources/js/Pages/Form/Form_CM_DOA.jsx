import React, { useState, useRef, useEffect, useMemo } from "react";
import HeaderLogo from "@/Components/Headers/HeaderLogo";
import HeaderIdentitas from "@/Components/Headers/HeaderIdentitas";
import Identitas_Tim from "@/Components/Form/Identitas_Tim";
import { Head, useForm } from "@inertiajs/react";
import SignatureCanvas from "react-signature-canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import axios from 'axios';

export default function Form_CM_DOA(props) {
    const id = props.id;
    const { data, setData, post, processing } = useForm({
        id: id || "",
        nama_pasien: "",
        ttl: "",
        jenis_kelamin: "L",
        nik: "",
        alamat: "",
        no_telepon: "",
        nama_tim: "",
        petugas_dokter: "",
        petugas_perawat: "",
        petugas_bidan: "",
        petugas_driver: "",
        petugas_nakes_1: "",
        petugas_nakes_2: "",
        kondisi_kritis: [],
        jalan_napas: [],
        pernafasan: [],
        sirkulasi: [],
        eksposur: [],
        kesimpulan_awal: [],
        gcs_e: "",
        gcs_v: "",
        gcs_m: "",
        pupil: "",
        reflek_cahaya: "",
        lateralisasi: "",
        td: "",
        hr: "",
        rr: "",
        suhu: "",
        spo2: "",
        skala_nyeri: "",
        pukul: "",
        fu_td: "",
        fu_hr: "",
        fu_rr: "",
        fu_suhu: "",
        fu_spo2: "",
        fu_skala_nyeri: "",
        fu_pukul: "",
        keluhan_utama: "",
        riwayat_sekarang: "",
        riwayat_dahulu: [],
        riwayat_keluarga: "",
        riwayat_obat: "",
        pf_normocephal: "",
        pf_sclera_ikterik_1: "",
        pf_sclera_ikterik_2: "",
        pf_conj_anemis_1: "",
        pf_conj_anemis_2: "",
        pf_perbesaran_kelenjar_getah_bening: "",
        pf_deviasi_trachea: "",
        pf_suara_dasar_veikuler_1: "",
        pf_suara_dasar_veikuler_2: "",
        pf_rhonki_1: "",
        pf_rhonki_2: "",
        pf_wheezing_1: "",
        pf_wheezing_2: "",
        pf_bunyi_jantung_1_2: "",
        pf_bunyi_jantung_1_2_status: "",
        pf_bising_usus: "",
        pf_bising_usus_status: "",
        pf_nyeri_tekan_abdomen: "",
        pf_nyeri_tekan_abdomen_area: "",
        pf_akral_hangat_a_1: "",
        pf_akral_hangat_a_2: "",
        pf_akral_hangat_b_1: "",
        pf_akral_hangat_b_2: "",
        pf_oedema_a_1: "",
        pf_oedema_a_2: "",
        pf_oedema_b_1: "",
        pf_oedema_b_2: "",
        anatomi_tubuh: null,
        ekg: "",
        gds: "",
        au: "",
        chol: "",
        hb: "",
        diagnosis_medis: ["", "", "", "", ""],
        terapi_tindakan: ["", "", "", "", ""],
        rs_rujukan: "",
        tgl_rujukan: "",
        jam_rujukan: "",
        nama_petugas: "",
        nama_keluarga: "",
        ttd_petugas: null,
        ttd_keluarga: null,
    });
    const [isPrinting, setIsPrinting] = useState(false);
    const ref_print = useRef();
    const [get_data_icd_10, set_data_icd_10] = useState([]);
    const [get_identitas_pasien, set_identitas_pasien] = useState({
        id: "",
        nik: "",
        nama: "",
        tgl_lahir: "",
        umur: "",
        alamat: "",
        alamat_kelurahan: "",
        alamat_kecamatan: "",
        no_telepon: "",
        tgl_penanganan: new Date().toISOString().split("T")[0],
    });
    const os_identitas_pasien = (identity) => {
        if (typeof identity === "function") {
            set_identitas_pasien((prev) => {
                const res = identity(prev);
                setData((v) => ({
                    ...v,
                    nik: res.nik || "",
                    nama_pasien: res.nama || "",
                    ttl:
                        (res.tgl_lahir || "") +
                        (res.umur ? "/" + res.umur : ""),
                    alamat: res.alamat || "",
                    no_telepon: res.no_telepon || "",
                }));
                return res;
            });
        } else {
            set_identitas_pasien(identity);
            setData((prev) => ({
                ...prev,
                nik: identity.nik || "",
                nama_pasien: identity.nama || "",
                ttl:
                    (identity.tgl_lahir || "") +
                    (identity.umur ? "/" + identity.umur : ""),
                alamat: identity.alamat || "",
                no_telepon: identity.no_telepon || "",
            }));
        }
    };
    const sigAnatomi = useRef();
    const sigPetugas = useRef();
    const sigKeluarga = useRef();
    const checkedArray = (field, value) =>
        Array.isArray(data[field]) && data[field].includes(value);
    const checkboxChange = (field, value) => {
        let arr = Array.isArray(data[field]) ? [...data[field]] : [];
        if (arr.includes(value)) arr = arr.filter((i) => i !== value);
        else arr.push(value);
        setData(field, arr);
    };
    const memoized_icd_10 = useMemo(() => {
        return get_data_icd_10.map((opts, i) => (
            <option key={i} id={opts.id} value={opts.diagnosis}>
                {""}
                {opts.kode_icd}
                {""}
            </option>
        ));
    }, [get_data_icd_10]);
    const oc_tambah_diagnosis_medis = () => {
        setData("diagnosis_medis", [...data.diagnosis_medis, ""]);
    };
    const oc_hapus_diagnosis_medis = (index) => {
        const newList = [...data.diagnosis_medis];
        newList.splice(index, 1);
        setData("diagnosis_medis", newList);
    };
    const oc_tambah_terapi_tindakan = () => {
        setData("terapi_tindakan", [...data.terapi_tindakan, ""]);
    };
    const oc_hapus_terapi_tindakan = (index) => {
        const newList = [...data.terapi_tindakan];
        newList.splice(index, 1);
        setData("terapi_tindakan", newList);
    };
    const arrayTextChange = (field, index, value) => {
        let arr = [...data[field]];
        arr[index] = value;
        setData(field, arr);
    };
    useEffect(() => {
        window.axios
            .post(window.location.origin + "/ref_icd_10")
            .then((res) => set_data_icd_10(res.data));
        if (id) {
            window.axios
                .post(window.location.origin + "/ref_form_cm_doa", {
                    id_form: id,
                })
                .then((response) => {
                    const row = response.data;
                    console.log("✅ Data Form CM DOA loaded:", row);  // DEBUG
                    if (row) {
                        const parseJSON = (val, fallback) => {
                            if (Array.isArray(val)) return val;
                            if (typeof val === "object" && val !== null)
                                return Object.values(val);
                            try {
                                let parsed = val ? JSON.parse(val) : fallback;
                                if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
                                    return Object.values(parsed);
                                }
                                return Array.isArray(parsed) ? parsed : fallback;
                            } catch (e) {
                                return fallback;
                            }
                        };
                        
                        /* HELPER: Normalize semua field dari API response
                           Pastikan tidak ada field yang null/undefined saat set ke state */
                        const normalizeField = (val, defaultVal = "") => {
                            if (val === null || val === undefined) return defaultVal;
                            return val;
                        };
                        
                        setData({
                            id: id,
                            nama_pasien: normalizeField(row.nama_pasien),
                            ttl: normalizeField(row.ttl),
                            jenis_kelamin: row.jenis_kelamin || "L",
                            nik: normalizeField(row.nik),
                            alamat: normalizeField(row.alamat),
                            no_telepon: normalizeField(row.no_telepon),
                            nama_tim: normalizeField(row.nama_tim),
                            petugas_dokter: normalizeField(row.petugas_dokter),
                            petugas_perawat: normalizeField(row.petugas_perawat),
                            petugas_bidan: normalizeField(row.petugas_bidan),
                            petugas_driver: normalizeField(row.petugas_driver),
                            petugas_nakes_1: normalizeField(row.petugas_nakes_1),
                            petugas_nakes_2: normalizeField(row.petugas_nakes_2),
                            kondisi_kritis: parseJSON(row.kondisi_kritis, []),
                            jalan_napas: parseJSON(row.jalan_napas, []),
                            pernafasan: parseJSON(row.pernafasan, []),
                            sirkulasi: parseJSON(row.sirkulasi, []),
                            eksposur: parseJSON(row.eksposur, []),
                            kesimpulan_awal: parseJSON(row.kesimpulan_awal, []),
                            gcs_e: normalizeField(row.gcs_e),
                            gcs_v: normalizeField(row.gcs_v),
                            gcs_m: normalizeField(row.gcs_m),
                            pupil: normalizeField(row.pupil),
                            reflek_cahaya: normalizeField(row.reflek_cahaya),
                            lateralisasi: normalizeField(row.lateralisasi),
                            td: normalizeField(row.td),
                            hr: normalizeField(row.hr),
                            rr: normalizeField(row.rr),
                            suhu: normalizeField(row.suhu),
                            spo2: normalizeField(row.spo2),
                            skala_nyeri: normalizeField(row.skala_nyeri),
                            pukul: normalizeField(row.pukul),
                            fu_td: normalizeField(row.fu_td),
                            fu_hr: normalizeField(row.fu_hr),
                            fu_rr: normalizeField(row.fu_rr),
                            fu_suhu: normalizeField(row.fu_suhu),
                            fu_spo2: normalizeField(row.fu_spo2),
                            fu_skala_nyeri: normalizeField(row.fu_skala_nyeri),
                            fu_pukul: normalizeField(row.fu_pukul),
                            keluhan_utama: normalizeField(row.keluhan_utama),
                            riwayat_sekarang: normalizeField(row.riwayat_sekarang),
                            riwayat_dahulu: parseJSON(row.riwayat_dahulu, []),
                            riwayat_keluarga: normalizeField(row.riwayat_keluarga),
                            riwayat_obat: normalizeField(row.riwayat_obat),
                            pf_normocephal: normalizeField(row.pf_normocephal),
                            pf_sclera_ikterik_1: normalizeField(row.pf_sclera_ikterik_1),
                            pf_sclera_ikterik_2: normalizeField(row.pf_sclera_ikterik_2),
                            pf_conj_anemis_1: normalizeField(row.pf_conj_anemis_1),
                            pf_conj_anemis_2: normalizeField(row.pf_conj_anemis_2),
                            pf_perbesaran_kelenjar_getah_bening:
                                normalizeField(row.pf_perbesaran_kelenjar_getah_bening),
                            pf_deviasi_trachea: normalizeField(row.pf_deviasi_trachea),
                            pf_suara_dasar_veikuler_1:
                                normalizeField(row.pf_suara_dasar_veikuler_1),
                            pf_suara_dasar_veikuler_2:
                                normalizeField(row.pf_suara_dasar_veikuler_2),
                            pf_rhonki_1: normalizeField(row.pf_rhonki_1),
                            pf_rhonki_2: normalizeField(row.pf_rhonki_2),
                            pf_wheezing_1: normalizeField(row.pf_wheezing_1),
                            pf_wheezing_2: normalizeField(row.pf_wheezing_2),
                            pf_bunyi_jantung_1_2:
                                normalizeField(row.pf_bunyi_jantung_1_2),
                            pf_bunyi_jantung_1_2_status:
                                normalizeField(row.pf_bunyi_jantung_1_2_status),
                            pf_bising_usus: normalizeField(row.pf_bising_usus),
                            pf_bising_usus_status:
                                normalizeField(row.pf_bising_usus_status),
                            pf_nyeri_tekan_abdomen:
                                normalizeField(row.pf_nyeri_tekan_abdomen),
                            pf_nyeri_tekan_abdomen_area:
                                normalizeField(row.pf_nyeri_tekan_abdomen_area),
                            pf_akral_hangat_a_1: normalizeField(row.pf_akral_hangat_a_1),
                            pf_akral_hangat_a_2: normalizeField(row.pf_akral_hangat_a_2),
                            pf_akral_hangat_b_1: normalizeField(row.pf_akral_hangat_b_1),
                            pf_akral_hangat_b_2: normalizeField(row.pf_akral_hangat_b_2),
                            pf_oedema_a_1: normalizeField(row.pf_oedema_a_1),
                            pf_oedema_a_2: normalizeField(row.pf_oedema_a_2),
                            pf_oedema_b_1: normalizeField(row.pf_oedema_b_1),
                            pf_oedema_b_2: normalizeField(row.pf_oedema_b_2),
                            ekg: normalizeField(row.ekg),
                            gds: normalizeField(row.gds),
                            au: normalizeField(row.au),
                            chol: normalizeField(row.chol),
                            hb: normalizeField(row.hb),
                            diagnosis_medis: parseJSON(row.diagnosis_medis, [
                                "",
                                "",
                                "",
                                "",
                                "",
                            ]),
                            terapi_tindakan: parseJSON(row.terapi_tindakan, [
                                "",
                                "",
                                "",
                                "",
                                "",
                            ]),
                            rs_rujukan: normalizeField(row.rs_rujukan),
                            tgl_rujukan: normalizeField(row.tgl_rujukan),
                            jam_rujukan: normalizeField(row.jam_rujukan),
                            nama_petugas: normalizeField(row.nama_petugas),
                            nama_keluarga: normalizeField(row.nama_keluarga),
                        });
                        set_identitas_pasien({
                            id: "",
                            nik: normalizeField(row.nik),
                            nama: normalizeField(row.nama_pasien),
                            tgl_lahir: (normalizeField(row.ttl)).split("/")[0] || "",
                            umur: (normalizeField(row.ttl)).split("/")[1] || "",
                            alamat: normalizeField(row.alamat),
                            no_telepon: normalizeField(row.no_telepon),
                            tgl_penanganan: row.created_at
                                ? row.created_at.split("T")[0]
                                : new Date().toISOString().split("T")[0],
                        });
                        if (row.anatomi_tubuh && sigAnatomi.current) {
                            setTimeout(
                                () =>
                                    sigAnatomi.current.fromDataURL(
                                        row.anatomi_tubuh,
                                    ),
                                500,
                            );
                        }
                        if (row.ttd_petugas && sigPetugas.current) {
                            setTimeout(
                                () =>
                                    sigPetugas.current.fromDataURL(
                                        row.ttd_petugas,
                                    ),
                                500,
                            );
                        }
                        if (row.ttd_keluarga && sigKeluarga.current) {
                            setTimeout(
                                () =>
                                    sigKeluarga.current.fromDataURL(
                                        row.ttd_keluarga,
                                    ),
                                500,
                            );
                        }
                    }
                })
                .catch((err) => {
                    console.error("❌ Gagal load Form CM DOA:", err);
                    console.error("Error response:", err.response?.data);
                });
        }
    }, [id, get_data_icd_10?.length]);
    const [daftarRS, setDaftarRS] = useState([]);

    useEffect(() => {
    // Pakai axios.post dan format parameter object biasa
    axios.post(window.location.origin + '/ref_faskes', { jenis: 'rumah sakit' })
        .then(response => {
            setDaftarRS(response.data);
        })
        .catch(error => console.log("Gagal memuat data RS:", error));
    }, []);
    const simpanData = () => {
        if (data.nik && data.nik.length !== 16) {
            toast.error("NIK harus terdiri dari tepat 16 digit angka", {
                position: "top-right",
            });
            return;
        }
        let cek_diagnosis = true;
        if (data.diagnosis_medis) {
            data.diagnosis_medis.forEach((item) => {
                if (item && item.trim() !== "") {
                    const s_kode = get_data_icd_10.find(
                        (val) => val.diagnosis === item,
                    )?.kode_icd;
                    if (!s_kode) cek_diagnosis = false;
                }
            });
        }
        if (!cek_diagnosis) {
            toast.error("Diagnosis medis tidak sesuai ICD-10", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        const formData = {
            ...data,
            id_form: id,
            anatomi_tubuh: !sigAnatomi.current?.isEmpty()
                ? sigAnatomi.current.getCanvas().toDataURL("image/png")
                : null,
            ttd_petugas: !sigPetugas.current?.isEmpty()
                ? sigPetugas.current.getCanvas().toDataURL("image/png")
                : null,
            ttd_keluarga: !sigKeluarga.current?.isEmpty()
                ? sigKeluarga.current.getCanvas().toDataURL("image/png")
                : null,
        };
        const url = id
            ? window.location.origin + "/form_cm_doa/perbarui"
            : window.location.origin + "/form_cm_doa/simpan";
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
    const promiseResolveRef = useRef();
    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            promiseResolveRef.current();
        }
    }, [isPrinting]);
    const handlePrint = useReactToPrint({
        content: () => ref_print.current,
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => setIsPrinting(false),
    });
    return (
        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            {""}
            <Head title="Form CM DOA" /> <ToastContainer />
            {""}
            {/* SIHIR CSS KERTAS A4 & ZOOM PRINT */}
            {""}
            <style>{` @media print { @page { size: A4 portrait; margin: 0mm !important; } body, html { margin: 0 !important; padding: 0 !important; background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-container { width: 1050px !important; max-width: 1050px !important; zoom: 0.45 !important; padding: 2mm 5mm !important; margin: 0 auto !important; box-shadow: none !important; border: none !important; } } `}</style>
            {""}
            {/* TOMBOL-TOMBOL MELAYANG DI ATAS MEJA ABU-ABU */}
            {""}
            {/* --- TOMBOL ATAS --- */}
            <div className="flex justify-center print:hidden">
                <a
                    href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none"
                >
                    Kembali
                </a>
            </div>
            {""}
            {/* INI KUNCINYA BROW: KERTAS A4 DI TENGAH LAYAR */}
            {""}
            <div
                ref={ref_print}
                className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black text-xs md:text-sm sm:text-xs leading-none shrink-0"
            >
                {""}
                    {/* HEADER IDENTITAS */} {/* HEADER IDENTITAS */}
                    {""}
                    <HeaderIdentitas
                        isPrinting={isPrinting}
                        data={get_identitas_pasien}
                        onChange={os_identitas_pasien}
                    />
                    {""}
                    {/* SUB TITLE & TEAMS (MODERNIZED) */}
                    {""}
                    <div className="text-center font-bold text-sm md:text-base sm:text-sm mb-2 print:mb-1 uppercase border border-black p-1 p-2 print:p-1 bg-gray-100 shadow-sm">
                        {""}
                        ASESMEN GAWAT DARURAT{""}
                    </div>
                    {""}
                    <div className="w-full mb-2 print:mb-1">
                        {""}
                        <Identitas_Tim
                            isPrinting={isPrinting}
                            onSubmit={(timData) => {
                                setData({
                                    ...data,
                                    nama_tim: timData.tim || "",
                                    petugas_dokter: timData.dokter || "",
                                    petugas_perawat: timData.perawat || "",
                                    petugas_bidan: timData.bidan || "",
                                    petugas_driver: timData.driver || "",
                                    petugas_nakes_1: timData.nakes_1 || "",
                                    petugas_nakes_2: timData.nakes_2 || "",
                                });
                            }}
                            auth={props.auth}
                            id_form={id}
                            initialData={{
                                tim: data.nama_tim || "",
                                dokter: data.petugas_dokter || "",
                                perawat: data.petugas_perawat || "",
                                bidan: data.petugas_bidan || "",
                                driver: data.petugas_driver || "",
                                nakes_1: data.petugas_nakes_1 || "",
                                nakes_2: data.petugas_nakes_2 || "",
                            }}
                        />
                        {""}
                    </div>
                    {""}
                    {/* SECTION I SURVEI PRIMER */}
                    {""}
                    <div className="border border-black p-1 mb-1 flex text-sm">
                        {""}
                        <div className="w-[22%] p-2 print:p-1 border-r border-black font-bold flex flex-col bg-gray-50">
                            {""}
                            <div className="mb-2 print:mb-1 text-center border-b border-black pb-1 uppercase tracking-tighter text-xs">
                                TANDA VITAL
                            </div>
                            {""}
                            <div className="flex flex-col gap-2 print:gap-1 w-full font-normal flex-1">
                                {""}
                                <div className="flex items-center font-bold">
                                    TD<span className="w-4 text-center">:</span>
                                    {""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none text-center bg-transparent focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.td || ""}
                                        onChange={(e) =>
                                            setData("td", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="ml-1 w-10 text-right text-[12px] font-normal text-gray-400">
                                        mmHg
                                    </span>
                                </div>
                                {""}
                                <div className="flex items-center font-bold">
                                    HR<span className="w-4 text-center">:</span>
                                    {""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none text-center bg-transparent focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.hr || ""}
                                        onChange={(e) =>
                                            setData("hr", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="ml-1 w-10 text-right text-[12px] font-normal text-gray-400">
                                        x/mnt
                                    </span>
                                </div>
                                {""}
                                <div className="flex items-center font-bold">
                                    RR<span className="w-4 text-center">:</span>
                                    {""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none text-center bg-transparent focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.rr || ""}
                                        onChange={(e) =>
                                            setData("rr", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="ml-1 w-10 text-right text-[12px] font-normal text-gray-400">
                                        x/mnt
                                    </span>
                                </div>
                                {""}
                                <div className="flex items-center font-bold">
                                    Suhu
                                    <span className="w-4 text-center">:</span>
                                    {""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none text-center bg-transparent focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.suhu || ""}
                                        onChange={(e) =>
                                            setData("suhu", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="ml-1 w-10 text-right text-[12px] font-normal text-gray-400">
                                        °C
                                    </span>
                                </div>
                                {""}
                                <div className="flex items-center font-bold">
                                    SpO2
                                    <span className="w-4 text-center">:</span>
                                    {""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none text-center bg-transparent focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.spo2 || ""}
                                        onChange={(e) =>
                                            setData("spo2", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="ml-1 w-10 text-right text-[12px] font-normal text-gray-400">
                                        %
                                    </span>
                                </div>
                                {""}
                                <div className="flex items-center whitespace-nowrap mt-2 font-bold">
                                    Skala Nyeri:{""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-dotted border-gray-300 outline-none ml-2 text-center bg-transparent font-bold focus:ring-0 transition-all shadow-none"
                                        value={data.skala_nyeri || ""}
                                        onChange={(e) =>
                                            setData(
                                                "skala_nyeri",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                {""}
                                <div className="flex items-center font-bold">
                                    Pukul:{""}
                                    <input
                                        className="w-0 flex-1 border-0 border-b border-gray-300 outline-none ml-2 text-center bg-transparent text-sm focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.pukul || ""}
                                        onChange={(e) =>
                                            setData("pukul", e.target.value)
                                        }
                                    />
                                </div>
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-[78%] flex flex-col">
                            {""}
                            <div className="text-center font-bold bg-gray-200 border-b border-black p-2 print:p-1 text-sm tracking-widest uppercase">
                                I. SURVEI PRIMER
                            </div>
                            {""}
                            <div className="grid grid-cols-4 border-b border-black bg-white">
                                {""}
                                <div className="p-2 print:p-1 border-r border-black">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        KONDISI KRITIS
                                    </div>
                                    {""}
                                    <div className="flex flex-col gap-1 mt-2">
                                        {""}
                                        {[
                                            "Henti Napas",
                                            "Hanya Merespon Nyeri",
                                            "Distress Pernafasan Berat",
                                            "Nadi Tidak Teraba / Syok",
                                            "SpO2 <90%",
                                            "Kejang (sedang)",
                                            "Tidak Ada",
                                        ].map((val) => (
                                            <label
                                                key={val}
                                                className="flex gap-2 items-center leading-tight cursor-pointer py-0.5"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                    checked={checkedArray(
                                                        "kondisi_kritis",
                                                        val,
                                                    )}
                                                    onChange={(e) =>
                                                        checkboxChange(
                                                            "kondisi_kritis",
                                                            val,
                                                        )
                                                    }
                                                />
                                                <span className="font-medium text-xs">
                                                    {val}
                                                </span>
                                            </label>
                                        ))}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="p-2 print:p-1 border-r border-black">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        JALAN NAPAS
                                    </div>
                                    {""}
                                    <div className="flex flex-col gap-1 mt-2">
                                        {""}
                                        {[
                                            "Paten",
                                            "Parsial",
                                            "Obstruksi (Total)",
                                            "Snoring",
                                            "Gurgling",
                                        ].map((val) => (
                                            <label
                                                key={val}
                                                className="flex gap-2 items-center leading-tight cursor-pointer py-0.5"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                    checked={checkedArray(
                                                        "jalan_napas",
                                                        val,
                                                    )}
                                                    onChange={(e) =>
                                                        checkboxChange(
                                                            "jalan_napas",
                                                            val,
                                                        )
                                                    }
                                                />
                                                <span className="font-medium text-xs">
                                                    {val}
                                                </span>
                                            </label>
                                        ))}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="p-2 print:p-1 border-r border-black">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        PERNAPASAN
                                    </div>
                                    {""}
                                    <div className="flex flex-col gap-1 mt-2">
                                        {""}
                                        {[
                                            "Spontan",
                                            "Apneu",
                                            "Sianosis",
                                            "Retraksi Dada",
                                            "Nasal Flare",
                                        ].map((val) => (
                                            <label
                                                key={val}
                                                className="flex gap-2 items-center leading-tight cursor-pointer py-0.5"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                    checked={checkedArray(
                                                        "pernafasan",
                                                        val,
                                                    )}
                                                    onChange={(e) =>
                                                        checkboxChange(
                                                            "pernafasan",
                                                            val,
                                                        )
                                                    }
                                                />
                                                <span className="font-medium text-xs">
                                                    {val}
                                                </span>
                                            </label>
                                        ))}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="p-2 print:p-1 bg-gray-50">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        SIRKULASI
                                    </div>
                                    {""}
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {""}
                                        <div className="flex flex-col gap-1">
                                            {""}
                                            <div className="font-bold text-blue-800 text-[10px] uppercase tracking-widest mb-0.5">
                                                Nadi
                                            </div>
                                            {""}
                                            {[
                                                "Kuat",
                                                "Lemah",
                                                "Tak Teraba",
                                            ].map((val) => (
                                                <label
                                                    key={val}
                                                    className="flex gap-1.5 items-center leading-tight cursor-pointer py-0.5"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                        checked={checkedArray(
                                                            "sirkulasi",
                                                            val,
                                                        )}
                                                        onChange={(e) =>
                                                            checkboxChange(
                                                                "sirkulasi",
                                                                val,
                                                            )
                                                        }
                                                    />
                                                    <span className="font-medium text-xs">
                                                        {val}
                                                    </span>
                                                </label>
                                            ))}
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex flex-col gap-1">
                                            {""}
                                            <div className="font-bold text-red-800 text-[10px] uppercase tracking-widest mb-0.5">
                                                Kulit
                                            </div>
                                            {""}
                                            {[
                                                "Pucat",
                                                "Sianosis",
                                                "Mottled",
                                                "Normal",
                                            ].map((val) => (
                                                <label
                                                    key={val}
                                                    className="flex gap-1.5 items-center leading-tight cursor-pointer py-0.5"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                        checked={checkedArray(
                                                            "sirkulasi",
                                                            val,
                                                        )}
                                                        onChange={(e) =>
                                                            checkboxChange(
                                                                "sirkulasi",
                                                                val,
                                                            )
                                                        }
                                                    />
                                                    <span className="font-medium text-xs">
                                                        {val}
                                                    </span>
                                                </label>
                                            ))}
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                            </div>
                            {""}
                            <div className="grid grid-cols-3 bg-white">
                                {""}
                                <div className="p-2 print:p-1 border-r border-black flex flex-col">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        DISABILITAS
                                    </div>
                                    {""}
                                    <div className="flex flex-col gap-2 mt-2 justify-start">
                                        {""}
                                        <div className="flex items-center gap-1 font-bold text-xs">
                                            GCS:{""}
                                            <span className="text-gray-400 ml-1">
                                                E:
                                            </span>
                                            <input
                                                className="w-8 border-0 border-b border-gray-300 outline-none text-center bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.gcs_e || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "gcs_e",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {""}
                                            <span className="text-gray-400 ml-1">
                                                V:
                                            </span>
                                            <input
                                                className="w-8 border-0 border-b border-gray-300 outline-none text-center bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.gcs_v || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "gcs_v",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {""}
                                            <span className="text-gray-400 ml-1">
                                                M:
                                            </span>
                                            <input
                                                className="w-8 border-0 border-b border-gray-300 outline-none text-center bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.gcs_m || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "gcs_m",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center font-bold text-xs">
                                            Pupil:{""}
                                            <input
                                                className="flex-1 w-0 border-0 border-b border-gray-300 outline-none ml-2 bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.pupil || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "pupil",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {""}
                                        <div className="flex items-center font-bold text-xs">
                                            Reflek Cahaya:{""}
                                            <input
                                                className="flex-1 w-0 border-0 border-b border-gray-300 outline-none ml-2 bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.reflek_cahaya || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "reflek_cahaya",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {""}
                                        <div className="flex items-center font-bold border-t border-gray-100 pt-2 mt-1 text-xs">
                                            Lateralisasi:{""}
                                            <input
                                                className="flex-1 w-0 border-0 border-b border-gray-300 outline-none ml-2 bg-transparent focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                                value={data.lateralisasi || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "lateralisasi",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="p-2 print:p-1 border-r border-black flex flex-col">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        EKSPOSUR
                                    </div>
                                    {""}
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {""}
                                        {[
                                            "Dalam batas normal",
                                            "Luka",
                                            "Pendarahan",
                                            "Patah tulang",
                                            "Luka bakar",
                                            "Deformitas",
                                            "Pembengkakan",
                                        ].map((val) => (
                                            <label
                                                key={val}
                                                className="flex gap-2 items-center leading-tight cursor-pointer py-0.5"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-4 h-4 shrink-0"
                                                    checked={checkedArray(
                                                        "eksposur",
                                                        val,
                                                    )}
                                                    onChange={(e) =>
                                                        checkboxChange(
                                                            "eksposur",
                                                            val,
                                                        )
                                                    }
                                                />
                                                <span className="font-medium text-xs tracking-tighter">
                                                    {val}
                                                </span>
                                            </label>
                                        ))}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="p-2 print:p-1 flex flex-col">
                                    {""}
                                    <div className="font-bold text-center border-b border-black mb-1 pb-1 uppercase text-[11px] text-gray-500 tracking-tighter">
                                        KESIMPULAN AWAL
                                    </div>
                                    {""}
                                    <div className="flex flex-col gap-3 print:gap-2 mt-2 pl-2">
                                        {""}
                                        {[
                                            "Mengancam Jiwa",
                                            "Potensi Mengancam Jiwa",
                                            "Tidak Mengancam Jiwa",
                                        ].map((val) => (
                                            <label
                                                key={val}
                                                className="flex gap-3 items-center leading-tight cursor-pointer py-1 print:py-0 text-sm"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-5 h-5 shrink-0"
                                                    checked={checkedArray(
                                                        "kesimpulan_awal",
                                                        val,
                                                    )}
                                                    onChange={(e) =>
                                                        checkboxChange(
                                                            "kesimpulan_awal",
                                                            val,
                                                        )
                                                    }
                                                />
                                                <span className="font-bold text-sm">
                                                    {val}
                                                </span>
                                            </label>
                                        ))}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                    </div>
                    {""}
                    {/* SECTION II RIWAYAT KESEHATAN */}
                    {""}
                    <div className="border border-black p-1 mb-1 flex flex-col leading-tight shadow-sm bg-white print:break-inside-avoid">
                        {""}
                        <div className="text-center font-bold bg-gray-200 border-b border-black p-2 print:p-1 w-full text-sm md:text-base sm:text-sm tracking-widest uppercase">
                            II. RIWAYAT KESEHATAN
                        </div>
                        {""}
                        <div className="w-full flex border-b border-black hover:bg-gray-50 transition-colors">
                            {""}
                            <div className="w-[22%] p-3 print:p-2 border-r border-black font-bold flex items-center bg-gray-50 uppercase tracking-tighter text-sm text-gray-600">
                                Keluhan Utama
                            </div>
                            {""}
                            <div className="w-[78%] p-3 print:p-2">
                                {""}
                                <input
                                    className="w-full outline-none bg-transparent border-0 border-b border-dotted border-gray-300 font-bold text-sm focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                    value={data.keluhan_utama || ""}
                                    onChange={(e) =>
                                        setData("keluhan_utama", e.target.value)
                                    }
                                />
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-full flex border-b border-black hover:bg-gray-50 transition-colors">
                            {""}
                            <div className="w-[22%] p-3 print:p-2 border-r border-black font-bold flex items-center bg-gray-50 uppercase tracking-tighter text-sm text-blue-900">
                                Riwayat Sekarang
                            </div>
                            {""}
                            <div className="w-[78%] p-3 print:p-2">
                                {""}
                                <textarea
                                    className="w-full min-h-[50px] outline-none resize-none p-1 leading-normal border-0 border-b border-dotted border-gray-300 rounded-none focus:border-blue-500 transition-all bg-transparent text-sm font-bold focus:ring-0 shadow-none"
                                    value={data.riwayat_sekarang || ""}
                                    onChange={(e) =>
                                        setData(
                                            "riwayat_sekarang",
                                            e.target.value,
                                        )
                                    }
                                />
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-full flex border-b border-black hover:bg-gray-50 transition-colors">
                            {""}
                            <div className="w-[22%] p-3 print:p-2 border-r border-black font-bold flex items-center bg-gray-50 uppercase tracking-tighter text-sm text-green-900">
                                Riwayat Dahulu
                            </div>
                            {""}
                            <div className="w-[78%] p-3 print:p-2 flex flex-wrap gap-x-5 gap-y-2">
                                {""}
                                {[
                                    "Hipertensi",
                                    "Diabetes",
                                    "Penyakit Jantung",
                                    "Asthma",
                                    "Stroke",
                                    "Alergi Obat",
                                ].map((val) => (
                                    <label
                                        key={val}
                                        className="flex gap-2 items-center leading-tight cursor-pointer text-sm hover:text-blue-600 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            className="appearance-none text-blue-600 bg-white border-gray-400 rounded-sm focus:ring-blue-500 w-5 h-5 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={checkedArray(
                                                "riwayat_dahulu",
                                                val,
                                            )}
                                            onChange={(e) =>
                                                checkboxChange(
                                                    "riwayat_dahulu",
                                                    val,
                                                )
                                            }
                                        />
                                        <span className="font-medium">
                                            {val}
                                        </span>
                                    </label>
                                ))}
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-full flex border-b border-black hover:bg-gray-50 transition-colors">
                            {""}
                            <div className="w-[22%] p-3 print:p-2 border-r border-black font-bold flex items-center bg-gray-50 uppercase tracking-tighter text-sm text-gray-600">
                                Riwayat Keluarga
                            </div>
                            {""}
                            <div className="w-[78%] p-3 print:p-2">
                                {""}
                                <input
                                    className="w-full outline-none bg-transparent border-0 border-b border-dotted border-gray-300 font-bold text-sm focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                    value={data.riwayat_keluarga || ""}
                                    onChange={(e) =>
                                        setData(
                                            "riwayat_keluarga",
                                            e.target.value,
                                        )
                                    }
                                />
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-full flex hover:bg-gray-50 transition-colors">
                            {""}
                            <div className="w-[22%] p-3 print:p-2 border-r border-black font-bold flex items-center bg-gray-50 uppercase tracking-tighter text-sm text-red-900">
                                Riwayat Obat
                            </div>
                            {""}
                            <div className="w-[78%] p-3 print:p-2">
                                {""}
                                <input
                                    className="w-full outline-none bg-transparent border-0 border-b border-dotted border-gray-300 font-bold text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                    value={data.riwayat_obat || ""}
                                    onChange={(e) =>
                                        setData("riwayat_obat", e.target.value)
                                    }
                                />
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                    </div>
                    {""}
                    {/* SECTION III PEMERIKSAAN FISIK DAN PENUNJANG */}
                    {""}
                    <div className="border border-black p-1 mb-1 flex flex-col shadow-sm bg-white print:break-inside-avoid">
                        {""}
                        <div className="text-center font-bold bg-gray-200 border-b border-black p-2 print:p-1 w-full text-sm md:text-base sm:text-sm tracking-widest uppercase">
                            {""}
                            III. PEMERIKSAAN FISIK DAN PEMERIKSAAN PENUNJANG{""}
                        </div>
                        {""}
                        <div className="flex w-full min-h-[380px] relative">
                            {""}
                            {/* Bagian Kiri (Gambar Anatomi) */}
                            {""}
                            <div className="w-1/2 shrink-0 flex flex-col border-r border-black p-4 print:p-2 bg-gray-50 gap-2">
                                {""}
                                <div className="text-center font-bold text-gray-400 uppercase tracking-widest text-xs">
                                    Lokasi Kelainan / Anatomi
                                </div>
                                {""}
                                <div className="flex-1 relative flex justify-center items-center rounded border border-gray-100 bg-white shadow-inner overflow-hidden">
                                    {""}
                                    <img
                                        src="/gambar/anatomi_tubuh.png"
                                        className="h-full w-full object-contain mix-blend-multiply opacity-40 absolute pointer-events-none"
                                    />
                                    {""}
                                    <SignatureCanvas
                                        penColor="black"
                                        ref={sigAnatomi}
                                        canvasProps={{
                                            className:
                                                "w-full h-full absolute inset-0 cursor-crosshair z-10",
                                        }}
                                        backgroundColor="transparent"
                                    />
                                    {""}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            sigAnatomi.current.clear();
                                        }}
                                        className="print:hidden absolute top-2 right-2 bg-white hover:bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-bold shadow-sm border border-red-200 transition-all z-20"
                                    >
                                        Reset
                                    </button>
                                    {""}
                                </div>
                                {""}
                            </div>
                            {""}
                            {/* Bagian Kanan (Form Input) */}
                            {""}
                            <div className="w-1/2 shrink-0 flex flex-col p-4 print:p-2 gap-3 print:gap-2">
                                {""}
                                {/* 1. KEPALA */}
                                {""}
                                <div className="flex border-b min-h-[45px]">
                                    {""}
                                    <div className="w-24 bg-gray-50 border-r p-2 flex items-center font-bold text-gray-600">
                                        KEPALA
                                    </div>
                                    {""}
                                    <div className="flex-1 p-2 flex flex-wrap items-center gap-x-4">
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Normocephal (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {data.pf_normocephal}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-8 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="normocephal"
                                                    value={data.pf_normocephal || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>)</span>
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Sclera Ikterik (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold">
                                                    {data.pf_sclera_ikterik_1}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-6 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="sclera_ikterik_1"
                                                    value={
                                                        data.pf_sclera_ikterik_1
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span className="mx-0.5">/</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold">
                                                    {data.pf_sclera_ikterik_2}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-6 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="sclera_ikterik_2"
                                                    value={
                                                        data.pf_sclera_ikterik_2
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>),</span>
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Conj. Anemis (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold">
                                                    {data.pf_conj_anemis_1}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-6 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="conj_anemis_1"
                                                    value={
                                                        data.pf_conj_anemis_1
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span className="mx-0.5">/</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold">
                                                    {data.pf_conj_anemis_2}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-6 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="conj_anemis_2"
                                                    value={
                                                        data.pf_conj_anemis_2
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>)</span>
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                {/* 2. LEHER */}
                                {""}
                                <div className="flex border-b min-h-[45px]">
                                    {""}
                                    <div className="w-24 bg-gray-50 border-r p-2 flex items-center font-bold text-gray-600">
                                        LEHER
                                    </div>
                                    {""}
                                    <div className="flex-1 p-2 flex flex-wrap items-center gap-x-4">
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Pembesaran KGB (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {
                                                        data.pf_perbesaran_kelenjar_getah_bening
                                                    }
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-10 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="perbesaran_kelenjar_getah_bening"
                                                    value={
                                                        data.pf_perbesaran_kelenjar_getah_bening
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>),</span>
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Deviasi Trachea (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {data.pf_deviasi_trachea}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-10 border-b border-gray-300 text-center focus:ring-0 p-0"
                                                    type="text"
                                                    name="deviasi_trachea"
                                                    value={
                                                        data.pf_deviasi_trachea
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>)</span>
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                {/* 3. THORAX */}
                                {""}
                                <div className="flex border-b min-h-[60px]">
                                    {""}
                                    <div className="w-24 bg-gray-50 border-r p-2 flex items-center font-bold text-gray-600 uppercase">
                                        Thorax
                                    </div>
                                    {""}
                                    <div className="flex-1 p-2 flex flex-col justify-center gap-y-1">
                                        {""}
                                        <div className="flex flex-wrap items-center gap-x-3">
                                            {""}
                                            <div className="flex items-center">
                                                {""}
                                                <span>SD Vesikuler (</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_suara_dasar_veikuler_1
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="suara_dasar_veikuler_1"
                                                            value={
                                                                data.pf_suara_dasar_veikuler_1
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>/</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_suara_dasar_veikuler_2
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="suara_dasar_veikuler_2"
                                                            value={
                                                                data.pf_suara_dasar_veikuler_2
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>), Rhonki (</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_rhonki_1
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="rhonki_1"
                                                            value={
                                                                data.pf_rhonki_1
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>/</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_rhonki_2
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="rhonki_2"
                                                            value={
                                                                data.pf_rhonki_2
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>), Wheezing (</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_wheezing_1
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="wheezing_1"
                                                            value={
                                                                data.pf_wheezing_1
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>/</span>
                                                {""}
                                                <span className="font-bold mx-0.5">
                                                    {isPrinting ? (
                                                        data.pf_wheezing_2
                                                    ) : (
                                                        <input
                                                            className="w-6 border-b text-center p-0"
                                                            type="text"
                                                            name="wheezing_2"
                                                            value={
                                                                data.pf_wheezing_2
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "pf_" +
                                                                        e.target
                                                                            .name,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </span>
                                                {""}
                                                <span>)</span>
                                                {""}
                                            </div>
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center gap-x-2">
                                            {""}
                                            <span>Bunyi Jantung 1 & 2 (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {data.pf_bunyi_jantung_1_2}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-10 border-b border-gray-300 text-center p-0"
                                                    type="text"
                                                    name="bunyi_jantung_1_2"
                                                    value={
                                                        data.pf_bunyi_jantung_1_2
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>)</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold text-blue-600 uppercase">
                                                    [
                                                    {
                                                        data.pf_bunyi_jantung_1_2_status
                                                    }
                                                    ]
                                                </span>
                                            ) : (
                                                <select
                                                    className="border-gray-200 rounded p-0 text-[10px] h-5 focus:ring-0"
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" + e.target.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    id="bunyi_jantung_1_2_status"
                                                    value={
                                                        data.pf_bunyi_jantung_1_2_status
                                                    }
                                                >
                                                    <option value="-">
                                                        Pilih
                                                    </option>
                                                    <option value="normal">
                                                        Normal
                                                    </option>
                                                    <option value="abnormal">
                                                        Abnormal
                                                    </option>
                                                </select>
                                            )}
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                {/* 4. ABDOMEN */}
                                {""}
                                <div className="flex border-b min-h-[50px]">
                                    {""}
                                    <div className="w-24 bg-gray-50 border-r p-2 flex items-center font-bold text-gray-600 uppercase">
                                        Abdomen
                                    </div>
                                    {""}
                                    <div className="flex-1 p-2 flex flex-col justify-center gap-y-1">
                                        {""}
                                        <div className="flex items-center gap-x-2">
                                            {""}
                                            <span>Bising Usus (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {data.pf_bising_usus}
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-10 border-b border-gray-300 text-center p-0"
                                                    type="text"
                                                    name="bising_usus"
                                                    value={data.pf_bising_usus || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>)</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold text-blue-600 uppercase">
                                                    [
                                                    {data.pf_bising_usus_status}
                                                    ]
                                                </span>
                                            ) : (
                                                <select
                                                    className="border-gray-200 rounded p-0 text-[10px] h-5 focus:ring-0"
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" + e.target.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    id="bising_usus_status"
                                                    value={
                                                        data.pf_bising_usus_status
                                                    }
                                                >
                                                    <option value="-">
                                                        Pilih
                                                    </option>
                                                    <option value="normal">
                                                        Normal
                                                    </option>
                                                    <option value="abnormal">
                                                        Abnormal
                                                    </option>
                                                </select>
                                            )}
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex items-center">
                                            {""}
                                            <span>Nyeri Tekan (</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold px-1">
                                                    {
                                                        data.pf_nyeri_tekan_abdomen
                                                    }
                                                </span>
                                            ) : (
                                                <input
                                                    className="w-8 border-b border-gray-300 text-center p-0"
                                                    type="text"
                                                    name="nyeri_tekan_abdomen"
                                                    value={
                                                        data.pf_nyeri_tekan_abdomen
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            )}
                                            {""}
                                            <span>) Area:</span>
                                            {""}
                                            {isPrinting ? (
                                                <span className="font-bold border-b border-dashed border-gray-400 ml-1 px-2 min-w-[80px]">
                                                    {
                                                        data.pf_nyeri_tekan_abdomen_area
                                                    }
                                                </span>
                                            ) : (
                                                <input
                                                    className="flex-1 border-b border-gray-300 ml-1 p-0 focus:ring-0"
                                                    type="text"
                                                    name="nyeri_tekan_abdomen_area"
                                                    value={
                                                        data.pf_nyeri_tekan_abdomen_area
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "pf_" +
                                                                e.target.name,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="..."
                                                />
                                            )}
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                {/* 5. EKSTREMITAS */}
                                {""}
                                <div className="flex border-b min-h-[60px]">
                                    {""}
                                    <div className="w-24 bg-gray-50 border-r p-2 flex items-center font-bold text-gray-600 uppercase">
                                        EKSTREMITAS
                                    </div>
                                    {""}
                                    <div className="flex-1 p-2 flex items-center justify-around">
                                        {""}
                                        <div className="flex flex-col items-center">
                                            {""}
                                            <span className="font-semibold text-gray-400 mb-1">
                                                Akral Hangat
                                            </span>
                                            {""}
                                            <div className="flex items-center gap-1">
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {
                                                            data.pf_akral_hangat_a_1
                                                        }
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="akral_hangat_a_1"
                                                        value={
                                                            data.pf_akral_hangat_a_1
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                                <span className="text-gray-200">
                                                    |
                                                </span>
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {
                                                            data.pf_akral_hangat_b_1
                                                        }
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="akral_hangat_b_1"
                                                        value={
                                                            data.pf_akral_hangat_b_1
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                            </div>
                                            {""}
                                            <div className="w-full border-b my-1"></div>
                                            {""}
                                            <div className="flex items-center gap-1">
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {
                                                            data.pf_akral_hangat_a_2
                                                        }
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="akral_hangat_a_2"
                                                        value={
                                                            data.pf_akral_hangat_a_2
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                                <span className="text-gray-200">
                                                    |
                                                </span>
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {
                                                            data.pf_akral_hangat_b_2
                                                        }
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="akral_hangat_b_2"
                                                        value={
                                                            data.pf_akral_hangat_b_2
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                            </div>
                                            {""}
                                        </div>
                                        {""}
                                        <div className="flex flex-col items-center">
                                            {""}
                                            <span className="font-semibold text-gray-400 mb-1">
                                                Oedema
                                            </span>
                                            {""}
                                            <div className="flex items-center gap-1">
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {data.pf_oedema_a_1}
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="oedema_a_1"
                                                        value={
                                                            data.pf_oedema_a_1
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                                <span className="text-gray-200">
                                                    |
                                                </span>
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {data.pf_oedema_b_1}
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="oedema_b_1"
                                                        value={
                                                            data.pf_oedema_b_1
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                            </div>
                                            {""}
                                            <div className="w-full border-b my-1"></div>
                                            {""}
                                            <div className="flex items-center gap-1">
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {data.pf_oedema_a_2}
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="oedema_a_2"
                                                        value={
                                                            data.pf_oedema_a_2
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                                <span className="text-gray-200">
                                                    |
                                                </span>
                                                {""}
                                                {isPrinting ? (
                                                    <span className="font-bold">
                                                        {data.pf_oedema_b_2}
                                                    </span>
                                                ) : (
                                                    <input
                                                        className="w-8 border border-gray-200 text-center p-0 rounded"
                                                        type="text"
                                                        name="oedema_b_2"
                                                        value={
                                                            data.pf_oedema_b_2
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "pf_" +
                                                                    e.target
                                                                        .name,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                                {""}
                                            </div>
                                            {""}
                                        </div>
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                                <div className="border-t-2 border-blue-50 mt-auto pt-2 flex items-center bg-blue-50/30 p-2 print:p-1 rounded-sm gap-2">
                                    {""}
                                    <span className="w-28 font-bold text-blue-900 uppercase text-sm tracking-widest shrink-0">
                                        Penunjang
                                    </span>
                                    {""}
                                    <div className="flex-1 grid grid-cols-4 gap-x-3">
                                        {""}
                                        {["ekg", "gds", "au", "chol", "hb"].map(
                                            (f) => (
                                                <div
                                                    key={f}
                                                    className="flex flex-col"
                                                >
                                                    {""}
                                                    <span className="text-xs uppercase font-bold text-blue-500 mb-1">
                                                        {f}
                                                    </span>
                                                    {""}
                                                    <input
                                                        className="border-0 border-b-[2px] border-blue-300 text-center font-bold text-sm bg-transparent leading-none h-5 outline-none focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                                        value={data[f]}
                                                        onChange={(e) =>
                                                            setData(
                                                                f,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    {""}
                                                </div>
                                            ),
                                        )}
                                        {""}
                                    </div>
                                    {""}
                                </div>
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                    </div>
                    {""}
                    {/* SECTION IV, V & FOLLOW UP */}
                    {""}
                    <div className="flex w-full gap-0 border border-black p-1 mb-1 shadow-sm text-sm bg-white print:break-inside-avoid">
                        {""}
                        {/* DIAGNOSIS MEDIS */}
                        {""}
                        <div className="w-1/3 shrink-0 border-r border-black flex flex-col p-4 print:p-2">
                            {""}
                            <div className="font-bold text-center border-b border-black mb-3 print:mb-1 pb-1 uppercase text-blue-900 tracking-tighter text-sm">
                                IV. DIAGNOSIS MEDIS
                            </div>
                            {""}
                            <div className="flex flex-col gap-2.5 print:gap-1.5 flex-1 overflow-hidden">
                                {""}
                                <datalist id="dl_icd_10">
                                    {memoized_icd_10}
                                </datalist>
                                {""}
                                {!isPrinting && (
                                    <button
                                        type="button"
                                        onClick={oc_tambah_diagnosis_medis}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1 px-2 rounded mb-2 w-max shadow-sm transition-colors self-center"
                                    >
                                        {""}+ Tambah Diagnosis{""}
                                    </button>
                                )}
                                {""}
                                {data.diagnosis_medis.map((val, i) => (
                                    <div
                                        className="flex items-center gap-2 w-full group"
                                        key={i}
                                    >
                                        {""}
                                        <span className="w-4 shrink-0 font-bold text-gray-300 text-xs">
                                            {i + 1}.
                                        </span>
                                        {""}
                                        <input
                                            className="flex-1 w-full min-w-0 border-0 border-b-[2px] border-dotted border-gray-400 bg-transparent text-sm font-bold outline-none focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                            value={val}
                                            list="dl_icd_10"
                                            onChange={(e) =>
                                                arrayTextChange(
                                                    "diagnosis_medis",
                                                    i,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {""}
                                        {!isPrinting && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    oc_hapus_diagnosis_medis(i)
                                                }
                                                className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        {""}
                                    </div>
                                ))}
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        {/* TERAPI / TINDAKAN */}
                        {""}
                        <div className="w-1/3 shrink-0 border-r border-black flex flex-col p-4 print:p-2 bg-gray-50">
                            {""}
                            <div className="font-bold text-center border-b border-black mb-3 print:mb-1 pb-1 uppercase text-green-900 tracking-tighter text-sm">
                                V. TERAPI / TINDAKAN
                            </div>
                            {""}
                            <div className="flex flex-col gap-2.5 print:gap-1.5 flex-1 overflow-hidden">
                                {""}
                                {!isPrinting && (
                                    <button
                                        type="button"
                                        onClick={oc_tambah_terapi_tindakan}
                                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold py-1 px-2 rounded mb-2 w-max shadow-sm transition-colors self-center"
                                    >
                                        {""}+ Tambah Terapi{""}
                                    </button>
                                )}
                                {""}
                                {data.terapi_tindakan.map((val, i) => (
                                    <div
                                        className="flex items-center gap-2 w-full group"
                                        key={i}
                                    >
                                        {""}
                                        <span className="w-3 shrink-0 font-bold text-gray-300 text-center text-xs">
                                            -
                                        </span>
                                        {""}
                                        <input
                                            className="flex-1 w-full min-w-0 border-0 border-b-[2px] border-dotted border-gray-400 bg-transparent text-sm font-bold outline-none focus:border-green-500 focus:ring-0 transition-all shadow-none"
                                            value={val}
                                            onChange={(e) =>
                                                arrayTextChange(
                                                    "terapi_tindakan",
                                                    i,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {""}
                                        {!isPrinting && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    oc_hapus_terapi_tindakan(i)
                                                }
                                                className="text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        {""}
                                    </div>
                                ))}
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        {/* TINDAK LANJUT / VITAL */}
                        {""}
                        <div className="w-1/3 shrink-0 flex flex-col p-4 print:p-2 bg-gray-50">
                            {""}
                            <div className="font-bold text-center border-b border-black mb-3 print:mb-1 pb-1 uppercase text-red-900 tracking-tighter text-sm">
                                {""}
                                VI. TINDAK LANJUT / VITAL{""}
                            </div>
                            {""}
                            <div className="flex flex-col gap-2.5 print:gap-1.5 flex-1 items-center text-sm font-bold w-full">
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        TD
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_td || ""}
                                        onChange={(e) =>
                                            setData("fu_td", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        mmHg
                                    </span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        HR
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_hr || ""}
                                        onChange={(e) =>
                                            setData("fu_hr", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        x/mnt
                                    </span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        RR
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_rr || ""}
                                        onChange={(e) =>
                                            setData("fu_rr", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        x/mnt
                                    </span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        Suhu
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_suhu || ""}
                                        onChange={(e) =>
                                            setData("fu_suhu", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        °C
                                    </span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        SpO2
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_spo2 || ""}
                                        onChange={(e) =>
                                            setData("fu_spo2", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        %
                                    </span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        Nyeri
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_skala_nyeri || ""}
                                        onChange={(e) =>
                                            setData(
                                                "fu_skala_nyeri",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right"></span>
                                    {""}
                                </div>
                                {""}
                                <div className="flex items-center justify-between w-full max-w-[260px]">
                                    {""}
                                    <span className="w-12 shrink-0 whitespace-nowrap text-left">
                                        Pukul
                                    </span>
                                    {""}
                                    <input
                                        className="w-24 border-0 border-b-[2px] border-gray-400 border-dotted outline-none text-center bg-transparent text-sm focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        value={data.fu_pukul || ""}
                                        onChange={(e) =>
                                            setData("fu_pukul", e.target.value)
                                        }
                                    />
                                    {""}
                                    <span className="w-16 shrink-0 text-xs text-gray-500 font-normal text-right">
                                        WIB
                                    </span>
                                    {""}
                                </div>
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                    </div>
                    {""}
                    {/* FOOTER */}
                    {""}
                    <div className="flex w-full text-xs items-stretch gap-3 print:gap-1.5 pb-2 print:pb-0 mt-2 print:mt-0.5 print:break-inside-avoid">
                        {""}
                        <div className="flex-1 p-3 print:p-2 bg-gray-50 border border-black p-1 rounded-sm shadow-inner overflow-hidden">
                            {""}
                            <div className="font-bold border-b border-blue-800 mb-2 print:mb-1 pb-1 tracking-widest uppercase text-blue-900 text-sm">
                                RUMAH SAKIT RUJUKAN
                            </div>
                            {""}
                            <div className="flex flex-col gap-2 print:gap-1">
                                {""}
                                <div className="flex items-center text-sm">
                                    <span className="w-24 font-bold text-gray-600">
                                        Nama RS
                                    </span>
                                    <span className="mx-1">:</span>
                                    <div className="flex-1 flex flex-col">
                                        <input
                                            type="text"
                                            list="dl_rujukan_doa"
                                            name="rs_rujukan"
                                            className="w-full border-0 border-b border-dotted border-gray-300 bg-transparent font-bold outline-none focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                            placeholder="Ketik atau pilih RS/Puskesmas..."
                                            value={data.rs_rujukan || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "rs_rujukan",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <datalist id="dl_rujukan_doa">
                                            {daftarRS.map((rs, index) => (
                                                <option key={index} id={rs.id} value={rs.nama}>{rs.nama}</option>
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                {""}
                                <div className="flex items-center text-sm">
                                    <span className="w-24 font-bold text-gray-600">
                                        Tgl Masuk
                                    </span>
                                    <span className="mx-1">:</span>
                                    <input
                                        className="border-0 border-b border-dotted border-gray-300 flex-1 bg-transparent outline-none focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        type="date"
                                        value={data.tgl_rujukan || ""}
                                        onChange={(e) =>
                                            setData(
                                                "tgl_rujukan",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                {""}
                                <div className="flex items-center text-sm">
                                    <span className="w-24 font-bold text-gray-700">
                                        Jam Masuk
                                    </span>
                                    <span className="mx-1">:</span>
                                    <input
                                        className="border-0 border-b border-dotted border-gray-300 flex-1 bg-transparent outline-none focus:border-blue-500 focus:ring-0 transition-all font-bold shadow-none"
                                        type="time"
                                        value={data.jam_rujukan || ""}
                                        onChange={(e) =>
                                            setData(
                                                "jam_rujukan",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                {""}
                            </div>
                            {""}
                        </div>
                        {""}
                        <div className="w-1/3 flex flex-col items-center p-2 text-center bg-white">
                            {""}
                            <div className="font-bold mb-2 print:mb-1 text-gray-700 uppercase text-sm tracking-widest border-b border-gray-100 w-full pb-1">
                                Petugas Ambulance
                            </div>
                            {""}
                            <div className="w-full h-24 print:h-12 border border-gray-50 relative group overflow-hidden mb-6">
                                {""}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sigPetugas.current.clear();
                                    }}
                                    className="print:hidden absolute top-0 right-0 bg-white text-red-500 p-1 rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 border border-red-50 transition-all"
                                >
                                    ✕
                                </button>
                                {""}
                                <SignatureCanvas
                                    penColor="black"
                                    ref={sigPetugas}
                                    canvasProps={{
                                        className:
                                            "w-full h-full absolute inset-0 cursor-crosshair",
                                    }}
                                />
                                {""}
                            </div>
                            {""}
                            <input
                                type="text"
                                className="w-[80%] border-0 border-b border-gray-300 text-center outline-none bg-transparent font-bold py-0 text-xs focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                placeholder="(Nama Terang)"
                                value={data.nama_petugas || ""}
                                onChange={(e) =>
                                    setData("nama_petugas", e.target.value)
                                }
                            />
                            {""}
                        </div>
                        {""}
                        <div className="w-1/3 flex flex-col items-center p-2 text-center bg-white border-l border-gray-100">
                            {""}
                            <div className="font-bold mb-2 print:mb-1 text-gray-700 uppercase text-sm tracking-widest border-b border-gray-100 w-full pb-1">
                                Keluarga Pasien
                            </div>
                            {""}
                            <div className="w-full h-24 print:h-12 border border-gray-50 relative group overflow-hidden mb-6">
                                {""}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sigKeluarga.current.clear();
                                    }}
                                    className="print:hidden absolute top-0 right-0 bg-white text-red-500 p-1 rounded-full shadow-sm z-10 opacity-0 group-hover:opacity-100 border border-red-50 transition-all"
                                >
                                    ✕
                                </button>
                                {""}
                                <SignatureCanvas
                                    penColor="black"
                                    ref={sigKeluarga}
                                    canvasProps={{
                                        className:
                                            "w-full h-full absolute inset-0 cursor-crosshair",
                                    }}
                                />
                                {""}
                            </div>
                            {""}
                            <input
                                type="text"
                                className="w-[80%] border-0 border-b border-gray-300 text-center outline-none bg-transparent font-bold py-0 text-xs focus:border-blue-500 focus:ring-0 transition-all shadow-none"
                                placeholder="(Nama Terang)"
                                value={data.nama_keluarga || ""}
                                onChange={(e) =>
                                    setData("nama_keluarga", e.target.value)
                                }
                            />
                            {""}
                        </div>
                        {""}
                    </div>
                    {""}
            </div>
            {""}
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