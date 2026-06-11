import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Dashboard({ stats = {}, programs = [], latestTransactions = [] }) {
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
    const Stat = ({ label, value }) => (
        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
            <p className="text-sm text-[#787671]">{label}</p>
            <p className="mt-2 text-xl font-semibold text-[#1A1A1A]">{value}</p>
        </div>
    );

    return (
        <UserLayout>
            <Head title="Dashboard Hari Raya" />
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Tabungan Hari Raya</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Dashboard Hari Raya</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">Ringkasan program dan saldo hari raya Anda.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Program Diikuti" value={stats.programCount || 0} />
                    <Stat label="Program Aktif" value={stats.activeProgramCount || 0} />
                    <Stat label="Total Saldo" value={formatRupiah(stats.totalBalance)} />
                    <Stat label="Total Setoran" value={formatRupiah(stats.totalDeposit)} />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-[#E5E3DF] bg-white">
                        <div className="border-b border-[#E5E3DF] px-4 py-4"><h2 className="text-lg font-semibold">Program Saya</h2></div>
                        <div className="divide-y divide-[#E5E3DF]">
                            {programs.length > 0 ? programs.map((program) => (
                                <Link key={program.id} href={`/holiday/programs/${program.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[#FAFAF9]">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{program.name}</p>
                                        <p className="text-xs text-[#787671]">{program.status} - {program.participant_status}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-[#15803D]">{formatRupiah(program.balance)}</p>
                                </Link>
                            )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Anda belum terdaftar di program hari raya.</p>}
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E3DF] bg-white">
                        <div className="border-b border-[#E5E3DF] px-4 py-4"><h2 className="text-lg font-semibold">Transaksi Terbaru</h2></div>
                        <div className="divide-y divide-[#E5E3DF]">
                            {latestTransactions.length > 0 ? latestTransactions.map((trx) => (
                                <div key={trx.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{trx.holiday_program?.name ?? '-'}</p>
                                        <p className="text-xs text-[#787671]">{trx.type} - {trx.status}</p>
                                        <p className="text-xs text-[#787671]">{formatDateTime(trx.created_at)}</p>
                                    </div>
                                    <p className="text-sm font-semibold">{formatRupiah(trx.amount)}</p>
                                </div>
                            )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada transaksi.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
