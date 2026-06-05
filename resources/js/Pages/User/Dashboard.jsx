import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import UserLayout from '@/Layouts/UserLayout';
import DashboardChartCard from '@/Components/DashboardChartCard';
import StatCard from '@/Components/StatCard';

const COLORS = ['#16A34A', '#0075DE', '#DD5B00', '#E03131'];

export default function Dashboard({
    stats,
    latestGoals,
    latestTransactions,
    chartFilters,
    transactionChartData = [],
    statusChartData = [],
    balanceTrendData = [],
}) {
    const [filters, setFilters] = useState({
        period: chartFilters?.period || 'weekly',
        start_date: chartFilters?.start_date || '',
        end_date: chartFilters?.end_date || '',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    const applyChartFilter = (e) => {
        e.preventDefault();

        router.get('/dashboard', filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const statusClass = {
        active: 'bg-[#DCFCE7] text-[#15803D]',
        completed: 'bg-blue-50 text-blue-700',
        cancelled: 'bg-red-50 text-red-700',
        pending: 'bg-yellow-50 text-yellow-700',
        approved: 'bg-[#DCFCE7] text-[#15803D]',
        rejected: 'bg-red-50 text-red-700',
    };

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Dashboard</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">
                        Ringkasan tabungan Anda
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5D5B54]">
                        Filter chart berdasarkan periode untuk melihat pola setoran, penarikan, dan saldo berjalan.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard title="Total Saldo" value={formatRupiah(stats.totalBalance)} icon="Rp" />
                    <StatCard title="Total Target" value={stats.totalGoals} icon="T" tone="blue" />
                    <StatCard title="Target Aktif" value={stats.activeGoals} icon="A" />
                    <StatCard title="Setoran Pending" value={stats.pendingTransactions} icon="P" tone="yellow" />
                </div>

                <form onSubmit={applyChartFilter} className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <div className="grid gap-3 md:grid-cols-4">
                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Periode Chart</label>
                            <select
                                value={filters.period}
                                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="today">Hari ini</option>
                                <option value="weekly">Mingguan</option>
                                <option value="monthly">Bulanan</option>
                                <option value="yearly">Tahunan</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {filters.period === 'custom' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-[#1A1A1A]">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={filters.start_date}
                                        onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#1A1A1A]">Tanggal Akhir</label>
                                    <input
                                        type="date"
                                        value={filters.end_date}
                                        onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-end">
                            <button type="submit" className="w-full rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                Terapkan Filter
                            </button>
                        </div>
                    </div>
                </form>

                <div className="grid gap-4 xl:grid-cols-3">
                    <DashboardChartCard title="Setoran & Penarikan" description="Nominal transaksi berdasarkan tanggal.">
                        {transactionChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={transactionChartData}>
                                    <CartesianGrid stroke="#E5E3DF" strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Bar dataKey="deposit" name="Setoran" fill="#16A34A" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="withdraw" name="Penarikan" fill="#DD5B00" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada transaksi pada periode ini.</div>
                        )}
                    </DashboardChartCard>

                    <DashboardChartCard title="Status Target" description="Komposisi target tabungan.">
                        {statusChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={92} label>
                                        {statusChartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada target tabungan.</div>
                        )}
                    </DashboardChartCard>

                    <DashboardChartCard title="Trend Saldo" description="Saldo berjalan dari transaksi approved.">
                        {balanceTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={balanceTrendData}>
                                    <CartesianGrid stroke="#E5E3DF" strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Line type="monotone" dataKey="balance" name="Saldo" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada saldo berjalan pada periode ini.</div>
                        )}
                    </DashboardChartCard>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-[#1A1A1A]">Target Terbaru</h2>
                                <p className="text-sm text-[#787671]">Card target dengan progress hijau.</p>
                            </div>
                            <Link href="/saving-goals" className="rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm font-medium text-[#15803D] hover:bg-[#DCFCE7]">Lihat Semua</Link>
                        </div>

                        <div className="space-y-3">
                            {latestGoals.length > 0 ? latestGoals.map((goal) => {
                                const progress = goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;

                                return (
                                    <div key={goal.id} className="rounded-xl border border-[#E5E3DF] bg-[#FAFAF9] p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold text-[#1A1A1A]">{goal.title}</h3>
                                                <p className="mt-1 text-sm text-[#5D5B54]">{formatRupiah(goal.current_amount)} / {formatRupiah(goal.target_amount)}</p>
                                            </div>
                                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass[goal.status] ?? 'bg-gray-100 text-gray-700'}`}>{goal.status}</span>
                                        </div>
                                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E5E3DF]">
                                            <div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${progress}%` }} />
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="rounded-xl border border-dashed border-[#E5E3DF] p-6 text-center text-sm text-[#787671]">Belum ada target tabungan.</div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold text-[#1A1A1A]">Transaksi Terbaru</h2>
                                <p className="text-sm text-[#787671]">Setoran dan penarikan terbaru.</p>
                            </div>
                            <Link href="/transactions" className="rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm font-medium text-[#15803D] hover:bg-[#DCFCE7]">Lihat Semua</Link>
                        </div>

                        <div className="space-y-3">
                            {latestTransactions.length > 0 ? latestTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex flex-col gap-3 rounded-xl border border-[#E5E3DF] bg-[#FAFAF9] p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A]">{transaction.saving_goal?.title ?? '-'}</h3>
                                        <p className="mt-1 text-sm text-[#787671]">{transaction.type === 'deposit' ? 'Setoran' : 'Penarikan'}</p>
                                    </div>
                                    <div className="sm:text-right">
                                        <p className="font-semibold text-[#1A1A1A]">{formatRupiah(transaction.amount)}</p>
                                        <span className={`mt-1 inline-block rounded-md px-2 py-1 text-xs font-semibold ${statusClass[transaction.status] ?? 'bg-gray-100 text-gray-700'}`}>{transaction.status}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="rounded-xl border border-dashed border-[#E5E3DF] p-6 text-center text-sm text-[#787671]">Belum ada transaksi.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
