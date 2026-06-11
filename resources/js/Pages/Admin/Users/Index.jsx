import { Head, router, useForm } from '@inertiajs/react';
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
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const form = useForm({
        name: '',
        member_number: '',
        role: 'user',
        password: '',
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

    const openCreateForm = () => {
        setEditingUser(null);
        form.clearErrors();
        form.setData({
            name: '',
            member_number: '',
            role: 'user',
            password: '',
        });
        setShowForm(true);
    };

    const openEditForm = (user) => {
        setEditingUser(user);
        form.clearErrors();
        form.setData({
            name: user.name || '',
            member_number: user.member_number || '',
            role: user.role || 'user',
            password: '',
        });
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingUser(null);
        form.clearErrors();
        form.reset();
    };

    const submitForm = (e) => {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: closeForm,
        };

        if (editingUser) {
            form.put(`/admin/users/${editingUser.id}`, options);
            return;
        }

        form.post('/admin/users', options);
    };

    const deleteUser = (user) => {
        const confirmed = window.confirm(
            `Hapus peserta "${user.name}"? Semua data terkait seperti target tabungan, transaksi, peserta program Hari Raya, setoran, dan notifikasi akan ikut terhapus.`
        );

        if (!confirmed) return;

        router.delete(`/admin/users/${user.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Data User" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Data User
                        </h1>
                        <p className="text-gray-600">
                            Kelola dan pantau data user pada sistem tabungan digital.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Tambah Peserta
                    </button>
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

                {showForm && (
                    <div className="mb-6 rounded-xl bg-white p-5 shadow">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingUser ? 'Edit Peserta' : 'Tambah Peserta'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingUser ? 'Kosongkan password jika tidak ingin mengubahnya.' : 'Password wajib diisi untuk akun baru.'}
                            </p>
                        </div>

                        <form onSubmit={submitForm} className="grid gap-4 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nama</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Nama peserta"
                                />
                                {form.errors.name && <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">No Anggota</label>
                                <input
                                    type="text"
                                    value={form.data.member_number}
                                    onChange={(e) => form.setData('member_number', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Contoh: ANG-001"
                                />
                                {form.errors.member_number && <p className="mt-1 text-xs text-red-600">{form.errors.member_number}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={form.data.role}
                                    onChange={(e) => form.setData('role', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="user">User / Peserta</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {form.errors.role && <p className="mt-1 text-xs text-red-600">{form.errors.role}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder={editingUser ? 'Opsional' : 'Minimal 8 karakter'}
                                />
                                {form.errors.password && <p className="mt-1 text-xs text-red-600">{form.errors.password}</p>}
                            </div>

                            <div className="flex flex-wrap items-end gap-3 lg:col-span-4">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                                >
                                    {form.processing ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah Peserta'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

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
                            placeholder="Cari nama atau no anggota"
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
                                        No Anggota
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
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                                        Aksi
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
                                                {user.member_number || '-'}
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

                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditForm(user)}
                                                        className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteUser(user)}
                                                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
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
