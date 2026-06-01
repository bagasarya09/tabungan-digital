import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, latestTransactions }) {
    const formatRupiah = (value) => {
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan data tabungan digital.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total User</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.totalUsers}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Target</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.totalGoals}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Transaksi</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.totalTransactions}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Pending</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.pendingTransactions}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Setoran Approved</p>
                        <h2 className="mt-2 text-xl font-bold text-gray-800">
                            {formatRupiah(stats.approvedDepositAmount)}
                        </h2>
                    </div>
                </div>

                <div className="mt-8 rounded-xl bg-white p-5 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">
                            Transaksi Terbaru
                        </h2>

                        <Link
                            href="/admin/deposits/verification"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Verifikasi Setoran
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Target
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Nominal
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {latestTransactions.length > 0 ? (
                                    latestTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="border-t">
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.user?.name ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.saving_goal?.title ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                                {formatRupiah(transaction.amount)}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.status}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                            Belum ada transaksi.
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
