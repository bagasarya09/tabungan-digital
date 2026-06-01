import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Dashboard({ stats, latestGoals, latestTransactions }) {
    const formatRupiah = (value) => {
        return `Rp ${Number(value).toLocaleString('id-ID')}`;
    };

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan tabungan dan transaksi Anda.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Saldo</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {formatRupiah(stats.totalBalance)}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Target</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.totalGoals}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Target Aktif</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.activeGoals}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Setoran Pending</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {stats.pendingTransactions}
                        </h2>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                Target Tabungan Terbaru
                            </h2>

                            <Link
                                href="/saving-goals"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {latestGoals.length > 0 ? (
                                latestGoals.map((goal) => {
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
                                            className="rounded-lg border border-gray-200 p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-800">
                                                    {goal.title}
                                                </h3>

                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    {goal.status}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600">
                                                {formatRupiah(goal.current_amount)} / {formatRupiah(goal.target_amount)}
                                            </p>

                                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-blue-600"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Progress {progress.toFixed(0)}%
                                            </p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada target tabungan.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                Transaksi Terbaru
                            </h2>

                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {latestTransactions.length > 0 ? (
                                latestTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {transaction.saving_goal?.title ?? '-'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {transaction.status}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-gray-800">
                                            {formatRupiah(transaction.amount)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada transaksi.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}