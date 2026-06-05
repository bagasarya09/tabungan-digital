import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Masuk ke akun"
            subtitle="Lanjutkan mengelola target tabungan dan transaksi Anda."
        >
            <Head title="Masuk" />

            {status && (
                <div className="mb-4 rounded-lg border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-3 text-sm text-[#15803D]">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-[#1A1A1A]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="nama@email.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="Masukkan password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-[#5D5B54]">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-medium text-[#15803D] hover:underline"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>

                <p className="text-center text-sm text-[#5D5B54]">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="font-semibold text-[#15803D] hover:underline">
                        Daftar
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
