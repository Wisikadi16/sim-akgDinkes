import React , {useState, useEffect, useRef} from "react";
import axios from 'axios';
import {router} from "@inertiajs/react";
import { Head, Link, useForm } from '@inertiajs/react';

import HeaderForm from "@/Components/Headers/HeaderForm";
import Identitas_Tim from "@/Components/Form/Identitas_Tim";
import Tanda_Vital from "@/Components/Form/Tanda_Vital";

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import {useReactToPrint} from 'react-to-print';

import SignatureCanvas from 'react-signature-canvas';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form_Umum({auth, id}) {
    const [id_form, set_id_form] = useState(null);
    // console.log("form"+id)
    // console.log(props)
    const [get_identitas_pasien, set_identitas_pasien] = useState({
        id:'',
        nik:'',
        nama_pasien : '',
        tgl_lahir : '',
        umur:'',
        alamat:'',
        alamat_kelurahan:'',
        alamat_kecamatan:'',
        tgl_penanganan:'',
    });

    const [get_data_icd_10, set_data_icd_10] = useState([]);
    const [get_data_icd_9, set_data_icd_9] = useState([]);
    const [rs_rujukan, set_rs_rujukan] = useState([]);

    const os_identitas_pasien = (data) => {
        useEffect(() =>{
            // set_data(data)
            set_identitas_pasien(data);
        });
        // console.log("identitas_pasien:")
        // console.log(data)
    }
    
    const [get_data_identitas_tim_ambulance, set_data_identitas_tim_ambulance] = useState({
        id: '',
        tim : '',
        dokter : '',
        perawat:'',
        bidan:'',
        driver:'',
    });

    const os_identitas_tim_ambulance = (data) => {
        useEffect(() =>{
            set_data_identitas_tim_ambulance(data)
        });
    }
    // var dt=false;

    useEffect(() => {
        axios.post(window.location.origin+'/ref_icd_10').then(function (response){
            set_data_icd_10(response.data)
        })

        axios.post(window.location.origin+'/ref_icd_9').then(function (response){
            set_data_icd_9(response.data)
        })

        axios.post(window.location.origin+'/ref_faskes',
        {
            jenis:'rumah sakit'
        }).then(function (response){
            set_rs_rujukan(response.data)
        })
    }, [])

    useEffect(() => {
        // var icd_10;
        // axios.post(window.location.origin+'/ref_icd_10').then(function (response){
        //     set_data_icd_10(response.data)
        //     icd_10=response.data
        // })

        // axios.post(window.location.origin+'/ref_icd_9').then(function (response){
        //     set_data_icd_9(response.data)
        // })

        
        // axios.post(window.location.origin+'/ref_faskes',
        // {
        //     jenis:'rumah sakit'
        // }).then(function (response){
        //     set_rs_rujukan(response.data)
        // })

        if(id!=null && get_data_icd_10?.length > 0 && get_data_icd_9?.length > 0 && rs_rujukan?.length > 0){
            axios.post(window.location.origin+'/ref_form_umum',
            {
                id:id,
            }).then(function (response){
                console.log("reponseeee")
                console.log(response)
                set_id_form(response.data.id_form);
                // set_identitas_pasien(prev_data => ({
                //     ...prev_data,
                //     id: response.data.pasien.id,
                // }));
                // console.log(get_identitas_pasien)
                set_data_surv_prim_kondisi_kritis(
                    ...get_data_surv_prim_kondisi_kritis,JSON.parse(response.data.kondisi_kritis))
                set_data_surv_prim_jalan_nafas(
                    ...get_data_surv_prim_jalan_nafas, JSON.parse(response.data.jalan_nafas))
                set_data_surv_prim_pernafasan(
                    ...get_data_surv_prim_pernafasan, JSON.parse(response.data.pernafasan))
                set_data_surv_prim_sirkulasi_nadi(
                    ...get_data_surv_prim_sirkulasi_nadi, JSON.parse(response.data.sirkulasi_nadi))
                set_data_surv_prim_sirkulasi_kulit(
                    ...get_data_surv_prim_sirkulasi_kulit, JSON.parse(response.data.sirkulasi_kulit))
                set_data_surv_prim_disabilitas({
                    ...get_data_surv_prim_disabilitas,
                    ["gcs_e"]: response.data.ds_gcs_e,
                    ["gcs_m"]: response.data.ds_gcs_m,
                    ["gcs_v"]: response.data.ds_gcs_v,
                    ["pupil"]: response.data.ds_pupil,
                    ["reflek_cahaya"]: response.data.ds_reflek_cahaya,
                    ["lateralisasi"]: response.data.ds_lateralisasi,
                });
                set_data_surv_prim_eksposur(
                    ...get_data_surv_prim_eksposur, JSON.parse(response.data.eksposur))
                set_data_surv_prim_kesimpulan_awal(
                    ...get_data_surv_prim_kesimpulan_awal, JSON.parse(response.data.kesimpulan_awal))
                
                // set_data_surv_prim_riwayat_penyakit_dahulu(
                //     ...get_data_surv_prim_riwayat_penyakit_dahulu, JSON.parse(response.data.rk_riwayat_penyakit_dahulu))
                // if (response.data.rk_riwayat_penyakit_dahulu !== null) {
                //     const parsedData = JSON.parse(response.data.rk_riwayat_penyakit_dahulu);
                  
                //     if (Array.isArray(parsedData)) {
                //       set_data_surv_prim_riwayat_penyakit_dahulu(
                //         [
                //           ...get_data_surv_prim_riwayat_penyakit_dahulu,
                //           ...parsedData.filter(
                //             (val) => !ar_riwayat_penyakit_dahulu.some((val2) => val === val2.value)
                //           ),
                //         ]
                //       );
                //     } 
                //     // else {
                //     //   console.error("Invalid data format. Expected an array.");
                //     // }
                //   }
                if (response.data.rk_riwayat_penyakit_dahulu != null && response.data.rk_riwayat_penyakit_dahulu != "null") {
                    set_data_surv_prim_riwayat_penyakit_dahulu(
                        [
                        ...get_data_surv_prim_riwayat_penyakit_dahulu,
                        ...JSON.parse(response.data.rk_riwayat_penyakit_dahulu)
                        ]
                    );
                    const valuesNotInArray = JSON.parse(response.data.rk_riwayat_penyakit_dahulu).filter(
                        (val) => !ar_riwayat_penyakit_dahulu.some((arVal) => val === arVal.value)
                        );
                        if(valuesNotInArray!=null){
                        set_data_surv_prim_riwayat_penyakit_dahulu_lainnya(
                            [
                            ...get_data_surv_prim_riwayat_penyakit_dahulu_lainnya,
                            ...valuesNotInArray
                            ]
                        );
                        // set_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya(true)
                        }
                }
                //   set_data_surv_prim_riwayat_penyakit_dahulu_lainnya
                
                set_data_surv_prim_riwayat_kesehatan({
                    ...get_data_surv_prim_riwayat_kesehatan,
                    ["keluhan_utama"]: response.data.rk_keluhan_utama,
                    ["riwayat_penyakit_sekarang"]:response.data.rk_riwayat_penyakit_sekarang,
                    ["riwayat_penyakit_dahulu"]:JSON.parse(response.data.rk_riwayat_penyakit_dahulu),
                    ["riwayat_penyakit_keluarga"]:response.data.rk_riwayat_penyakit_keluarga,
                    ["riwayat_minum_obat"]:response.data.rk_riwayat_minum_obat,
                })

                set_data_pemeriksaan_fisik_dan_penunjang({
                    ...get_data_pemeriksaan_fisik_dan_penunjang,
                    ["normocephal"]:response.data.pf_normocephal,
                    ["sclera_ikterik_1"]:response.data.pf_sclera_ikterik_1,
                    ["sclera_ikterik_2"]:response.data.pf_sclera_ikterik_2,
                    ["conj_anemis_1"]:response.data.pf_conj_anemis_1,
                    ["conj_anemis_2"]:response.data.pf_conj_anemis_2,
                    ["perbesaran_kelenjar_getah_bening"]:response.data.pf_perbesaran_kelenjar_getah_bening,
                    ["diviasi_trachea"]:response.data.pf_deviasi_trachea,
                    ["suara_dasar_veikuler_1"]:response.data.pf_suara_dasar_veikuler_1,
                    ["suara_dasar_veikuler_2"]:response.data.pf_suara_dasar_veikuler_2,
                    ["rhonki_1"]:response.data.pf_rhonki_1,
                    ["rhonki_2"]:response.data.pf_rhonki_2,
                    ["wheezing_1"]:response.data.pf_wheezing_1,
                    ["wheezing_2"]:response.data.pf_wheezing_2,
                    ["bunyi_jantung_1_2"]:response.data.pf_bunyi_jantung_1_2,
                    ["bunyi_jantung_1_2_status"]:response.data.pf_bunyi_jantung_1_2_status,
                    ["bising_usus"]:response.data.pf_bising_usus,
                    ["bising_usus_status"]:response.data.pf_bising_usus_status,
                    ["nyeri_tekan_abdomen"]:response.data.pf_nyeri_tekan_abdomen,
                    ["nyeri_tekan_abdomen_area"]:response.data.pf_nyeri_tekan_abdomen_area,
                    ["akral_hangat_a_1"]:response.data.pf_akral_hangat_a_1,
                    ["akral_hangat_a_2"]:response.data.pf_akral_hangat_a_2,
                    ["akral_hangat_b_1"]:response.data.pf_akral_hangat_b_1,
                    ["akral_hangat_b_2"]:response.data.pf_akral_hangat_b_2,
                    ["oedema_a_1"]:response.data.pf_oedema_a_1,
                    ["oedema_a_2"]:response.data.pf_oedema_a_2,
                    ["oedema_b_1"]:response.data.pf_oedema_b_1,
                    ["oedema_b_2"]:response.data.pf_oedema_b_2,
                    ["ekg"]:response.data.pf_ekg,
                    ["gds"]:response.data.pf_gds,
                    ["au"]:response.data.pf_au,
                    ["chol"]:response.data.pf_chol,
                    ["hb"]:response.data.pf_hb,
                })

                // set_data_diagnosis_medis(
                //     ...get_data_diagnosis_medis, JSON.parse(response.data.diagnosis_medis)
                // )
                var parse_diagnosis_medis;
                // if(response.data.diagnosis_medis!=null){
                //     consok
                //     var parse_diagnosis_medis=JSON.parse(response.data.diagnosis_medis);
                    
                //     set_kode_diagnosis_medis(
                //         ...kode_diagnosis_medis, parse_diagnosis_medis
                //     )
                // }
                // if(parse_diagnosis_medis!=null){
                //     Object.keys(parse_diagnosis_medis).forEach((item) => {
                //         const s_kode = get_data_icd_10.find((val) => val.kode_icd == parse_diagnosis_medis[item])?.diagnosis;
                        
                //         set_data_diagnosis_medis((prevData) => [...prevData, s_kode].filter(Boolean));
                //     })
                // }

                if (response.data.diagnosis_medis) {
                    const parsedDiagnosisMedis = JSON.parse(response.data.diagnosis_medis);
                
                    console.log("parsed diagnosa")
                    console.log(parsedDiagnosisMedis)
                    // Update kode_diagnosis_medis state
                    set_kode_diagnosis_medis((prevState) => [...prevState, ...parsedDiagnosisMedis]);
                
                    // Update data_diagnosis_medis state
                    const updatedDiagnosisMedis = parsedDiagnosisMedis
                        .map((item) => get_data_icd_10.find((val) => val.kode_icd === item)?.diagnosis)
                        .filter(Boolean);
                
                    set_data_diagnosis_medis((prevData) => [...prevData, ...updatedDiagnosisMedis]);
                }

                set_terapi_tindakan_konsul_dr(
                    ...get_terapi_tindakan_konsul_dr, response.data.terapi_tindakan_konsul_dr
                )

                set_terapi_tindakan_konsul(
                    ...get_terapi_tindakan_konsul, JSON.parse(response.data.terapi_tindakan_konsul)
                )

                set_data_follow_up_tanda_vital({
                    ...get_data_follow_up_tanda_vital,
                    ["td"]:response.data.ftv_td,
                    ["hr"]:response.data.ftv_hr,
                    ["rr"]:response.data.ftv_rr,
                    ["sh"]:response.data.ftv_sh,
                    ["spo2"]:response.data.ftv_spo2,
                    ["skala_nyeri"]:response.data.ftv_skala_nyeri,
                    ["nrm"]:response.data.ftv_nrm,
                    ["gds"]:response.data.ftv_gds,
                    ["pukul"]:response.data.ftv_pukul,
                })

                // set_jam_rs_rujukan(dayjs(response.data.rsr_tgl+"T"+response.data.rsr_jam).toISOString())
                set_data_rumah_sakit_rujukan({
                    ...get_data_rumah_sakit_rujukan,
                    ["rs"]:response.data.rsr_rs,
                    ["tgl"]:response.data.rsr_tgl,
                    ["jam"]:response.data.rsr_jam,
                    ["in_jam"]:dayjs(response.data.rsr_tgl+"T"+response.data.rsr_jam),
                })

                if(response.data.rsr_rs!=null){
                    set_pilih_rumah_sakit_rujukan("true")
                }

                set_data_nama_ttd_petugas_ambulance_hebat(
                    ...get_data_nama_ttd_petugas_ambulance_hebat, response.data.nama_ttd_petugas_ambulance_hebat
                )

                set_ttd_petugas_ambulance(
                    ...get_ttd_petugas_ambulance, response.data.ttd_petugas_ambulance_hebat
                )
                ref_ttd_petugas_ambulance.current.fromDataURL(response.data.ttd_petugas_ambulance_hebat);

                set_data_keluarga_pasien_petugas_rs(
                    ...get_data_keluarga_pasien_petugas_rs, response.data.keluarga_pasien_petugas_rs
                )

                console.log("keluarga pasien petugas rs")
                console.log(get_data_keluarga_pasien_petugas_rs)

                set_data_nama_ttd_keluarga_pasien_petugas_rs(
                    ...get_data_nama_ttd_keluarga_pasien_petugas_rs, response.data.nama_ttd_keluarga_pasien_petugas_rs
                )

                set_ttd_keluarga_pasien_petugas_rs(
                    ...get_ttd_keluarga_pasien_petugas_rs, response.data.ttd_keluarga_pasien_petugas_rs
                )
                ref_ttd_keluarga_pasien_petugas_rs.current.fromDataURL(response.data.ttd_keluarga_pasien_petugas_rs);

            })
        }
        // else{
        //     set_data_keluarga_pasien_petugas_rs(
        //         ...get_data_keluarga_pasien_petugas_rs, "Petugas RS"
        //     )
        // }
        

    }, [get_data_icd_10?.length, get_data_icd_9?.length, rs_rujukan?.length])

    const [get_data_surv_prim_kondisi_kritis, set_data_surv_prim_kondisi_kritis] = useState([]);

    function handleChangeCbx_KondisiKritis(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_kondisi_kritis(get_data_surv_prim_kondisi_kritis => 
                [...get_data_surv_prim_kondisi_kritis, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_kondisi_kritis(get_data_surv_prim_kondisi_kritis => {
                return [...get_data_surv_prim_kondisi_kritis.filter(val => val!== value)]
            });
        }
        // console.log("surv_kondisi_kritis")
        // console.log(get_data_surv_prim_kondisi_kritis);
        
    }
    
    // console.log("kondisi kritis")
    // console.log(get_data_surv_prim_kondisi_kritis)

    const [get_data_surv_prim_jalan_nafas, set_data_surv_prim_jalan_nafas] = useState([]);

    function handleChangeCbx_JalanNafas(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_jalan_nafas(get_data_surv_prim_jalan_nafas => 
                [...get_data_surv_prim_jalan_nafas, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_jalan_nafas(get_data_surv_prim_jalan_nafas => {
                return [...get_data_surv_prim_jalan_nafas.filter(val => val!== value)]
            });
        }
        
    }
    // console.log("jalan_nafas:"+get_data_surv_prim_jalan_nafas)

    const [get_data_surv_prim_pernafasan, set_data_surv_prim_pernafasan] = useState([]);

    function handleChangeCbx_Pernafasan(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_pernafasan(get_data_surv_prim_pernafasan => 
                [...get_data_surv_prim_pernafasan, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_pernafasan(get_data_surv_prim_pernafasan => {
                return [...get_data_surv_prim_pernafasan.filter(val => val!== value)]
            });
        }
        
    }

    // console.log("pernafasan:"+get_data_surv_prim_pernafasan)

    const [get_data_surv_prim_sirkulasi_nadi, set_data_surv_prim_sirkulasi_nadi] = useState([]);

    function oc_sirkulasi_nadi(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_sirkulasi_nadi(get_data_surv_prim_sirkulasi_nadi => 
                [...get_data_surv_prim_sirkulasi_nadi, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_sirkulasi_nadi(get_data_surv_prim_sirkulasi_nadi => {
                return [...get_data_surv_prim_sirkulasi_nadi.filter(val => val!== value)]
            });
        }
    }
    // console.log("sirkulasi nadi"+get_data_surv_prim_sirkulasi_nadi);

    const [get_data_surv_prim_sirkulasi_kulit, set_data_surv_prim_sirkulasi_kulit] = useState([]);

    function oc_sirkulasi_kulit(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_sirkulasi_kulit(get_data_surv_prim_sirkulasi_kulit => 
                [...get_data_surv_prim_sirkulasi_kulit, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_sirkulasi_kulit(get_data_surv_prim_sirkulasi_kulit => {
                return [...get_data_surv_prim_sirkulasi_kulit.filter(val => val!== value)]
            });
        }
        
    }

    // console.log("sirkulasi kulit"+get_data_surv_prim_sirkulasi_kulit);

    const [get_data_tanda_vital, set_data_tanda_vital] = useState({
        td : '',
        hr:'',
        rr:'',
        sh:"",
        spo2:"",
        skala_nyeri:"",
        pukul:"",
    });

    const getData_TandaVital = (data) => {
        // console.log("tanda vital")
        // console.log(data)
        useEffect(() =>{
            set_data_tanda_vital(data)
        });
        
        // console.log("td_form:"+data.td)
    }

    const [get_data_surv_prim_disabilitas, set_data_surv_prim_disabilitas] = useState({
        gcs_e: '',
        gcs_m: '',
        gcs_v: '',
        pupil: '',
        reflek_cahaya: '',
        lateralisasi:'',
    });

    const oc_disabilitas = (e) => {
        // console.log("oc_disabilitas");
        // console.log("nama_target"+e.target.value)
        // console.log("jam"+get_jam);
        const value = e.target.value;
        
        set_data_surv_prim_disabilitas({
            ...get_data_surv_prim_disabilitas,
            [e.target.name]: value,
        });
    }
    
    const oc_data_surv_prim_disabilitas_lateralisasi = (e) => {
        set_data_surv_prim_disabilitas(
            {   ...get_data_surv_prim_disabilitas,
                ["lateralisasi"]: e.target.value,
            });
    }
    
    // console.log("disabilitas");
    // console.log(get_data_surv_prim_disabilitas);

    const [get_data_surv_prim_eksposur, set_data_surv_prim_eksposur] = useState([]);

    function handleChangeCbx_Eksposur(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_eksposur(get_data_surv_prim_eksposur => 
                [...get_data_surv_prim_eksposur, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_eksposur(get_data_surv_prim_eksposur => {
                return [...get_data_surv_prim_eksposur.filter(val => val!== value)]
            });
        }
    }

    // console.log("eksposur");
    // console.log(get_data_surv_prim_eksposur);

    const [get_data_surv_prim_kesimpulan_awal, set_data_surv_prim_kesimpulan_awal] = useState([]);

    function oc_kesimpulan_awal(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        const {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            set_data_surv_prim_kesimpulan_awal(get_data_surv_prim_kesimpulan_awal => 
                [...get_data_surv_prim_kesimpulan_awal, value]
            );
        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            set_data_surv_prim_kesimpulan_awal(get_data_surv_prim_kesimpulan_awal => {
                return [...get_data_surv_prim_kesimpulan_awal.filter(val => val!== value)]
            });
        }
    }

    // console.log("kesimpulan awal");
    // console.log(get_data_surv_prim_kesimpulan_awal);

    const [get_data_surv_prim_riwayat_kesehatan, set_data_surv_prim_riwayat_kesehatan] = useState({
        keluhan_utama: '',
        riwayat_penyakit_sekarang: '',
        riwayat_penyakit_dahulu: '',
        riwayat_penyakit_keluarga: '',
        riwayat_minum_obat: '',
    });

    const oc_riwayat_kesehatan = (e) => {
        // console.log("oc_riwayat_kesehatan");
        // console.log("nama_target"+e.target.value)
        // console.log("jam"+get_jam);
        const value = e.target.value;
        
        set_data_surv_prim_riwayat_kesehatan({
            ...get_data_surv_prim_riwayat_kesehatan,
            [e.target.name]: value,
        });
    }
    
    const [get_data_surv_prim_riwayat_penyakit_dahulu, set_data_surv_prim_riwayat_penyakit_dahulu] = useState([]);
    const ar_riwayat_penyakit_dahulu = [
        {value:'Jantung'},
        {value:'Hipertensi'},
        {value:'DM'},
        {value:'Epilepsi'},
        {value:'Asma'},
        {value:'Kelainan Jiwa'},
        {value:'Lainnya'},
    ] 


    const [get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya, set_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya] = useState(false)
    const [get_data_surv_prim_riwayat_penyakit_dahulu_lainnya, set_data_surv_prim_riwayat_penyakit_dahulu_lainnya] = useState('');
    
    function oc_riwayat_penyakit_dahulu(event){
        // console.log("oc_survei_primer");
        // console.log("apneu"+e.target.value)
        // const {value, checked} = event.target;
        var {value, checked} = event.target;
        if(checked){
            // console.log("cek"+checked);
            // console.log("value"+value);
            // conos
            if(value=="lainnya"){
                // console.log("value lainnya"+get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                set_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya(!get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                // set_data_surv_prim_riwayat_penyakit_dahulu_lainnya(get_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                // console.log("value lainnya v:"+get_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                
            }
            set_data_surv_prim_riwayat_penyakit_dahulu(get_data_surv_prim_riwayat_penyakit_dahulu => 
                [...get_data_surv_prim_riwayat_penyakit_dahulu, value]
            );
            
            set_data_surv_prim_riwayat_kesehatan({
                ...get_data_surv_prim_riwayat_kesehatan,
                // ["lainnya"]: [...get_data_surv_prim_riwayat_penyakit_dahulu, value],
                ["riwayat_penyakit_dahulu"]: [...get_data_surv_prim_riwayat_penyakit_dahulu, value],
            })

        }
        else{
            // console.log("cek false"+checked);
            // console.log("value"+value);
            if(value=="lainnya"){
                // console.log("value lainnya"+get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                set_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya(!get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya);
                // value=get_data_surv_prim_riwayat_penyakit_dahulu_lainnya;
                
            }
            
            set_data_surv_prim_riwayat_penyakit_dahulu(get_data_surv_prim_riwayat_penyakit_dahulu =>
                [...get_data_surv_prim_riwayat_penyakit_dahulu.filter(val => val!== value)]
            );

            set_data_surv_prim_riwayat_kesehatan({
                ...get_data_surv_prim_riwayat_kesehatan,
                ["riwayat_penyakit_dahulu"]: [...get_data_surv_prim_riwayat_kesehatan['riwayat_penyakit_dahulu'].filter(val => val!==value)],
            })
        }
    }

    // console.log("riwayat kesehatan");
    // console.log(get_data_surv_prim_riwayat_kesehatan)
    console.log("riwayat penyakit dahulu")
    console.log(get_data_surv_prim_riwayat_penyakit_dahulu)
    console.log("riwyat dahulu lainnya")
    console.log(get_data_surv_prim_riwayat_penyakit_dahulu_lainnya)

    const oc_riwayat_kesehatan_dahulu_lainnya = (e) => {
        // console.log("oc_riwayat_kesehatan");
        // console.log("nama_target"+e.target.value)
        const value = e.target.value;
        set_data_surv_prim_riwayat_penyakit_dahulu_lainnya(value)

        set_data_surv_prim_riwayat_kesehatan({
            ...get_data_surv_prim_riwayat_kesehatan,
            // ["lainnya"]: [...get_data_surv_prim_riwayat_penyakit_dahulu, value],
            ["riwayat_penyakit_dahulu"]: [...get_data_surv_prim_riwayat_penyakit_dahulu, value],
        })
    }

    const [get_data_pemeriksaan_fisik_dan_penunjang, set_data_pemeriksaan_fisik_dan_penunjang] = useState({
        normocephal: '',
        sclera_ikterik_1:'',
        sclera_ikterik_2: '',
        conj_anemis_1: '',
        conj_anemis_2: '',
        perbesaran_kelenjar_getah_bening: '',
        deviasi_trachea: '',
        suara_dasar_veikuler_1: '',
        suara_dasar_veikuler_2: '',
        rhonki_1: '',
        rhonki_2: '',
        wheezing_1: '',
        wheezing_2: '',
        bunyi_jantung_1_2: '',
        bunyi_jantung_1_2_status: '',
        bising_usus: '',
        bising_usus_status: '',
        nyeri_tekan_abdomen: '',
        nyeri_tekan_abdomen_area: '',
        akral_hangat_a_1: '',
        akral_hangat_a_2: '',
        akral_hangat_b_1: '',
        akral_hangat_b_2: '',
        oedema_a_1: '',
        oedema_a_2: '',
        oedema_b_1: '',
        oedema_b_2: '',
        ekg: '',
        gds: '',
        au: '',
        chol: '',
        hb: '',

        // riwayat_penyakit_sekarang: '',
        // riwayat_penyakit_dahulu: '',
        // riwayat_penyakit_keluarga: '',
        // riwayat_minum_obat: '',
    });

    const oc_pemeriksaan_fisik_dan_penunjang = (e) => {
        // console.log("oc_riwayat_kesehatan");
        // console.log("nama_target"+e.target.value)
        const value = e.target.value;

        set_data_pemeriksaan_fisik_dan_penunjang({
            ...get_data_pemeriksaan_fisik_dan_penunjang,
            [e.target.name]: value,
        })

    }

    const oc_s_pemeriksaan_fisik_dan_penunjang = (e) =>{
        // console.log("select")
        // console.log(e);
        // console.log(e.target.id)
        set_data_pemeriksaan_fisik_dan_penunjang(
            {   ...get_data_pemeriksaan_fisik_dan_penunjang,
                [e.target.id]: e.target.value,
            });
    }

    // console.log("pemeriksaan fisik dan penunjang");
    // console.log(get_data_pemeriksaan_fisik_dan_penunjang);
    const [get_data_diagnosis_medis, set_data_diagnosis_medis] = useState([]);
    const [kode_diagnosis_medis, set_kode_diagnosis_medis] = useState([]);

    const oc_tambah_diagnosis_medis=()=>{
        const c_val = [...get_data_diagnosis_medis, []];
        set_data_diagnosis_medis(c_val);
        const c_kode = [...kode_diagnosis_medis, []];
        set_kode_diagnosis_medis(c_kode);
    }

    const oc_value_diagnosis_medis=(e, i)=>{
        const value = [...get_data_diagnosis_medis];
        value[i]=e.target.value;
        set_data_diagnosis_medis(value);
        const kode = [...kode_diagnosis_medis];
        const s_kode = get_data_icd_10.find((val) => val.diagnosis === value[i])?.kode_icd;
        if (s_kode) {
            kode[i] = s_kode;
            set_kode_diagnosis_medis(kode);
        }
    }

    console.log("kode diagnosis")
    console.log(kode_diagnosis_medis)
    console.log(get_data_diagnosis_medis)
    const oc_hapus_diagnosis_medis=(i)=>{
        const value = [...get_data_diagnosis_medis];
        value.splice(i, 1);
        set_data_diagnosis_medis(value);

        const kode = [...kode_diagnosis_medis];
        kode.splice(i, 1);
        set_kode_diagnosis_medis(kode);
    }

    // console.log("diagnosis medis");
    // console.log(get_data_diagnosis_medis);
    
    const [get_terapi_tindakan_konsul_dr, set_terapi_tindakan_konsul_dr] = useState('');
    // const [get_terapi_tindakan_konsul, set_terapi_tindakan_konsul] = useState('');
    const [get_terapi_tindakan_konsul, set_terapi_tindakan_konsul] = useState([]);

    // const oc_terapi_tindakan_konsul= (e) =>{
    //     console.log("terapi")
    //     console.log(e);
    //     console.log(e.target.value)
    //     set_terapi_tindakan_konsul(e.target.value);
    // }

    const oc_tambah_terapi_tindakan_konsul=()=>{
        const c_val = [...get_terapi_tindakan_konsul, []];
        set_terapi_tindakan_konsul(c_val);
    }

    const oc_value_terapi_tindakan_konsul=(e, i)=>{
        const value = [...get_terapi_tindakan_konsul];
        value[i]=e.target.value;
        set_terapi_tindakan_konsul(value);
    }

    const oc_hapus_terapi_tindakan_konsul=(i)=>{
        const value = [...get_terapi_tindakan_konsul];
        value.splice(i,1);
        set_terapi_tindakan_konsul(value);
    }

    // console.log("terapi tindakan konsul")
    // console.log(get_terapi_tindakan_konsul)

    const [get_data_follow_up_tanda_vital, set_data_follow_up_tanda_vital] = useState({
        td : '',
        hr:'',
        rr:'',
        sh:"",
        spo2:"",
        skala_nyeri:"",
        nrm:"",
        gds:"",
        pukul:"",
    });

    const getData_FollowUpTandaVital = (data) => {
        // console.log("nama_form_follow_up")
        useEffect(() =>{
            set_data_follow_up_tanda_vital(data)
        });
        
        // console.log("td_form:"+data.td)
    }

    // console.log("follow up tanda vital");
    // console.log(get_data_follow_up_tanda_vital);
    
    const [get_jam_rs_rujukan, set_jam_rs_rujukan] = React.useState(dayjs(new Date));
    
    const [get_data_rumah_sakit_rujukan, set_data_rumah_sakit_rujukan] = useState({
        rs : '',
        tgl: new Date('Y-m-d'),
        tgl_baru: '',
        in_jam: dayjs(new Date),
        jam: ((JSON.stringify(get_jam_rs_rujukan.$H)).length==1?"0"+get_jam_rs_rujukan.$H:get_jam_rs_rujukan.$H)+":"
        +((JSON.stringify(get_jam_rs_rujukan.$m)).length==1?"0"+get_jam_rs_rujukan.$m:get_jam_rs_rujukan.$m),
    });

    const oc_data_rumah_sakit_rujukan = (e) => {
        // console.log("oc_riwayat_kesehatan");
        if(e.$H!=null){
            var jam = JSON.stringify(e.$H);
            if(jam.length==1){
            jam = "0"+jam;
            }
            var menit = JSON.stringify(e.$m);
            if(menit.length==1){
            menit = "0"+menit;
            }

            set_data_rumah_sakit_rujukan({
              ...get_data_rumah_sakit_rujukan,
            //   ["c_pukul"]: e,
            //   ["jam"]: e.$H+":"+e.$m,
              ["jam"]: jam+":"+menit,
            });
        }
        else if(e.target.name=="tgl"){
            // const value = e.target.value;
            const tgl_lama = e.target.value;
    
            const [tahun, bulan, hari] = tgl_lama.split('-');
            const tgl_baru = `${hari}/${bulan}/${tahun}`;

            // console.log(tgl_baru);
            set_data_rumah_sakit_rujukan({
                ...get_data_rumah_sakit_rujukan,
                ["tgl"]: tgl_lama,
                ["tgl_baru"]: tgl_baru,
            })
        }
        else{
            // console.log("nama_target"+e.target.value)
            const value = e.target.value;
            set_data_rumah_sakit_rujukan({
                ...get_data_rumah_sakit_rujukan,
                [e.target.name]: value,
            })
        }
    }
    
    // console.log("rumah sakit rujukan")
    // console.log(get_data_rumah_sakit_rujukan)
    // console.log(get_jam_rs_rujukan)
    
    // const [get_data_keluarga_pasien_petugas_rs, set_data_keluarga_pasien_petugas_rs] = useState('')
    const [get_data_keluarga_pasien_petugas_rs, set_data_keluarga_pasien_petugas_rs] = useState("Petugas RS")
    // const [get_data_keluarga_pasien_petugas_rs, set_data_keluarga_pasien_petugas_rs] = useState('')
    
    const [get_data_nama_ttd_petugas_ambulance_hebat, set_data_nama_ttd_petugas_ambulance_hebat] = useState('')
    const [get_data_nama_ttd_keluarga_pasien_petugas_rs, set_data_nama_ttd_keluarga_pasien_petugas_rs] = useState('')

    // console.log("status")
    // console.log(get_data_keluarga_pasien_petugas_rs)
    // console.log("petugas ambulance hebat")
    // console.log(get_data_nama_ttd_petugas_ambulance_hebat)
    // console.log("nama keluarga pasien petugas rs")
    // console.log(get_data_nama_ttd_keluarga_pasien_petugas_rs)
    
    const [get_ttd_petugas_ambulance, set_ttd_petugas_ambulance] = useState('');
    const [get_ttd_keluarga_pasien_petugas_rs, set_ttd_keluarga_pasien_petugas_rs] = useState('');
    
    // const [get_url_ttd_petugas_ambulance, set_url_ttd_petugas_ambulance] = useState();

    let ref_ttd_petugas_ambulance = useRef({})
    
    let ref_ttd_keluarga_pasien_petugas_rs = useRef({})


    // const oc_ttd_petugas_ambulance = () =>{
    //     set_url_ttd_petugas_ambulance(get_ttd_petugas_ambulance.getTrimmedCanvas().toDataURL('image/png'))
    // }
    const oe_ttd_petugas_ambulance = () => {
        set_ttd_petugas_ambulance(ref_ttd_petugas_ambulance.current.toDataURL());
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
    }

    const oe_ttd_keluarga_pasien_petugas_rs = () => {
        set_ttd_keluarga_pasien_petugas_rs(ref_ttd_keluarga_pasien_petugas_rs.current.toDataURL());
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
    }
    
    console.log("oe_ttd2_petugas_ambulance")
    console.log(get_ttd_petugas_ambulance)
    
    console.log("oe_ttd2_keluarga")
    console.log(get_ttd_keluarga_pasien_petugas_rs)
    
    // console.log(get_ttd_petugas_ambulance)

    const oc_hapus_ttd_petugas_ambulance = () =>{
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_ttd_petugas_ambulance)
        // set_url_ttd_petugas_ambulance(get_ttd_petugas_ambulance.getTrimmedCanvas().toDataURL('image/png'))
        // get_ttd_petugas_ambulance.clear();
        ref_ttd_petugas_ambulance.current.clear();
        // set_url_ttd_petugas_ambulance('');
        // ref_ttd_petugas_ambulance.current.fromDataURL(get_url_ttd_petugas_ambulance)
        
    }
    const oc_hapus_ttd_keluarga_pasien_atau_petugas_rs = () =>{
        // get_ttd_keluarga_pasien_petugas_rs.clear();
        ref_ttd_keluarga_pasien_petugas_rs.current.clear();
    }
    
    const oc_simpan = (e) => {
        console.log(e.preventDefault());
        
        if(get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu!=null){
            Object.keys(get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu).forEach((item) => {
                if(get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu[item] == "lainnya") {    
                    get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu = get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu.filter(item => item !== "lainnya") 
                }
            })
        }

        //cek diagnosis
        var cek_diagnosis=true;
        if(get_data_diagnosis_medis!=null){
            Object.keys(get_data_diagnosis_medis).forEach((item) => {
                const s_kode = get_data_icd_10.find((val) => val.diagnosis === get_data_diagnosis_medis[item])?.kode_icd;
                if (s_kode==null) {
                    cek_diagnosis=false
                    toast.error("diagnosis medis tidak sesuai icd 10", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            })
        }

        if(cek_diagnosis){
            if(id!=null){
                axios.post(window.location.origin+'/form_umum_perbarui',
                {
                    id_form:id,
                    nik:get_identitas_pasien.nik,
                    nama_pasien:get_identitas_pasien.nama_pasien,
                    tgl_lahir:get_identitas_pasien.tgl_lahir,
                    alamat:get_identitas_pasien.alamat,
                    alamat_kelurahan:get_identitas_pasien.alamat_kelurahan,
                    alamat_kecamatan:get_identitas_pasien.alamat_kecamatan,
                    no_telepon:get_identitas_pasien.no_telepon,
                    tgl_penanganan:get_identitas_pasien.tgl_penanganan,
                    
                    //identitas tim ambulance
                    ita_id_tim:get_data_identitas_tim_ambulance.id,
                    ita_tim:get_data_identitas_tim_ambulance.tim,
                    ita_dokter:get_data_identitas_tim_ambulance.dokter,
                    ita_perawat:get_data_identitas_tim_ambulance.perawat,
                    ita_bidan:get_data_identitas_tim_ambulance.bidan,
                    ita_driver:get_data_identitas_tim_ambulance.driver,
                    //
                    //survei primer
                    kondisi_kritis:get_data_surv_prim_kondisi_kritis,
                    jalan_nafas:get_data_surv_prim_jalan_nafas,
                    pernafasan:get_data_surv_prim_pernafasan,
                    sirkulasi_nadi:get_data_surv_prim_sirkulasi_nadi,
                    sirkulasi_kulit:get_data_surv_prim_sirkulasi_kulit,
                    
                    //tanda vital
                    tv_td:get_data_tanda_vital.td,
                    tv_hr:get_data_tanda_vital.hr,
                    tv_rr:get_data_tanda_vital.rr,
                    tv_sh:get_data_tanda_vital.sh,
                    tv_spo2:get_data_tanda_vital.spo2,
                    tv_skala_nyeri:get_data_tanda_vital.skala_nyeri,
                    tv_pukul:get_data_tanda_vital.pukul,
        
                    //disabilitas
                    ds_gcs_e:get_data_surv_prim_disabilitas.gcs_e,
                    ds_gcs_m:get_data_surv_prim_disabilitas.gcs_m,
                    ds_gcs_v:get_data_surv_prim_disabilitas.gcs_v,
                    ds_pupil:get_data_surv_prim_disabilitas.pupil,
                    ds_reflek_cahaya:get_data_surv_prim_disabilitas.reflek_cahaya,
                    ds_lateralisasi:get_data_surv_prim_disabilitas.lateralisasi,
        
                    //eksposur
                    eksposur:get_data_surv_prim_eksposur,
        
                    //kesimpulan awal
                    kesimpulan_awal:get_data_surv_prim_kesimpulan_awal,
        
                    //riwayat kesehatan
                    rk_keluhan_utama:get_data_surv_prim_riwayat_kesehatan.keluhan_utama,
                    rk_riwayat_penyakit_sekarang:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_sekarang,
                    rk_riwayat_penyakit_dahulu:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu,
                    rk_riwayat_penyakit_keluarga:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_keluarga,
                    rk_riwayat_minum_obat:get_data_surv_prim_riwayat_kesehatan.riwayat_minum_obat,
        
                    //pemeriksaan fisik dan pemeriksaan penunjang
                    pf_normocephal:get_data_pemeriksaan_fisik_dan_penunjang.normocephal,
                    pf_sclera_ikterik_1:get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_1,
                    pf_sclera_ikterik_2:get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_2,
                    pf_conj_anemis_1:get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_1,
                    pf_conj_anemis_2:get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_2,
                    pf_perbesaran_kelenjar_getah_bening:get_data_pemeriksaan_fisik_dan_penunjang.perbesaran_kelenjar_getah_bening,
                    pf_deviasi_trachea:get_data_pemeriksaan_fisik_dan_penunjang.deviasi_trachea,
                    pf_suara_dasar_veikuler_1:get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_1,
                    pf_suara_dasar_veikuler_2:get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_2,
                    pf_rhonki_1:get_data_pemeriksaan_fisik_dan_penunjang.rhonki_1,
                    pf_rhonki_2:get_data_pemeriksaan_fisik_dan_penunjang.rhonki_2,
                    pf_wheezing_1:get_data_pemeriksaan_fisik_dan_penunjang.wheezing_1,
                    pf_wheezing_2:get_data_pemeriksaan_fisik_dan_penunjang.wheezing_2,
                    pf_bunyi_jantung_1_2:get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2,
                    pf_bunyi_jantung_1_2_status:get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2_status,
                    pf_bising_usus:get_data_pemeriksaan_fisik_dan_penunjang.bising_usus,
                    pf_bising_usus_status:get_data_pemeriksaan_fisik_dan_penunjang.bising_usus_status,
                    pf_nyeri_tekan_abdomen:get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen,
                    pf_nyeri_tekan_abdomen_area:get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen_area,
                    pf_akral_hangat_a_1:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_1,
                    pf_akral_hangat_a_2:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_2,
                    pf_akral_hangat_b_1:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_1,
                    pf_akral_hangat_b_2:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_2,
                    pf_oedema_a_1:get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_1,
                    pf_oedema_a_2:get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_2,
                    pf_oedema_b_1:get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_1,
                    pf_oedema_b_2:get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_2,
                    pf_ekg:get_data_pemeriksaan_fisik_dan_penunjang.ekg,
                    pf_gds:get_data_pemeriksaan_fisik_dan_penunjang.gds,
                    pf_au:get_data_pemeriksaan_fisik_dan_penunjang.au,
                    pf_chol:get_data_pemeriksaan_fisik_dan_penunjang.chol,
                    pf_hb:get_data_pemeriksaan_fisik_dan_penunjang.hb,
                    
                    //diagnosis medis
                    // diagnosis_medis:get_data_diagnosis_medis,
                    diagnosis_medis:kode_diagnosis_medis,
        
                    //terapi tindakan konsul
                    terapi_tindakan_konsul:get_terapi_tindakan_konsul,
                    terapi_tindakan_konsul_dr:get_terapi_tindakan_konsul_dr,
        
                    //follow up tanda vital
                    ftv_td:get_data_follow_up_tanda_vital.td,
                    ftv_hr:get_data_follow_up_tanda_vital.hr,
                    ftv_rr:get_data_follow_up_tanda_vital.rr,
                    ftv_sh:get_data_follow_up_tanda_vital.sh,
                    ftv_spo2:get_data_follow_up_tanda_vital.spo2,
                    ftv_nrm:get_data_follow_up_tanda_vital.nrm,
                    ftv_gds:get_data_follow_up_tanda_vital.gds,
                    ftv_skala_nyeri:get_data_follow_up_tanda_vital.skala_nyeri,
                    ftv_pukul:get_data_follow_up_tanda_vital.pukul,
                    
                    //rumah sakit rujukan
                    rsr_rs:get_data_rumah_sakit_rujukan.rs,
                    rsr_tgl:get_data_rumah_sakit_rujukan.tgl,
                    rsr_jam:get_data_rumah_sakit_rujukan.jam,
        
                    //keluarga pasien petugas rs
                    keluarga_pasien_petugas_rs:get_data_keluarga_pasien_petugas_rs,
        
                    //petugas ambulance hebat
                    nama_ttd_petugas_ambulance_hebat:get_data_nama_ttd_petugas_ambulance_hebat,
                    ttd_petugas_ambulance:get_ttd_petugas_ambulance,

                    //nama keluarga pasien petugas rs
                    nama_ttd_keluarga_pasien_petugas_rs:get_data_nama_ttd_keluarga_pasien_petugas_rs,
                    ttd_keluarga_pasien_petugas_rs:get_ttd_keluarga_pasien_petugas_rs
                

                }).then(function (response){
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                }).catch(function (error) {
                    toast.error("Data gagal disimpan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            }
            else{
                axios.post(window.location.origin+'/form_umum_simpan',
                {
                    //identitas pasien
                    nik:get_identitas_pasien.nik,
                    nama_pasien:get_identitas_pasien.nama_pasien,
                    tgl_lahir:get_identitas_pasien.tgl_lahir,
                    alamat:get_identitas_pasien.alamat,
                    alamat_kelurahan:get_identitas_pasien.alamat_kelurahan,
                    alamat_kecamatan:get_identitas_pasien.alamat_kecamatan,
                    no_telepon:get_identitas_pasien.no_telepon,
                    tgl_penanganan:get_identitas_pasien.tgl_penanganan,
                    //
                    //identitas tim ambulance
                    ita_id_tim:get_data_identitas_tim_ambulance.id,
                    ita_tim:get_data_identitas_tim_ambulance.tim,
                    ita_dokter:get_data_identitas_tim_ambulance.dokter,
                    ita_perawat:get_data_identitas_tim_ambulance.perawat,
                    ita_bidan:get_data_identitas_tim_ambulance.bidan,
                    ita_driver:get_data_identitas_tim_ambulance.driver,
                    //
                    //survei primer
                    kondisi_kritis:get_data_surv_prim_kondisi_kritis,
                    jalan_nafas:get_data_surv_prim_jalan_nafas,
                    pernafasan:get_data_surv_prim_pernafasan,
                    sirkulasi_nadi:get_data_surv_prim_sirkulasi_nadi,
                    sirkulasi_kulit:get_data_surv_prim_sirkulasi_kulit,
                    
                    //tanda vital
                    tv_td:get_data_tanda_vital.td,
                    tv_hr:get_data_tanda_vital.hr,
                    tv_rr:get_data_tanda_vital.rr,
                    tv_sh:get_data_tanda_vital.sh,
                    tv_spo2:get_data_tanda_vital.spo2,
                    tv_skala_nyeri:get_data_tanda_vital.skala_nyeri,
                    tv_pukul:get_data_tanda_vital.pukul,
        
                    //disabilitas
                    ds_gcs_e:get_data_surv_prim_disabilitas.gcs_e,
                    ds_gcs_m:get_data_surv_prim_disabilitas.gcs_m,
                    ds_gcs_v:get_data_surv_prim_disabilitas.gcs_v,
                    ds_pupil:get_data_surv_prim_disabilitas.pupil,
                    ds_reflek_cahaya:get_data_surv_prim_disabilitas.reflek_cahaya,
                    ds_lateralisasi:get_data_surv_prim_disabilitas.lateralisasi,
        
                    //eksposur
                    eksposur:get_data_surv_prim_eksposur,
        
                    //kesimpulan awal
                    kesimpulan_awal:get_data_surv_prim_kesimpulan_awal,
        
                    //riwayat kesehatan
                    rk_keluhan_utama:get_data_surv_prim_riwayat_kesehatan.keluhan_utama,
                    rk_riwayat_penyakit_sekarang:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_sekarang,
                    rk_riwayat_penyakit_dahulu:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_dahulu,
                    rk_riwayat_penyakit_keluarga:get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_keluarga,
                    rk_riwayat_minum_obat:get_data_surv_prim_riwayat_kesehatan.riwayat_minum_obat,
        
                    //pemeriksaan fisik dan pemeriksaan penunjang
                    pf_normocephal:get_data_pemeriksaan_fisik_dan_penunjang.normocephal,
                    pf_sclera_ikterik_1:get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_1,
                    pf_sclera_ikterik_2:get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_2,
                    pf_conj_anemis_1:get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_1,
                    pf_conj_anemis_2:get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_2,
                    pf_perbesaran_kelenjar_getah_bening:get_data_pemeriksaan_fisik_dan_penunjang.perbesaran_kelenjar_getah_bening,
                    pf_deviasi_trachea:get_data_pemeriksaan_fisik_dan_penunjang.deviasi_trachea,
                    pf_suara_dasar_veikuler_1:get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_1,
                    pf_suara_dasar_veikuler_2:get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_2,
                    pf_rhonki_1:get_data_pemeriksaan_fisik_dan_penunjang.rhonki_1,
                    pf_rhonki_2:get_data_pemeriksaan_fisik_dan_penunjang.rhonki_2,
                    pf_wheezing_1:get_data_pemeriksaan_fisik_dan_penunjang.wheezing_1,
                    pf_wheezing_2:get_data_pemeriksaan_fisik_dan_penunjang.wheezing_2,
                    pf_bunyi_jantung_1_2:get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2,
                    pf_bunyi_jantung_1_2_status:get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2_status,
                    pf_bising_usus:get_data_pemeriksaan_fisik_dan_penunjang.bising_usus,
                    pf_bising_usus_status:get_data_pemeriksaan_fisik_dan_penunjang.bising_usus_status,
                    pf_nyeri_tekan_abdomen:get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen,
                    pf_nyeri_tekan_abdomen_area:get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen_area,
                    pf_akral_hangat_a_1:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_1,
                    pf_akral_hangat_a_2:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_2,
                    pf_akral_hangat_b_1:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_1,
                    pf_akral_hangat_b_2:get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_2,
                    pf_oedema_a_1:get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_1,
                    pf_oedema_a_2:get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_2,
                    pf_oedema_b_1:get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_1,
                    pf_oedema_b_2:get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_2,
                    pf_ekg:get_data_pemeriksaan_fisik_dan_penunjang.ekg,
                    pf_gds:get_data_pemeriksaan_fisik_dan_penunjang.gds,
                    pf_au:get_data_pemeriksaan_fisik_dan_penunjang.au,
                    pf_chol:get_data_pemeriksaan_fisik_dan_penunjang.chol,
                    pf_hb:get_data_pemeriksaan_fisik_dan_penunjang.hb,
                    
                    //diagnosis medis
                    // diagnosis_medis:get_data_diagnosis_medis,
                    diagnosis_medis:kode_diagnosis_medis,
        
                    //terapi tindakan konsul
                    terapi_tindakan_konsul:get_terapi_tindakan_konsul,
                    terapi_tindakan_konsul_dr:get_terapi_tindakan_konsul_dr,
        
                    //follow up tanda vital
                    ftv_td:get_data_follow_up_tanda_vital.td,
                    ftv_hr:get_data_follow_up_tanda_vital.hr,
                    ftv_rr:get_data_follow_up_tanda_vital.rr,
                    ftv_sh:get_data_follow_up_tanda_vital.sh,
                    ftv_spo2:get_data_follow_up_tanda_vital.spo2,
                    ftv_nrm:get_data_follow_up_tanda_vital.nrm,
                    ftv_gds:get_data_follow_up_tanda_vital.gds,
                    ftv_skala_nyeri:get_data_follow_up_tanda_vital.skala_nyeri,
                    ftv_pukul:get_data_follow_up_tanda_vital.pukul,
                    
                    //rumah sakit rujukan
                    rsr_rs:get_data_rumah_sakit_rujukan.rs,
                    rsr_tgl:get_data_rumah_sakit_rujukan.tgl,
                    rsr_jam:get_data_rumah_sakit_rujukan.jam,
        
                    //keluarga pasien petugas rs
                    keluarga_pasien_petugas_rs:get_data_keluarga_pasien_petugas_rs,
        
                    //petugas ambulance hebat
                    nama_ttd_petugas_ambulance_hebat:get_data_nama_ttd_petugas_ambulance_hebat,
                    ttd_petugas_ambulance_hebat:get_ttd_petugas_ambulance,

                    //nama keluarga pasien petugas rs
                    nama_ttd_keluarga_pasien_petugas_rs:get_data_nama_ttd_keluarga_pasien_petugas_rs,
                    ttd_keluarga_pasien_petugas_rs:get_ttd_keluarga_pasien_petugas_rs,

                }).then(function (response){
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                }).catch(function (error) {
                    toast.error("Data gagal disimpan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                });
            }    
        }
        
    };
    
    const [pilih_rumah_sakit_rujukan, set_pilih_rumah_sakit_rujukan] = useState(false);

    const [isPrinting, setIsPrinting] = useState(false);

    // const c_print_ref = useRef();
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
            return new Promise((resolve)=>{
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint:()=>setIsPrinting(false)
    })

    console.log("keluraga petugas rs")
    console.log(get_data_keluarga_pasien_petugas_rs)

    
    return (
      <div className="mb-3">
        <ToastContainer />
        <div className="flex justify-center"> 
            <a href="/catatan_medis"
                className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                Kembali
            </a>
        </div>
       <div ref={c_print_ref}>
        <HeaderForm isPrinting={isPrinting} onSubmit={os_identitas_pasien} id_form_umum={id} />
        <div className="grid grid-cols-5 mt-3 text-xxs md:text-sm sm:text-xs">
            <Identitas_Tim isPrinting={isPrinting} onSubmit={os_identitas_tim_ambulance} auth={auth} id_form={id_form}/>
            <div className="mr-3 col-start-2 col-end-6">
                <div className="border-solid border-2 font-bold text-center">ASESMEN GAWAT DARURAT</div>
                <div className="mt-2 border-solid border-2 font-bold text-center">I. SURVEI PRIMER</div>
                <div className="border-solid border-2 grid grid-cols-4">
                    <div className="grid">
                        <div className="pl-1 font-bold ">KONDISI KRITIS</div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                // value={get_data_survei_primer.apneu}
                                value="apneu"
                                checked={get_data_surv_prim_kondisi_kritis.includes('apneu')?true:false}
                                // name="apneu"
                                onChange={handleChangeCbx_KondisiKritis} />
                            <label className="pl-2 inline-block hover:cursor-pointer">Apneu</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="hanya_merespon_nyeri"
                                checked={get_data_surv_prim_kondisi_kritis.includes('hanya_merespon_nyeri')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_hanya_merespon_nyeri" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Hanya Merespon Nyeri</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="distress_respirasi_berat"
                                checked={get_data_surv_prim_kondisi_kritis.includes('distress_respirasi_berat')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_distress_respirasi_berat" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Distress Respirasi Berat</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="nadi_tidak_teraba_/_syok"
                                checked={get_data_surv_prim_kondisi_kritis.includes('nadi_tidak_teraba_/_syok')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_nadi_tidak_teraba" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Nadi Tidak Teraba / Syok</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="sp02<90%"
                                checked={get_data_surv_prim_kondisi_kritis.includes('sp02<90%')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_spo2" />
                            <label className="pl-2 inline-block hover:cursor-pointer">SpO<sub>2</sub> {"<"} 90 %</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="kejang"
                                checked={get_data_surv_prim_kondisi_kritis.includes('kejang')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_kejang" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Kejang (Sedang Berlangsung)</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="tidak_ada"
                                checked={get_data_surv_prim_kondisi_kritis.includes('tidak_ada')?true:false}
                                onChange={handleChangeCbx_KondisiKritis}
                                id="id_checkbox_tidak_ada" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Tidak Ada</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="pl-1 font-bold">JALAN NAFAS</div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="paten"
                                checked={get_data_surv_prim_jalan_nafas.includes('paten')?true:false}
                                onChange={handleChangeCbx_JalanNafas}
                                id="id_cbx_paten" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Paten</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="obstruksi"
                                checked={get_data_surv_prim_jalan_nafas.includes('obstruksi')?true:false}
                                onChange={handleChangeCbx_JalanNafas}
                                id="id_cbx_obstruksi" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Obstruksi</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="stridor"
                                checked={get_data_surv_prim_jalan_nafas.includes('stridor')?true:false}
                                onChange={handleChangeCbx_JalanNafas}
                                id="id_cbx_stridor" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Stridor</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="gurgling"
                                checked={get_data_surv_prim_jalan_nafas.includes('gurgling')?true:false}
                                onChange={handleChangeCbx_JalanNafas}
                                id="id_cbx_gurgling" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Gurgling</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="snoring"
                                checked={get_data_surv_prim_jalan_nafas.includes('snoring')?true:false}
                                onChange={handleChangeCbx_JalanNafas}
                                id="id_cbx_snoring" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Snoring</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="pl-1 font-bold">PERNAFASAN</div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="spontan"
                                checked={get_data_surv_prim_pernafasan.includes('spontan')?true:false}
                                onChange={handleChangeCbx_Pernafasan}
                                id="id_cbx_spontan" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Spontan</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="apneu"
                                checked={get_data_surv_prim_pernafasan.includes('apneu')?true:false}
                                onChange={handleChangeCbx_Pernafasan}
                                id="id_cbx_pernafasan_apneu" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Apneu</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="sianosis"
                                checked={get_data_surv_prim_pernafasan.includes('sianosis')?true:false}
                                onChange={handleChangeCbx_Pernafasan}
                                id="id_cbx_sianosis" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Sianosis</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="retraksi_otot"
                                checked={get_data_surv_prim_pernafasan.includes('retraksi_otot')?true:false}
                                onChange={handleChangeCbx_Pernafasan}
                                id="id_cbx_retraksi_otot" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Retraksi Otot</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="nasal_flare"
                                checked={get_data_surv_prim_pernafasan.includes('nasal_flare')?true:false}
                                onChange={handleChangeCbx_Pernafasan}
                                id="id_cbx_nasal_flare" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Nasal Flare</label>
                        </div>
                    </div>
                    <div className="grid">
                        <div className="pl-1 font-bold">SIRKULASI</div>
                        <div className="pl-1 font-bold">Nadi</div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="kuat"
                                checked={get_data_surv_prim_sirkulasi_nadi.includes('kuat')?true:false}
                                onChange={oc_sirkulasi_nadi}
                                id="id_cbx_nadi_kuat" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Kuat</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="lemah"
                                checked={get_data_surv_prim_sirkulasi_nadi.includes('lemah')?true:false}
                                onChange={oc_sirkulasi_nadi}
                                id="id_cbx_nadi_lemah" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Lemah</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="tak_teraba"
                                checked={get_data_surv_prim_sirkulasi_nadi.includes('tak_teraba')?true:false}
                                onChange={oc_sirkulasi_nadi}
                                id="id_cbx_nadi_tak_teraba" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Tak Teraba</label>
                        </div>
                        <div className="pl-1 font-bold">Kulit</div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="normal"
                                checked={get_data_surv_prim_sirkulasi_kulit.includes('normal')?true:false}
                                onChange={oc_sirkulasi_kulit}
                                id="id_cbx_kulit_normal" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Normal</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="pucat"
                                checked={get_data_surv_prim_sirkulasi_kulit.includes('pucat')?true:false}
                                onChange={oc_sirkulasi_kulit}
                                id="id_cbx_kulit_pucat" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Pucat</label>
                        </div>
                        <div className="pl-1 flex items-center">
                            <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                type="checkbox"
                                value="sianosis"
                                checked={get_data_surv_prim_sirkulasi_kulit.includes('sianosis')?true:false}
                                onChange={oc_sirkulasi_kulit}
                                id="id_cbx_kulit_sianosis" />
                            <label className="pl-2 inline-block hover:cursor-pointer">Sianosis</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-4 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
            <Tanda_Vital judul="TANDA VITAL" isPrinting={isPrinting} onSubmit={getData_TandaVital} id={id}/>
            {/* <Tanda_Vital onSubmit={getData_TandaVital}/> */}
            <div className="border-solid border-2">
                <div className="font-bold">DISABILITAS</div>
                <div className="flex">
                    <div>GCS</div>
                    <div>:E</div>
                    {
                    isPrinting==false &&
                    <div className="w-[20%]">
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                        type="text"
                        name="gcs_e"
                        value={get_data_surv_prim_disabilitas.gcs_e}
                        onChange={oc_disabilitas}
                        />
                    </div> 
                    }
                    {
                        isPrinting &&
                        <div className="ml-1 mr-1">{get_data_surv_prim_disabilitas.gcs_e}</div>
                    }
                    <div>M</div>
                    {
                    isPrinting==false &&
                    <div className="w-[20%]">
                    <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                        type="text"
                        name="gcs_m"
                        value={get_data_surv_prim_disabilitas.gcs_m}
                        onChange={oc_disabilitas}
                        />
                    </div>
                    }
                    {
                        isPrinting &&
                        <div className="ml-1 mr-1">{get_data_surv_prim_disabilitas.gcs_m}</div>
                    }
                    <div>V</div>
                    {
                    isPrinting==false &&
                    <div className="w-[40%]">
                        <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                            type="text"
                            name="gcs_v"
                            value={get_data_surv_prim_disabilitas.gcs_v}
                            onChange={oc_disabilitas}
                            />
                    </div>
                    }
                    {
                        isPrinting &&
                        <div className="ml-1">{get_data_surv_prim_disabilitas.gcs_v}</div>
                    }
                </div>
                <div className="flex">
                    <div>Pupil</div>
                    <div>:</div>
                    {
                        isPrinting ==false &&
                        <div>
                            <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                                type="text"
                                name="pupil"
                                value={get_data_surv_prim_disabilitas.pupil}
                                onChange={oc_disabilitas}
                                />
                        </div>
                    }
                    {
                        isPrinting  &&
                        <div>{get_data_surv_prim_disabilitas.pupil}</div>
                    }
                    
                </div>
                <div className="flex">
                    <div>Reflek Cahaya</div>
                    <div>:</div>
                    {
                        isPrinting ==false &&
                        <div>
                        <input className="w-full text-xxs md:text-sm sm:text-xs p-0"
                                type="text"
                                name="reflek_cahaya"
                                value={get_data_surv_prim_disabilitas.reflek_cahaya}
                                onChange={oc_disabilitas}
                                />
                        </div>
                    }
                    {
                        isPrinting &&
                        <div>{get_data_surv_prim_disabilitas.reflek_cahaya}</div>
                    }
                </div>
                <div className="flex">
                    <div>Lateralisasi</div>
                    <div>:</div>
                    {
                        isPrinting ==false &&
                        <select
                            id="lateralisasi"
                            className="w-full text-xxs md:text-sm sm:text-xs p-0"
                            onChange={oc_data_surv_prim_disabilitas_lateralisasi}
                            defaultValue={get_data_surv_prim_disabilitas.lateralisasi}
                            value={get_data_surv_prim_disabilitas.lateralisasi}>
                            <option value="">Pilih</option>
                            <option value="Kanan">Kanan</option>
                            <option value="Kiri">Kiri</option>
                            <option value="-">-</option>
                        </select>
                    }
                    {
                        isPrinting &&
                        <div>{get_data_surv_prim_disabilitas.lateralisasi}</div>
                    }
                </div>
            </div>
            <div className="border-solid border-2">
                <div className="font-bold">EKSPOSUR</div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="dalam_batas_normal"
                        checked={get_data_surv_prim_eksposur.includes('dalam_batas_normal')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_dalam_batas_normal" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Dalam Batas Normal</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="luka"
                        checked={get_data_surv_prim_eksposur.includes('luka')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_luka" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Luka</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="deformitas"
                        checked={get_data_surv_prim_eksposur.includes('deformitas')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_deformitas" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Deformitas</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="pendarahan"
                        checked={get_data_surv_prim_eksposur.includes('pendarahan')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_pendarahan" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Pendarahan</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="nyeri_tekan"
                        checked={get_data_surv_prim_eksposur.includes('nyeri_tekan')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_nyeri_tekan" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Nyeri Tekan</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="pembengkakan"
                        checked={get_data_surv_prim_eksposur.includes('pembengkakan')?true:false}
                        onChange={handleChangeCbx_Eksposur}
                        id="id_cbx_pembengkakan" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Pembengkakan</label>
                </div>
            </div>
            <div className="border-solid border-2">
                <div className="font-bold">KESIMPULAN AWAL</div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]" 
                        type="checkbox"
                        value="mengancam_jiwa"
                        checked={get_data_surv_prim_kesimpulan_awal.includes("mengancam_jiwa")}
                        onChange={oc_kesimpulan_awal}
                        id="id_cbx_mengancam_jiwa" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Mengancam Jiwa</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="potensi_mengancam_jiwa"
                        checked={get_data_surv_prim_kesimpulan_awal.includes("potensi_mengancam_jiwa")}
                        onChange={oc_kesimpulan_awal}
                        id="id_cbx_potensi_mengancam_jiwa" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Potensi Mengancam Jiwa</label>
                </div>
                <div className="pl-1 flex items-center">
                    <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="checkbox"
                        value="tidak_mengancam_jiwa"
                        checked={get_data_surv_prim_kesimpulan_awal.includes("tidak_mengancam_jiwa")}
                        onChange={oc_kesimpulan_awal}
                        id="id_cbx_tidak_mengancam_jiwa" />
                    <label className="pl-2 inline-block hover:cursor-pointer">Tidak Mengancam Jiwa</label>
                </div>
            </div>
        </div>
        <div className="border-solid border-2 mt-3 ml-3 mr-3 font-bold text-xs md:text-sm sm:text-xs flex justify-center">II. RIWAYAT KESEHATAN</div>
        <div className="grid grid-rows-6 xxs:grid-cols-8 sm:grid-cols-5 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
            <div className="border-solid border-2 col-start-1 col-end-1">Keluhan Utama</div>
            <div className="border-solid border-2 col-start-2 col-end-9">
                {/* <div className=""></div> */}
                <input className="w-full text-xs md:text-sm sm:text-xs"
                    type="text"
                    name="keluhan_utama"
                    value={get_data_surv_prim_riwayat_kesehatan.keluhan_utama}
                    onChange={oc_riwayat_kesehatan}
                    />
            </div>
            <div className="row-span-2 border-solid border-2 col-start-1 col-end-1">Riwayat Penyakit Sekarang</div>
            <div className="row-span-2 border-solid border-2 col-start-2 col-end-9">
                <textarea className="w-full h-full text-xxs md:text-sm sm:text-xs"
                    // type="text"
                    name="riwayat_penyakit_sekarang"
                    value={get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_sekarang}
                    onChange={oc_riwayat_kesehatan}
                    />
            </div>
            <div className="border-solid border-2 col-start-1 col-end-1">Riwayat Penyakit Dahulu</div>
            <div className="grid grid-flow-col border-solid border-2 col-start-2 col-end-9">
                <div className="flex">
                {
                    isPrinting == false &&
                    ar_riwayat_penyakit_dahulu.map((option, index) => (
                        <div key={index} className="pl-1 flex items-center">
                            <input className="xxs:w-[10px] xxs:h-[10px] sm:w-[15px] sm:h-[15px]"
                                type="checkbox"
                                value={option.value}
                                onChange={oc_riwayat_penyakit_dahulu}
                                checked={get_data_surv_prim_riwayat_penyakit_dahulu.includes(option.value)}/>
                            <label className="text-xxs md:text-sm sm:text-xs pl-1 inline-block hover:cursor-pointer">{option.value}</label>
                        </div>
                    ))
                }
                {
                    isPrinting && 
                    ar_riwayat_penyakit_dahulu.map(option => (
                    <div className="pl-1 flex items-center">
                        <input className="appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                            type="checkbox"
                            value={option.value}
                            onChange={oc_riwayat_penyakit_dahulu}
                            // checked={get_data_surv_prim_riwayat_penyakit_dahulu.includes(option.value)?get_data_surv_prim_riwayat_penyakit_dahulu.includes(option.value):''}
                            // id="id_cbx_epilepsi" 
                            />
                        <label className="pl-2 inline-block hover:cursor-pointer">{option.value}</label>
                    </div>
                    ))
                }
                {
                    // get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya && 
                    isPrinting == false &&
                    <div className="flex items-center w-full ml-1">
                        <input className="w-full h-full text-xxs md:text-sm sm:text-xs p-0"
                            type="text"
                            value={get_data_surv_prim_riwayat_penyakit_dahulu_lainnya}
                            onChange={oc_riwayat_kesehatan_dahulu_lainnya}
                        />
                    </div>
                }
                {
                    // get_show_data_surv_prim_riwayat_penyakit_dahulu_lainnya && 
                    isPrinting &&
                    <div className="flex items-center ml-1">{get_data_surv_prim_riwayat_penyakit_dahulu_lainnya}</div>
                }
                </div>
            </div>
            <div className="border-solid border-2 col-start-1 col-end-1">Riwayat Penyakit Keluarga</div>
            <div className="border-solid border-2 col-start-2 col-end-9">
                {/* <div className=""> */}
                    <input className="w-full h-full text-xxs md:text-sm sm:text-xs"
                        type="text"
                        name="riwayat_penyakit_keluarga"
                        value={get_data_surv_prim_riwayat_kesehatan.riwayat_penyakit_keluarga}
                        onChange={oc_riwayat_kesehatan}
                    />
                {/* </div> */}
            </div>
            <div className=" border-solid border-2 col-start-1 col-end-1">
                <div className="">Riwayat Minum Obat</div>
            </div>
            <div className=" border-solid border-2 col-start-2 col-end-9">
                {/* <div className=""> */}
                    <input className="w-full h-full text-xxs md:text-sm sm:text-xs"
                        type="text"
                        name="riwayat_minum_obat"
                        value={get_data_surv_prim_riwayat_kesehatan.riwayat_minum_obat}
                        onChange={oc_riwayat_kesehatan}
                    />
                {/* </div> */}
            </div>
        </div>
        <div className="border-solid border-2 mt-3 ml-3 mr-3 font-bold text-xs md:text-sm sm:text-xs flex justify-center">III. PEMERIKSAAN FISIK DAN PEMERIKSAAN PENUNJANG</div>
        <div className="grid grid-cols-3 ml-3 mr-3 text-xs md:text-sm sm:text-xs">
            <div className="border-solid border-2 col-start-1 col-end-1">gambar</div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Kepala</div>
                <div className="col-start-2 col-end-7 flex">
                    <div className="flex">
                        <div className="mr-1">: Normocephal</div>
                        {/* <div className="ml-1"> */}
                            (
                                {
                                    isPrinting==false &&
                                    <input className="w-[15px] h-[20px] text-xxs md:text-sm sm:text-xs p-0" 
                                    type="text"
                                    name="normocephal"
                                    value={get_data_pemeriksaan_fisik_dan_penunjang.normocephal}
                                    onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                }
                                {
                                    isPrinting &&
                                    <div>{get_data_pemeriksaan_fisik_dan_penunjang.normocephal}</div>
                                }
                            )
                        {/* </div> */}
                    </div>
                    <div className="flex ml-2">
                        <div className="mr-1">Sclera Ikterik</div>    
                                {/* <div className="ml-1"> */}
                                    {"("}
                                    {
                                        isPrinting==false &&
                                        // <div>
                                        <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0"
                                        type="text"
                                        name="sclera_ikterik_1"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_1}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                        // </div>
                                    }
                                    {
                                        isPrinting &&
                                        <div>{get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_1}</div>
                                    }
                                {/* </div> */}
                                <div className="ml-1">
                                    /
                                </div>
                                    {
                                        isPrinting==false &&
                                        <div className="ml-1">
                                        <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0"
                                        type="text"
                                        name="sclera_ikterik_2"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_2}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                        </div>
                                    }
                                    {
                                        isPrinting &&
                                        <div className="ml-1">{get_data_pemeriksaan_fisik_dan_penunjang.sclera_ikterik_2}</div>
                                    }
                                    {")"},
                                {/* </div> */}
                            {/* </div>
                        } */}
                        
                        
                    </div>
                    <div className="flex ml-2">
                        <div className="mr-1">Conj. Anemis</div>
                        {/* <div className="ml-1"> */}
                            {"("}
                            {
                                isPrinting==false &&
                                <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                                type="text"
                                name="conj_anemis_1"
                                value={get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_1}
                                onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                            }
                            {
                                isPrinting &&
                                <div>{get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_1}</div>
                            }
                            
                        {/* </div> */}
                        <div className="ml-1 mr-1">
                            /
                        </div>
                        {/* <div className="ml-1"> */}
                            {
                                isPrinting==false &&
                                <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                                type="text"
                                name="conj_anemis_2"
                                value={get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_2}
                                onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                            }
                            {
                                isPrinting &&
                                <div>{get_data_pemeriksaan_fisik_dan_penunjang.conj_anemis_2}</div>
                            }
                            {")"}
                        {/* </div> */}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Leher</div>
                {/* <div className="col-start-2 col-span-3"> */}
                <div className="flex col-start-2 col-end-7">
                    <div className="mr-1">: Perbesaraan Kelenjar Getah Bening</div>
                    {/* <div className="ml-1"> */}
                        (
                        {
                            isPrinting==false &&
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="perbesaran_kelenjar_getah_bening"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.perbesaran_kelenjar_getah_bening}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.perbesaran_kelenjar_getah_bening}</div>
                        }
                        ),
                    {/* </div> */}
                    <div className="ml-2 mr-1">
                        Deviasi Trachea
                    </div>
                    {/* <div> */}
                        {/* <div className="ml-1"> */}
                            (
                            {
                            isPrinting==false &&
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0"
                                type="text"
                                name="deviasi_trachea"
                                value={get_data_pemeriksaan_fisik_dan_penunjang.deviasi_trachea}
                                onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                            }
                            {
                            isPrinting &&
                                <div>{get_data_pemeriksaan_fisik_dan_penunjang.deviasi_trachea}</div>
                            }
                            
                            )
                        {/* </div> */}
                    {/* </div> */}
                </div>
            </div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Thorax</div>
                <div className="flex col-start-2 col-end-7">
                    <div>: Suara Dasar Veikuler</div>
                    {/* <div className="ml-1"> */}
                    {/* <div> */}
                        {"("}
                        {
                            isPrinting==false &&
                            <div>
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="suara_dasar_veikuler_1"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_1}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                            </div>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_1}</div>
                        }
                    {/* </div> */}
                    <div>
                        /
                    </div>
                    {/* <div> */}
                        {
                            isPrinting==false &&
                            <div>
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="suara_dasar_veikuler_2"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_2}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                            </div>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.suara_dasar_veikuler_2}</div>
                        }
                        {"),"}
                    {/* </div> */}
                    <div>Rhonki</div>
                    {/* <div className="ml-1"> */}
                        {"("}
                        {
                            isPrinting==false &&
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="rhonki_1"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.rhonki_1}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.rhonki_1}</div>
                        }
                        
                    {/* </div> */}
                    <div>
                        /
                    </div>
                    {/* <div className="ml-1"> */}
                        {
                            isPrinting==false &&
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="rhonki_2"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.rhonki_2}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.rhonki_2}</div>
                        }
                        
                        {"),"}
                    {/* </div> */}

                    <div>Wheezing</div>
                    {/* <div className="ml-1"> */}
                        {"("}
                        {
                            isPrinting==false &&
                            <input className="w-[15px] h-[20px] text-xs md:text-sm sm:text-xs p-0" 
                            type="text"
                            name="wheezing_1"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.wheezing_1}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.wheezing_1}</div>
                        }
                        
                    {/* </div> */}
                    <div>
                        /
                    </div>
                    {/* <div className="ml-1"> */}
                        {
                            isPrinting==false &&
                            <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                            type="text"
                            name="wheezing_2"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.wheezing_2}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.wheezing_2}</div>
                        }
                        
                        {"),"}
                    {/* </div> */}
                </div>
                <div className="flex col-start-2 col-end-7 ml-2">
                    <div>Bunyi Jantung 1 dan 2</div>
                    {/* <div className="ml-1"> */}
                        (
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                            type="text"
                            name="bunyi_jantung_1_2"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2}</div>
                        }
                        
                        )
                    {/* </div> */}
                    {/* <div className="ml-2"> */}
                        {
                        isPrinting==false &&
                        <select
                            id="bunyi_jantung_1_2_status"
                            className="w-[90px] h-[20px] p-0 text-xs md:text-sm sm:text-xs"
                            onChange={oc_s_pemeriksaan_fisik_dan_penunjang}
                            // defaultValue={get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2_status}
                            value={get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2_status}
                            >
                            <option value="-">Pilih</option>
                            <option value="normal">Normal</option>
                            <option value="abnormal">Abnormal</option>
                        </select>
                        }
                        {
                            isPrinting &&
                            <div className="ml-1">{get_data_pemeriksaan_fisik_dan_penunjang.bunyi_jantung_1_2_status}</div>
                        }
                        
                        {/* Normal / Abnormal / ... */}
                    {/* </div> */}
                </div>
            </div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Abdomen</div>
                <div className="flex col-start-2 col-end-7">
                    <div>: Bising Usus</div>
                    {/* <div className="ml-1"> */}
                        (
                         {
                            isPrinting==false &&
                            <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                            type="text"
                            name="bising_usus"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.bising_usus}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                         }   
                         {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.bising_usus}</div>
                         }
                        )
                    {/* </div> */}
                    <div>
                        {
                            isPrinting==false &&
                            <select
                                id="bising_usus_status"
                                className="w-[90px] h-[20px] p-0 text-xs md:text-sm sm:text-xs"
                                onChange={oc_s_pemeriksaan_fisik_dan_penunjang}
                                // defaultValue={get_data_pemeriksaan_fisik_dan_penunjang.bising_usus_status}>
                                value={get_data_pemeriksaan_fisik_dan_penunjang.bising_usus_status}>
                                <option value="-">Pilih</option>
                                <option value="normal">Normal</option>
                                <option value="abnormal">Abnormal</option>
                            </select>
                        } 
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.bising_usus_status}</div>
                        }
                    </div>
                </div>
                <div className="flex col-start-2 col-end-7 ml-1">
                    <div className="ml-1">Nyeri Tekan Abdomen</div>
                    {/* <div className="ml-1"> */}
                        (
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                            type="text"
                            name="nyeri_tekan_abdomen"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                        isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen}</div>
                        }
                        
                        )
                    {/* </div> */}
                    <div className="ml-1">pada Area :</div>
                    {/* <div> */}
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[100px] h-[20px] p-0" 
                            type="text"
                            name="nyeri_tekan_abdomen_area"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen_area}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.nyeri_tekan_abdomen_area}</div>
                        }
                        
                    {/* </div> */}
                </div>
            </div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Ekstremitas</div>
                <div className="flex col-start-2 col-end-7">
                    <div>: Akral Hangat</div>
                    <div className="ml-1">
                        <div>
                            <div className="flex">
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="akral_hangat_a_1"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_1}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="akral_hangat_b_1"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_1}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex">
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="akral_hangat_a_2"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_a_2}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="akral_hangat_b_2"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.akral_hangat_b_2}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-2">Oedema</div>
                    <div className="ml-1">
                        <div>
                            <div className="flex">
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="oedema_a_1"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_1}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0"
                                        type="text"
                                        name="oedema_b_1"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_1}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex">
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="oedema_a_2"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.oedema_a_2}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                                <div>
                                    <input className="text-xs md:text-sm sm:text-xs w-[15px] h-[20px] p-0" 
                                        type="text"
                                        name="oedema_b_2"
                                        value={get_data_pemeriksaan_fisik_dan_penunjang.oedema_b_2}
                                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-6 border-solid border-2 col-start-2 col-end-4 text-xxs md:text-sm sm:text-xs">
                <div>Penunjang</div>
                <div className="flex col-start-2 col-end-7">
                    <div>: EKG :</div>
                    {/* <div> */}
                        {
                            isPrinting==false && 
                            <input className="text-xs md:text-sm sm:text-xs w-[100px] h-[20px] p-0" 
                            type="text"
                            name="ekg"
                            value={get_data_pemeriksaan_fisik_dan_penunjang.ekg}
                            onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.ekg}</div>
                        }
                    {/* </div> */}
                </div>
                <div className="col-start-2 col-end-7 ml-2 flex">
                    <div>GDS</div>
                    {/* <div> */}
                        {"("}
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[25px] h-[20px] p-0" 
                        type="text"
                        name="gds"
                        value={get_data_pemeriksaan_fisik_dan_penunjang.gds}
                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input> 
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.gds}</div>
                        }
                        {")"}
                    {/* </div> */}
                    <div>AU</div>
                    {/* <div> */}
                        (
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[25px] h-[20px] p-0" 
                        type="text"
                        name="au"
                        value={get_data_pemeriksaan_fisik_dan_penunjang.au}
                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.au}</div>
                        }
                        ),
                    {/* </div> */}
                    <div>CHOL</div>
                    {/* <div> */}
                        (
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[25px] h-[20px] p-0" 
                        type="text"
                        name="chol"
                        value={get_data_pemeriksaan_fisik_dan_penunjang.chol}
                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.chol}</div>
                        }
                        ),
                    {/* </div> */}
                    <div>HB</div>
                    {/* <div> */}
                        (
                        {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-[25px] h-[20px] p-0" 
                        type="text"
                        name="hb"
                        value={get_data_pemeriksaan_fisik_dan_penunjang.hb}
                        onChange={oc_pemeriksaan_fisik_dan_penunjang}></input>
                        }
                        {
                            isPrinting &&
                            <div>{get_data_pemeriksaan_fisik_dan_penunjang.hb}</div>
                        }
                        ),
                    {/* </div> */}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-4 border-solid border-2 mt-3 ml-3 mr-3 text-xs md:text-sm sm:text-xs">
            <div className="col-start-1 col-end-1 border-solid border-2">
                <div className="flex justify-center border-solid border-2 font-bold">IV. DIAGNOSIS MEDIS</div>
                {
                    isPrinting &&
                    get_data_diagnosis_medis.map((data, i)=>{
                        // console.log("i"+i);
                        return(
                            <div key={i+1} className="flex ">
                                <div className="mr-1">{i+1}.</div>
                                <div>{get_data_diagnosis_medis[i]}</div>
                            </div>
                        )
                    })
                }
                {
                    isPrinting==false &&
                    <div className="flex justify-center">
                        <button type="button" onClick={oc_tambah_diagnosis_medis} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Tambah
                        </button>
                    </div>
                }
                {
                    isPrinting==false &&
                    get_data_diagnosis_medis.map((data, i)=>{
                        return(
                            <div key={i} className = "flex">
                                <div className="mr-1">{i+1}.</div>
                                <input className={`w-full text-xs md:text-sm sm:text-xs p-0 ${kode_diagnosis_medis[i] == "" ? 'border border-red-500' : ''}`} 
                                    type = "text"
                                    name = "diagnosis_medis"
                                    list = "dl_icd_10"
                                    value = {get_data_diagnosis_medis[i]}
                                    onChange = {e=>oc_value_diagnosis_medis(e,i)} />
                                    <datalist id = "dl_icd_10">
                                        {get_data_icd_10.map((opts,i)=><option key={i} id={opts.id} value={opts.diagnosis}>{opts.kode_icd}</option>)}
                                    </datalist>
                                    <button className="w-1/6 text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded" type="button" onClick={()=>oc_hapus_diagnosis_medis(i)}>x</button>
                            </div>
                        )
                    })
                }
            </div>
            <div className="col-start-2 col-end-4 border-solid border-2 text-xs md:text-sm sm:text-xs">
                <div className="border-solid border-2 font-bold flex">
                    {
                        isPrinting==false &&
                        <div className="flex">
                            <div className="w-full">
                                V. TERAPI / TINDAKAN / KONSUL :
                            </div>
                            <div className="flex">
                                <input type="text" 
                                className="w-full h-full text-xs md:text-sm sm:text-xs p-0"
                                name="terapi_tindakan_konsul_dr"
                                value={get_terapi_tindakan_konsul_dr}
                                onChange={e=>set_terapi_tindakan_konsul_dr(e.target.value)}></input>
                            </div>
                        </div>
                    }
                    {
                        isPrinting &&
                        <div className="flex">
                            <div className="text-xs md:text-sm sm:text-xs">
                            V. TERAPI / TINDAKAN / KONSUL :
                            </div>
                            {get_terapi_tindakan_konsul_dr}
                        </div>
                    }
                </div>
                {
                    isPrinting==false &&
                    <div className="flex justify-center">
                        <button type="button" onClick={oc_tambah_terapi_tindakan_konsul} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Tambah
                        </button>
                    </div>
                }
                {
                    isPrinting==false &&
                    get_terapi_tindakan_konsul.map((data, i)=>{
                        return(
                            <div key={i} className="flex">
                                <div className="mr-1">{i+1}.</div>
                                <input className="w-5/6 text-xs md:text-sm sm:text-xs p-0" type="text" 
                                    value={get_terapi_tindakan_konsul[i]} 
                                    onChange={e=>oc_value_terapi_tindakan_konsul(e,i)}
                                    list="dl_icd_9" >
                                </input>
                                <datalist id = "dl_icd_9">
                                    {get_data_icd_9.map((opts,i)=><option key={i} id={opts.id} value={opts.diagnosa}>{opts.kode}</option>)}
                                </datalist>
                                <button className="w-1/6 text-xs md:text-sm sm:text-xs bg-red-500 hover:bg-red-700 text-white font-bold rounded" type="button" onClick={()=>oc_hapus_terapi_tindakan_konsul(i)}>x</button>
                            </div>
                        )
                    })
                }
                {
                    isPrinting &&
                    get_terapi_tindakan_konsul.map((data, i)=>{
                        return(
                            <div key={i} className="flex">
                                <div className="mr-1">{i+1}.</div>
                                <div>{get_terapi_tindakan_konsul[i]}</div>
                            </div>
                        )
                    })
                }
            </div>
            <Tanda_Vital judul="FOLLOW UP TANDA VITAL" onSubmit={getData_FollowUpTandaVital} isPrinting={isPrinting} id={id} />
        </div>
        <div className="grid grid-cols-4 border-solid border-2 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
            <div className="border-solid border-2">
            {
                pilih_rumah_sakit_rujukan=="true" &&
                <div>
                    <div className="flex justify-center border-solid border-2 font-bold">RUMAH SAKIT RUJUKAN</div>
                    <div className="grid grid-cols-5">
                        <div>RS</div>
                        <div className="flex col-span-4">
                            :
                            {
                                isPrinting &&
                                <div>{get_data_rumah_sakit_rujukan.rs}</div>
                            }
                            {
                                isPrinting==false &&
                                    <>
                                        <input className={`w-full text-xs md:text-sm sm:text-xs p-0}`} 
                                            type = "text"
                                            name = "rs"
                                            list = "dl_rs_rujukan"
                                            value = {get_data_rumah_sakit_rujukan.rs}
                                            onChange = {oc_data_rumah_sakit_rujukan} />
                                            <datalist id = "dl_rs_rujukan">
                                                {rs_rujukan.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                                            </datalist>
                                    </>
                                // <input className="w-full text-xs md:text-sm sm:text-xs"
                                // type="text"
                                // name="rs"
                                // value={get_data_rumah_sakit_rujukan.rs}
                                // onChange={oc_data_rumah_sakit_rujukan} />
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-5">
                        <div>Tgl</div>
                        <div className="flex col-span-4">
                            :
                            {
                                isPrinting &&
                                <div>{get_data_rumah_sakit_rujukan.tgl_baru}</div>
                            }
                            {
                                isPrinting==false &&
                                <input className="w-full text-xs md:text-sm sm:text-xs" 
                                type="date"
                                name = "tgl"
                                value={get_data_rumah_sakit_rujukan.tgl}
                                onChange={oc_data_rumah_sakit_rujukan}
                                />
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-5">
                        <div>Jam</div>
                        <div className="flex col-span-4">
                            :
                            {
                                isPrinting 
                                &&
                                <div>{get_data_rumah_sakit_rujukan.jam}</div>
                            }
                            {
                                isPrinting==false &&
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* <MobileTimePicker value={get_jam_rs_rujukan} onChange={oc_data_rumah_sakit_rujukan} ampm={false} slotProps={{ */}
                                    <MobileTimePicker value={get_data_rumah_sakit_rujukan.in_jam} onChange={oc_data_rumah_sakit_rujukan} ampm={false} slotProps={{
                                        textField: {
                                                size: "small",
                                            },
                                        }} />
                                </LocalizationProvider>
                            }
                        </div>
                    </div>
                </div>
            }
            </div>
            <div className="relative border-solid border-2">
                <div className="flex justify-center text-xxs md:text-sm sm:text-xs">Petugas Ambulance Hebat,</div>
                {/* {
                    isPrinting == false && */}
                    <div className="w-full">
                        <SignatureCanvas
                            canvasProps={{className:'sigCanvas w-full h-full'} }
                            ref={ref_ttd_petugas_ambulance}
                            onEnd={oe_ttd_petugas_ambulance}
                            />
                    </div>
                {/* } */}
                {/* {
                    isPrinting &&
                    // <div>{get_url_ttd_petugas_ambulance}</div>
                    <div className="flex justify-center">
                    <img src={get_url_ttd_petugas_ambulance}/>
                    </div>
                    // <img src={get_ttd_petugas_ambulance.getTrimmedCanvas().toDataURL('image/png')}/>
                } */}
                {/* <div className="absolute inset-x-0 bottom-0"> */}
                <div>
                    {
                        isPrinting &&
                        <div className="flex justify-center">{get_data_nama_ttd_petugas_ambulance_hebat}</div>
                    }
                    {
                        isPrinting==false &&   
                        <input className="text-xs md:text-sm sm:text-xs w-full" type="text" 
                            name="petugas_ambulance_hebat" onChange={e => set_data_nama_ttd_petugas_ambulance_hebat(e.target.value)}
                            value={get_data_nama_ttd_petugas_ambulance_hebat} />
                    }
                </div>
            </div>
            {/* <div className="border-solid border-2 flex justify-center cols-start-3">Keluarga Pasien / Petugas RS,</div> */}
            <div className="relative border-solid border-2">
                {
                    isPrinting==false && 
                    <div className="flex justify-center">
                        <select
                            id="keluarga_pasien_petugas_rs"
                            className="w-full text-xxs md:text-sm sm:text-xs p-0"
                            onChange={(e)=>set_data_keluarga_pasien_petugas_rs(e.target.value)}
                        
                            // defaultValue={get_data_keluarga_pasien_petugas_rs}
                            value={get_data_keluarga_pasien_petugas_rs}
                            >
                            <option value="Petugas RS">Petugas RS</option>
                            <option value="Keluarga Pasien">Keluarga Pasien</option>
                        </select>
                    </div>  
                }
                {
                    isPrinting &&
                    <div className="flex justify-center">{get_data_keluarga_pasien_petugas_rs}</div>
                }
                <div>
                    <SignatureCanvas
                        canvasProps={{className:'sigCanvas w-full h-full'}}
                        ref={ref_ttd_keluarga_pasien_petugas_rs}
                        onEnd={oe_ttd_keluarga_pasien_petugas_rs}
                        />
                </div>
                <div>
                    {
                        isPrinting &&
                        <div className="flex justify-center">{get_data_nama_ttd_keluarga_pasien_petugas_rs}</div>
                    }
                    {
                        isPrinting==false &&
                        <input className="text-xs md:text-sm sm:text-xs w-full" type="text" 
                            name="keluarga_pasien_petugas_rs" onChange={e => set_data_nama_ttd_keluarga_pasien_petugas_rs(e.target.value)}
                            value={get_data_nama_ttd_keluarga_pasien_petugas_rs} />
                    }
                </div>
            </div>
            <div className="border-solid border-2 flex justify-center">PSC 119</div>
        </div>
       </div>
       <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
            <div>
                <select id="pilih_rumah_sakit_rujukan" 
                    onChange={(e) => set_pilih_rumah_sakit_rujukan(e.target.value)}
                    value={pilih_rumah_sakit_rujukan}>
                    <option value="true">Rujukan</option>
                    <option value="false">Tidak Rujukan</option>
                </select>
            </div>
            <button type="button" onClick={oc_hapus_ttd_petugas_ambulance} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
            <button type="button" onClick={oc_hapus_ttd_keluarga_pasien_atau_petugas_rs} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
       </div>
       
        <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs">
            <div></div>
            <button type="button" onClick={oc_simpan} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">{id?'Perbarui':'Simpan'}</button>
            <button type="button" onClick={oc_print} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Print</button>
        </div>
      </div>
    );
}