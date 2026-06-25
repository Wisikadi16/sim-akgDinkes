import React, { useEffect, useState } from "react";
import { HiSun, HiMoon } from "react-icons/hi";

export default function DarkModeToggle({ isSidebarOpen }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Cek preferensi awal dari localStorage atau OS
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDark(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <button 
            onClick={toggleDarkMode}
            className={`group flex items-center text-sm rounded-xl text-red-200 hover:bg-red-600 hover:text-white transition-all duration-300 w-full ${!isSidebarOpen ? "justify-center p-2" : "gap-4 p-3"}`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <div className="shrink-0 flex justify-center items-center w-8 h-8 rounded-lg bg-red-800 group-hover:bg-red-500 transition-colors relative overflow-hidden">
                <div className={`transition-transform duration-500 absolute ${isDark ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                    <HiMoon className="w-5 h-5 text-red-200 group-hover:text-white" />
                </div>
                <div className={`transition-transform duration-500 absolute ${!isDark ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}>
                    <HiSun className="w-5 h-5 text-amber-300 group-hover:text-amber-200" />
                </div>
            </div>
            
            <h2 className={`font-medium whitespace-pre transition-all duration-500 overflow-hidden ${isSidebarOpen ? "w-full opacity-100 text-left" : "w-0 opacity-0 translate-x-4 hidden"}`}>
                {isDark ? "" : ""}
            </h2>
            
            <h2 className={`${isSidebarOpen && "hidden"} absolute left-20 bg-gray-900 font-semibold whitespace-pre text-white rounded-md shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-3 group-hover:py-2 group-hover:duration-300 group-hover:w-fit z-[100]`}>
                {isDark ? "Terang" : "Gelap"}
            </h2>
        </button>
    );
}
