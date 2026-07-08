import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, daftar }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing } = useForm({
        name: '',
        username: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (daftar != null) {
            post(route('auth.cek_daftar'));
        } else {
            post(route('auth.cek_login'));
        }
    };

    return (
        <GuestLayout>
            <Head title={daftar ? "Daftar Akun" : "Log in"} />

            {status && (
                <div className="flex justify-center mb-6 font-medium text-sm text-red-600 bg-red-50/80 backdrop-blur-sm py-3 px-4 rounded-xl border border-red-200 animate-pulse">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 sm:px-4 py-2">
                {/* Header Teks Luwes */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 tracking-tight">
                        {daftar ? 'Buat Akun Baru' : 'Selamat Datang'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        {daftar
                            ? 'Silakan lengkapi data dirimu di bawah ini'
                            : 'Silakan masuk untuk melanjutkan'}
                    </p>
                </div>

                <div className="space-y-5">
                    {daftar && (
                        <div className="group">
                            <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-600 font-semibold ml-1 mb-1.5 transition-colors group-focus-within:text-red-600" />
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 hover:border-red-300 transition-all duration-300 shadow-sm"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkapmu"
                            />
                        </div>
                    )}

                    <div className="group">
                        <InputLabel htmlFor="username" value="Username" className="text-gray-600 font-semibold ml-1 mb-1.5 transition-colors group-focus-within:text-red-600" />
                        <TextInput
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 hover:border-red-300 transition-all duration-300 shadow-sm"
                            autoComplete="username"
                            isFocused={!daftar}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Masukkan username"
                        />
                    </div>

                    <div className="group">
                        <InputLabel htmlFor="password" value="Password" className="text-gray-600 font-semibold ml-1 mb-1.5 transition-colors group-focus-within:text-red-600" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 hover:border-red-300 transition-all duration-300 shadow-sm"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors mt-0.5"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <PrimaryButton
                        className="w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:from-red-700 active:to-red-800 rounded-2xl shadow-lg shadow-red-500/30 text-white font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-red-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : (daftar ? 'Daftar Sekarang' : 'Log in')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}