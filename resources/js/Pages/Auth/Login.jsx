import { useEffect } from 'react';
// import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {useParams} from 'react-router-dom';

export default function Login({ status, canResetPassword, daftar }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        password: '',
        // remember: false,
    });

    // const {status2} = useParams();
    console.log(daftar)
    console.log(processing)
    console.log(data)
    // console.log(status2)

    // useEffect(() => {
    //     return () => {
    //         reset('password');
    //     };
    // }, []);

    const submit = (e) => {
        e.preventDefault();

        if(daftar!=null){
            post(route('auth.cek_daftar'));
        }
        else{
            post(route('auth.cek_login'));
        }
    };

    return (
        <GuestLayout>
            {/* <Head title="Log in" /> */}

            {status && <div className="flex justify-center mb-4 font-medium text-md text-red-300">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    {
                        daftar &&
                        <div className='flex justify-center text-[26px] mb-3'>Daftar</div>
                    }
                    {
                        daftar ==null &&
                        <div className='flex justify-center text-[26px] mb-3'>Login</div>
                    }
                    {
                        daftar &&
                        <div>
                            <InputLabel htmlFor="name" value="Nama" />

                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </div>
                    }

                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('username', e.target.value)}
                    />

                    {/* <InputError message={errors.username} className="mt-2" /> */}
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    {/* <InputError message={errors.password} className="mt-2" /> */}
                </div>

                {/* <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div> */}

                <div className="flex items-center justify-center mt-4">
                    {/* {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    )} */}

                    <PrimaryButton className="ml-4" disabled={processing}>
                        {
                            daftar &&
                            <div>Daftar</div>
                        }
                        {
                            daftar == null &&
                            <div>Log in</div>
                        }
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
