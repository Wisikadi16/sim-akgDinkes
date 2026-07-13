import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
import { useReactToPrint } from "react-to-print";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Form_Neonatal(props) {
    const [id_form, set_id_form] = useState(null);

    const [isPrinting, setIsPrinting] = useState(false);

    const [jam_lahir_identitas_bayi, set_jam_lahir_identitas_bayi] =
        React.useState(dayjs(new Date()));

    const [identitas_bayi, set_identitas_bayi] = useState({
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
        id: "",
        tim: "",
        dokter: "",
        perawat: "",
        bidan: "",
        driver: "",
    });

    const os_identitas_tim_ambulance = (data) => {
        console.log("identitas tim ambulance");
        console.log(data);
        console.log(id_form);
        // if(id_form==null){
        set_identitas_tim_ambulance(data);
        // }
    };

    console.log("tim ambulan");
    console.log(identitas_tim_ambulance);

    // const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    // const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [semua_kecamatan_identitas_ibu, set_semua_kecamatan_identitas_ibu] =
        useState([]);
    const [semua_kelurahan_identitas_ibu, set_semua_kelurahan_identitas_ibu] =
        useState([]);
    const [semua_kecamatan_identitas_ayah, set_semua_kecamatan_identitas_ayah] =
        useState([]);
    const [semua_kelurahan_identitas_ayah, set_semua_kelurahan_identitas_ayah] =
        useState([]);
    const [get_data_icd_10, set_data_icd_10] = useState([]);
    const [get_data_icd_9, set_data_icd_9] = useState([]);
    const [daftarRS, setDaftarRS] = useState([]);

    useEffect(() => {
        axios
            .post(window.location.origin + "/ref_kecamatan", {})
            .then(function (response) {
                set_semua_kecamatan(response.data);
                set_semua_kecamatan_identitas_ibu(response.data);
                set_semua_kecamatan_identitas_ayah(response.data);
            });

        axios
            .post(window.location.origin + "/ref_kelurahan", {
                kode_kecamatan: kode_kecamatan,
            })
            .then(function (response) {
                set_semua_kelurahan(response.data);
                set_semua_kelurahan_identitas_ibu(response.data);
                set_semua_kelurahan_identitas_ayah(response.data);
            });

        axios
            .post(window.location.origin + "/ref_icd_10")
            .then(function (response) {
                set_data_icd_10(response.data);
            });

        axios
            .post(window.location.origin + "/ref_icd_9")
            .then(function (response) {
                set_data_icd_9(response.data);
            });

        axios
            .post(window.location.origin + "/ref_faskes", {
                jenis: "rumah sakit",
            })
            .then(function (response) {
                setDaftarRS(response.data);
            })
            .catch((error) => console.log("Gagal memuat data RS:", error));

        if (props.id != null) {
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

            axios
                .post(window.location.origin + "/ref_form_neonatal", {
                    id: props.id,
                })
                .then(function (response) {
                    console.log("id bayi");
                    console.log(response);

                    const responseData = response.data;
                    console.log(responseData.form.id);

                    set_id_form(responseData.form.id);

                    //identitas bayi
                    set_identitas_bayi((prevState) => ({
                        ...prevState,
                        nama_pasien: responseData.pasien.nama,
                        tgl_lahir: responseData.pasien.tgl_lahir,
                        jam_lahir: responseData.pasien.jam_lahir,
                        jenis_kelamin: responseData.pasien.jenis_kelamin,
                    }));

                    if (responseData.pasien.jam_lahir) {
                        const split_jam_lahir =
                            responseData.pasien.jam_lahir.split(":");
                        const tgl_lahir_jam = new Date(
                            responseData.pasien.tgl_lahir +
                                " " +
                                responseData.pasien.jam_lahir,
                        );
                        const dayjs_tgl_lahir = dayjs(tgl_lahir_jam)
                            .hour(split_jam_lahir[0])
                            .minute(split_jam_lahir[1]);
                        set_jam_lahir_identitas_bayi(dayjs_tgl_lahir);
                    }

                    //identitas tim ambulan
                    set_identitas_tim_ambulance((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (key.includes("ita_")) {
                                // console.log("keybaur")
                                const key_baru = key.replace(/^ita_/, "");
                                // console.log(key_baru)
                                newState[key_baru] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    //identitas ibu
                    set_identitas_ibu((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (key.includes("_ibu")) {
                                const key_baru = key.replace(/_ibu/, "");

                                newState[key_baru] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    //identitas ayah
                    set_identitas_ayah((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (key.includes("_ayah")) {
                                const key_baru = key.replace(/_ayah/, "");

                                newState[key_baru] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    //riwayat kehamilan dan persalinan
                    set_riwayat_kehamilan_dan_persalinan((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (prevState.hasOwnProperty(key)) {
                                newState[key] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    set_kronologi_anamnesis(responseData.anamnesis);

                    set_pemeriksaan_fisik((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (prevState.hasOwnProperty(key)) {
                                newState[key] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    set_pemeriksaan_penunjang(
                        responseData.pemeriksaan_penunjang,
                    );

                    set_diagnosis_medis(
                        parseJSON(responseData.diagnosis_medis, [])
                    );

                    set_terapi_tindakan_konsul(
                        parseJSON(responseData.terapi_tindakan_konsul, [])
                    );

                    set_lain_lain(responseData.lain_lain);

                    if (responseData.rsr_faskes != null) {
                        set_pilih_rumah_sakit_rujukan("true");
                    }
                    set_rumah_sakit_rujukan((prevState) => {
                        let newState = { ...prevState };

                        Object.keys(responseData).forEach((key) => {
                            if (key.includes("rsr_")) {
                                const key_baru = key.replace(/rsr_/, "");

                                if (key_baru == "jam" && responseData.rsr_jam) {
                                    const split_jam =
                                        responseData.rsr_jam.split(":");
                                    const tgl_jam = new Date(
                                        responseData.rsr_tgl +
                                            " " +
                                            responseData.rsr_jam,
                                    );
                                    const dayjs_tgl = dayjs(tgl_jam)
                                        .hour(split_jam[0])
                                        .minute(split_jam[1]);
                                    newState["tp_jam"] = dayjs_tgl;
                                }
                                newState[key_baru] = responseData[key];
                            }
                        });

                        return newState;
                    });

                    set_nama_ttd_petugas_ambulance_hebat(
                        responseData.nama_ttd_petugas_ambulance_hebat || "",
                    );
                    
                    if (responseData.ttd_petugas_ambulance_hebat) {
                        setTimeout(() => {
                            if (ref_ttd_petugas_ambulance.current && typeof ref_ttd_petugas_ambulance.current.fromDataURL === 'function') {
                                ref_ttd_petugas_ambulance.current.fromDataURL(responseData.ttd_petugas_ambulance_hebat);
                            }
                        }, 500);
                    }

                    set_status_ttd_petugas_rs_keluarga_pasien(
                        responseData.status_ttd_petugas_rs_keluarga_pasien || "",
                    );
                    set_nama_ttd_petugas_rs_keluarga_pasien(
                        responseData.nama_ttd_petugas_rs_keluarga_pasien || "",
                    );
                    
                    if (responseData.ttd_petugas_rs_keluarga_pasien) {
                        setTimeout(() => {
                            if (ref_ttd_petugas_rs_keluarga_pasien.current && typeof ref_ttd_petugas_rs_keluarga_pasien.current.fromDataURL === 'function') {
                                ref_ttd_petugas_rs_keluarga_pasien.current.fromDataURL(responseData.ttd_petugas_rs_keluarga_pasien);
                            }
                        }, 500);
                    }
                })
                .catch(function (error) {
                    console.log("Gagal memuat data form neonatal:", error);
                    toast.error(
                        "Gagal memuat data form. Silakan muat ulang halaman.",
                        { position: "top-right" },
                    );
                });
        }
    }, []);

    function cari_nama_kecamatan(kode_kecamatan) {
        const kecamatan = semua_kecamatan.find(
            (val) => val.kode_kecamatan === kode_kecamatan,
        );

        return kecamatan ? kecamatan.nama_kecamatan : null;
    }

    function cari_nama_kelurahan(kode_kelurahan) {
        const kelurahan = semua_kelurahan.find(
            (val) => val.kode_kelurahan === kode_kelurahan,
        );

        return kelurahan ? kelurahan.nama_kelurahan : null;
    }

    const [identitas_ibu, set_identitas_ibu] = useState({
        nama: "",
        usia: "",
        pekerjaan: "",
        goldar: "",
        no_telepon: "",
        alamat: "",
        kecamatan: "",
        kelurahan: "",
    });

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
        goldar: "",
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

    const [
        riwayat_kehamilan_dan_persalinan,
        set_riwayat_kehamilan_dan_persalinan,
    ] = useState({
        usia_gestasi: "",
        anc: "",
        riwayat_penyakit_kehamilan: "",
        penolong_persalinan: "",
        cara_persalinan: "",
        apgar_score: "",
        apgar_score_status: "",
    });

    const oc_riwayat_kehamilan_dan_persalinan = (e) => {
        const value = e.target.value;

        set_riwayat_kehamilan_dan_persalinan({
            ...riwayat_kehamilan_dan_persalinan,
            [e.target.name]: value,
        });
    };

    console.log("riwayat kehamilan dan persalinan");
    console.log(riwayat_kehamilan_dan_persalinan);

    function cbx_apgar_score(event) {
        const { value, checked } = event.target;
        if (checked) {
            set_riwayat_kehamilan_dan_persalinan({
                ...riwayat_kehamilan_dan_persalinan,
                ["apgar_score_status"]: "ya",
            });
        } else {
            set_riwayat_kehamilan_dan_persalinan({
                ...riwayat_kehamilan_dan_persalinan,
                ["apgar_score_status"]: "",
            });
        }
    }

    const [kronologi_anamnesis, set_kronologi_anamnesis] = useState("");

    console.log("kronologi anamnesis");
    console.log(kronologi_anamnesis);

    const [pemeriksaan_fisik, set_pemeriksaan_fisik] = useState({
        tekanan_darah: "",
        nadi: "",
        pernafasan: "",
        suhu: "",
        saturasi_oksigen: "",
        berat_badan_lahir: "",
        panjang_badan: "",
        lingkar_kepala: "",
        lingkar_dada: "",
        lingkar_perut: "",
        keadaan_umum: "",
        warna_kulit: "",
        kepala: "",
        ket_kepala: "",
        mata: "",
        ket_mata: "",
        leher: "",
        ket_leher: "",
        jantung: "",
        ket_jantung: "",
        paru: "",
        ket_paru: "",
        abdomen: "",
        ket_abdomen: "",
        ekstremitas: "",
        ket_ekstremitas: "",
        genitalia: "",
        genitalia_jenis_kelamin: "Laki-laki",
        ket_genitalia: "",
        anus: "",
        ket_anus: "",
    });

    const oc_pemeriksaan_fisik = (e) => {
        const value = e.target.value;

        set_pemeriksaan_fisik({
            ...pemeriksaan_fisik,
            [e.target.name]: value,
        });
    };

    function cbx_pemeriksaan_fisik(event) {
        const { value, checked, name } = event.target;
        set_pemeriksaan_fisik((prevState) => ({
            ...prevState,
            [name]: checked
                ? [...prevState[name], value]
                : prevState[name].filter((val) => val !== value),
        }));
    }

    console.log("pemeriksaan fisik");
    console.log(pemeriksaan_fisik);

    const [pemeriksaan_penunjang, set_pemeriksaan_penunjang] = useState("");
    console.log(pemeriksaan_penunjang);

    const [terapi_tindakan_konsul, set_terapi_tindakan_konsul] = useState([]);

    const [lain_lain, set_lain_lain] = useState("");
    console.log(lain_lain);

    const [pilih_rumah_sakit_rujukan, set_pilih_rumah_sakit_rujukan] =
        useState(false);

    const oc_tambah_terapi_tindakan_konsul = () => {
        const c_val = [...terapi_tindakan_konsul, []];
        set_terapi_tindakan_konsul(c_val);
    };

    const oc_value_terapi_tindakan_konsul = (e, i) => {
        const value = [...terapi_tindakan_konsul];
        value[i] = e.target.value;
        set_terapi_tindakan_konsul(value);
    };

    const oc_hapus_terapi_tindakan_konsul = (i) => {
        console.log("hapus " + i);
        const value = [...terapi_tindakan_konsul];
        value.splice(i, 1);
        set_terapi_tindakan_konsul(value);
    };

    const [diagnosis_medis, set_diagnosis_medis] = useState([]);

    const oc_tambah_diagnosis_medis = () => {
        const c_val = [...diagnosis_medis, []];
        set_diagnosis_medis(c_val);
    };

    const oc_value_diagnosis_medis = (e, i) => {
        const value = [...diagnosis_medis];
        value[i] = e.target.value;
        set_diagnosis_medis(value);
    };

    const oc_hapus_diagnosis_medis = (i) => {
        console.log("hapus " + i);
        const value = [...diagnosis_medis];
        value.splice(i, 1);
        set_diagnosis_medis(value);
    };

    const [jam_rumah_sakit_rujukan, set_jam_rumah_sakit_rujukan] =
        React.useState(dayjs(new Date()));

    const [rumah_sakit_rujukan, set_rumah_sakit_rujukan] = useState({
        faskes: "",
        tgl: "",
        tp_jam: dayjs(new Date()),
        jam:
            (JSON.stringify(jam_rumah_sakit_rujukan.$H).length == 1
                ? "0" + jam_rumah_sakit_rujukan.$H
                : jam_lahir_identitas_bayi.$H) +
            ":" +
            (JSON.stringify(jam_rumah_sakit_rujukan.$m).length == 1
                ? "0" + jam_rumah_sakit_rujukan.$m
                : jam_lahir_identitas_bayi.$m),
        alasan_rujuk: "",
    });

    const oc_rumah_sakit_rujukan = (e) => {
        if (e.$H != null) {
            var jam = JSON.stringify(e.$H);
            if (jam.length == 1) {
                jam = "0" + jam;
            }
            var menit = JSON.stringify(e.$m);
            if (menit.length == 1) {
                menit = "0" + menit;
            }

            set_rumah_sakit_rujukan({
                ...rumah_sakit_rujukan,
                ["jam"]: jam + ":" + menit,
            });
        } else {
            const value = e.target.value;

            set_rumah_sakit_rujukan({
                ...rumah_sakit_rujukan,
                [e.target.name]: value,
            });
        }
    };

    console.log("rumah sakit rujukan");
    console.log(rumah_sakit_rujukan);

    // let ref_ttd_petugas_ambulance = useRef({})

    const [
        nama_ttd_petugas_ambulance_hebat,
        set_nama_ttd_petugas_ambulance_hebat,
    ] = useState("");

    const [
        status_ttd_petugas_rs_keluarga_pasien,
        set_status_ttd_petugas_rs_keluarga_pasien,
    ] = useState("Petugas Rs");

    const [
        nama_ttd_petugas_rs_keluarga_pasien,
        set_nama_ttd_petugas_rs_keluarga_pasien,
    ] = useState("");

    const [get_ttd_petugas_ambulance, set_ttd_petugas_ambulance] = useState("");
    const [
        get_ttd_petugas_rs_keluarga_pasien,
        set_ttd_petugas_rs_keluarga_pasien,
    ] = useState("");

    let ref_ttd_petugas_ambulance = useRef({});

    let ref_ttd_petugas_rs_keluarga_pasien = useRef({});

    const oe_ttd_petugas_ambulance = () => {
        set_ttd_petugas_ambulance(
            ref_ttd_petugas_ambulance.current.toDataURL(),
        );
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
    };

    const oe_ttd_petugas_rs_keluarga_pasien = () => {
        set_ttd_petugas_rs_keluarga_pasien(
            ref_ttd_petugas_rs_keluarga_pasien.current.toDataURL(),
        );
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
    };

    const oc_hapus_ttd_petugas_ambulance = () => {
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
        // set_url_ttd_petugas_ambulance(get_ttd_petugas_ambulance.getTrimmedCanvas().toDataURL('image/png'))
        // get_ttd_petugas_ambulance.clear();
        ref_ttd_petugas_ambulance.current.clear();
        // set_url_ttd_petugas_ambulance('');
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_url_ttd_petugas_ambulance)
    };
    const oc_hapus_ttd_petugas_rs_keluarga_pasien = () => {
        // get_ttd_keluarga_pasien_petugas_rs.clear();
        ref_ttd_petugas_rs_keluarga_pasien.current.clear();
    };

    const oc_simpan = (e) => {
        console.log(e.preventDefault());
        
        const ttd_petugas_val = ref_ttd_petugas_ambulance.current && typeof ref_ttd_petugas_ambulance.current.isEmpty === 'function' && !ref_ttd_petugas_ambulance.current.isEmpty() 
            ? ref_ttd_petugas_ambulance.current.getCanvas().toDataURL('image/png') 
            : "";
        const ttd_keluarga_val = ref_ttd_petugas_rs_keluarga_pasien.current && typeof ref_ttd_petugas_rs_keluarga_pasien.current.isEmpty === 'function' && !ref_ttd_petugas_rs_keluarga_pasien.current.isEmpty() 
            ? ref_ttd_petugas_rs_keluarga_pasien.current.getCanvas().toDataURL('image/png') 
            : "";

        const v_pemeriksaan_fisik = {};

        for (const key of Object.keys(pemeriksaan_fisik)) {
            v_pemeriksaan_fisik[key] = pemeriksaan_fisik[key];
        }

        var jenis;
        if (id_form != null) {
            jenis = "perbarui";
        } else {
            jenis = "simpan";
        }

        axios
            .post(window.location.origin + "/form_neonatal/" + jenis, {
                id_form: id_form,

                //identitas bayi
                nama_bayi: identitas_bayi.nama_pasien,
                tgl_lahir_bayi: identitas_bayi.tgl_lahir,
                jam_lahir: identitas_bayi.jam_lahir,
                jenis_kelamin: identitas_bayi.jenis_kelamin,
                //identitas tim ambulance
                ita_id_tim: identitas_tim_ambulance.id,
                ita_tim: identitas_tim_ambulance.tim,
                ita_dokter: identitas_tim_ambulance.dokter,
                ita_nakes_1: identitas_tim_ambulance.nakes_1,
                ita_nakes_2: identitas_tim_ambulance.nakes_2,
                ita_perawat: identitas_tim_ambulance.perawat,
                ita_bidan: identitas_tim_ambulance.bidan,
                ita_driver: identitas_tim_ambulance.driver,
                //identitas orangtua
                //identitas ibu
                nama_ibu: identitas_ibu.nama,
                usia_ibu: identitas_ibu.usia,
                pekerjaan_ibu: identitas_ibu.pekerjaan,
                goldar_ibu: identitas_ibu.goldar,
                no_telepon_ibu: identitas_ibu.no_telepon,
                alamat_ibu: identitas_ibu.alamat,
                kecamatan_ibu: identitas_ibu.kecamatan,
                kelurahan_ibu: identitas_ibu.kelurahan,
                //identitas ayah
                nama_ayah: identitas_ayah.nama,
                usia_ayah: identitas_ayah.usia,
                pekerjaan_ayah: identitas_ayah.pekerjaan,
                goldar_ayah: identitas_ayah.goldar,
                no_telepon_ayah: identitas_ayah.no_telepon,
                alamat_ayah: identitas_ayah.alamat,
                kecamatan_ayah: identitas_ayah.kecamatan,
                kelurahan_ayah: identitas_ayah.kelurahan,
                //riwayat kehamilan dan persalinan
                usia_gestasi: riwayat_kehamilan_dan_persalinan.usia_gestasi,
                anc: riwayat_kehamilan_dan_persalinan.anc,
                riwayat_penyakit_kehamilan:
                    riwayat_kehamilan_dan_persalinan.riwayat_penyakit_kehamilan,
                penolong_persalinan:
                    riwayat_kehamilan_dan_persalinan.penolong_persalinan,
                cara_persalinan:
                    riwayat_kehamilan_dan_persalinan.cara_persalinan,
                apgar_score_status:
                    riwayat_kehamilan_dan_persalinan.apgar_score_status,
                apgar_score: riwayat_kehamilan_dan_persalinan.apgar_score,
                //kronologi
                anamnesis: kronologi_anamnesis,
                //pemeriksaan fisik

                pemeriksaan_fisik: v_pemeriksaan_fisik,

                pemeriksaan_penunjang: pemeriksaan_penunjang,
                diagnosis_medis: diagnosis_medis,
                terapi_tindakan_konsul: terapi_tindakan_konsul,
                lain_lain: lain_lain,

                // tekanan_darah:pemeriksaan_fisik.tekanan_darah,
                // nadi:pemeriksaan_fisik.nadi,
                // pernafasan:pemeriksaan_fisik.pernafasan,
                // suhu:pemeriksaan_fisik.suhu,
                // saturasi_oksigen:pemeriksaan_fisik.saturasi_oksigen,
                // berat_badan_lahir:pemeriksaan_fisik.berat_badan_lahir,
                // panjang_badan:pemeriksaan_fisik.panjang_badan,
                // lingkar_kepala:pemeriksaan_fisik.lingkar_kepala,
                // lingkar_dada:pemeriksaan_fisik.lingkar_dada,
                // lingkar_perut:pemeriksaan_fisik.lingkar_perut,
                // keadaan_umum:pemeriksaan_fisik.keadaan_umum,
                // warna_kulit:pemeriksaan_fisik.warna_kulit,
                // kepala:pemeriksaan_fisik.kepala,
                // ket_kepala:pemeriksaan_fisik.ket_kepala,
                // mata:pemeriksaan_fisik.mata,
                // ket_mata:pemeriksaan_fisik.ket_mata,
                // leher:pemeriksaan_fisik.leher,
                // ket_leher:pemeriksaan_fisik.ket_leher,
                // jantung:pemeriksaan_fisik.jantung,
                // ket_jantung:pemeriksaan_fisik.ket_jantung,
                // paru:pemeriksaan_fisik.paru,
                // ket_paru:pemeriksaan_fisik.ket_paru,
                // abdomen:pemeriksaan_fisik.abdomen,
                // ket_abdomen:pemeriksaan_fisik.ket_abdomen,

                //diagnosis medis

                //rumah sakit rujukan
                rsr_faskes: rumah_sakit_rujukan.faskes,
                rsr_tgl: rumah_sakit_rujukan.tgl,
                rsr_jam: rumah_sakit_rujukan.jam,
                rsr_alasan_rujuk: rumah_sakit_rujukan.alasan_rujuk,

                //petugas ambulance hebat
                nama_ttd_petugas_ambulance_hebat:
                    nama_ttd_petugas_ambulance_hebat,
                ttd_petugas_ambulance_hebat: ttd_petugas_val,

                //keluarga pasien petugas rs
                status_ttd_petugas_rs_keluarga_pasien:
                    status_ttd_petugas_rs_keluarga_pasien,
                nama_ttd_petugas_rs_keluarga_pasien:
                    nama_ttd_petugas_rs_keluarga_pasien,
                ttd_petugas_rs_keluarga_pasien: ttd_keluarga_val,
            })
            .then(function (response) {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                // console.log(response)
            })
            .catch(function (error) {
                toast.error("Data gagal disimpan", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const c_print_ref = useRef(null);
    const promiseResolveRef = useRef(null);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    const oc_print = useReactToPrint({
        content: () => c_print_ref.current,
        // documentTitle: 'emp-data',
        // onBeforeGetContent: () => {
        //       setIsPrinting(true);
        // },
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => setIsPrinting(false),
    });

    console.log("id form");
    console.log(id_form);

    return (
        <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0 w-full font-sans text-black">
            <ToastContainer />
            <style dangerouslySetInnerHTML={{__html: `
            @media print {
            @page { size: A4 portrait; margin: 5mm !important; }
            body, html { margin: 0 !important; padding: 0 !important; background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .kertas-a4 {
                width: 1050px !important;
                max-width: 1050px !important;
                zoom: 0.75!important; 
                padding: 0 !important;
                margin: 0 auto !important;
                box-shadow: none !important;
                border: none !important;
                page-break-inside: avoid;
            }
            .print\\:hidden { display: none !important; }
            }
            `}} />
            {/* --- TOMBOL ATAS --- */}
            <div className="flex justify-center print:hidden">
                <a
                    href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none"
                >
                    Kembali
                </a>
            </div>
            <div
                ref={c_print_ref}
                className="kertas-a4 mx-auto bg-white shadow-2xl overflow-hidden w-full md:w-full print:w-full print:max-w-full p-4 md:p-10 print:shadow-none print:p-0 text-black"
            >
                <div className="grid grid-cols-2 text-xs md:text-sm sm:text-xs">
                    <HeaderLogo />
                    <div className="mt-3 mr-3 pl-1 pt-1 border-solid border-2 grid grid-cols-3">
                        <div className="flex col-span-3 mb-1 font-bold">
                            IDENTITAS BAYI
                        </div>
                        <div>Nama Pasien</div>
                        <div className="flex col-span-2 h-7">
                            <div>:</div>
                            {isPrinting == false && (
                                <input
                                    className="w-full text-xs md:text-sm sm:text-xs p-0"
                                    type="text"
                                    name="nama_pasien"
                                    value={identitas_bayi.nama_pasien}
                                    onChange={oc_identitas_bayi}
                                />
                            )}
                            {isPrinting && (
                                <div>{identitas_bayi.nama_pasien}</div>
                            )}
                        </div>
                        <div>Tanggal Lahir</div>
                        <div className="flex col-span-2 h-7">
                            <div>:</div>
                            {isPrinting == false && (
                                <input
                                    className="w-full text-xs md:text-sm sm:text-xs pt-0 pb-0"
                                    type="date"
                                    name="tgl_lahir"
                                    value={identitas_bayi.tgl_lahir}
                                    onChange={oc_identitas_bayi}
                                />
                            )}
                            {isPrinting && (
                                <div>{identitas_bayi.tgl_lahir}</div>
                            )}
                        </div>
                        <div className="mb-5">Jam Lahir</div>
                        <div className="flex col-span-2 h-7">
                            <div>:</div>
                            {isPrinting && (
                                <div>{identitas_bayi.jam_lahir}</div>
                            )}
                            {isPrinting == false && (
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                    // onChange={oc_identitas_bayi}
                                >
                                    <MobileTimePicker
                                        onChange={oc_identitas_bayi}
                                        ampm={false}
                                        value={jam_lahir_identitas_bayi}
                                        // renderInput={(params) => <TextField
                                        //     size="small"
                                        //   />
                                        // }
                                        // PopperProps={{
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                // sx: "padding:0"
                                            },
                                        }}
                                    ></MobileTimePicker>
                                </LocalizationProvider>
                            )}
                        </div>
                        <div>Jenis Kelamin</div>
                        <div className="flex col-span-2 h-7 text-sm">
                            <div>:</div>
                            {isPrinting == false && (
                                <select
                                    className="pb-0 pt-0"
                                    onChange={oc_identitas_bayi}
                                    name="jenis_kelamin"
                                >
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            )}
                            {isPrinting && (
                                <div>{identitas_bayi.nama_pasien}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={isPrinting ? "ml-3 mr-3" : "ml-0 mr-0"}>
                    <div className="w-full mt-3 text-xxs md:text-sm sm:text-xs">
                        <div className="mb-2 print:mb-1">
                            <Identitas_Tim
                                isPrinting={isPrinting}
                                onSubmit={os_identitas_tim_ambulance}
                                auth={props.auth}
                                id_form={id_form}
                                initialData={identitas_tim_ambulance}
                            />
                        </div>
                        <div className="">
                            <div className="border-solid border-2 font-bold text-center">
                                ASESMEN BAYI BARU LAHIR (NEONATUS)
                            </div>
                            <div className="mt-2 border-solid border-2 font-bold text-center">
                                I. IDENTITAS ORANGTUA
                            </div>
                            <div className="border-solid border-2 grid grid-cols-2">
                                <div className="grid border-2 ">
                                    <div className="pl-1 font-bold">
                                        IDENTITAS IBU
                                    </div>
                                    <div className="pl-1 flex w-[100%]">
                                        <div className="w-[30%]">Nama Ibu</div>
                                        {isPrinting && (
                                            <div className="w-[70%] flex">
                                                :<div>{identitas_ibu.nama}</div>
                                            </div>
                                        )}
                                        {isPrinting == false && (
                                            <div className="w-[70%] flex">
                                                :
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="nama"
                                                    value={identitas_ibu.nama}
                                                    onChange={oc_identitas_ibu}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Usia</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="usia"
                                                    value={identitas_ibu.usia}
                                                    onChange={oc_identitas_ibu}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>{identitas_ibu.usia}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Pekerjaan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="pekerjaan"
                                                    value={
                                                        identitas_ibu.pekerjaan
                                                    }
                                                    onChange={oc_identitas_ibu}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ibu.pekerjaan}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">
                                            Gol. Darah
                                        </div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    name="goldar"
                                                    className="w-full text-sm p-0"
                                                    value={identitas_ibu.goldar}
                                                    onChange={oc_identitas_ibu}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ibu.goldar}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">
                                            No Telepon
                                        </div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="no_telepon"
                                                    value={
                                                        identitas_ibu.no_telepon
                                                    }
                                                    onChange={oc_identitas_ibu}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ibu.no_telepon}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Alamat</div>
                                        <div className="w-[70%] flex text-sm">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="alamat"
                                                    value={identitas_ibu.alamat}
                                                    onChange={oc_identitas_ibu}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ibu.alamat}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Kecamatan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <select
                                                    className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                                                    name="kecamatan"
                                                    onChange={oc_identitas_ibu}
                                                    value={
                                                        identitas_ibu.kecamatan
                                                            ? cari_nama_kecamatan(
                                                                  identitas_ibu.kecamatan,
                                                              )
                                                            : "-"
                                                    }
                                                >
                                                    <option value="-">
                                                        kecamatan
                                                    </option>
                                                    {semua_kecamatan.map(
                                                        (opts, i) => (
                                                            <option
                                                                key={i}
                                                                id={
                                                                    opts.kode_kecamatan
                                                                }
                                                                value={
                                                                    opts.nama_kecamatan
                                                                }
                                                            >
                                                                {
                                                                    opts.nama_kecamatan
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {cari_nama_kecamatan(
                                                        identitas_ibu.kecamatan,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Kelurahan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <select
                                                    className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                                                    name="kelurahan"
                                                    onChange={oc_identitas_ibu}
                                                    value={
                                                        identitas_ibu.kelurahan
                                                            ? cari_nama_kelurahan(
                                                                  identitas_ibu.kelurahan,
                                                              )
                                                            : "-"
                                                    }
                                                >
                                                    <option value="-">
                                                        Kelurahan
                                                    </option>
                                                    {semua_kelurahan.map(
                                                        (opts, i) => (
                                                            <option
                                                                key={i}
                                                                id={
                                                                    opts.kode_kelurahan
                                                                }
                                                                value={
                                                                    opts.nama_kelurahan
                                                                }
                                                            >
                                                                {
                                                                    opts.nama_kelurahan
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {cari_nama_kelurahan(
                                                        identitas_ibu.kelurahan,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid border-2">
                                    <div className="pl-1 font-bold ">
                                        IDENTITAS AYAH
                                    </div>
                                    <div className="pl-1 flex w-[100%]">
                                        <div className="w-[30%]">Nama Ayah</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="nama"
                                                    value={identitas_ayah.nama}
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>{identitas_ayah.nama}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Usia</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="usia"
                                                    value={identitas_ayah.usia}
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>{identitas_ayah.usia}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Pekerjaan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="pekerjaan"
                                                    value={
                                                        identitas_ayah.pekerjaan
                                                    }
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ayah.pekerjaan}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">
                                            Gol. Darah
                                        </div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    name="goldar"
                                                    className="w-full text-sm p-0"
                                                    value={
                                                        identitas_ayah.goldar
                                                    }
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ayah.goldar}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">
                                            No Telepon
                                        </div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="no_telepon"
                                                    value={
                                                        identitas_ayah.no_telepon
                                                    }
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ayah.no_telepon}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Alamat</div>
                                        <div className="w-[70%] flex text-sm">
                                            :
                                            {isPrinting == false && (
                                                <input
                                                    type="text"
                                                    className="w-full text-sm p-0"
                                                    name="alamat"
                                                    value={
                                                        identitas_ayah.alamat
                                                    }
                                                    onChange={oc_identitas_ayah}
                                                />
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {identitas_ayah.alamat}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Kecamatan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <select
                                                    className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                                                    name="kecamatan"
                                                    onChange={oc_identitas_ayah}
                                                    value={
                                                        identitas_ayah.kecamatan
                                                            ? cari_nama_kecamatan(
                                                                  identitas_ayah.kecamatan,
                                                              )
                                                            : "-"
                                                    }
                                                >
                                                    <option value="-">
                                                        kecamatan
                                                    </option>
                                                    {semua_kecamatan.map(
                                                        (opts, i) => (
                                                            <option
                                                                key={i}
                                                                id={
                                                                    opts.kode_kecamatan
                                                                }
                                                                value={
                                                                    opts.nama_kecamatan
                                                                }
                                                            >
                                                                {
                                                                    opts.nama_kecamatan
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {cari_nama_kecamatan(
                                                        identitas_ayah.kecamatan,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pl-1 flex">
                                        <div className="w-[30%]">Kelurahan</div>
                                        <div className="w-[70%] flex">
                                            :
                                            {isPrinting == false && (
                                                <select
                                                    className="w-full h-8 text-xs md:text-sm sm:text-xs pt-0 pb-0"
                                                    name="kelurahan"
                                                    onChange={oc_identitas_ayah}
                                                    value={
                                                        identitas_ayah.kelurahan
                                                            ? cari_nama_kelurahan(
                                                                  identitas_ayah.kelurahan,
                                                              )
                                                            : "-"
                                                    }
                                                >
                                                    <option value="-">
                                                        Kelurahan
                                                    </option>
                                                    {semua_kelurahan.map(
                                                        (opts, i) => (
                                                            <option
                                                                key={i}
                                                                id={
                                                                    opts.kode_kelurahan
                                                                }
                                                                value={
                                                                    opts.nama_kelurahan
                                                                }
                                                            >
                                                                {
                                                                    opts.nama_kelurahan
                                                                }
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {cari_nama_kelurahan(
                                                        identitas_ayah.kelurahan,
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 border-2">
                        <div className="text-sm">
                            <div className="font-bold flex justify-center border-2">
                                II. RIWAYAT KEHAMILAN DAN PERSALINAN
                            </div>
                            <div className="border-2">
                                <div className="font-bold mt-3">
                                    RIWAYAT KEHAMILAN
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">Usia Gestasi</div>
                                    <div className="flex w-[60%]">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="usia_gestasi"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.usia_gestasi
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.usia_gestasi
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">
                                        ANC (Antenatal Care)
                                    </div>
                                    <div className="flex w-[60%]">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="anc"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.anc
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.anc
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">
                                        Riw. Penyakit Kehamilan
                                    </div>
                                    <div className="flex w-[60%]">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="riwayat_penyakit_kehamilan"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.riwayat_penyakit_kehamilan
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.riwayat_penyakit_kehamilan
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="font-bold mt-3">
                                    RIWAYAT PERSALINAN
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">
                                        Penolong Persalinan
                                    </div>
                                    <div className="flex w-[60%]">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="penolong_persalinan"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.penolong_persalinan
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.penolong_persalinan
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">
                                        Cara Persalinan
                                    </div>
                                    <div className="flex w-[60%]">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="cara_persalinan"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.cara_persalinan
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.cara_persalinan
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-[40%]">
                                        APGAR Score
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="apgar_score_status"
                                            onChange={cbx_apgar_score}
                                            checked={
                                                riwayat_kehamilan_dan_persalinan.apgar_score_status ==
                                                "ya"
                                                    ? true
                                                    : false
                                            }
                                        />
                                    </div>
                                    <div className="flex w-[60%] h-full">
                                        :
                                        {isPrinting == false && (
                                            <input
                                                type="text"
                                                className="w-full text-sm p-0"
                                                name="apgar_score"
                                                value={
                                                    riwayat_kehamilan_dan_persalinan.apgar_score
                                                }
                                                onChange={
                                                    oc_riwayat_kehamilan_dan_persalinan
                                                }
                                            ></input>
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {
                                                    riwayat_kehamilan_dan_persalinan.apgar_score
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-full">
                            <div className="flex justify-center border-2 font-bold text-sm">
                                III. KRONOLOGI
                            </div>
                            <div>Anamnesis :</div>
                            <div>
                                {isPrinting == false && (
                                        <textarea
                                            className="w-full h-[181px] print:min-h-[250px]"
                                            onChange={(e) =>
                                                set_kronologi_anamnesis(
                                                    e.target.value,
                                                )
                                            }
                                            value={kronologi_anamnesis}
                                        ></textarea>
                                    )}
                                {isPrinting && <div className="print:min-h-[250px]">{kronologi_anamnesis}</div>}
                           </div>
                        </div>
                    </div>
                    <div className="flex justify-center font-bold text-sm mt-3 border-2">
                        IV. PEMERIKSAAN FISIK
                    </div>
                    <div className="grid grid-cols-3 text-sm border-2">
                        <div className="border-2">
                            <div className="flex">
                                <div className="w-[50%]">Tekanan Darah</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="tekanan_darah"
                                            value={
                                                pemeriksaan_fisik.tekanan_darah
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.tekanan_darah}
                                        </div>
                                    )}
                                    mm/Hg
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Nadi</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="nadi"
                                            value={pemeriksaan_fisik.nadi}
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.nadi}</div>
                                    )}
                                    x/mnt
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Pernafasan</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="pernafasan"
                                            value={pemeriksaan_fisik.pernafasan}
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.pernafasan}
                                        </div>
                                    )}
                                    x/mnt
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Suhu</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="suhu"
                                            value={pemeriksaan_fisik.suhu}
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.suhu}</div>
                                    )}
                                    <span>&#8451;</span>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Saturasi Oksigen</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="saturasi_oksigen"
                                            value={
                                                pemeriksaan_fisik.saturasi_oksigen
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.saturasi_oksigen}
                                        </div>
                                    )}
                                    %
                                </div>
                            </div>
                            <div className="flex mt-3">
                                <div className="w-[50%]">Berat Badan Lahir</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="berat_badan_lahir"
                                            value={
                                                pemeriksaan_fisik.berat_badan_lahir
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {
                                                pemeriksaan_fisik.berat_badan_lahir
                                            }
                                        </div>
                                    )}
                                    gr
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Panjang Badan</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="panjang_badan"
                                            value={
                                                pemeriksaan_fisik.panjang_badan
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.panjang_badan}
                                        </div>
                                    )}
                                    cm
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Lingkar Kepala</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="lingkar_kepala"
                                            value={
                                                pemeriksaan_fisik.lingkar_kepala
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.lingkar_kepala}
                                        </div>
                                    )}
                                    cm
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Lingkar Dada</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="lingkar_dada"
                                            value={
                                                pemeriksaan_fisik.lingkar_dada
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.lingkar_dada}
                                        </div>
                                    )}
                                    cm
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[50%]">Lingkar Perut</div>
                                <div className="flex w-[50%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="p-0 w-full"
                                            name="lingkar_perut"
                                            value={
                                                pemeriksaan_fisik.lingkar_perut
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.lingkar_perut}
                                        </div>
                                    )}
                                    cm
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex">
                                <div className="w-[20%]">Keadaan Umum</div>
                                <div className="flex w-[80%]">
                                    :
                                    {isPrinting == false && (
                                        <input
                                            type="text"
                                            className="w-full p-0"
                                            name="keadaan_umum"
                                            value={
                                                pemeriksaan_fisik.keadaan_umum
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        ></input>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.keadaan_umum}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Warna Kulit</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="normal"
                                            name="warna_kulit"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.warna_kulit &&
                                                pemeriksaan_fisik.warna_kulit.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="pucat"
                                            name="warna_kulit"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.warna_kulit &&
                                                pemeriksaan_fisik.warna_kulit.includes(
                                                    "pucat",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Pucat
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="sianosis"
                                            name="warna_kulit"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.warna_kulit &&
                                                pemeriksaan_fisik.warna_kulit.includes(
                                                    "sianosis",
                                                )
                                            }
                                        />
                                        <label className="pl-2 inline-block hover:cursor-pointer">
                                            Sianosis
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Kepala</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="normal"
                                            name="kepala"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.kepala &&
                                                pemeriksaan_fisik.kepala.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="abnormal"
                                            name="kepala"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.kepala &&
                                                pemeriksaan_fisik.kepala.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    <div>
                                        {isPrinting == false && (
                                            <input
                                                className="p-0"
                                                type="text"
                                                name="ket_kepala"
                                                value={
                                                    pemeriksaan_fisik.ket_kepala
                                                }
                                                onChange={oc_pemeriksaan_fisik}
                                            />
                                        )}
                                        {isPrinting && (
                                            <div>
                                                {pemeriksaan_fisik.ket_kepala}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Mata</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="normal"
                                            name="mata"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.mata &&
                                                pemeriksaan_fisik.mata.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            value="abnormal"
                                            name="mata"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.mata &&
                                                pemeriksaan_fisik.mata.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_mata"
                                            value={pemeriksaan_fisik.ket_mata}
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.ket_mata}</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Leher</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="leher"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.leher &&
                                                pemeriksaan_fisik.leher.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="leher"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.leher &&
                                                pemeriksaan_fisik.leher.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_leher"
                                            value={pemeriksaan_fisik.ket_lahir}
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.ket_lahir}</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Jantung</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="jantung"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.jantung &&
                                                pemeriksaan_fisik.jantung.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="jantung"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.jantung &&
                                                pemeriksaan_fisik.jantung.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_jantung"
                                            value={
                                                pemeriksaan_fisik.ket_jantung
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.ket_jantung}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Paru</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="paru"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.paru &&
                                                pemeriksaan_fisik.paru.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="paru"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.paru &&
                                                pemeriksaan_fisik.paru.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_paru"
                                            value={pemeriksaan_fisik.ket_paru}
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.ket_paru}</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Abdomen</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="abdomen"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.abdomen &&
                                                pemeriksaan_fisik.abdomen.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="abdomen"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.abdomen &&
                                                pemeriksaan_fisik.abdomen.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_abdomen"
                                            value={
                                                pemeriksaan_fisik.ket_abdomen
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.ket_abdomen}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Ekstremitas</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="ekstremitas"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.ekstremitas &&
                                                pemeriksaan_fisik.ekstremitas.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="ekstremitas"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.ekstremitas &&
                                                pemeriksaan_fisik.ekstremitas.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_ekstremitas"
                                            value={
                                                pemeriksaan_fisik.ket_ekstremitas
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.ket_ekstremitas}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Genitalia</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        Jenis Kelamin:
                                        <select
                                            className="pt-0 pb-0 pr-1 pl-1"
                                            name="jenis_kelamin"
                                            id="jenis_kelamin"
                                            onChange={(event) =>
                                                set_pemeriksaan_fisik(
                                                    (prevState) => ({
                                                        ...prevState,
                                                        genitalia_jenis_kelamin:
                                                            event.target.value,
                                                    }),
                                                )
                                            }
                                            value={
                                                pemeriksaan_fisik.genitalia_jenis_kelamin
                                                    ? pemeriksaan_fisik.genitalia_jenis_kelamin
                                                    : "Laki-laki"
                                            }
                                        >
                                            <option value="Laki-laki">
                                                Laki-laki
                                            </option>
                                            <option value="Perempuan">
                                                Perempuan
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="genitalia"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.genitalia &&
                                                pemeriksaan_fisik.genitalia.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="genitalia"
                                            value="miksi"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.genitalia &&
                                                pemeriksaan_fisik.genitalia.includes(
                                                    "miksi",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Miksi
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="genitalia"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.genitalia &&
                                                pemeriksaan_fisik.genitalia.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            type="text"
                                            name="ket_genitalia"
                                            value={
                                                pemeriksaan_fisik.ket_genitalia
                                            }
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {pemeriksaan_fisik.ket_genitalia}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex">
                                <div className="w-[20%]">Anus</div>
                                <div className="flex w-[80%]">
                                    :
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="anus"
                                            value="normal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.anus &&
                                                pemeriksaan_fisik.anus.includes(
                                                    "normal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Normal
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="anus"
                                            value="mekonium"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.anus &&
                                                pemeriksaan_fisik.anus.includes(
                                                    "mekonium",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Mekonium
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent-[0px_0px_0px_13px_rgba(255,255,255,0.4)]-[0px_0px_0px_13px_#3b71ca]"
                                            type="checkbox"
                                            name="anus"
                                            value="abnormal"
                                            onChange={cbx_pemeriksaan_fisik}
                                            checked={
                                                pemeriksaan_fisik.anus &&
                                                pemeriksaan_fisik.anus.includes(
                                                    "abnormal",
                                                )
                                            }
                                        />
                                        <label className="pr-2 pl-2 inline-block hover:cursor-pointer">
                                            Abnormal
                                        </label>
                                    </div>
                                    {isPrinting == false && (
                                        <input
                                            className="p-0"
                                            name="ket_anus"
                                            type="text"
                                            value={pemeriksaan_fisik.ket_anus}
                                            onChange={oc_pemeriksaan_fisik}
                                        />
                                    )}
                                    {isPrinting && (
                                        <div>{pemeriksaan_fisik.ket_anus}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center font-bold text-sm mt-3 border-2">
                        V. PEMERIKSAAN PENUNJANG
                    </div>
                    <div>
                        {isPrinting == false && (
                            <textarea
                                className="w-[100%]"
                                onChange={(event) =>
                                    set_pemeriksaan_penunjang(
                                        event.target.value,
                                    )
                                }
                                value={pemeriksaan_penunjang}
                            ></textarea>
                        )}
                        {isPrinting && <div>{pemeriksaan_penunjang}</div>}
                    </div>

                    <div className="flex font-bold text-sm mt-3 border-2">
                        <div className="w-[30%]">
                            <div className="border-2">VI. DIAGNOSIS MEDIS</div>
                            {isPrinting == false && (
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={oc_tambah_diagnosis_medis}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            )}
                            {isPrinting == false &&
                                diagnosis_medis.map((data, i) => {
                                    return (
                                        <div key={i} className="flex">
                                            <div className="mr-1">{i + 1}.</div>
                                            <input
                                                className="w-full text-xs md:text-sm sm:text-xs p-0"
                                                type="text"
                                                name="diagnosis_medis"
                                                list="dl_icd_10"
                                                value={diagnosis_medis[i]}
                                                onChange={(e) =>
                                                    oc_value_diagnosis_medis(
                                                        e,
                                                        i,
                                                    )
                                                }
                                            />
                                            <datalist id="dl_icd_10">
                                                {get_data_icd_10.map(
                                                    (opts, i) => (
                                                        <option
                                                            key={i}
                                                            id={opts.id}
                                                            value={
                                                                opts.diagnosis
                                                            }
                                                        >
                                                            {opts.kode_icd}
                                                        </option>
                                                    ),
                                                )}
                                            </datalist>
                                            <button
                                                className="w-1/6 text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                                                type="button"
                                                onClick={() =>
                                                    oc_hapus_diagnosis_medis(i)
                                                }
                                            >
                                                x
                                            </button>
                                        </div>
                                    );
                                })}
                            {isPrinting &&
                                diagnosis_medis.map((data, i) => {
                                    return (
                                        <div key={i} className="flex">
                                            <div className="mr-1">{i + 1}.</div>
                                            <div>{diagnosis_medis[i]}</div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="w-[40%]">
                            <div className="border-2">
                                VII. TERAPI / TINDAKAN / KONSUL :
                            </div>
                            {isPrinting == false && (
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={
                                            oc_tambah_terapi_tindakan_konsul
                                        }
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            )}
                            {isPrinting == false &&
                                terapi_tindakan_konsul.map((data, i) => {
                                    return (
                                        <div key={i} className="flex">
                                            <div className="mr-1">{i + 1}.</div>
                                            <input
                                                className="w-5/6 text-xs md:text-sm sm:text-xs p-0"
                                                type="text"
                                                value={
                                                    terapi_tindakan_konsul[i]
                                                }
                                                onChange={(e) =>
                                                    oc_value_terapi_tindakan_konsul(
                                                        e,
                                                        i,
                                                    )
                                                }
                                                list="dl_icd_9"
                                            ></input>
                                            <datalist id="dl_icd_9">
                                                {get_data_icd_9.map(
                                                    (opts, i) => (
                                                        <option
                                                            key={i}
                                                            id={opts.id}
                                                            value={
                                                                opts.diagnosa
                                                            }
                                                        >
                                                            {opts.kode}
                                                        </option>
                                                    ),
                                                )}
                                            </datalist>
                                            <button
                                                className="w-1/6 text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded"
                                                type="button"
                                                onClick={() =>
                                                    oc_hapus_terapi_tindakan_konsul(
                                                        i,
                                                    )
                                                }
                                            >
                                                x
                                            </button>
                                        </div>
                                    );
                                })}
                            {isPrinting &&
                                terapi_tindakan_konsul.map((data, i) => {
                                    return (
                                        <div key={i} className="flex">
                                            <div className="mr-1">{i + 1}.</div>
                                            <div>
                                                {terapi_tindakan_konsul[i]}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="w-[30%] border-2">
                            <div>Lain-lain:</div>
                            {isPrinting == false && (
                                <textarea
                                    className="w-full"
                                    onChange={(event) =>
                                        set_lain_lain(event.target.value)
                                    }
                                    value={lain_lain}
                                ></textarea>
                            )}
                            {isPrinting && <div>{lain_lain}</div>}
                        </div>
                    </div>
                    <div className="flex mt-3 border-2 text-sm">
                        <div className="w-full border-2">
                            {pilih_rumah_sakit_rujukan == "true" && (
                                <div>
                                    <div className="font-bold flex justify-center">
                                        RUMAH SAKIT RUJUKAN
                                    </div>
                                    <div className="flex">
                                        <div className="w-[40%]">
                                            RS / Puskesmas
                                        </div>
                                        <div className="w-[60%]">
                                            {isPrinting == false && (
                                                <>
                                                    <input
                                                        className="w-full p-0"
                                                        type="text"
                                                        name="faskes"
                                                        list="rs_rujukan_neonatal_list"
                                                        placeholder="Pilih/ketik RS atau Puskesmas..."
                                                        onChange={
                                                            oc_rumah_sakit_rujukan
                                                        }
                                                        value={
                                                            rumah_sakit_rujukan.faskes
                                                        }
                                                    ></input>
                                                    <datalist id="rs_rujukan_neonatal_list">
                                                        {daftarRS.map((opts, i) => (
                                                            <option key={i} value={opts.nama} />
                                                        ))}
                                                    </datalist>
                                                </>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {rumah_sakit_rujukan.faskes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[40%]">Tanggal</div>
                                        <div className="w-[60%]">
                                            {isPrinting == false && (
                                                <input
                                                    className="w-full p-0"
                                                    type="date"
                                                    name="tgl"
                                                    onChange={
                                                        oc_rumah_sakit_rujukan
                                                    }
                                                    value={
                                                        rumah_sakit_rujukan.tgl
                                                    }
                                                ></input>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {rumah_sakit_rujukan.tgl}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[40%]">Jam</div>
                                        <div className="w-[60%]">
                                            {isPrinting == false && (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                >
                                                    <MobileTimePicker
                                                        name="jam"
                                                        value={
                                                            rumah_sakit_rujukan.tp_jam
                                                        }
                                                        onChange={
                                                            oc_rumah_sakit_rujukan
                                                        }
                                                        ampm={false}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                            },
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {rumah_sakit_rujukan.jam}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[40%]">
                                            Alasan Rujuk
                                        </div>
                                        <div className="w-[60%]">
                                            {isPrinting == false && (
                                                <input
                                                    className="w-full p-0"
                                                    type="text"
                                                    name="alasan_rujuk"
                                                    onChange={
                                                        oc_rumah_sakit_rujukan
                                                    }
                                                    value={
                                                        rumah_sakit_rujukan.alasan_rujuk
                                                    }
                                                ></input>
                                            )}
                                            {isPrinting && (
                                                <div>
                                                    {
                                                        rumah_sakit_rujukan.alasan_rujuk
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full border-2">
                            <div className="relative border-solid border-2">
                                <div className="flex justify-center">
                                    Petugas Ambulance Hebat
                                </div>
                                <div className="relative">
                                    {isPrinting === false && (
                                        <button type="button" onClick={oc_hapus_ttd_petugas_ambulance} className="absolute top-0 right-0 text-red-500 font-bold px-2 py-1 text-lg z-10" title="Hapus Tanda Tangan">X</button>
                                    )}
                                    <SignatureCanvas
                                        canvasProps={{
                                            className:
                                                "sigCanvas w-full h-full",
                                        }}
                                        ref={ref_ttd_petugas_ambulance}
                                        onEnd={oe_ttd_petugas_ambulance}
                                    />
                                </div>
                                <div>
                                    {isPrinting == false && (
                                        <input
                                            className="text-xs md:text-sm sm:text-xs w-full"
                                            type="text"
                                            onChange={(e) =>
                                                set_nama_ttd_petugas_ambulance_hebat(
                                                    e.target.value,
                                                )
                                            }
                                            value={
                                                nama_ttd_petugas_ambulance_hebat
                                            }
                                        />
                                    )}
                                    {isPrinting && (
                                        <div className="flex justify-center">
                                            {nama_ttd_petugas_ambulance_hebat}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-2">
                            <div className="relative h-full border-solid border-2 flex flex-col">
                                <div className="flex justify-center">
                                    {isPrinting === false && (
                                        <select
                                            id="keluarga_pasien_petugas_rs"
                                            className="w-full text-xxs md:text-sm sm:text-xs p-0"
                                            onChange={(e) =>
                                                set_status_ttd_petugas_rs_keluarga_pasien(
                                                    e.target.value,
                                                )
                                            }
                                            value={
                                                status_ttd_petugas_rs_keluarga_pasien
                                            }
                                        >
                                            <option value="Petugas RS">
                                                Petugas RS
                                            </option>
                                            <option value="Keluarga Pasien">
                                                Keluarga Pasien
                                            </option>
                                        </select>
                                    )}
                                    {isPrinting && (
                                        <div>
                                            {status_ttd_petugas_rs_keluarga_pasien
                                                ? status_ttd_petugas_rs_keluarga_pasien
                                                : "Petugas RS"}
                                        </div>
                                    )}
                                </div>

                               <div className="relative">
                                    {isPrinting === false && (
                                        <button type="button" onClick={oc_hapus_ttd_petugas_rs_keluarga_pasien} className="absolute top-0 right-0 text-red-500 font-bold px-2 py-1 text-lg z-10" title="Hapus Tanda Tangan">X</button>
                                    )}
                                    <SignatureCanvas
                                        canvasProps={{
                                            className:
                                                "sigCanvas w-full h-full",
                                        }}
                                        ref={ref_ttd_petugas_rs_keluarga_pasien}
                                        onEnd={
                                            oe_ttd_petugas_rs_keluarga_pasien
                                        }
                                    />
                                </div>

                                {isPrinting === false && (
                                    <div className="mt-auto">
                                        <input
                                            className="text-xs md:text-sm sm:text-xs w-full"
                                            type="text"
                                            name="keluarga_pasien_petugas_rs"
                                            onChange={(e) =>
                                                set_nama_ttd_petugas_rs_keluarga_pasien(
                                                    e.target.value,
                                                )
                                            }
                                            value={
                                                nama_ttd_petugas_rs_keluarga_pasien
                                            }
                                        />
                                    </div>
                                )}

                                {isPrinting && (
                                    <div className="flex justify-center">
                                        {nama_ttd_petugas_rs_keluarga_pasien}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full border-2">
                            <div className="flex justify-center">PSC 119</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
                <div>
                    <select
                        id="pilih_rumah_sakit_rujukan"
                        onChange={(e) =>
                            set_pilih_rumah_sakit_rujukan(e.target.value)
                        }
                        value={pilih_rumah_sakit_rujukan}
                    >
                        <option value="true">Rujukan</option>
                        <option value="false">Tidak Rujukan</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs print:hidden">
                <div></div>
                <button
                    type="button"
                    onClick={oc_simpan}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                >
                    {id_form ? "Perbarui" : "Simpan"}
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
    );
}