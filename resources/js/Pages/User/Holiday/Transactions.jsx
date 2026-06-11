import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Transactions({ transactions = {} }) {
    const rows = transactions.data ?? [];
    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const formatDateTime = (date) => date
        ? new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';

    return (
        <UserLayout>
            <Head title="Transaksi Hari Raya" />
            <div className="mx-auto max-w-6xl space-y-6">
                <h1 className="text-2xl font-semibold text-[#1A1A1A]">Transaksi Hari Raya</h1>
                <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E5E3DF]">
                            <thead className="bg-[#FAFAF9]"><tr><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Program</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tipe</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tanggal</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Nominal</th></tr></thead>
                            <tbody className="divide-y divide-[#E5E3DF]">
                                {rows.length > 0 ? rows.map((trx) => (
                                    <tr key={trx.id}><td className="px-4 py-3 text-sm font-semibold">{trx.holiday_program?.name ?? '-'}</td><td className="px-4 py-3 text-sm">{trx.type}</td><td className="px-4 py-3 text-sm">{trx.status}</td><td className="px-4 py-3 text-sm">{formatDateTime(trx.created_at)}</td><td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(trx.amount)}</td></tr>
                                )) : <tr><td colSpan="5" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada transaksi hari raya.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
