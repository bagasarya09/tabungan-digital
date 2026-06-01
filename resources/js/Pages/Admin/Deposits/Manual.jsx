import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Manual({ users, savingGoals, transactions }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        user_id: '',
        saving_goal_id: '',
        amount: '',
        note: '',
    });

    const formatRupiah = (value) => {
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    const filteredSavingGoals = useMemo(() => {
        if (!data.user_id) return [];

        return savingGoals.filter((goal) => {
            return String(goal.user_id) === String(data.user_id);
        });
    }, [data.user_id, savingGoals]);

    const selectedGoal = useMemo(() => {
        if (!data.saving_goal_id) return null;

        return savingGoals.find((goal) => {
            return String(goal.id) === String(data.saving_goal_id);
        });
    }, [data.saving_goal_id, savingGoals]);

    const submit = (e) => {
        e.preventDefault();

        post('/admin/deposits/manual', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Input Setoran Manual" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Input Setoran Manual
                    </h1>
                    <p className="text-gray-600">
                        Catat setoran user secara langsung. Status transaksi otomatis approved.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="text-lg font-bold text-gray-800">
                                Form Setoran
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Pilih user dan target tabungan yang masih aktif.
                            </p>

                            <form onSubmit={submit} className="mt-6 space-y-5">
                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Pilih User
                                    </label>
                                    <select
                                        value={data.user_id}
                                        onChange={(e) => {
                                            setData({
                                                ...data,
                                                user_id: e.target.value,
                                                saving_goal_id: '',
                                            });
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">-- Pilih User --</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.user_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.user_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Pilih Target Tabungan
                                    </label>
                                    <select
                                        value={data.saving_goal_id}
                                        onChange={(e) => setData('saving_goal_id', e.target.value)}
                                        disabled={!data.user_id}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            {data.user_id
                                                ? '-- Pilih Target --'
                                                : 'Pilih user terlebih dahulu'}
                                        </option>

                                        {filteredSavingGoals.map((goal) => (
                                            <option key={goal.id} value={goal.id}>
                                                {goal.title}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.saving_goal_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.saving_goal_id}
                                        </p>
                                    )}

                                    {data.user_id && filteredSavingGoals.length === 0 && (
                                        <p className="mt-1 text-sm text-yellow-600">
                                            User ini belum memiliki target tabungan aktif.
                                        </p>
                                    )}
                                </div>

                                {selectedGoal && (
                                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                                        <p className="font-semibold">
                                            {selectedGoal.title}
                                        </p>
                                        <p className="mt-1">
                                            Saldo saat ini: {formatRupiah(selectedGoal.current_amount)}
                                        </p>
                                        <p>
                                            Target: {formatRupiah(selectedGoal.target_amount)}
                                        </p>
                                    </div>
                                )}

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
                                        Catatan
                                    </label>
                                    <textarea
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                                        rows="4"
                                        placeholder="Contoh: Setoran diterima oleh admin"
                                    ></textarea>

                                    {errors.note && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.note}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Setoran'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-800">
                                    Setoran Manual Terbaru
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Menampilkan transaksi approved terbaru.
                                </p>
                            </div>

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
                                                Nominal
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                                Status
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
                                                        {formatRupiah(transaction.amount)}
                                                    </td>

                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                            {transaction.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-8 text-center text-gray-500"
                                                >
                                                    Belum ada setoran manual.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}