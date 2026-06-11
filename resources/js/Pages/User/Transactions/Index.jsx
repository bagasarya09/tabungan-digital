import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ transactions, savingGoals, withdrawableSavingGoals = [], filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
        type: filters?.type || '',
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        saving_goal_id: '',
        amount: '',
        note: '',
        proof_image: null,
    });

    const {
        data: withdrawData,
        setData: setWithdrawData,
        post: postWithdraw,
        processing: withdrawProcessing,
        errors: withdrawErrors,
        reset: resetWithdraw,
        clearErrors: clearWithdrawErrors,
    } = useForm({
        saving_goal_id: '',
        amount: '',
        note: '',
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

    const transactionItems = transactions?.data ?? [];

    const formatRupiah = (value) => {
        return `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    };
    const onlyDigits = (value) => String(value || '').replace(/\D/g, '');
    const formatRupiahInput = (value) => {
        const digits = onlyDigits(value);
        return digits ? `Rp ${Number(digits).toLocaleString('id-ID')}` : '';
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

        router.get('/transactions', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setFilterData({
            search: '',
            status: '',
            type: '',
            start_date: '',
            end_date: '',
        });

        router.get('/transactions');
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

    const openWithdrawModal = () => {
        resetWithdraw();
        clearWithdrawErrors();
        setShowWithdrawModal(true);
    };

    const closeWithdrawModal = () => {
        setShowWithdrawModal(false);
        resetWithdraw();
        clearWithdrawErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        post('/transactions', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const submitWithdraw = (e) => {
        e.preventDefault();

        postWithdraw('/transactions/withdraw', {
            preserveScroll: true,
            onSuccess: () => {
                closeWithdrawModal();
            },
        });
    };

    const openDetailModal = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setSelectedTransaction(null);
        setShowDetailModal(false);
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

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={openWithdrawModal}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                        >
                            Ajukan Penarikan
                        </button>

                        <button
                            onClick={openCreateModal}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            + Tambah Setoran
                        </button>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        Filter Transaksi
                    </h2>

                    <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Cari Target
                            </label>
                            <input
                                type="text"
                                value={filterData.search}
                                onChange={(e) =>
                                    setFilterData({ ...filterData, search: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                                placeholder="Contoh: laptop"
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
                                Jenis
                            </label>
                            <select
                                value={filterData.type}
                                onChange={(e) =>
                                    setFilterData({ ...filterData, type: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="deposit">Setoran</option>
                                <option value="withdraw">Penarikan</option>
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

                        <div className="flex gap-3 md:col-span-2 lg:col-span-5">
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

                                            <td className="px-4 py-3 text-sm">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailModal(transaction)}
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
                                            Belum ada transaksi.
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
                                        type="text"
                                        inputMode="numeric"
                                        value={formatRupiahInput(data.amount)}
                                        onChange={(e) => setData('amount', onlyDigits(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                        placeholder="Rp 50.000"
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

            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Ajukan Penarikan
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Saldo target akan berkurang setelah penarikan disetujui admin.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeWithdrawModal}
                                className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100"
                            >
                                x
                            </button>
                        </div>

                        {withdrawableSavingGoals.length > 0 ? (
                            <form onSubmit={submitWithdraw} className="space-y-5">
                                {Object.keys(withdrawErrors).length > 0 && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {Object.values(withdrawErrors)[0]}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Pilih Target Tabungan
                                    </label>
                                    <select
                                        value={withdrawData.saving_goal_id}
                                        onChange={(e) => setWithdrawData('saving_goal_id', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                                    >
                                        <option value="">-- Pilih Target --</option>
                                        {withdrawableSavingGoals.map((goal) => (
                                            <option key={goal.id} value={goal.id}>
                                                {goal.title} - Saldo {formatRupiah(goal.current_amount)}
                                            </option>
                                        ))}
                                    </select>

                                    {withdrawErrors.saving_goal_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {withdrawErrors.saving_goal_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Nominal Penarikan
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatRupiahInput(withdrawData.amount)}
                                        onChange={(e) => setWithdrawData('amount', onlyDigits(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                                        placeholder="Rp 50.000"
                                    />

                                    {withdrawErrors.amount && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {withdrawErrors.amount}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Alasan / Catatan Penarikan
                                    </label>
                                    <textarea
                                        value={withdrawData.note}
                                        onChange={(e) => setWithdrawData('note', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none"
                                        rows="4"
                                        placeholder="Contoh: Dana akan digunakan untuk kebutuhan mendesak"
                                    ></textarea>

                                    {withdrawErrors.note && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {withdrawErrors.note}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeWithdrawModal}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={withdrawProcessing}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {withdrawProcessing ? 'Mengirim...' : 'Ajukan Penarikan'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                                <h3 className="font-semibold">
                                    Belum ada saldo yang bisa ditarik
                                </h3>
                                <p className="mt-1 text-sm">
                                    Penarikan hanya bisa diajukan dari target tabungan milik Anda yang memiliki saldo lebih dari Rp 0.
                                </p>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeWithdrawModal}
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

            {showDetailModal && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Detail Transaksi
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Informasi lengkap transaksi tabungan Anda.
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
                                <p className="text-sm text-gray-500">Target Tabungan</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedTransaction.saving_goal?.title ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Jenis Transaksi</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {typeLabel[selectedTransaction.type] ?? selectedTransaction.type}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Nominal</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatRupiah(selectedTransaction.amount)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Status</p>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                        statusClass[selectedTransaction.status] ?? 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {selectedTransaction.status}
                                </span>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Tanggal Transaksi</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatDate(selectedTransaction.created_at)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">Tanggal Diproses</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {formatDate(selectedTransaction.approved_at)}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                                <p className="text-sm text-gray-500">
                                    {selectedTransaction.type === 'deposit' ? 'Bukti Setoran' : 'Bukti'}
                                </p>
                                {selectedTransaction.proof_image ? (
                                    <a
                                        href={`/storage/${selectedTransaction.proof_image}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                                    >
                                        Lihat Bukti Setoran
                                    </a>
                                ) : (
                                    <p className="mt-1 font-semibold text-gray-800">
                                        {selectedTransaction.type === 'deposit'
                                            ? 'Tidak ada bukti setoran'
                                            : 'Tidak ada bukti'}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                                <p className="text-sm text-gray-500">Catatan User</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedTransaction.note ?? '-'}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 md:col-span-2">
                                <p className="text-sm text-gray-500">Catatan Admin</p>
                                <p className="mt-1 font-semibold text-gray-800">
                                    {selectedTransaction.admin_note ?? '-'}
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
        </UserLayout>
    );
}
