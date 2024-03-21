import React , {useEffect}from "react";
import { Link } from "react-router-dom";

import {HiMenuAlt2} from "react-icons/hi";
import { useState } from "react";

export default function Sidebar({auth}) {
  // console.log(auth)
  const menu = 
    [
      auth.role=="admin"||auth.role=="yankes"?{name:"Dashboard", nl:"dashboard", link:'/dashboard', icon:'/./assets/img/dashboard.png', classname:'w-[30px] h-[30px]'}:null,
      auth.role=="admin"||auth.role=="Tim Ambulan"||auth.role=="Operator"?{name:"Laporan", nl:"laporan", link:'/laporan', icon:'/./assets/img/laporan.png', classname:'w-[50px]'}:null,
      auth.role=="admin"||auth.role=="Tim Ambulan"||auth.role=="Operator"?{name:"Order", nl:"order", link:'/order', icon:'/./assets/img/order.png', classname:'w-[50px]'}:null,
      auth.role=="admin"||auth.role=="Tim Ambulan"?{name:"Catatan Medis", nl:"catatan_medis", link:'/catatan_medis', icon:'/./assets/img/catatan_medis.png', classname:'w-[26px] h-[24px] ml-[1px]'}:null,
      auth.role=="admin"?{name:"Pasien", nl:"pasien", link:'/pasien', icon:'/./assets/img/pasien.png', classname:'w-[30px] h-[28px]'}:null,
      auth.role=="admin"?{name:"Admin", nl:"admin", link:'/admin', icon:'/./assets/img/admin.png', classname:'w-[30px] h-[28px]'}:null,
      auth.role=="admin"||auth.role=="yankes"||auth.role=="Tim Ambulan"?{name:"Petugas", nl:"petugas", link:'/petugas', icon:'/./assets/img/petugas.png', classname:'w-[24px] h-[24px]'}:null,
      auth.role=="admin"||auth.role=="yankes"?{name:"Tim Ambulan", nl:"tim_ambulan", link:'/tim_ambulan', icon:'/./assets/img/ambulan.png', classname:'w-[38px] h-[32px]'}:null,
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
    
    // <section className="flex gap-6">
    <div className="z-10">
        {
          isMobile &&
          <>
            <div className="py-3 flex justify-end">
              <HiMenuAlt2 size={26} className="cursor-pointer" onClick={()=>set_open_mobile(!open_mobile)} />
            </div>
            {open_mobile &&
              <div className="flex flex-wrap bg-red-500">
                <div className={`w-[33.33%] mb-1`}>
                  <Link to="/dashboard" 
                    className={`group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md`}
                    onClick={(e)=>set_link("/dashboard")}>
                      <img src="/./assets/img/user.png" className="w-[27px]"></img>
                      <div className="truncate">
                        <h2 className={`text-white`}>{auth.name}</h2>
                      </div>
                      <h2 className={`${open && "hidden"} absolute left-48 bg-black font-semibold whitespace-pre text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>{auth.name}</h2>
                  </Link>
                </div>
                {filter_menu?.map((val, i) => (
                  <div key={i} className={`w-[33.33%] mb-1`}>
                    <Link
                      to={val?.link}
                      className={`group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md ${val?.nl.toLowerCase() === link && "bg-black"}`}
                      onClick={(e) => set_link(val?.nl.toLowerCase())}>
                      <div className={`${open ? "w-[15%]" : "w-[100%]"}`}>
                        <img src={val?.icon} className={val?.classname} alt={val?.name}></img>
                      </div>
                      <h2 className={`text-white`}>{val?.name}</h2>
                    </Link>
                  </div>
                ))}
                <div className={`w-[33.33%] mb-1`}>
                  <a href="/logout" className="group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md cursor-pointer">
                    <div className={`${open && "w-[15%]"} ${!open && "w-[100%]"}`}>
                      <img src="/./assets/img/logout.png" className="w-[30px] h-[30px]"></img>
                    </div>
                    <h2 className={`text-white`}>Logout</h2>
                  </a>
                </div>
              </div>
            }
            
          </>
        }
        {!isMobile &&
        <div className={`bg-red-500 min-h-full ${open ? 'w-[200px]' : 'w-[80px]'} duration text-white px-4`}>
      
          <div className="py-3 flex justify-end">
            <HiMenuAlt2 size={26} className="cursor-pointer" onClick={()=>set_open(!open)} />
          </div>
       
          <div className="mt-4 flex flex-col gap-4 relative">
            <Link to="/dashboard" 
                className={`group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md`}
                onClick={(e)=>set_link("/dashboard")}>
                  <img src="/./assets/img/user.png" className="w-[27px]"></img>
                  <div className="truncate">
                    <h2 className={`whitespace-pre duration-500 ${open && "w-[85%]"} ${!open && "w-[0%] opacity-0 translate-x-28 overflow-hidden"}`}>{auth.name}</h2>
                  </div>
                  <h2 className={`${open && "hidden"} absolute left-48 bg-black font-semibold whitespace-pre text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>{auth.name}</h2>
              </Link>
            {
              filter_menu?.map((val, i)=>(
                <Link to={val?.link} key={i} 
                  className={`group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md ${val?.nl?.toLowerCase()==link && "bg-black"}`}
                  onClick={(e)=>set_link(val?.nl?.toLowerCase())}>
                    <div className={`${open && "w-[15%]"} ${!open && "w-[100%]"}`}>
                      <img src={val?.icon} className={val?.classname}></img>
                    </div>
                    <h2 className={`whitespace-pre duration-500 ${open && "w-[85%]"} ${!open && "w-[0%] opacity-0 translate-x-28 overflow-hidden"}`}>{val?.name}</h2>
                    <h2 className={`${open && "hidden"} absolute left-48 bg-black font-semibold whitespace-pre text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>{val?.name}</h2>
                </Link>
              ))
            }
            <a href="/logout" className="group flex items-center justify-center text sm gap-3.5 p-1 hover:bg-gray-800 rounded-md cursor-pointer">
              <div className={`${open && "w-[15%]"} ${!open && "w-[100%]"}`}>
                <img src="/./assets/img/logout.png" className="w-[30px] h-[30px]"></img>
              </div>
              <h2 className={`whitespace-pre duration-500 ${open && "w-[85%]"} ${!open && "w-[0%] opacity-0 translate-x-28 overflow-hidden"}`}>Logout</h2>
              <h2 className={`${open && "hidden"} absolute left-48 bg-black font-semibold whitespace-pre text-white rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>Logout</h2>
            </a>
          </div>
        </div>
        }
      
    </div>
  );
}
