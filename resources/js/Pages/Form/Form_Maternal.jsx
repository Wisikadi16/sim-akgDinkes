import React, { useState, useEffect, useRef } from "react";

import HeaderLogo from "@/Components/Headers/HeaderLogo";
import Identitas_Tim from "@/Components/Form/Identitas_Tim";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { createTheme } from "@mui/system";
import { TextField } from "@mui/material";

import { styled } from "@mui/material/styles";

import SignatureCanvas from "react-signature-canvas";
import HeaderFormMaternal from "@/Components/Headers/HeaderFormMaternal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

// const MobileTimePicker = styled(MobileTimePicker)({
//   '.css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
//     padding: 0,
//   }
// })
export default function Form_Maternal(props) {
    const [isPrinting, setIsPrinting] = useState(false);

    const [jam_lahir_identitas_bayi, set_jam_lahir_identitas_bayi] =
        React.useState(dayjs(new Date()));

    const [identitas_bayi, set_identitas_bayi] = useState({
        // nik:"",
        nama_pasien: "",
        tgl_lahir: "",
        jam_lahir:
            (JSON.stringify(jam_lahir_identitas_bayi.$H).length == 1
                ? "0" + jam_lahir_identitas_bayi.$H
                : jam_lahir_identitas_bayi.$H) +
            ":" +
            (JSON.stringify(jam_lahir_identitas_bayi.$m).length == 1
                ? "0" + jam_lahir_identitas_bayi.$m
                : jam_lahir_identitas_bayi.$m),
        // tgl_penanganan:new Date().toISOString().split('T')[0],
        jenis_kelamin: "Laki-Laki",
    });

    const oc_identitas_bayi = (e) => {
        console.log("oc_identitas_bayi");
        if (e.$H != null) {
            var jam = JSON.stringify(e.$H);
            if (jam.length == 1) {
                jam = "0" + jam;
            }
            var menit = JSON.stringify(e.$m);
            if (menit.length == 1) {
                menit = "0" + menit;
            }

            set_identitas_bayi({
                ...identitas_bayi,
                ["jam_lahir"]: jam + ":" + menit,
            });
        } else {
            const value = e.target.value;
            set_identitas_bayi({
                ...identitas_bayi,
                [e.target.name]: value,
            });
        }
    };
    console.log("identitas bayi");
    console.log(identitas_bayi);

    const [identitas_tim_ambulance, set_identitas_tim_ambulance] = useState({
        tim: "",
        dokter: "",
        perawat: "",
        bidan: "",
        driver: "",
    });

    const os_identitas_tim_ambulance = (data) => {
        console.log("identitas tim ambulance");
        console.log(data);
        set_identitas_tim_ambulance(data);
    };

    console.log("tim ambulan");
    console.log(identitas_tim_ambulance);

    // const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    // const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [semua_kecamatan_identitas_ibu, set_semua_kecamatan_identitas_ibu] =
        useState([]);
    const [semua_kelurahan_identitas_ibu, set_semua_kelurahan_identitas_ibu] =
        useState([]);
    const [semua_kecamatan_identitas_ayah, set_semua_kecamatan_identitas_ayah] =
        useState([]);
    const [semua_kelurahan_identitas_ayah, set_semua_kelurahan_identitas_ayah] =
        useState([]);
    const [rs_rujukan, set_rs_rujukan] = useState([]);

    useEffect(() => {
        axios
            .post(window.location.origin + "/ref_kecamatan", {})
            .then(function (response) {
                set_semua_kecamatan_identitas_ibu(response.data);
                set_semua_kecamatan_identitas_ayah(response.data);
            });

        axios
            .post(window.location.origin + "/ref_kelurahan", {
                kode_kecamatan: kode_kecamatan,
            })
            .then(function (response) {
                set_semua_kelurahan_identitas_ibu(response.data);
                set_semua_kelurahan_identitas_ayah(response.data);
            });

        axios
            .post(window.location.origin + "/ref_faskes", {
                jenis: "rumah sakit",
            })
            .then(function (response) {
                set_rs_rujukan(response.data);
            });
    }, []);

    useEffect(() => {
        if (props.id != null) {
            axios
                .post(window.location.origin + "/ref_form_maternal", {
                    id_form: props.id,
                })
                .then(function (response) {
                    if (response.data) {
                        if (response.data.pasien) {
                            set_identitas_ibu(prev => ({
                                ...prev,
                                nama: response.data.pasien.nama || "",
                                tgl_lahir: response.data.pasien.tgl_lahir || "",
                                alamat: response.data.pasien.alamat || "",
                            }));
                        }
                        
                        set_rumah_sakit_rujukan(prev => ({
                            ...prev,
                            rs: response.data.rs_tujuan || "",
                            petugas: response.data.petugas_rs_tujuan || "",
                            tgl: response.data.tanggal_rujukan || dayjs().format("YYYY-MM-DD"),
                            jam: response.data.jam_rujukan || dayjs().format("HH:mm"),
                        }));

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

                        setAtasPermintaan(parseJSON(response.data.atas_permintaan, []));
                        setPetugasPendamping(parseJSON(response.data.petugas_pendamping, { dokter: '', perawat: '', bidan: '', driver: '' }));
                        setKondisiSaatIni(parseJSON(response.data.kondisi_saat_ini, { hpht: '', usia_kehamilan: '', tb: '', bb: '', ku: '', spo2: '', td: '', rr: '', suhu: '', djj: '' }));
                        setTandaSyok(parseJSON(response.data.tanda_syok, { terjadi: '', iv_line: false, td_1: '', waktu_1: '', ulangi_1_liter: false, td_2: '', waktu_2: '', pasang_kateter: false, urine_output: '', waktu_3: '' }));
                        setAlasanDirujuk(parseJSON(response.data.alasan_dirujuk, []));
                        setRiwayat(parseJSON(response.data.riwayat, []));
                        setRiwayatLain(response.data.riwayat_lain || "");
                        
                        const parsedFisik = parseJSON(response.data.fisik, {});
                        if (parsedFisik.list) setFisik(parsedFisik.list);
                        setFisikInput(prev => ({ ...prev, ...parsedFisik }));
                        
                        setLab(parseJSON(response.data.lab, []));
                        setLainLain(response.data.lain_lain || "");
                        setDiagnosa(response.data.diagnosa || "");
                        setPenanganan(response.data.penanganan || "");
                        setTindakanTherapy(response.data.tindakan_therapy || "");
                        
                        const parsedMonitoring = parseJSON(response.data.monitoring, [{ waktu: '', tanda_vital: '', td: '', ku: '', pernafasan: '', nadi: '', ppv: '', suhu: '', vt: '', observasi_his: '', djj: '', keadaan_pasien: '' }]);
                        setMonitoring(parsedMonitoring);

                        const parsedHandover = parseJSON(response.data.handover, null);
                        if (parsedHandover) {
                            setTtdPetugas(prev => ({ ...prev, ...parsedHandover }));
                        }

                        if (response.data.ttd_penyerah && ref_ttd_petugas_ambulance.current) {
                            setTimeout(() => ref_ttd_petugas_ambulance.current.fromDataURL(response.data.ttd_penyerah), 500);
                        }
                        if (response.data.ttd_penerima && ref_ttd_petugas_rs.current) {
                            setTimeout(() => ref_ttd_petugas_rs.current.fromDataURL(response.data.ttd_penerima), 500);
                        }
                    }
                })
                .catch(function(error){
                    console.error("Error fetching maternal data:", error);
                });
        }
    }, [props.id]);

    const [identitas_ibu, set_identitas_ibu] = useState({
        nama: "",
        usia: "",
        tgl_lahir: "",
        pekerjaan: "",
        golongan_darah: "",
        no_telepon: "",
        alamat: "",
        kecamatan: "",
        kelurahan: "",
    });

    function hit_umur(tgl_lahir) {
        if (!tgl_lahir) return "";
        return dayjs().diff(dayjs(tgl_lahir), 'year');
    }

    const oc_identitas_ibu = (e) => {
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index];
            let option = el.getAttribute("id");
            console.log("kec" + option);
            set_identitas_ibu({ ...identitas_ibu, ["kecamatan"]: option });
            axios
                .post(window.location.origin + "/ref_kelurahan", {
                    kode_kecamatan: option,
                })
                .then(function (response) {
                    set_semua_kelurahan_identitas_ibu(response.data);
                });
        } else if (e.target.name == "kelurahan") {
            // console.log("kel")
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index];
            let option = el.getAttribute("id");
            console.log("kel" + option);
            set_identitas_ibu({ ...identitas_ibu, ["kelurahan"]: option });
        } else if (e.target.name == "tgl_lahir") {
            const value = e.target.value;
            const umur = hit_umur(value);
            set_identitas_ibu({
                ...identitas_ibu,
                [e.target.name]: value,
                ["usia"]: umur,
            });
        } else {
            const value = e.target.value;

            set_identitas_ibu({
                ...identitas_ibu,
                [e.target.name]: value,
            });
        }
    };

    const [identitas_ayah, set_identitas_ayah] = useState({
        nama: "",
        usia: "",
        pekerjaan: "",
        golongan_darah: "",
        no_telepon: "",
        alamat: "",
        kecamatan: "",
        kelurahan: "",
    });

    const oc_identitas_ayah = (e) => {
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index];
            let option = el.getAttribute("id");
            console.log("kec" + option);
            set_identitas_ayah({ ...identitas_ayah, ["kecamatan"]: option });
            axios
                .post(window.location.origin + "/ref_kelurahan", {
                    kode_kecamatan: option,
                })
                .then(function (response) {
                    set_semua_kelurahan_identitas_ayah(response.data);
                });
        } else if (e.target.name == "kelurahan") {
            // console.log("kel")
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index];
            let option = el.getAttribute("id");
            console.log("kel" + option);
            set_identitas_ayah({ ...identitas_ayah, ["kelurahan"]: option });
        } else {
            const value = e.target.value;

            set_identitas_ayah({
                ...identitas_ayah,
                [e.target.name]: value,
            });
        }
    };

    console.log("identitas ibu");
    console.log(identitas_ibu);

    console.log("identitas ayah");
    console.log(identitas_ayah);

    // === NEW STATES FOR MATERNAL FORM ===
    const [atasPermintaan, setAtasPermintaan] = useState([]);
    const [petugasPendamping, setPetugasPendamping] = useState({
        dokter: '', perawat: '', bidan: '', driver: ''
    });
    
    const [kondisiSaatIni, setKondisiSaatIni] = useState({
        hpht: '', usia_kehamilan: '', tb: '', bb: '', ku: '', spo2: '', td: '', rr: '', suhu: '', djj: ''
    });
    
    const [tandaSyok, setTandaSyok] = useState({
        terjadi: '', iv_line: false,
        td_1: '', waktu_1: '',
        ulangi_1_liter: false, td_2: '', waktu_2: '',
        pasang_kateter: false, urine_output: '', waktu_3: ''
    });
    
    const [alasanDirujuk, setAlasanDirujuk] = useState([]);
    const [riwayat, setRiwayat] = useState([]);
    const [riwayatLain, setRiwayatLain] = useState("");
    
    const [fisik, setFisik] = useState([]);
    const [fisikInput, setFisikInput] = useState({
        penurunan: '1/5', lama_persalinan: '', taksiran_berat_bayi: '', usia_kehamilan: '',
        kontraksi_frekuensi: '', kontraksi_durasi: '', ketuban_pecah_jam: '',
        nadi_100: '',
    });
    
    const [lab, setLab] = useState([]);
    const [lainLain, setLainLain] = useState("");
    const [diagnosa, setDiagnosa] = useState("");
    const [penanganan, setPenanganan] = useState("");
    const [tindakanTherapy, setTindakanTherapy] = useState("");
    
    const [monitoring, setMonitoring] = useState([{
        waktu: '', tanda_vital: '', td: '', ku: '', pernafasan: '', nadi: '', ppv: '', suhu: '', vt: '', observasi_his: '', djj: '', keadaan_pasien: ''
    }]);

    const [ttdPetugas, setTtdPetugas] = useState({
        tanggal: dayjs().format("YYYY-MM-DD"),
        jam: dayjs(),
        rs_puskesmas: "",
        yang_menyerahkan: { nama: "" },
        yang_menerima: { nama: "" },
    });

    // HANDLERS
    const handleCheckboxArray = (e, stateGetter, stateSetter) => {
        const { value, checked } = e.target;
        if (checked) {
            stateSetter([...stateGetter, value]);
        } else {
            stateSetter(stateGetter.filter(item => item !== value));
        }
    };

    const handleObjectChange = (e, stateGetter, stateSetter) => {
        const { name, value, type, checked } = e.target;
        stateSetter({
            ...stateGetter,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleMonitoringChange = (index, e) => {
        const { name, value } = e.target;
        const newMonitoring = [...monitoring];
        newMonitoring[index][name] = value;
        setMonitoring(newMonitoring);
    };
    // ===================================

    const [rumah_sakit_rujukan, set_rumah_sakit_rujukan] = useState({
        tgl: dayjs().format("YYYY-MM-DD"),
        jam: dayjs().format("HH:mm"),
        tp_jam: dayjs(new Date()),
    });

    const oc_rumah_sakit_rujukan = (e) => {
        const value = e.target.value;
        set_rumah_sakit_rujukan({
            ...rumah_sakit_rujukan,
            [e.target.name]: value,
        });
    };

    const [daftarRS, setDaftarRS] = useState([]);

    useEffect(() => {
        axios.post(window.location.origin + '/ref_faskes', { jenis: 'rumah sakit' })
            .then(response => {
                setDaftarRS(response.data);
            })
            .catch(error => console.log("Gagal memuat data RS:", error));
    }, []);

    const oc_simpan = (e) => {
        e.preventDefault();

        const payload = {
            id_form: props.id,
            identitas_ibu: identitas_ibu,
            nama_pasien: identitas_ibu.nama,
            tgl_lahir: identitas_ibu.tgl_lahir,
            alamat: identitas_ibu.alamat,
            rumah_sakit_rujukan: rumah_sakit_rujukan,
            atas_permintaan: atasPermintaan,
            petugas_pendamping: petugasPendamping,
            pemeriksaan_fisik: kondisiSaatIni,
            tanda_syok: tandaSyok,
            alasan_dirujuk: alasanDirujuk,
            riwayat: riwayat,
            riwayat_lain: riwayatLain,
            fisik: { ...fisikInput, list: fisik },
            lab: lab,
            lain_lain: lainLain,
            diagnosa: diagnosa,
            penanganan: penanganan,
            tindakan_therapy: tindakanTherapy,
            monitoring: monitoring,
            handover: ttdPetugas,
            ttd_penyerah: ref_ttd_petugas_ambulance.current?.isEmpty() ? "" : ref_ttd_petugas_ambulance.current.getCanvas().toDataURL('image/png'),
            ttd_penerima: ref_ttd_petugas_rs.current?.isEmpty() ? "" : ref_ttd_petugas_rs.current.getCanvas().toDataURL('image/png'),
        };

        const endpoint = props.id 
            ? window.location.origin + "/form_maternal/perbarui" 
            : window.location.origin + "/form_maternal/simpan";

        axios.post(endpoint, payload)
            .then(function (response) {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setTimeout(() => (window.location.href = "/catatan_medis"), 2000);
            })
            .catch(function (error) {
                console.error("Error saving data:", error);
                toast.error("Terjadi kesalahan saat menyimpan data.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const componentRef = useRef();
    const handlePrint = () => {
        window.print();
    };

    const oc_print = () => {
        setIsPrinting(true);
        setTimeout(() => {
            handlePrint();
            setIsPrinting(false);
        }, 500);
    };

    let ref_ttd_petugas_ambulance = useRef({});
    let ref_ttd_petugas_rs = useRef({});

    return (
        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 5mm !important; }
                    body, html { 
                        margin: 0 !important; 
                        padding: 0 !important; 
                        background-color: white !important; 
                        -webkit-print-color-adjust: exact; 
                        print-color-adjust: exact; 
                    }
                    .kertas-a4 {
                        width: 1050px !important;
                        max-width: 1050px !important;
                        zoom: 0.65 !important; /* UBAH ANGKA INI (misal 0.60 atau 0.70) JIKA KURANG PAS */
                        padding: 0 !important;
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .overflow-x-auto { overflow: hidden !important; }
                }
            `}</style>
            <div className="flex justify-center print:hidden">
                <a
                    href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none"
                >
                    Kembali
                </a>
            </div>

            <div className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-[1000px] print:max-w-[1000px] min-h-[1414px] p-4 md:p-10 print:shadow-none print:p-0 text-black">
                <div className="text-xs md:text-sm sm:text-xs">
                    <HeaderFormMaternal />
                </div>
                <div className="grid grid-cols-2 text-xs md:text-sm sm:text-xs">
                    {/* <Identitas_Tim onSubmit={getDataIdentitas}/> */}
                    <div className="flex justify-center">RUJUKAN MATERNAL</div>
                    <div className="mr-3 col-start-2 col-end-6">
                        <div className="flex">
                            <div className="w-[50%]">Nama Pasien</div>
                            <div className="w-[50%]">
                                <input
                                    type="text"
                                    name="nama"
                                    value={identitas_ibu.nama || ""}
                                    onChange={oc_identitas_ibu}
                                    className="w-full p-0"
                                ></input>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-[50%]">Tanggal Lahir (Umur)</div>
                            <div className="w-[30%]">
                                <input
                                    type="date"
                                    name="tgl_lahir"
                                    value={identitas_ibu.tgl_lahir || ""}
                                    onChange={oc_identitas_ibu}
                                    className="w-full p-0"
                                ></input>
                            </div>
                            <div className="w-[20%]">
                                <input
                                    type="text"
                                    name="usia"
                                    value={identitas_ibu.usia || ""}
                                    onChange={oc_identitas_ibu}
                                    placeholder="Umur"
                                    className="w-full p-0"
                                ></input>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-[50%]">Alamat</div>
                            <div className="w-[50%]">
                                <input
                                    type="text"
                                    name="alamat"
                                    value={identitas_ibu.alamat || ""}
                                    onChange={oc_identitas_ibu}
                                    className="w-full p-0"
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-2 w-full">
                    <div className="text-sm w-[30%]">
                        <div className="font-bold flex justify-center border-2">
                            RUMAH SAKIT TUJUAN
                        </div>
                        <div className="border-2">
                            <input
                                type="text"
                                name="rs"
                                value={rumah_sakit_rujukan.rs || ""}
                                onChange={oc_rumah_sakit_rujukan}
                                list="rs_rujukan_maternal_list"
                                className="w-full p-0 border-0 outline-none focus:ring-0 text-sm"
                                placeholder="Pilih/ketik RS atau Puskesmas..."
                            />
                            <datalist id="rs_rujukan_maternal_list">
                                {daftarRS.map((opts, i) => (
                                    <option key={i} value={opts.nama} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className="text-sm w-[30%]">
                        <div className="font-bold flex justify-center border-2">
                            Petugas RS Tujuan yang dihubungi
                        </div>
                        <div className="border-2">
                            <input
                                type="text"
                                name="petugas"
                                value={rumah_sakit_rujukan.petugas || ""}
                                onChange={oc_rumah_sakit_rujukan}
                                className="w-full p-0 border-0 outline-none focus:ring-0 text-sm"
                            ></input>
                        </div>
                    </div>
                    <div className="text-sm w-[20%]">
                        <div className="font-bold flex justify-center border-2">
                            Tanggal
                        </div>
                        <div className="border-2">
                            <input
                                type="date"
                                name="tgl"
                                value={rumah_sakit_rujukan.tgl || ""}
                                onChange={oc_rumah_sakit_rujukan}
                                className="w-full p-0 border-0 outline-none focus:ring-0 text-sm"
                            ></input>
                        </div>
                    </div>
                    <div className="text-sm w-[20%]">
                        <div className="font-bold flex justify-center border-2">
                            Jam
                        </div>
                        <div className="border-2">
                            <input
                                type="time"
                                name="jam"
                                value={rumah_sakit_rujukan.jam || ""}
                                onChange={oc_rumah_sakit_rujukan}
                                className="w-full p-0 border-0 outline-none focus:ring-0 text-sm"
                            ></input>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                        <div>
                            <div>Atas permintaan :</div>
                            <div className="flex">
                                <input
                                    type="checkbox"
                                    id="permintaan_dokter"
                                    value="Dokter"
                                    checked={atasPermintaan.includes("Dokter")}
                                    onChange={(e) => handleCheckboxArray(e, atasPermintaan, setAtasPermintaan)}
                                ></input>
                                <label htmlFor="permintaan_dokter" className="mr-3">
                                    Dokter
                                </label>
                                <input
                                    type="checkbox"
                                    id="permintaan_pasien"
                                    value="Pasien/Keluarga"
                                    checked={atasPermintaan.includes("Pasien/Keluarga")}
                                    onChange={(e) => handleCheckboxArray(e, atasPermintaan, setAtasPermintaan)}
                                ></input>
                                <label htmlFor="permintaan_pasien">Pasien/Keluarga</label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    id="permintaan_lainnya"
                                    value="Lainnya"
                                    checked={atasPermintaan.includes("Lainnya")}
                                    onChange={(e) => handleCheckboxArray(e, atasPermintaan, setAtasPermintaan)}
                                ></input>
                                <label htmlFor="permintaan_lainnya">Lainnya</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 border-2 text-xs md:text-sm sm:text-xs">
                    <div>
                        <div className="flex justify-center border-2">
                            Petugas Pendamping
                        </div>
                        <div>Dokter</div>
                        <div>Perawat</div>
                        <div>Bidan</div>
                        <div>Driver</div>
                    </div>

                    <div>
                        <div className="flex justify-center border-2">Nama</div>
                        <div>
                            <input type="text" name="dokter" value={petugasPendamping.dokter} onChange={(e) => handleObjectChange(e, petugasPendamping, setPetugasPendamping)} className="p-0 w-full"></input>
                        </div>
                        <div>
                            <input type="text" name="perawat" value={petugasPendamping.perawat} onChange={(e) => handleObjectChange(e, petugasPendamping, setPetugasPendamping)} className="p-0 w-full"></input>
                        </div>
                        <div>
                            <input type="text" name="bidan" value={petugasPendamping.bidan} onChange={(e) => handleObjectChange(e, petugasPendamping, setPetugasPendamping)} className="p-0 w-full"></input>
                        </div>
                        <div>
                            <input type="text" name="driver" value={petugasPendamping.driver} onChange={(e) => handleObjectChange(e, petugasPendamping, setPetugasPendamping)} className="p-0 w-full"></input>
                        </div>
                    </div>
                </div>
                <div className="border-2 font-bold text-xs md:text-sm sm:text-xs">
                    KONDISI SAAT INI
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[50%]">HPHT</div>
                    <div className="w-[50%]">
                        <input type="text" name="hpht" value={kondisiSaatIni.hpht} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[50%]">Usia Kehamilan (mg)</div>
                    <div className="w-[50%]">
                        <input type="text" name="usia_kehamilan" value={kondisiSaatIni.usia_kehamilan} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">TB (cm)</div>
                        <div className="w-[50%]">
                            <input type="text" name="tb" value={kondisiSaatIni.tb} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">BB (Kg)</div>
                        <div className="w-[50%]">
                            <input type="text" name="bb" value={kondisiSaatIni.bb} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">KU</div>
                        <div className="w-[50%]">
                            <input type="text" name="ku" value={kondisiSaatIni.ku} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">Spo2</div>
                        <div className="w-[50%]">
                            <input type="text" name="spo2" value={kondisiSaatIni.spo2} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">TD</div>
                        <div className="w-[50%]">
                            <input type="text" name="td" value={kondisiSaatIni.td} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">RR</div>
                        <div className="w-[50%]">
                            <input type="text" name="rr" value={kondisiSaatIni.rr} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                </div>
                <div className="flex border-2 text-xs md:text-sm sm:text-xs">
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">Suhu</div>
                        <div className="w-[50%]">
                            <input type="text" name="suhu" value={kondisiSaatIni.suhu} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                    <div className="flex w-[50%]">
                        <div className="w-[50%]">Denyut jantung janin</div>
                        <div className="w-[50%]">
                            <input type="text" name="djj" value={kondisiSaatIni.djj} onChange={(e) => handleObjectChange(e, kondisiSaatIni, setKondisiSaatIni)} className="p-0 w-full"></input>
                        </div>
                    </div>
                </div>
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div>JIKA DIDAPATI TANDA SYOK</div>
                    <div>
                        <input type="text" name="terjadi" value={tandaSyok.terjadi} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div>
                    Pasien dengan nadi {">"} 100 x/mnt dan TD sisfolik {"<"} 100
                    mmHg
                </div>
                <div>Pemasangan IV Line 2 jalur dengan abocath</div>
                <div className="flex items-center gap-1">
                    <div>
                        <input type="checkbox" name="iv_line" checked={tandaSyok.iv_line} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)}></input>
                    </div>
                    <label>TD</label>
                    <div className="w-16">
                        <input type="text" name="td_1" value={tandaSyok.td_1} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                    mmHg
                    <div className="ml-3">Pukul</div>
                    <div>
                        <input type="time" name="waktu_1" value={tandaSyok.waktu_1} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div>
                        <input type="checkbox" name="ulangi_1_liter" checked={tandaSyok.ulangi_1_liter} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)}></input>
                    </div>
                    <label>Ulangi 1 Liter jika masih Hipotensi</label>
                    <div className="ml-3">
                        TD
                    </div>
                    <div className="w-16">
                        <input type="text" name="td_2" value={tandaSyok.td_2} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                    mmHg
                    <div className="ml-3">Pukul</div>
                    <div>
                        <input type="time" name="waktu_2" value={tandaSyok.waktu_2} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <div>
                        <input type="checkbox" name="pasang_kateter" checked={tandaSyok.pasang_kateter} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)}></input>
                    </div>
                    <label>Pasang kateter</label>
                    <div className="ml-3">
                        Urine output
                    </div>
                    <div className="w-16">
                        <input type="text" name="urine_output" value={tandaSyok.urine_output} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                    cc
                    <div className="ml-3">Pukul</div>
                    <div>
                        <input type="time" name="waktu_3" value={tandaSyok.waktu_3} onChange={(e) => handleObjectChange(e, tandaSyok, setTandaSyok)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    ALASAN DI RUJUK {"(Beri tanda dan catat semua yang sesuai)"}
                </div>
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2"></div>
                    <div className="flex border-2 w-[15%] items-center gap-1">
                        <div>
                            <input type="checkbox" value="PEB/Eklampsia" checked={alasanDirujuk.includes("PEB/Eklampsia")} onChange={(e) => handleCheckboxArray(e, alasanDirujuk, setAlasanDirujuk)}></input>
                        </div>
                        <label>PEB/Eklampsia</label>
                    </div>
                    <div className="flex border-2 w-[20%] items-center gap-1">
                        <div>
                            <input type="checkbox" value="Perdarahan" checked={alasanDirujuk.includes("Perdarahan")} onChange={(e) => handleCheckboxArray(e, alasanDirujuk, setAlasanDirujuk)}></input>
                        </div>
                        <label>Perdarahan</label>
                    </div>
                    <div className="flex border-2 w-[25%] items-center gap-1">
                        <div>
                            <input type="checkbox" value="Partus Macet" checked={alasanDirujuk.includes("Partus Macet")} onChange={(e) => handleCheckboxArray(e, alasanDirujuk, setAlasanDirujuk)}></input>
                        </div>
                        <label>Partus Macet</label>
                    </div>
                    <div className="flex border-2 w-[15%] items-center gap-1">
                        <div>
                            <input type="checkbox" value="Persalinan Prematur" checked={alasanDirujuk.includes("Persalinan Prematur")} onChange={(e) => handleCheckboxArray(e, alasanDirujuk, setAlasanDirujuk)}></input>
                        </div>
                        <label>Persalinan Prematur</label>
                    </div>
                    <div className="flex border-2 w-[15%] items-center gap-1">
                        <div>
                            <input type="checkbox" value="Infeksi Nifas" checked={alasanDirujuk.includes("Infeksi Nifas")} onChange={(e) => handleCheckboxArray(e, alasanDirujuk, setAlasanDirujuk)}></input>
                        </div>
                        <label>Infeksi Nifas</label>
                    </div>
                </div>
                {/* BLOK RIWAYAT: KOTAK LEBIH BESAR, TEKS NORMAL, TANPA SCROLL */}
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs w-full items-stretch">
                    {/* Label Riwayat (Lebar 8%) */}
                    <div className="w-[8%] border-r-2 p-2 flex items-center justify-center">Riwayat</div>
                    
                    {/* Kolom 1 (Lebar 17%) */}
                    <div className="w-[17%] border-r-2 flex flex-col">
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Sakit Kepala" checked={riwayat.includes("Sakit Kepala")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Sakit Kepala</label>
                        </div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Nyeri Ulu Hati" checked={riwayat.includes("Nyeri Ulu Hati")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Nyeri Ulu Hati</label>
                        </div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Pandangan Kabur" checked={riwayat.includes("Pandangan Kabur")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Pandangan Kabur</label>
                        </div>
                        <div className="flex w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Kejang" checked={riwayat.includes("Kejang")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Kejang</label>
                        </div>
                    </div>
                    
                    {/* Kolom 2 (Lebar 17%) */}
                    <div className="w-[17%] border-r-2 flex flex-col">
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Usia Kehamilan" checked={riwayat.includes("Usia Kehamilan")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Usia Kehamilan</label>
                        </div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2"></div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Nyeri" checked={riwayat.includes("Nyeri")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Nyeri</label>
                        </div>
                        <div className="flex w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Kontraksi" checked={riwayat.includes("Kontraksi")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Kontraksi</label>
                        </div>
                    </div>

                    {/* Kolom 3 (Lebar 26% - Diberi ruang paling besar karena teks panjang) */}
                    <div className="w-[26%] border-r-2 flex flex-col">
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="partograf melewati garis waspada" checked={riwayat.includes("partograf melewati garis waspada")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">partograf melewati garis waspada</label>
                        </div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="tidak adekuat" checked={riwayat.includes("tidak adekuat")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">
                                tidak adekuat <br/><span className="font-normal text-xs text-gray-500">(frek, 3x/10 mnt, durasi &lt; 40)</span>
                            </label>
                        </div>
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="tidak terbaca" checked={riwayat.includes("tidak terbaca")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">tidak terbaca</label>
                        </div>
                        <div className="w-full flex-1 flex flex-col justify-center p-2 hover:bg-gray-50">
                            <div className="flex items-start gap-1.5 mb-1.5">
                                <input type="checkbox" className="mt-0.5 shrink-0" value="kelainan letak" checked={riwayat.includes("kelainan letak")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                                <label className="leading-tight">kelainan letak</label>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <input type="checkbox" className="shrink-0" value="Taksiran berat bayi" checked={riwayat.includes("Taksiran berat bayi")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                                <label className="leading-tight whitespace-nowrap">Taksiran berat bayi</label>
                                <input
                                    type="text"
                                    name="taksiran_berat_bayi"
                                    value={fisikInput.taksiran_berat_bayi}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-12 text-center h-5 text-sm focus:ring-0 border-b border-gray-400 font-bold bg-transparent"
                                ></input>
                                <span className="font-normal text-xs">gr</span>
                            </div>
                        </div>
                    </div>

                    {/* Kolom 4 (Lebar 16%) */}
                    <div className="w-[16%] border-r-2 flex flex-col">
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="<37 minggu" checked={riwayat.includes("<37 minggu")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">&lt;37 minggu</label>
                        </div>
                        <div className="flex w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Ketuban pecah" checked={riwayat.includes("Ketuban pecah")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Ketuban pecah</label>
                        </div>
                    </div>
                    
                    {/* Kolom 5 (Lebar 16%) */}
                    <div className="w-[16%] flex flex-col">
                        <div className="flex border-b-2 w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="Demam" checked={riwayat.includes("Demam")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">Demam, S &gt; 38 C</label>
                        </div>
                        <div className="flex w-full flex-1 items-start gap-1.5 p-2 hover:bg-gray-50">
                            <input type="checkbox" className="mt-0.5 shrink-0" value="kesadaran" checked={riwayat.includes("kesadaran")} onChange={(e) => handleCheckboxArray(e, riwayat, setRiwayat)}></input>
                            <label className="leading-tight">kesadaran</label>
                        </div>
                    </div>
                </div>
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2">Riwayat lain</div>
                    <div className="w-[90%]">
                        <input type="text" value={riwayatLain} onChange={(e) => setRiwayatLain(e.target.value)} className="p-0 w-full"></input>
                    </div>
                </div>
                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2">Fisik</div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[25%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="TD>140/90 mmHg" checked={fisik.includes("TD>140/90 mmHg")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>TD{">"}140/90 mmHg</label>
                        </div>
                    </div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[25%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Nadi>100/mnt" checked={fisik.includes("Nadi>100/mnt")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Nadi{">"}100/mnt</label>
                        </div>
                        <div className="flex border-2 w-full min-h-[25%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Sistolik<100 mmHg" checked={fisik.includes("Sistolik<100 mmHg")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Sistolik{"<"}100 mmHg</label>
                        </div>
                    </div>
                    <div className="w-[25%]">
                        <div className="border-2 w-full min-h-[40%] flex items-center gap-1 px-1">
                            <div>Penurunan</div>
                            <div>
                                <select name="penurunan" value={fisikInput.penurunan} onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)} className="pt-0 pb-0">
                                    <option>1/5</option>
                                    <option>2/5</option>
                                    <option>3/5</option>
                                    <option>4/5</option>
                                    <option>5/5</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-2 w-full min-h-[40%] flex items-center gap-1 px-1">
                            <div className="flex items-center gap-1">
                                <div>
                                    <input type="checkbox" value="Lama persalinan" checked={fisik.includes("Lama persalinan")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                                </div>
                                <label>Lama persalinan</label>
                            </div>
                            <div className="flex items-center gap-1">
                                <input type="text" name="lama_persalinan" value={fisikInput.lama_persalinan} onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)} className="p-0 w-[40px]"></input>jam
                            </div>
                        </div>
                        <div className="flex border-2 w-full min-h-[20%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Moulase" checked={fisik.includes("Moulase")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Moulase</label>
                        </div>
                    </div>
                    <div className="w-[20%]">
                        <div className="flex border-2 w-full min-h-[30%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Usia kehamilan" checked={fisik.includes("Usia kehamilan")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Usia kehamilan</label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    name="usia_kehamilan"
                                    value={fisikInput.usia_kehamilan}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-[40px]"
                                ></input>
                                mgg
                            </div>
                        </div>
                        <div className="flex border-2 w-full min-h-[30%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Kontraksi" checked={fisik.includes("Kontraksi")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Kontraksi</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="kontraksi_frekuensi"
                                    value={fisikInput.kontraksi_frekuensi}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-[30px]"
                                ></input>
                                /10 mnt/
                            </div>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    name="kontraksi_durasi"
                                    value={fisikInput.kontraksi_durasi}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-[30px]"
                                ></input>
                                dtk
                            </div>
                        </div>
                        <div className="flex border-2 w-full min-h-[20%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Ketuban pecah" checked={fisik.includes("Ketuban pecah")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Ketuban pecah</label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    name="ketuban_pecah_jam"
                                    value={fisikInput.ketuban_pecah_jam}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-[30px]"
                                ></input>
                                jam
                            </div>
                        </div>
                        <div className="flex border-2 w-full min-h-[20%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="leukosit" checked={fisik.includes("leukosit")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>leukosit</label>
                        </div>
                    </div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[30%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Nadi>100x/mnt" checked={fisik.includes("Nadi>100x/mnt")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Nadi{">"}100x/mnt</label>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    name="nadi_100"
                                    value={fisikInput.nadi_100}
                                    onChange={(e) => handleObjectChange(e, fisikInput, setFisikInput)}
                                    className="p-0 w-[30px]"
                                ></input>
                                mgg
                            </div>
                        </div>
                        <div className="flex border-2 w-full min-h-[30%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Sistolik" checked={fisik.includes("Sistolik")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Sistolik</label>
                        </div>
                        <div className="flex border-2 w-full min-h-[20%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Lochia berbau" checked={fisik.includes("Lochia berbau")} onChange={(e) => handleCheckboxArray(e, fisik, setFisik)}></input>
                            </div>
                            <label>Lochia berbau</label>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2">Lab</div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Proteinuria 1+2+3+" checked={lab.includes("Proteinuria 1+2+3+")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>Proteinuria 1+2+3+</label>
                        </div>
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="HIV/AIDS" checked={lab.includes("HIV/AIDS")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>HIV/AIDS</label>
                        </div>
                    </div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Hb" checked={lab.includes("Hb")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>Hb</label>
                        </div>
                    </div>
                    <div className="w-[25%]">
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="HBSAg" checked={lab.includes("HBSAg")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>HBSAg</label>
                        </div>
                    </div>
                    <div className="w-[20%]">
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Leukosit LEA air ket" checked={lab.includes("Leukosit LEA air ket")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>Leukosit LEA {"air ket"}</label>
                        </div>
                    </div>
                    <div className="w-[15%]">
                        <div className="flex border-2 w-full min-h-[50%] items-center gap-1">
                            <div>
                                <input type="checkbox" value="Leukosit" checked={lab.includes("Leukosit")} onChange={(e) => handleCheckboxArray(e, lab, setLab)}></input>
                            </div>
                            <label>Leukosit</label>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2">Lain-lain</div>
                    <div className="w-[90%] border-2">
                        <div>
                            <input type="text" value={lainLain} onChange={(e) => setLainLain(e.target.value)} className="w-full p-0"></input>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%]">DIAGNOSA</div>
                    <div className="w-[90%]">
                        <div>
                            <input type="text" value={diagnosa} onChange={(e) => setDiagnosa(e.target.value)} className="w-full p-0"></input>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[15%]">PENANGANAN</div>
                    <div className="w-[85%]">
                        <div>
                            <input type="text" value={penanganan} onChange={(e) => setPenanganan(e.target.value)} className="w-full p-0"></input>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[15%]">TINDAKAN/THERAPY</div>
                    <div className="w-[85%]">
                        <div>
                            <input type="text" value={tindakanTherapy} onChange={(e) => setTindakanTherapy(e.target.value)} className="w-full p-0"></input>
                        </div>
                    </div>
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    HAL PENTING YANG PERLU DICATAT SELAMA PERJALANAN
                </div>

                <div className="flex font-bold border-2 text-xs md:text-sm sm:text-xs">
                    <div className="w-[10%] border-2">
                        <div>Waktu</div>
                        <div>
                            <input type="text" name="waktu" value={monitoring[0].waktu} onChange={(e) => handleMonitoringChange(0, e)} className="p-0 w-full"></input>
                        </div>
                    </div>
                    <div className="w-[90%] border-2">
                        <div className="flex justify-center">Monitoring</div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">Tanda Vital</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="tanda_vital"
                                        value={monitoring[0].tanda_vital}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">TD</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="td"
                                        value={monitoring[0].td}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">KU</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="ku"
                                        value={monitoring[0].ku}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">pernafasan</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="pernafasan"
                                        value={monitoring[0].pernafasan}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">Nadi</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="nadi"
                                        value={monitoring[0].nadi}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">PPV</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="ppv"
                                        value={monitoring[0].ppv}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">Suhu</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="suhu"
                                        value={monitoring[0].suhu}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">VT</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="vt"
                                        value={monitoring[0].vt}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">Observasi His</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="observasi_his"
                                        value={monitoring[0].observasi_his}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">DJJ</div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="djj"
                                        value={monitoring[0].djj}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full">
                            <div className="flex w-[50%]">
                                <div className="w-[30%]">
                                    Monitoring keadaan pasien
                                </div>
                                <div className="w-[70%]">
                                    <input
                                        type="text"
                                        name="keadaan_pasien"
                                        value={monitoring[0].keadaan_pasien}
                                        onChange={(e) => handleMonitoringChange(0, e)}
                                        className="p-0 w-full"
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center border-2 text-xs md:text-sm sm:text-xs">
                    NAMA DAN TANDA TANGAN PETUGAS
                </div>

                <div className="flex mt-3 border-2 text-sm">
                    <div className="w-full border-2">
                        <div className="flex">
                            <div className="w-[40%]">Tanggal</div>
                            <div className="w-[60%]">
                                <input
                                    className="w-full p-0"
                                    type="date"
                                    value={ttdPetugas.tanggal}
                                    onChange={(e) => setTtdPetugas({...ttdPetugas, tanggal: e.target.value})}
                                ></input>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-[40%]">Jam</div>
                            <div className="w-[60%]">
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <MobileTimePicker
                                        value={ttdPetugas.jam}
                                        onChange={(val) => setTtdPetugas({...ttdPetugas, jam: val})}
                                        ampm={false}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-[40%]">RS / Puskesmas</div>
                            <div className="w-[60%]">
                                <input
                                    className="w-full p-0"
                                    type="text"
                                    list="rs_puskesmas_maternal_list"
                                    value={ttdPetugas.rs_puskesmas}
                                    onChange={(e) => setTtdPetugas({...ttdPetugas, rs_puskesmas: e.target.value})}
                                    placeholder="Ketik atau pilih RS/Puskesmas..."
                                />
                                <datalist id="rs_puskesmas_maternal_list">
                                    {daftarRS.map((rs, i) => (
                                        <option key={i} value={rs.nama} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-2">
                        <div className="relative border-solid border-2">
                            <div className="flex justify-center">
                                Yang menyerahkan
                            </div>
                            <div className="h-24 border-b">
                                <SignatureCanvas
                                    canvasProps={{
                                        className: "sigCanvas w-full h-full",
                                    }}
                                    ref={ref_ttd_petugas_ambulance}
                                />
                            </div>
                            <div>
                                <input
                                    className="text-xs md:text-sm sm:text-xs w-full p-0 text-center"
                                    type="text"
                                    name="keluarga_pasien_petugas_rs"
                                    value={ttdPetugas.yang_menyerahkan.nama}
                                    onChange={(e) => setTtdPetugas({...ttdPetugas, yang_menyerahkan: {...ttdPetugas.yang_menyerahkan, nama: e.target.value}})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-2">
                        <div className="relative border-solid border-2">
                            <div className="flex justify-center">
                                Yang Menerima
                            </div>
                            <div className="h-24 border-b">
                                <SignatureCanvas
                                    canvasProps={{
                                        className: "sigCanvas w-full h-full",
                                    }}
                                    ref={ref_ttd_petugas_rs}
                                />
                            </div>
                            <div>
                                <input
                                    className="text-xs md:text-sm sm:text-xs w-full p-0 text-center"
                                    type="text"
                                    name="keluarga_pasien_petugas_rs"
                                    value={ttdPetugas.yang_menerima.nama}
                                    onChange={(e) => setTtdPetugas({...ttdPetugas, yang_menerima: {...ttdPetugas.yang_menerima, nama: e.target.value}})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 mt-3 mb-5 text-xs md:text-sm sm:text-xs print:hidden">
                    <div></div>
                    <button
                        type="button"
                        onClick={oc_simpan}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    >
                        {props.id ? "Perbarui" : "Simpan"}
                    </button>
                    <button
                        type="button"
                        onClick={oc_print}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
}