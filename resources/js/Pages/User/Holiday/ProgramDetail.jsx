import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function ProgramDetail({ program, participant, transactions = [], balance = 0 }) {
    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const formatDate = (date) => date
        ? new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID')
        : '-';
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
            <Head title="Detail Program Hari Raya" />
            <div className="mx-auto max-w-6xl space-y-6">
                <div className="rounded-xl border border-[#E5E3DF] bg-white p-6">
                    <p className="text-sm font-medium text-[#787671]">Detail Program</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">{program?.name}</h1>
                    <p className="mt-2 text-sm text-[#5D5B54]">{formatDate(program?.start_date)} - {formatDate(program?.holiday_date)}</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg bg-[#F6F5F4] p-4"><p className="text-sm text-[#787671]">Saldo</p><p className="mt-1 text-xl font-semibold">{formatRupiah(balance)}</p></div>
                        <div className="rounded-lg bg-[#F6F5F4] p-4"><p className="text-sm text-[#787671]">Status Peserta</p><p className="mt-1 text-xl font-semibold">{participant?.status}</p></div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                    <div className="border-b border-[#E5E3DF] px-4 py-4"><h2 className="text-lg font-semibold">Riwayat Transaksi</h2></div>
                    <div className="divide-y divide-[#E5E3DF]">
                        {transactions.length > 0 ? transactions.map((trx) => (
                            <div key={trx.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                <div><p className="text-sm font-semibold">{trx.type}</p><p className="text-xs text-[#787671]">{trx.status} - {formatDateTime(trx.created_at)}</p><p className="text-xs text-[#787671]">{trx.note ?? '-'}</p></div>
                                <p className="text-sm font-semibold">{formatRupiah(trx.amount)}</p>
                            </div>
                        )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada transaksi.</p>}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
