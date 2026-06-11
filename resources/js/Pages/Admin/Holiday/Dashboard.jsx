import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats = {}, latestTransactions = [], latestPrograms = [] }) {
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

    const Stat = ({ label, value }) => (
        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
            <p className="text-sm text-[#787671]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#1A1A1A]">{value}</p>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Dashboard Hari Raya" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Admin Hari Raya</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Dashboard Hari Raya</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">Ringkasan data dari program, peserta, dan transaksi hari raya.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Stat label="Total Program" value={stats.totalPrograms || 0} />
                    <Stat label="Program Aktif" value={stats.activePrograms || 0} />
                    <Stat label="Peserta Aktif" value={stats.activeParticipants || 0} />
                    <Stat label="Total Setoran Approved" value={formatRupiah(stats.totalDeposit)} />
                    <Stat label="Total Penarikan Approved" value={formatRupiah(stats.totalWithdraw)} />
                    <Stat label="Transaksi Pending" value={stats.pendingTransactions || 0} />
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-xl border border-[#E5E3DF] bg-white">
                        <div className="border-b border-[#E5E3DF] px-4 py-4">
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Transaksi Terbaru</h2>
                        </div>
                        <div className="divide-y divide-[#E5E3DF]">
                            {latestTransactions.length > 0 ? latestTransactions.map((trx) => (
                                <div key={trx.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{trx.user?.name ?? '-'}</p>
                                        <p className="text-xs text-[#787671]">{trx.holiday_program?.name ?? '-'} - {trx.type} - {trx.status}</p>
                                        <p className="text-xs text-[#787671]">{formatDateTime(trx.created_at)}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-[#1A1A1A]">{formatRupiah(trx.amount)}</p>
                                </div>
                            )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada transaksi holiday.</p>}
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E3DF] bg-white">
                        <div className="border-b border-[#E5E3DF] px-4 py-4">
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Program Terbaru</h2>
                        </div>
                        <div className="divide-y divide-[#E5E3DF]">
                            {latestPrograms.length > 0 ? latestPrograms.map((program) => (
                                <div key={program.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{program.name}</p>
                                        <p className="text-xs text-[#787671]">{formatDate(program.start_date)} - {formatDate(program.holiday_date)}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-[#15803D]">{program.participants_count || 0} peserta</p>
                                </div>
                            )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada program.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
