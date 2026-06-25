import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-8 sm:pt-0 relative overflow-hidden bg-red-500 font-sans selection:bg-red-200 selection:text-red-900">

            {/* Latar Belakang Gambar & Gradasi Merah Cerah */}
            <div className="absolute inset-0 z-0">
                {/* Gambar Background Medis/Ambulan */}
                <img
                    src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=2070&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                {/* Gradasi merah cerah dengan opacity yang diturunkan */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/60 via-red-500/50 to-rose-500/60"></div>
            </div>

            {/* Efek Cahaya Membulat (Glowing Orbs) biar luwes */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Konten Utama */}
            <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-0 mt-4 sm:mt-0">

                {/* Bagian Judul Atas (Icon Love Dihapus) */}
                <div className="text-center mb-8">
                    <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl text-white">
                        SIM Ambulan Hebat
                    </h1>
                </div>

                {/* Kotak Putih Form (Glassmorphism + Sangat Luwes) */}
                <div className="w-full sm:max-w-md px-6 py-8 sm:px-10 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl sm:rounded-[2rem] border border-white/50 transition-all duration-300">
                    {children}
                </div>

            </div>
        </div>
    );
}
