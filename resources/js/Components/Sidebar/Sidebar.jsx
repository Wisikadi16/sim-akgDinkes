import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import {
  HiMenuAlt2,
  HiViewGrid,
  HiDocumentText,
  HiClipboardList,
  HiBookOpen,
  HiUsers,
  HiShieldCheck,
  HiUser,
  HiTruck,
  HiLogout
} from "react-icons/hi";
import { useState } from "react";
import DarkModeToggle from "../DarkModeToggle";

export default function Sidebar({ auth }) {
  // console.log(auth)
  const menu =
    [
      auth.role == "admin" || auth.role == "yankes" ? { name: "Dashboard", nl: "dashboard", link: '/dashboard', icon: HiViewGrid } : null,
      auth.role == "admin" || auth.role == "Tim Ambulan" || auth.role == "Operator" ? { name: "Order", nl: "order", link: '/order', icon: HiClipboardList } : null,
      auth.role == "admin" || auth.role == "Tim Ambulan" ? { name: "Catatan Medis", nl: "catatan_medis", link: '/catatan_medis', icon: HiBookOpen } : null,
      auth.role == "admin" ? { name: "Pasien", nl: "pasien", link: '/pasien', icon: HiUsers } : null,
      auth.role == "admin" ? { name: "Admin", nl: "admin", link: '/admin', icon: HiShieldCheck } : null,
      auth.role == "admin" || auth.role == "yankes" || auth.role == "Tim Ambulan" ? { name: "Petugas", nl: "petugas", link: '/petugas', icon: HiUser } : null,
      auth.role == "admin" || auth.role == "yankes" ? { name: "Tim Ambulan", nl: "tim_ambulan", link: '/tim_ambulan', icon: HiTruck } : null,
      auth.role == "admin" || auth.role == "Tim Ambulan" || auth.role == "Operator" ? { name: "Laporan", nl: "laporan", link: '/laporan', icon: HiDocumentText } : null,
    ]

  const filter_menu = menu.filter((item) => item !== null)

  var url = window.location.href;
  var s_url = url.split('/');

  const [open, set_open] = useState(true);
  const [open_mobile, set_open_mobile] = useState(false);
  const [link, set_link] = useState(s_url[3]);

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
    <div className={`z-40 drop-shadow-sm shrink-0 print:hidden ${isMobile ? 'w-full block fixed top-0 left-0' : 'flex'}`}>

      {/* === TAMPILAN MOBILE === */}
      {isMobile && (
        <>
          <div className="w-full py-4 px-5 flex justify-between items-center bg-red-700 dark:bg-slate-900 shadow-sm relative z-50">
            <div className="font-bold text-white text-lg">SIM-AKG</div>
            <HiMenuAlt2 size={28} className="cursor-pointer text-white hover:text-red-200 transition-colors" onClick={() => set_open_mobile(!open_mobile)} />
          </div>

          {open_mobile && (
            <div className="flex flex-col bg-red-700 dark:bg-slate-900 shadow-xl absolute w-full left-0 border-t border-red-600 dark:border-slate-800 px-4 py-4 gap-2 z-40 max-h-[calc(100vh-68px)] overflow-y-auto">

              {/* User Profile Mobile */}
              <div className="flex items-center gap-3 p-3 bg-red-800 dark:bg-slate-800 rounded-xl mb-2 border border-red-600 dark:border-slate-700">
                <div className="bg-red-600 dark:bg-slate-700 p-2 rounded-full">
                  <img src="/./assets/img/user.png" className="w-[30px] filter drop-shadow-sm brightness-0 invert" alt="User"></img>
                </div>
                <div className="truncate">
                  <h2 className="text-white font-bold">{auth.name}</h2>
                  <p className="text-xs text-red-200 dark:text-slate-400 capitalize">{auth.role}</p>
                </div>
              </div>

              {/* Menu Mobile */}
              {filter_menu?.map((val, i) => {
                const isActive = val?.nl.toLowerCase() === link;
                return (
                  <Link
                    key={i}
                    to={val?.link}
                    className={`group flex items-center text-sm gap-4 p-3 rounded-xl transition-all duration-300 ${isActive
                      ? "bg-white dark:bg-red-500/10 text-red-700 dark:text-red-500 shadow-md shadow-red-900/50 dark:shadow-none"
                      : "text-red-100 dark:text-slate-400 hover:bg-red-600 dark:hover:bg-slate-800 hover:text-white dark:hover:text-slate-100"
                      }`}
                    onClick={() => { set_link(val?.nl.toLowerCase()); set_open_mobile(false); }}>

                    <div className={`p-1.5 rounded-lg ${isActive ? "bg-red-100 dark:bg-transparent" : "bg-red-800 dark:bg-slate-800 group-hover:bg-red-500 dark:group-hover:bg-slate-700"}`}>
                      {val?.icon && React.createElement(val.icon, {
                        className: `w-5 h-5 ${isActive ? "text-red-700 dark:text-red-500" : "text-red-100 dark:text-slate-400 opacity-80"}`
                      })}
                    </div>
                    <h2 className="font-medium">{val?.name}</h2>
                  </Link>
                )
              })}

              <div className="h-px bg-red-600 dark:bg-slate-800 my-2"></div>

              {/* Dark Mode Toggle Mobile */}
              <DarkModeToggle isSidebarOpen={true} />

              {/* Logout Mobile */}
              <a href="/logout" className="group flex items-center text-sm gap-4 p-3 rounded-xl text-red-100 dark:text-slate-400 hover:bg-red-600 dark:hover:bg-slate-800 hover:text-white dark:hover:text-slate-100 transition-all duration-300">
                <div className="p-1.5 rounded-lg bg-red-800 dark:bg-slate-800 group-hover:bg-red-500 dark:group-hover:bg-slate-700">
                  <HiLogout className="w-5 h-5 text-red-100 dark:text-slate-400 opacity-80 group-hover:opacity-100" />
                </div>
                <h2 className="font-medium">Logout</h2>
              </a>
            </div>
          )}
        </>
      )}

      {/* === TAMPILAN DESKTOP === */}
      {!isMobile && (
        <div className={`bg-red-700 dark:bg-slate-900 min-h-screen shadow-[4px_0_24px_rgba(0,0,0,0.1)] transition-all duration-500 ${open ? 'w-64' : 'w-20'} flex flex-col fixed h-full z-40 border-r border-red-800 dark:border-slate-800 overflow-x-hidden`}>

          <div className="py-6 px-6 flex items-center justify-between border-b border-red-600 dark:border-slate-800">
            {open && <div className="font-extrabold text-white text-xl tracking-wide whitespace-nowrap overflow-hidden">SIM-AKG</div>}
            <div className={`${!open ? 'mx-auto' : ''}`}>
              <HiMenuAlt2 size={24} className="cursor-pointer text-red-200 dark:text-slate-400 hover:text-white dark:hover:text-slate-100 transition-colors" onClick={() => set_open(!open)} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 px-4 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">

            {/* User Profile Desktop */}
            <Link to="/dashboard"
              className={`group flex items-center transition-all duration-300 rounded-2xl ${!open ? "justify-center p-2 mb-4 hover:bg-red-600 dark:hover:bg-slate-800" : `gap-4 p-3 mb-4 ${link === "dashboard" ? "bg-red-800 dark:bg-red-500/10 border border-red-600 dark:border-red-500/20" : "hover:bg-red-600 dark:hover:bg-slate-800"}`
                }`}
              onClick={() => set_link("dashboard")}>

              <div className="bg-red-600 dark:bg-slate-800 p-2.5 rounded-xl shrink-0 flex items-center justify-center">
                <img src="/./assets/img/user.png" className="w-[26px] drop-shadow-sm brightness-0 invert" alt="User"></img>
              </div>

              <div className={`truncate transition-all duration-500 ${!open && "w-0 opacity-0 hidden"}`}>
                <h2 className="text-white font-bold text-sm tracking-tight">{auth.name}</h2>
                <p className="text-xs text-red-200 dark:text-slate-400 capitalize">{auth.role}</p>
              </div>
            </Link>

            <div className="text-xs font-semibold text-red-300 dark:text-slate-500 uppercase tracking-wider mb-2 px-3 mt-2 whitespace-nowrap overflow-hidden">
              {open ? 'Menu Utama' : '-'}
            </div>

            {/* Menu List Desktop */}
            {filter_menu?.map((val, i) => {
              const isActive = val?.nl?.toLowerCase() === link;
              return (
                <Link to={val?.link} key={i}
                  className={`relative group flex items-center text-sm rounded-xl transition-all duration-300 select-none ${!open ? "justify-center p-2 mb-1" : "gap-4 p-3 mb-1"
                    } ${isActive
                      ? "bg-white dark:bg-red-500/10 text-red-700 dark:text-red-500 shadow-lg shadow-black/10 dark:shadow-none"
                      : "text-red-100 dark:text-slate-400 hover:bg-red-600 dark:hover:bg-slate-800 hover:text-white dark:hover:text-slate-100"
                    }`}
                  onClick={(e) => set_link(val?.nl?.toLowerCase())}>

                  <div className={`shrink-0 flex justify-center items-center w-8 h-8 rounded-lg transition-colors ${isActive ? "bg-red-100 dark:bg-transparent" : "bg-red-800 dark:bg-slate-800 group-hover:bg-red-500 dark:group-hover:bg-slate-700"
                    }`}>
                    {val?.icon && React.createElement(val.icon, {
                      className: `w-5 h-5 ${isActive ? "text-red-700 dark:text-red-500" : "text-red-100 dark:text-slate-400 opacity-80"}`
                    })}
                  </div>

                  <h2 className={`font-medium whitespace-pre transition-all duration-500 overflow-hidden ${open ? "w-full opacity-100" : "w-0 opacity-0 translate-x-4"
                    }`}>{val?.name}</h2>

                  <h2 className={`${open && "hidden"} absolute left-20 bg-gray-900 font-semibold whitespace-pre text-white rounded-md shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-3 group-hover:py-2 group-hover:duration-300 group-hover:w-fit z-[100]`}>
                    {val?.name}
                  </h2>
                </Link>
              )
            })}

          </div>

          {/* Bottom Section */}
          <div className="p-4 mt-auto border-t border-red-600 dark:border-slate-800 bg-red-700 dark:bg-slate-900 flex flex-col gap-2">
            <DarkModeToggle isSidebarOpen={open} />

            <a href="/logout" className={`group flex items-center text-sm rounded-xl text-red-200 hover:bg-red-600 hover:text-white transition-all duration-300 ${!open ? "justify-center p-2" : "gap-4 p-3"}`}>
              <div className="shrink-0 flex justify-center items-center w-8 h-8 rounded-lg bg-red-800 dark:bg-slate-800 group-hover:bg-red-500 dark:group-hover:bg-slate-700 transition-colors">
                <HiLogout className="w-5 h-5 text-red-200 opacity-70 group-hover:opacity-100" />
              </div>
              <h2 className={`font-medium whitespace-pre transition-all duration-500 overflow-hidden ${open ? "w-full opacity-100" : "w-0 opacity-0 translate-x-4 hidden"
                }`}>Logout</h2>
              <h2 className={`${open && "hidden"} absolute left-20 bg-gray-900 font-semibold whitespace-pre text-white rounded-md shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-3 group-hover:py-2 group-hover:duration-300 group-hover:w-fit z-[100]`}>
                Logout
              </h2>
            </a>
          </div>

        </div>
      )}

      {/* Dummy div to offset absolute sidebar in desktop view so content doesn't hide behind it */}
      {!isMobile && (
        <div className={`transition-all duration-500 ${open ? 'w-64' : 'w-20'} shrink-0 hidden md:block`}></div>
      )}

    </div>
  );
}