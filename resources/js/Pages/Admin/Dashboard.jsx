import AdminLayout from '@/Layouts/AdminLayout';
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
import DashboardChartCard from '@/Components/DashboardChartCard';
import StatCard from '@/Components/StatCard';

const COLORS = ['#16A34A', '#0075DE', '#DD5B00', '#E03131'];

export default function Dashboard({
    stats,
    latestTransactions,
    chartFilters,
    transactionChartData = [],
    typeChartData = [],
    balanceTrendData = [],
    approvedAmountChartData = [],
}) {
    const [filters, setFilters] = useState({
        period: chartFilters?.period || 'weekly',
        start_date: chartFilters?.start_date || '',
        end_date: chartFilters?.end_date || '',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    const applyChartFilter = (e) => {
        e.preventDefault();

        router.get('/admin/dashboard', filters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const statusClass = {
        pending: 'bg-yellow-50 text-yellow-700',
        approved: 'bg-[#DCFCE7] text-[#15803D]',
        rejected: 'bg-red-50 text-red-700',
    };

    const typeLabel = {
        deposit: 'Setoran',
        withdraw: 'Penarikan',
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#787671]">Dashboard Admin</p>
                        <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">
                            Ringkasan sistem tabungan
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5D5B54]">
                            Filter chart untuk melihat status transaksi, komposisi tipe, tren transaksi, dan nominal approved.
                        </p>
                    </div>

                    <Link href="/admin/passbooks" className="rounded-lg bg-[#16A34A] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#15803D]">
                        Cetak Buku Tabungan
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard title="Total User" value={stats.totalUsers} icon="U" />
                    <StatCard title="Total Target" value={stats.totalGoals} icon="T" tone="blue" />
                    <StatCard title="Total Transaksi" value={stats.totalTransactions} icon="X" tone="gray" />
                    <StatCard title="Transaksi Pending" value={stats.pendingTransactions} icon="P" tone="yellow" />
                    <StatCard title="Setoran Approved" value={formatRupiah(stats.approvedDepositAmount)} icon="Rp" />
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

                <div className="grid gap-4 xl:grid-cols-2">
                    <DashboardChartCard title="Transaksi per Status" description="Jumlah pending, approved, dan rejected.">
                        {transactionChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={transactionChartData}>
                                    <CartesianGrid stroke="#E5E3DF" strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#16A34A" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada transaksi pada periode ini.</div>
                        )}
                    </DashboardChartCard>

                    <DashboardChartCard title="Komposisi Transaksi" description="Perbandingan deposit dan withdraw.">
                        {typeChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={typeChartData} dataKey="value" nameKey="name" outerRadius={92} label>
                                        {typeChartData.map((entry, index) => (
                                            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, typeLabel[name] ?? name]} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada komposisi transaksi.</div>
                        )}
                    </DashboardChartCard>

                    <DashboardChartCard title="Trend Transaksi" description="Jumlah transaksi berdasarkan tanggal.">
                        {balanceTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={balanceTrendData}>
                                    <CartesianGrid stroke="#E5E3DF" strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="total" name="Transaksi" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada tren transaksi.</div>
                        )}
                    </DashboardChartCard>

                    <DashboardChartCard title="Nominal Approved" description="Total nominal transaksi approved per tanggal.">
                        {approvedAmountChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={approvedAmountChartData}>
                                    <CartesianGrid stroke="#E5E3DF" strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatRupiah(value)} />
                                    <Bar dataKey="total" name="Nominal Approved" fill="#0075DE" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#787671]">Belum ada nominal approved pada periode ini.</div>
                        )}
                    </DashboardChartCard>
                </div>

                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-[#1A1A1A]">Transaksi Terbaru</h2>
                            <p className="text-sm text-[#787671]">Data terbaru dari setoran dan penarikan user.</p>
                        </div>
                        <Link href="/admin/reports/transactions" className="rounded-lg border border-[#E5E3DF] px-3 py-2 text-center text-sm font-medium text-[#15803D] hover:bg-[#DCFCE7]">
                            Lihat Laporan
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-[#E5E3DF]">
                        <table className="w-full min-w-[720px] border-collapse bg-white">
                            <thead className="bg-[#F6F5F4]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#5D5B54]">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#5D5B54]">Target</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#5D5B54]">Jenis</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#5D5B54]">Nominal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#5D5B54]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestTransactions.length > 0 ? latestTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="border-t border-[#E5E3DF]">
                                        <td className="px-4 py-3 text-sm text-[#1A1A1A]">{transaction.user?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{transaction.saving_goal?.title ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{typeLabel[transaction.type] ?? transaction.type}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">{formatRupiah(transaction.amount)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${statusClass[transaction.status] ?? 'bg-gray-100 text-gray-700'}`}>{transaction.status}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada transaksi.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
