import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import DataTable from "react-data-table-component";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);
const manualColors = [
  "#ef4444", // Merah
  "#3b82f6", // Biru
  "#10b981", // Hijau
  "#f59e0b", // Kuning
  "#8b5cf6", // Ungu
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#14b8a6", // Teal
  "#6366f1", // Indigo
  "#eab308", // Yellow
  "#d946ef", // Fuchsia
  "#0ea5e9", // Light Blue
  "#10b981", // Emerald
  "#a855f7", // Purple Tua
  "#ef4444", "#3b82f6", "#10b981", // Looping darurat
];

import ElegantStatCard from "../../Components/ElegantStatCard";
import LiveClock from "../../Components/LiveClock";

export default function Dashboard() {
  const [dataDash, setDataDash] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const year = new Date().getFullYear();
  const nama_bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][new Date().getMonth()];

  useEffect(() => {
    let isMounted = true;
    axios.post(window.location.origin + '/ref_dashboard', { order: true })
      .then(response => {
        if (isMounted) {
          setDataDash(response.data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Gagal memuat dashboard:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false };
  }, []);

  const columnsRekap = [
    { name: 'Tanggal', selector: row => row.tanggal, sortable: true },
    { name: 'Total Order', selector: row => row.total_order, center: true, sortable: true },
  ];

  const columnsTim = [
    { name: 'Nama Tim', selector: row => row.nama_tim, sortable: true },
    { name: 'Order Hari Ini', selector: row => row.hari_ini, center: true, sortable: true },
    { name: 'Bulan Ini', selector: row => row.bulan_ini, center: true, sortable: true },
    { name: 'Tahun Ini', selector: row => row.tahun_ini, center: true, sortable: true },
  ];
  
  if (isLoading || !dataDash) {
    return <div className="p-10 text-center font-bold text-gray-500 animate-pulse">Menyiapkan Dashboard SIM-AKG...</div>;
  }

  const chartDataBerwarna = {
    ...dataDash.grafik_hari_ini,
    datasets: dataDash.grafik_hari_ini.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor: manualColors[index % manualColors.length],
      backgroundColor: manualColors[index % manualColors.length],
      fill: false,
      borderWidth: 2,
      pointRadius: 3,
    }))
  };

  return (
    <div className="w-full flex flex-col gap-7 animate-fade-in pb-16">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-5 transition-colors duration-300">
        <div>
          <h1 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-300">Monitoring Order Ambulan Real-time & Histori</p>
        </div>
        
        {/* Live Clock Component */}
        <div className="flex items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
           <LiveClock />
        </div>
      </div>

      {/* KPI CARDS MENGGUNAKAN TEMA MERAH ELEGANT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ElegantStatCard
          title="Total Armada"
          value={dataDash.kpi?.total_armada || 0}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
        />
        <ElegantStatCard
          title="Order Hari Ini"
          value={dataDash.kpi?.total_hari_ini || 0}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <ElegantStatCard
          title={`Order ${nama_bulan}`}
          value={dataDash.kpi?.total_bulan_ini || 0}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15z" /></svg>}
        />
        <ElegantStatCard
          title={`Order Thn ${year}`}
          value={dataDash.kpi?.total_tahun_ini || 0}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>}
        />
      </div>

      {/* ATAS: GRAFIK HARI INI (FULL WIDTH) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight transition-colors duration-300">Trafik Order per Jam (Hari Ini)</h2>
          <span className="flex items-center gap-2 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-full animate-pulse border border-red-200 dark:border-red-500/20 uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span> Live
          </span>
        </div>
        <div className="h-[600px]">
          <Line
            data={chartDataBerwarna}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  align: 'start',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 6,
                    font: { size: 9 },
                    padding: 10,
                    color: isDarkMode ? '#f8fafc' : '#64748b'
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  suggestedMax: 5, // Memaksa grafik menampilkan minimal sampai angka 5 ke atas
                  grid: { color: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : '#f1f5f9' },
                  ticks: { precision: 0, color: isDarkMode ? '#f8fafc' : '#64748b' } // Memaksa sumbu Y hanya menampilkan angka bulat (integer)
                },
                x: { 
                  grid: { display: false },
                  ticks: { color: isDarkMode ? '#f8fafc' : '#64748b' }
                }
              },
              elements: {
                line: { tension: 0.4, borderWidth: 2 }
              }
            }}
          />
        </div>
      </div>

      {/* BAWAH: TABEL HISTORI (1/3) & RINCIAN TIM (2/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">

        {/* KIRI (1/3): Tabel Rekap Histori */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full transition-colors duration-300">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight mb-4 transition-colors duration-300">Rekap Histori (7 Hari)</h2>
          <div className="flex-1 overflow-auto border border-slate-100 dark:border-slate-700/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
            <DataTable 
              columns={columnsRekap} 
              data={dataDash.tabel_rekap_histori} 
              highlightOnHover 
              noHeader 
              striped 
              customStyles={{
                table: {
                  style: {
                    backgroundColor: 'transparent',
                  }
                },
                headRow: {
                  style: {
                    backgroundColor: 'var(--dt-header-bg, #f8fafc)',
                    color: 'var(--dt-header-text, #64748b)',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'var(--dt-border, #f1f5f9)'
                  }
                },
                rows: {
                  style: {
                    fontSize: '15px',
                    fontWeight: '500',
                    color: 'var(--dt-row-text, #334155)',
                    backgroundColor: 'transparent',
                    minHeight: '75px', // Membuat baris jauh lebih tinggi agar mengisi ruang kosong

                    '&:not(:last-of-type)': {
                      borderBottomStyle: 'solid',
                      borderBottomWidth: '1px',
                      borderBottomColor: 'var(--dt-border, #f1f5f9)'
                    }
                  },
                  stripedStyle: {
                    color: 'var(--dt-row-text, #334155)',
                    backgroundColor: 'var(--dt-striped-bg, #f8fafc)'
                  },
                  highlightOnHoverStyle: {
                    color: 'var(--dt-hover-text, #0f172a)',
                    backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                    transitionDuration: '0.15s',
                    transitionProperty: 'background-color',
                    borderBottomColor: 'var(--dt-border)',
                    outlineStyle: 'none',
                  }
                },
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center transition-colors duration-300">*Data histori diperbarui setiap pergantian hari</p>

            <a href="/laporan" className="w-full py-2 bg-red-500 hover:bg-red-600 border border-red-200 dark:border-red-600 text-white text-xs font-bold text-center rounded-lg transition-colors duration-200">
              Lihat Selengkapnya di Menu Laporan &rarr;
            </a>
          </div>
        </div>

        {/* KANAN (2/3): Rincian Per Tim */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-2xl px-6 py-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full h-full transition-colors duration-300">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight mb-4 transition-colors duration-300">Rincian Performa Tim Ambulan</h2>
          <div className="border border-slate-100 dark:border-slate-700/50 rounded-xl overflow-hidden transition-colors duration-300">
            <DataTable
              columns={columnsTim}
              data={dataDash.rincian_tim}
              pagination
              highlightOnHover
              responsive
              striped
              customStyles={{
                table: {
                  style: {
                    backgroundColor: 'transparent',
                  }
                },
                headRow: {
                  style: {
                    backgroundColor: 'var(--dt-header-bg, #f8fafc)',
                    color: 'var(--dt-header-text, #64748b)',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottomWidth: '1px',
                    borderBottomColor: 'var(--dt-border, #f1f5f9)'
                  }
                },
                rows: {
                  style: {
                    fontSize: '14px',
                    color: 'var(--dt-row-text, #334155)',
                    backgroundColor: 'transparent',
                    minHeight: '64px',

                    '&:not(:last-of-type)': {
                      borderBottomStyle: 'solid',
                      borderBottomWidth: '1px',
                      borderBottomColor: 'var(--dt-border, #f1f5f9)'
                    }
                  },
                  stripedStyle: {
                    color: 'var(--dt-row-text, #334155)',
                    backgroundColor: 'var(--dt-striped-bg, #f8fafc)'
                  },
                  highlightOnHoverStyle: {
                    color: 'var(--dt-hover-text, #0f172a)',
                    backgroundColor: 'var(--dt-hover-bg, #f1f5f9)',
                    transitionDuration: '0.15s',
                    transitionProperty: 'background-color',
                    borderBottomColor: 'var(--dt-border)',
                    outlineStyle: 'none',
                  }
                },
                pagination: {
                  style: {
                    backgroundColor: 'transparent',
                    color: 'var(--dt-row-text, #334155)',
                    borderTopColor: 'var(--dt-border, #f1f5f9)',
                  },
                  pageButtonsStyle: {
                    color: 'var(--dt-row-text, #334155)',
                    fill: 'var(--dt-row-text, #334155)',
                    backgroundColor: 'transparent',
                    '&:disabled': {
                      cursor: 'unset',
                      color: 'var(--dt-border)',
                      fill: 'var(--dt-border)',
                    },
                    '&:hover:not(:disabled)': {
                      backgroundColor: 'var(--dt-hover-bg)',
                    },
                    '&:focus': {
                      outline: 'none',
                      backgroundColor: 'var(--dt-hover-bg)',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
