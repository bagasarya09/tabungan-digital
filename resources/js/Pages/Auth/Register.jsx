import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Buat akun baru"
            subtitle="Mulai buat target tabungan dan pantau progress Anda."
        >
            <Head title="Daftar" />

            {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Registrasi belum berhasil. Periksa kembali data yang ditandai.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="text-sm font-medium text-[#1A1A1A]">
                        Nama
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="Nama lengkap"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="Minimal 8 karakter"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-[#1A1A1A]">
                        Konfirmasi Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="Ulangi password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Mendaftarkan...' : 'Daftar'}
                </button>

                <p className="text-center text-sm text-[#5D5B54]">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="font-semibold text-[#15803D] hover:underline">
                        Masuk
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
