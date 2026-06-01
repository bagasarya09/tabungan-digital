import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users }) {
    const formatRupiah = (value) => {
        return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    };

    const roleClass = {
        admin: 'bg-purple-100 text-purple-700',
        user: 'bg-blue-100 text-blue-700',
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
                            {users.length}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total User</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {users.filter((user) => user.role === 'user').length}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Admin</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {users.filter((user) => user.role === 'admin').length}
                        </h2>
                    </div>
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
                                {users.length > 0 ? (
                                    users.map((user) => (
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
                </div>
            </div>
        </AdminLayout>
    );
}