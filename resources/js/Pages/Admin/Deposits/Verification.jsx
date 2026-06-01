import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Verification({ transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        admin_note: '',
    });

    const approveTransaction = (transactionId) => {
        if (confirm('Yakin ingin menyetujui setoran ini?')) {
            router.post(`/admin/deposits/${transactionId}/approve`);
        }
    };

    const openRejectModal = (transaction) => {
        setSelectedTransaction(transaction);
        reset();
    };

    const rejectTransaction = (e) => {
        e.preventDefault();

        if (!selectedTransaction) return;

        post(`/admin/deposits/${selectedTransaction.id}/reject`, {
            onSuccess: () => {
                setSelectedTransaction(null);
                reset();
            },
        });
    };

    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    return (
        <AdminLayout>
            <Head title="Verifikasi Setoran" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Verifikasi Setoran
                        </h1>
                        <p className="text-gray-600">
                            Kelola pengajuan setoran user yang masuk.
                        </p>
                    </div>

                    <Link
                        href="/admin/dashboard"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
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
                                    Nominal
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Catatan
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Bukti
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Aksi
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

                                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                                            Rp {Number(transaction.amount).toLocaleString('id-ID')}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[transaction.status]}`}>
                                                {transaction.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {transaction.note ?? '-'}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {transaction.proof_image ? (
                                                <a
                                                    href={`/storage/${transaction.proof_image}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Bukti
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-sm">
                                            {transaction.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => approveTransaction(transaction.id)}
                                                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => openRejectModal(transaction)}
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Sudah diproses
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                        Belum ada data setoran.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800">
                            Tolak Setoran
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Masukkan alasan penolakan untuk setoran ini.
                        </p>

                        <form onSubmit={rejectTransaction} className="mt-5 space-y-4">
                            <div>
                                <label className="mb-1 block font-medium text-gray-700">
                                    Alasan Reject
                                </label>

                                <textarea
                                    value={data.admin_note}
                                    onChange={(e) => setData('admin_note', e.target.value)}
                                    rows="4"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    placeholder="Contoh: Bukti setoran tidak jelas"
                                ></textarea>

                                {errors.admin_note && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.admin_note}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTransaction(null)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {processing ? 'Memproses...' : 'Reject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
