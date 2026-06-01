import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ transactions, savingGoals }) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        saving_goal_id: '',
        amount: '',
        note: '',
        proof_image: null,
    });

    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const typeLabel = {
        deposit: 'Setoran',
        withdraw: 'Penarikan',
    };

    const formatRupiah = (value) => {
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    const openCreateModal = () => {
        reset();
        clearErrors();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        if (!confirm('Ajukan setoran ini untuk diverifikasi admin?')) {
            return;
        }

        post(route('transactions.store'), {
            forceFormData: true,
            onSuccess: () => {
                closeCreateModal();
                window.location.href = route('transactions.index');
            },
        });
    };

    return (
        <UserLayout>
            <Head title="Riwayat Transaksi" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-gray-600">
                            Lihat status setoran dan aktivitas tabungan Anda.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Tambah Setoran
                    </button>
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
                                        Bukti
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Catatan
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                        Catatan Admin
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
                                                {transaction.proof_image ? (
                                                    <a
                                                        href={`/storage/${transaction.proof_image}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Lihat Bukti
                                                    </a>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.note ?? '-'}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {transaction.admin_note ?? '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Belum ada transaksi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Tambah Setoran
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Ajukan setoran tabungan. Saldo akan bertambah setelah disetujui admin.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        {savingGoals.length > 0 ? (
                            <form onSubmit={submit} className="space-y-5">
                                {Object.keys(errors).length > 0 && (
                                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                        Setoran belum bisa diajukan. Periksa
                                        kembali data yang ditandai di bawah.
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Pilih Target Tabungan
                                    </label>
                                    <select
                                        value={data.saving_goal_id}
                                        onChange={(e) => setData('saving_goal_id', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">-- Pilih Target --</option>
                                        {savingGoals.map((goal) => (
                                            <option key={goal.id} value={goal.id}>
                                                {goal.title} - {formatRupiah(goal.current_amount)} / {formatRupiah(goal.target_amount)}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.saving_goal_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.saving_goal_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Nominal Setoran
                                    </label>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                        placeholder="Contoh: 50000"
                                    />

                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Bukti Setoran
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('proof_image', e.target.files[0])}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                                    />

                                    {errors.proof_image && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.proof_image}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Catatan
                                    </label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                        rows="4"
                                        placeholder="Contoh: Setoran dari uang jajan minggu ini"
                                    ></textarea>

                                    {errors.note && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.note}
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
                                        disabled={processing}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Mengirim...' : 'Ajukan Setoran'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                                <h3 className="font-semibold">
                                    Belum ada target tabungan aktif
                                </h3>
                                <p className="mt-1 text-sm">
                                    Silakan buat target tabungan terlebih dahulu atau ubah status target menjadi active.
                                </p>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeCreateModal}
                                        className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                                    >
                                        Mengerti
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
