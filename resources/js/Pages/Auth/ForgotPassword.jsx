import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout
            title="Reset password"
            subtitle="Masukkan email akun Anda. Kami akan mengirim link untuk membuat password baru."
        >
            <Head title="Lupa Password" />

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
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="nama@email.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>

                <Link href={route('login')} className="block text-center text-sm font-semibold text-[#15803D] hover:underline">
                    Kembali ke halaman masuk
                </Link>
            </form>
        </GuestLayout>
    );
}
