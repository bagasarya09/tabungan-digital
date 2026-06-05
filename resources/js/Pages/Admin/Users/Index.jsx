import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ users, filters, summary }) {
    const formatRupiah = (value) => {
        return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    };

    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        role: filters?.role || '',
    });

    const userItems = users?.data ?? [];

    const roleClass = {
        admin: 'bg-purple-100 text-purple-700',
        user: 'bg-blue-100 text-blue-700',
    };

        const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/users', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFilterData({
            search: '',
            role: '',
        });

        router.get('/admin/users');
    };

    return (
        <AdminLayout>
            <Head title="Data User" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Data User
                    </h1>
                    <p className="text-gray-600">
                        Kelola dan pantau data user pada sistem tabungan digital.
                    </p>
                </div>
                

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Akun</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalAccounts}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total User</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalUsers}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Admin</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalAdmins}
                        </h2>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Cari User
                        </label>
                        <input
                            type="text"
                            value={filterData.search}
                            onChange={(e) =>
                                setFilterData({ ...filterData, search: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Cari nama atau email"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            value={filterData.role}
                            onChange={(e) =>
                                setFilterData({ ...filterData, role: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Semua Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-end gap-3">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Cari
                        </button>

                        <button
                            type="button"
                            onClick={resetFilter}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Target
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Transaksi
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Total Saldo
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Tanggal Daftar
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {userItems.length > 0 ? (
                                    userItems.map((user) => (
                                        <tr key={user.id} className="border-t">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                {user.name}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {user.email}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        roleClass[user.role] ?? 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {user.saving_goals_count ?? 0}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {user.transactions_count ?? 0}
                                            </td>

                                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                                {formatRupiah(user.saving_goals_sum_current_amount)}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Belum ada data user.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t px-4 py-4">
                        <Pagination links={users.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
