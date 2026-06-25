import React, { useState, useEffect } from 'react';

export default function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        
        // Optional: Convert to 12-hour format if needed, but 24-hour is also fine
        const hours12 = (date.getHours() % 12) || 12;
        const hours12Str = hours12.toString().padStart(2, '0');

        return `${hours12Str}:${minutes}:${seconds} ${ampm}`;
    };

    const formatDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm tracking-tight">{formatDate(time)}</span>
            <span className="text-slate-300 dark:text-slate-600 transition-colors">|</span>
            <span className="text-sm tracking-tight">{formatTime(time)}</span>
        </div>
    );
}
