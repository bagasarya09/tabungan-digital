import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout
            title="Verifikasi email"
            subtitle="Kami sudah mengirim link verifikasi. Cek email Anda sebelum melanjutkan."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-lg border border-[#DCFCE7] bg-[#DCFCE7] px-4 py-3 text-sm text-[#15803D]">
                    Link verifikasi baru sudah dikirim ke email Anda.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-lg bg-[#16A34A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-60"
                >
                    {processing ? 'Mengirim...' : 'Kirim Ulang Verifikasi'}
                </button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-center text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]"
                >
                    Logout
                </Link>
            </form>
        </GuestLayout>
    );
}
