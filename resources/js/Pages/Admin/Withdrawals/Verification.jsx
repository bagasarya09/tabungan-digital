import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Verification({ transactions, filters }) {
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

    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
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

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/withdrawals/verification', filterData, {
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

        router.get('/admin/withdrawals/verification');
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

        router.post(`/admin/withdrawals/${approveTarget.id}/approve`, {}, {
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

    const closeRejectModal = () => {
        setSelectedTransaction(null);
        reset();
    };

    const rejectTransaction = (e) => {
        e.preventDefault();

        if (!selectedTransaction) return;

        post(`/admin/withdrawals/${selectedTransaction.id}/reject`, {
            onSuccess: closeRejectModal,
        });
    };

    return (
        <AdminLayout>
            <Head title="Verifikasi Penarikan" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Verifikasi Penarikan
                    </h1>
                    <p className="text-gray-600">
                        Kelola pengajuan penarikan user sebelum saldo target dikurangi.
                    </p>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        Filter Verifikasi Penarikan
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
                                        Saldo Target
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
                                                {formatRupiah(transaction.saving_goal?.current_amount)}
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
                                                {transaction.note ?? '-'}
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
                                                                type="button"
                                                                onClick={() => approveTransaction(transaction)}
                                                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                                                            >
                                                                Approve
                                                            </button>

                                                            <button
                                                                type="button"
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
                                            Belum ada data penarikan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t px-4 py-4">
                        <Pagination links={transactions.links} />
                    </div>
                </div>
            </div>

            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800">
                            Tolak Penarikan
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            Masukkan alasan penolakan untuk penarikan ini.
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
                                    placeholder="Contoh: Catatan penarikan belum lengkap"
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
                                    onClick={closeRejectModal}
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
                                    Detail Penarikan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Informasi lengkap pengajuan penarikan user.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                x
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
                                <p className="text-sm text-gray-500">Saldo Target Saat Ini</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatRupiah(detailTransaction.saving_goal?.current_amount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Nominal Penarikan</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatRupiah(detailTransaction.amount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                        statusClass[detailTransaction.status] ?? 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {detailTransaction.status}
                                </span>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Tanggal Pengajuan</p>
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
                title="Approve Penarikan"
                message={`Yakin ingin menyetujui penarikan ${approveTarget?.user?.name ?? 'user'} sebesar ${formatRupiah(approveTarget?.amount)}? Saldo target tabungan akan berkurang setelah disetujui.`}
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
