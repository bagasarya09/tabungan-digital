import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ savingGoals }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const createForm = useForm({
        title: '',
        target_amount: '',
        deadline: '',
        description: '',
    });

    const editForm = useForm({
        title: '',
        target_amount: '',
        deadline: '',
        status: 'active',
        description: '',
    });

    const formatRupiah = (value) => {
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();

        if (!confirm('Buat target tabungan baru dengan data ini?')) {
            return;
        }

        createForm.post('/saving-goals', {
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const openEditModal = (goal) => {
        setSelectedGoal(goal);

        editForm.setData({
            title: goal.title || '',
            target_amount: goal.target_amount || '',
            deadline: goal.deadline || '',
            status: goal.status || 'active',
            description: goal.description || '',
        });

        editForm.clearErrors();
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedGoal(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();

        if (!selectedGoal) return;

        if (!confirm(`Simpan perubahan pada target "${selectedGoal.title}"?`)) {
            return;
        }

        editForm.put(`/saving-goals/${selectedGoal.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const deleteGoal = (goal) => {
        if (confirm(`Yakin ingin menghapus target "${goal.title}"?`)) {
            router.delete(`/saving-goals/${goal.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <UserLayout>
            <Head title="Target Tabungan" />

            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Target Tabungan
                        </h1>
                        <p className="text-gray-600">
                            Kelola target tabungan Anda di sini.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Tambah Target
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {savingGoals.length > 0 ? (
                        savingGoals.map((goal) => {
                            const progress =
                                goal.target_amount > 0
                                    ? Math.min(
                                          (goal.current_amount / goal.target_amount) * 100,
                                          100
                                      )
                                    : 0;

                            return (
                                <div
                                    key={goal.id}
                                    className="rounded-xl bg-white p-5 shadow"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-800">
                                                {goal.title}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Deadline: {goal.deadline ?? '-'}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                goal.status === 'active'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : goal.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {goal.status}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <p className="text-sm text-gray-500">
                                            Terkumpul
                                        </p>
                                        <p className="font-semibold text-gray-800">
                                            {formatRupiah(goal.current_amount)} / {formatRupiah(goal.target_amount)}
                                        </p>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Progress {progress.toFixed(0)}%
                                    </p>

                                    {goal.description && (
                                        <p className="mt-3 text-sm text-gray-500">
                                            {goal.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(goal)}
                                            className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteGoal(goal)}
                                            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full rounded-xl bg-white p-8 text-center shadow">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Belum ada target tabungan
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Buat target tabungan pertama Anda.
                            </p>

                            <button
                                onClick={openCreateModal}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                + Tambah Target
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Tambah Target Tabungan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Buat target tabungan baru sesuai kebutuhan Anda.
                                </p>
                            </div>

                            <button
                                onClick={closeCreateModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitCreate} className="space-y-5">
                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Nama Target
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.title}
                                    onChange={(e) => createForm.setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Contoh: Beli Laptop"
                                />
                                {createForm.errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Nominal Target
                                </label>
                                <input
                                    type="number"
                                    value={createForm.data.target_amount}
                                    onChange={(e) => createForm.setData('target_amount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Contoh: 1000000"
                                />
                                {createForm.errors.target_amount && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.target_amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={createForm.data.deadline}
                                    onChange={(e) => createForm.setData('deadline', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                                {createForm.errors.deadline && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.deadline}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    rows="4"
                                    placeholder="Catatan tambahan untuk target tabungan"
                                ></textarea>
                                {createForm.errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {createForm.errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Target'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && selectedGoal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Edit Target Tabungan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Perbarui data target tabungan Anda.
                                </p>
                            </div>

                            <button
                                onClick={closeEditModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={submitEdit} className="space-y-5">
                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Nama Target
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.title}
                                    onChange={(e) => editForm.setData('title', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                                {editForm.errors.title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Nominal Target
                                </label>
                                <input
                                    type="number"
                                    value={editForm.data.target_amount}
                                    onChange={(e) => editForm.setData('target_amount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                                {editForm.errors.target_amount && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.target_amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={editForm.data.deadline}
                                    onChange={(e) => editForm.setData('deadline', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                />
                                {editForm.errors.deadline && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.deadline}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                {editForm.errors.status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.status}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData('description', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    rows="4"
                                ></textarea>
                                {editForm.errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Update Target'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
