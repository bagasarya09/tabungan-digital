import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Transactions({ transactions, users, filters, summary }) {
    const [filterData, setFilterData] = useState({
        user_id: filters.user_id || '',
        status: filters.status || '',
        type: filters.type || '',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const formatRupiah = (value) => {
        return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    };

    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const typeLabel = {
        deposit: 'Setoran',
        withdraw: 'Penarikan',
    };

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/reports/transactions', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFilterData({
            user_id: '',
            status: '',
            type: '',
            start_date: '',
            end_date: '',
        });

        router.get('/admin/reports/transactions');
    };

    return (
        <AdminLayout>
            <Head title="Laporan Transaksi" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Laporan Transaksi
                    </h1>
                    <p className="text-gray-600">
                        Pantau dan filter seluruh transaksi tabungan digital.
                    </p>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Transaksi</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalTransactions}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Approved</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalApproved}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Pending</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalPending}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Rejected</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalRejected}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Nominal Approved</p>
                        <h2 className="mt-2 text-xl font-bold text-gray-800">
                            {formatRupiah(summary.totalApprovedAmount)}
                        </h2>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        Filter Laporan
                    </h2>

                    <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                User
                            </label>
                            <select
                                value={filterData.user_id}
                                onChange={(e) => setFilterData({ ...filterData, user_id: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                value={filterData.status}
                                onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Jenis
                            </label>
                            <select
                                value={filterData.type}
                                onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="deposit">Setoran</option>
                                <option value="withdraw">Penarikan</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={filterData.start_date}
                                onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                value={filterData.end_date}
                                onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 md:col-span-2 lg:col-span-5">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Terapkan Filter
                        </button>

                        <button
                            type="button"
                            onClick={resetFilter}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Reset
                        </button>

                        <a
                            href={`/admin/reports/transactions/export?${new URLSearchParams(filterData).toString()}`}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Export CSV
                        </a>
                    </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Target
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Jenis
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Nominal
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Approved By
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Catatan
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-t">
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.user?.name ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.saving_goal?.title ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {typeLabel[transaction.type] ?? transaction.type}
                                            </td>

                                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                                {formatRupiah(transaction.amount)}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        statusClass[transaction.status] ?? 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.approved_by?.name ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.note ?? transaction.admin_note ?? '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Tidak ada data transaksi.
                                        </td>
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