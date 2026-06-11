import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Reports({ transactions = {}, users = [], programs = [], summary = {}, filters = {} }) {
    const [filterData, setFilterData] = useState({
        user_id: filters?.user_id || '',
        program_id: filters?.program_id || '',
        status: filters?.status || '',
        type: filters?.type || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

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
    const typeLabel = { deposit: 'Setoran', withdraw: 'Penarikan' };
    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/admin/holiday/reports', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        const reset = {
            user_id: '',
            program_id: '',
            status: '',
            type: '',
            start_date: '',
            end_date: '',
        };

        setFilterData(reset);
        router.get('/admin/holiday/reports', reset);
    };

    const exportReport = () => {
        window.location.href = `/admin/holiday/reports/export?${new URLSearchParams(filterData).toString()}`;
    };

    return (
        <AdminLayout>
            <Head title="Laporan Hari Raya" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1A1A1A]">Laporan Hari Raya</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                        Pantau transaksi Tabungan Hari Raya berdasarkan user, program, status, jenis, dan tanggal.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Total Transaksi</p>
                        <p className="mt-2 text-xl font-semibold">{summary.totalTransactions || 0}</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Approved</p>
                        <p className="mt-2 text-xl font-semibold">{summary.approved || 0}</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Pending</p>
                        <p className="mt-2 text-xl font-semibold">{summary.pending || 0}</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Rejected</p>
                        <p className="mt-2 text-xl font-semibold">{summary.rejected || 0}</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Setoran Approved</p>
                        <p className="mt-2 text-lg font-semibold">{formatRupiah(summary.deposit)}</p>
                    </div>
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                        <p className="text-sm text-[#787671]">Penarikan Approved</p>
                        <p className="mt-2 text-lg font-semibold">{formatRupiah(summary.withdraw)}</p>
                    </div>
                </div>

                <form onSubmit={applyFilter} className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A]">Filter Laporan</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">User</label>
                            <select
                                value={filterData.user_id}
                                onChange={(e) => setFilterData({ ...filterData, user_id: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name} - {user.member_number || user.email}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">Program</label>
                            <select
                                value={filterData.program_id}
                                onChange={(e) => setFilterData({ ...filterData, program_id: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Program</option>
                                {programs.map((program) => (
                                    <option key={program.id} value={program.id}>{program.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">Status</label>
                            <select
                                value={filterData.status}
                                onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">Jenis</label>
                            <select
                                value={filterData.type}
                                onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="deposit">Setoran</option>
                                <option value="withdraw">Penarikan</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={filterData.start_date}
                                onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-[#1A1A1A]">Tanggal Akhir</label>
                            <input
                                type="date"
                                value={filterData.end_date}
                                onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                                className="w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-6">
                            <button type="submit" className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                Terapkan Filter
                            </button>
                            <button type="button" onClick={resetFilter} className="rounded-lg border border-[#E5E3DF] px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">
                                Reset
                            </button>
                            <button type="button" onClick={exportReport} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">
                                Export Excel
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E5E3DF]">
                            <thead className="bg-[#FAFAF9]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Program</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tipe</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Nominal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Approved By</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Catatan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Catatan Admin / Potongan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E3DF]">
                                {rows.length > 0 ? rows.map((trx) => (
                                    <tr key={trx.id}>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{formatDateTime(trx.created_at)}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <p className="font-semibold text-[#1A1A1A]">{trx.user?.name ?? '-'}</p>
                                            <p className="text-xs text-[#787671]">{trx.user?.member_number || trx.user?.email || '-'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{trx.holiday_program?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{typeLabel[trx.type] ?? trx.type}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[trx.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(trx.amount)}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{trx.approved_by?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{trx.note ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{trx.admin_note ?? '-'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-10 text-center text-sm text-[#787671]">
                                            Belum ada transaksi Hari Raya pada filter ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {transactions.links && (
                        <div className="border-t border-[#E5E3DF] px-4 py-4">
                            <Pagination links={transactions.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
