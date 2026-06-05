import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Buat password baru"
            subtitle="Gunakan password baru yang aman agar akun tabungan tetap terlindungi."
        >
            <Head title="Reset Password" />

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
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
                        Password Baru
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoFocus
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
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
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Menyimpan...' : 'Reset Password'}
                </button>
            </form>
        </GuestLayout>
    );
}
