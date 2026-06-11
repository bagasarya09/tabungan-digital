import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function DepositVerification() {
    return (
        <AdminLayout>
            <Head title="Verifikasi Setoran Hari Raya" />
            <div className="mx-auto max-w-7xl rounded-xl border border-[#E5E3DF] bg-white p-6">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">Verifikasi Setoran Hari Raya</h1>
                <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                    Daftar setoran hari raya dengan saving_type holiday akan diverifikasi di sini.
                </p>
            </div>
        </AdminLayout>
    );
}
