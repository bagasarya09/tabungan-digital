import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ activityLogs, actions, filters, summary }) {
    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        role: filters?.role || '',
        action: filters?.action || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const activityLogItems = activityLogs?.data ?? [];

    const roleClass = {
        admin: 'bg-purple-100 text-purple-700',
        user: 'bg-blue-100 text-blue-700',
    };

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/activity-logs', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFilterData({
            search: '',
            role: '',
            action: '',
            start_date: '',
            end_date: '',
        });

        router.get('/admin/activity-logs');
    };

    const openDetailModal = (log) => {
        setSelectedLog(log);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setSelectedLog(null);
        setShowDetailModal(false);
    };

    return (
        <AdminLayout>
            <Head title="Activity Log" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Activity Log
                    </h1>
                    <p className="text-gray-600">
                        Pantau seluruh aktivitas penting pada sistem tabungan digital.
                    </p>
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Log</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalLogs}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Log Admin</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalAdmin}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Log User</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {summary.totalUser}
                        </h2>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        Filter Activity Log
                    </h2>

                    <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <input
                                type="text"
                                value={filterData.search}
                                onChange={(e) =>
                                    setFilterData({
                                        ...filterData,
                                        search: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Cari user, action, deskripsi"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                value={filterData.role}
                                onChange={(e) =>
                                    setFilterData({
                                        ...filterData,
                                        role: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Action
                            </label>
                            <select
                                value={filterData.action}
                                onChange={(e) =>
                                    setFilterData({
                                        ...filterData,
                                        action: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua Action</option>
                                {actions.map((action) => (
                                    <option key={action} value={action}>
                                        {action}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={filterData.start_date}
                                onChange={(e) =>
                                    setFilterData({
                                        ...filterData,
                                        start_date: e.target.value,
                                    })
                                }
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
                                onChange={(e) =>
                                    setFilterData({
                                        ...filterData,
                                        end_date: e.target.value,
                                    })
                                }
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
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Action
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Deskripsi
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {activityLogItems.length > 0 ? (
                                    activityLogItems.map((log) => (
                                        <tr key={log.id} className="border-t">
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {formatDate(log.created_at)}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {log.user?.name ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        roleClass[log.role] ?? 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {log.role ?? '-'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                {log.action}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {log.description ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailModal(log)}
                                                    className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Belum ada activity log.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t px-4 py-4">
                        <Pagination links={activityLogs.links} />
                    </div>
                </div>
            </div>

            {showDetailModal && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Detail Activity Log
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Informasi lengkap aktivitas sistem.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Tanggal</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatDate(selectedLog.created_at)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">User</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedLog.user?.name ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedLog.role ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Action</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedLog.action}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                                <p className="text-sm text-gray-500">Deskripsi</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedLog.description ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Subject Type</p>
                                <p className="mt-1 break-all font-semibold text-gray-800">
                                    {selectedLog.subject_type ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Subject ID</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedLog.subject_id ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                                <p className="text-sm text-gray-500">Properties</p>
                                <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-white">
                                    {JSON.stringify(selectedLog.properties, null, 2)}
                                </pre>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
