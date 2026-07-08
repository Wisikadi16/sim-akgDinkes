import React, { useState, useEffect } from 'react';

import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

// components
import Sidebar from "@/Components/Sidebar/Sidebar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// views

import Dashboard from "@/Pages/Dashboard/Dashboard";
// import Form from "@/Pages/Admin/Form";
// import Petugas from "@/Pages/Admin/Petugas";
import Order from "@/Pages/Dashboard/Order";
import Laporan from "@/Pages/Dashboard/Laporan";
import Catatan_Medis from "@/Pages/Dashboard/Catatan_Medis";
import Form_Umum from "@/Pages/Form/Form_Umum";
import Form_Neonatal from "@/Pages/Form/Form_Neonatal";
import Form_Maternal from "@/Pages/Form/Form_Maternal";
import Form_Surat_Keterangan_Kematian from "@/Pages/Form/Form_Surat_Keterangan_Kematian";
import Form_Surat_Persetujuan_Tindakan_Medis from "@/Pages/Form/Form_Surat_Persetujuan_Tindakan_Medis";
import Form_Lembar_Transfer_Pasien from "@/Pages/Form/Form_Lembar_Transfer_Pasien";
import Form_CM_DOA from "@/Pages/Form/Form_CM_DOA";
import Form_Keluarga from "@/Pages/Form/Form_Keluarga";
import Pasien from "@/Pages/Dashboard/Pasien";
import Admin from "@/Pages/Dashboard/Admin";
import Petugas from "@/Pages/Dashboard/Petugas";
import Tim_Ambulan from "@/Pages/Dashboard/Tim_Ambulan";
// import Form_Surat_Keterangan_Kematian from "../Form/Form_Surat_Keterangan_Kematian";

// import Maps from "views/admin/Maps.js";
// import Settings from "views/admin/Settings.js";
// import Tables from "views/admin/Tables.js";

export default function Index({ auth, id }) {
  // console.log("rolllle")
  // console.log({auth})
  // const isMobile = window.innerWidth <= 767;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ${isMobile ? 'block' : 'flex print:bg-white dark:bg-slate-800 transition-colors duration-300'}`}>
          <Sidebar auth={auth} />
          <div className={`print:p-0 ${isMobile ? 'pt-16 px-4 pb-8 w-full' : 'flex-1 w-full p-8 overflow-x-hidden'}`}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order" element={<Order auth={auth} />} />
              <Route path="/laporan" element={<Laporan auth={auth} />} />
              <Route path="/catatan_medis" element={<Catatan_Medis auth={auth} />} />
              <Route path="/form_umum" element={<Form_Umum auth={auth} />} />
              <Route path="/form_umum/:id" element={<Form_Umum auth={auth} id={id} />} />
              <Route path="/form_neonatal" element={<Form_Neonatal auth={auth} />} />
              <Route path="/form_neonatal/:id" element={<Form_Neonatal auth={auth} id={id} />} />

              <Route path="/form_maternal" element={<Form_Maternal auth={auth} />} />
              <Route path="/form_maternal/:id" element={<Form_Maternal auth={auth} id={id} />} />
              <Route path="/form_surat_keterangan_kematian" element={<Form_Surat_Keterangan_Kematian auth={auth} />} />
              <Route path="/form_surat_keterangan_kematian/:id" element={<Form_Surat_Keterangan_Kematian auth={auth} id={id} />} />
              <Route path="/form_surat_persetujuan_tindakan_medis" element={<Form_Surat_Persetujuan_Tindakan_Medis auth={auth} />} />
              <Route path="/form_surat_persetujuan_tindakan_medis/:id" element={<Form_Surat_Persetujuan_Tindakan_Medis auth={auth} id={id} />} />
              <Route path="/form_lembar_transfer_pasien" element={<Form_Lembar_Transfer_Pasien auth={auth} />} />
              <Route path="/form_lembar_transfer_pasien/:id" element={<Form_Lembar_Transfer_Pasien auth={auth} id={id} />} />
              <Route path="/form_cm_doa" element={<Form_CM_DOA auth={auth} />} />
              <Route path="/form_cm_doa/:id" element={<Form_CM_DOA auth={auth} id={id} />} />
              <Route path="/form-keluarga" element={<Form_Keluarga auth={auth} />} />
              <Route path="/form-keluarga/:id" element={<Form_Keluarga auth={auth} id={id} />} />


              <Route path="/pasien" element={<Pasien />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/petugas" element={<Petugas />} />
              <Route path="/tim_ambulan" element={<Tim_Ambulan />} />
              <Route path="/logout" exact component={<Navigate to="/logout" replace={true} />} />

              {/* <Route path="/" element={<Dashboard/>} /> */}
              {/* <Route path="/admin/maps" exact component={Maps} /> */}
              {/* <Route path="/admin/settings" exact component={Settings} /> */}
              {/* <Route path="/admin/tables" exact component={Tables} /> */}
              {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
              {/* <Navigate from="/admin" to="/admin/dashboard" /> */}
            </Routes>
          </div>

          {/* <FooterAdmin /> */}
        </div>
      </BrowserRouter>
    </>
  );
}
