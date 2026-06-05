import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Konfirmasi password"
            subtitle="Area ini membutuhkan verifikasi ulang untuk menjaga keamanan akun."
        >
            <Head title="Konfirmasi Password" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#DCFCE7]"
                        placeholder="Masukkan password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Memeriksa...' : 'Konfirmasi'}
                </button>
            </form>
        </GuestLayout>
    );
}
