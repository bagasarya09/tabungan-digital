import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Verification({ transactions, filters  }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [detailTransaction, setDetailTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [approveTarget, setApproveTarget] = useState(null);
    const [approveProcessing, setApproveProcessing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        admin_note: '',
    });

    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const transactionItems = transactions?.data ?? [];

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/deposits/verification', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFilterData({
            search: '',
            status: '',
            start_date: '',
            end_date: '',
        });

        router.get('/admin/deposits/verification');
    };

    const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
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

    const openDetailModal = (transaction) => {
        setDetailTransaction(transaction);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setDetailTransaction(null);
        setShowDetailModal(false);
    };

    const approveTransaction = (transaction) => {
        setApproveTarget(transaction);
    };

    const closeApproveModal = () => {
        if (approveProcessing) return;

        setApproveTarget(null);
    };

    const confirmApproveTransaction = () => {
        if (!approveTarget) return;

        setApproveProcessing(true);

        router.post(`/admin/deposits/${approveTarget.id}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setApproveTarget(null);
            },
            onFinish: () => {
                setApproveProcessing(false);
            },
        });
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
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                <h2 className="mb-4 text-lg font-bold text-gray-800">
                    Filter Verifikasi Setoran
                </h2>

                <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Cari User / Target
                        </label>
                        <input
                            type="text"
                            value={filterData.search}
                            onChange={(e) =>
                                setFilterData({ ...filterData, search: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Nama, email, atau target"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            value={filterData.status}
                            onChange={(e) =>
                                setFilterData({ ...filterData, status: e.target.value })
                            }
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
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            value={filterData.start_date}
                            onChange={(e) =>
                                setFilterData({ ...filterData, start_date: e.target.value })
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
                                setFilterData({ ...filterData, end_date: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3 md:col-span-2 lg:col-span-4">
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
                            {transactionItems.length > 0 ? (
                                transactionItems.map((transaction) => (
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
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openDetailModal(transaction)}
                                                className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                            >
                                                Detail
                                            </button>

                                            {transaction.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => approveTransaction(transaction)}
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
                                                </>
                                            ) : (
                                                <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500">
                                                    Sudah diproses
                                                </span>
                                            )}
                                        </div>
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
                    <div className="border-t px-4 py-4">
                        <Pagination links={transactions.links} />
                    </div>
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


            {showDetailModal && detailTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Detail Transaksi
                            </h2>
                            <p className="text-sm text-gray-600">
                                Informasi lengkap transaksi setoran user.
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
                            <p className="text-sm text-gray-500">Nama User</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.user?.name ?? '-'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Email User</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.user?.email ?? '-'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Target Tabungan</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.saving_goal?.title ?? '-'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Jenis Transaksi</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.type === 'deposit'
                                    ? 'Setoran'
                                    : 'Penarikan'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Nominal</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {formatRupiah(detailTransaction.amount)}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Status</p>
                            <span
                                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                    statusClass[detailTransaction.status] ??
                                    'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {detailTransaction.status}
                            </span>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Tanggal Transaksi</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {formatDate(detailTransaction.created_at)}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">Tanggal Diproses</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {formatDate(detailTransaction.approved_at)}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                            <p className="text-sm text-gray-500">Bukti Setoran</p>
                            {detailTransaction.proof_image ? (
                                <a
                                    href={`/storage/${detailTransaction.proof_image}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                                >
                                    Lihat Bukti Setoran
                                </a>
                            ) : (
                                <p className="mt-1 font-semibold text-gray-800">
                                    Tidak ada bukti setoran
                                </p>
                            )}
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                            <p className="text-sm text-gray-500">Catatan User</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.note ?? '-'}
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                            <p className="text-sm text-gray-500">Catatan Admin</p>
                            <p className="mt-1 font-semibold text-gray-800">
                                {detailTransaction.admin_note ?? '-'}
                            </p>
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

            <ConfirmModal
                show={Boolean(approveTarget)}
                title="Approve Setoran"
                message={`Yakin ingin menyetujui setoran ${approveTarget?.user?.name ?? 'user'} sebesar ${formatRupiah(approveTarget?.amount)}? Saldo target tabungan akan bertambah setelah disetujui.`}
                confirmText="Ya, Approve"
                cancelText="Batal"
                type="success"
                processing={approveProcessing}
                onConfirm={confirmApproveTransaction}
                onCancel={closeApproveModal}
            />
        </AdminLayout>
    );
}
