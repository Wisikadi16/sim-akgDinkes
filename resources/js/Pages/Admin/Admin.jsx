import React from "react";
// import ReactDOM from 'react-dom';
// import { Switch, Route, Redirect } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

// components

// import AdminNavbar from "@/Components/Navbars/AdminNavbar";
// import Sidebar from "@/Components/Sidebar/Sidebar";
// import HeaderStats from "@/Components/Headers/HeaderStats";
// import FooterAdmin from "@/Components/Footers/FooterAdmin";

// views

// import Dashboard from "@/Pages/Admin/Dashboard";
// import Maps from "views/admin/Maps.js";
// import Settings from "views/admin/Settings.js";
// import Tables from "views/admin/Tables.js";

export default function Admin() {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
          <AdminNavbar />
          {/* Header */}
          <HeaderStats />
          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              {/* <Route path="/admin/maps" exact component={Maps} /> */}
              {/* <Route path="/admin/settings" exact component={Settings} /> */}
              {/* <Route path="/admin/tables" exact component={Tables} /> */}
              {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
              {/* <Navigate from="/admin" to="/admin/dashboard" /> */}
            </Routes>
            <FooterAdmin />
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}
