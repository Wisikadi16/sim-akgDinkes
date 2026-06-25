import React from "react";

export default function ElegantStatCard({ title, value, icon, isNeutral }) {
    const iconThemeClass = isNeutral 
        ? "bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-colors" 
        : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 transition-colors";

    const shadowClass = isNeutral
        ? "shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600"
        : "shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-slate-600";

    return (
        <div className={`group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 ${shadowClass} transition-all duration-300 flex flex-col justify-between h-full cursor-default relative overflow-hidden`}>
            
            {/* Top row: Title and Icon */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide transition-colors">{title}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${iconThemeClass}`}>
                    {React.cloneElement(icon, { className: "w-4 h-4" })}
                </div>
            </div>
            
            {/* Bottom row: Value */}
            <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-colors">{value}</h3>
            </div>
        </div>
    );
}
