import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users, passbookOwner, savingGoals = [], transactions, summary, filters }) {
    const [filterData, setFilterData] = useState({
        user_id: filters?.user_id || '',
        saving_goal_id: filters?.saving_goal_id || '',
        period: filters?.period || 'all',
        month: filters?.month || '',
        year: filters?.year || new Date().getFullYear(),
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/admin/passbooks', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const pdfUrl = () => `/admin/passbooks/pdf?${new URLSearchParams(filterData).toString()}`;

    return (
        <AdminLayout>
            <Head title="Cetak Buku Tabungan User" />

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #passbook-print-area, #passbook-print-area * { visibility: visible; }
                    #passbook-print-area { position: absolute; left: 0; top: 0; width: 100%; background: white; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="no-print">
                    <p className="text-sm font-medium text-[#787671]">Admin Passbook</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">
                        Cetak Buku Tabungan User
                    </h1>
                    <p className="mt-2 text-sm text-[#5D5B54]">
                        Pilih user terlebih dahulu untuk melihat dan mencetak buku tabungan milik user.
                    </p>
                </div>

                <form onSubmit={applyFilter} className="no-print rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <div className="grid gap-3 md:grid-cols-5">
                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">User</label>
                            <select
                                value={filterData.user_id}
                                onChange={(e) => setFilterData({ ...filterData, user_id: e.target.value, saving_goal_id: '' })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Pilih user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.member_number || user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Target Tabungan</label>
                            <select
                                value={filterData.saving_goal_id}
                                onChange={(e) => setFilterData({ ...filterData, saving_goal_id: e.target.value })}
                                disabled={!filterData.user_id}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none disabled:bg-[#F6F5F4] disabled:text-[#A4A097]"
                            >
                                <option value="">Semua Target</option>
                                {savingGoals.map((goal) => (
                                    <option key={goal.id} value={goal.id}>
                                        {goal.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Periode</label>
                            <select
                                value={filterData.period}
                                onChange={(e) => setFilterData({ ...filterData, period: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="all">Semua Periode</option>
                                <option value="monthly">Bulanan</option>
                                <option value="yearly">Tahunan</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {filterData.period === 'monthly' && (
                            <div>
                                <label className="text-sm font-medium text-[#1A1A1A]">Bulan</label>
                                <input
                                    type="month"
                                    value={filterData.month}
                                    onChange={(e) => setFilterData({ ...filterData, month: e.target.value })}
                                    className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                />
                            </div>
                        )}

                        {filterData.period === 'yearly' && (
                            <div>
                                <label className="text-sm font-medium text-[#1A1A1A]">Tahun</label>
                                <input
                                    type="number"
                                    value={filterData.year}
                                    onChange={(e) => setFilterData({ ...filterData, year: e.target.value })}
                                    className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                />
                            </div>
                        )}

                        {filterData.period === 'custom' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-[#1A1A1A]">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={filterData.start_date}
                                        onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#1A1A1A]">Tanggal Akhir</label>
                                    <input
                                        type="date"
                                        value={filterData.end_date}
                                        onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                                        className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-end">
                            <button type="submit" className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                Tampilkan
                            </button>
                        </div>
                    </div>
                </form>

                {!passbookOwner ? (
                    <div className="rounded-xl border border-dashed border-[#E5E3DF] bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            Pilih user terlebih dahulu untuk melihat buku tabungan.
                        </h2>
                        <p className="mt-2 text-sm text-[#787671]">
                            Admin mencetak buku tabungan milik user yang dipilih, bukan milik admin.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="no-print flex flex-wrap gap-3">
                            <button onClick={() => window.print()} className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                Cetak Buku Tabungan User
                            </button>
                            <a href={pdfUrl()} className="rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                                Download PDF Buku Tabungan User
                            </a>
                        </div>

                        <section id="passbook-print-area" className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                            <div className="border-b border-[#E5E3DF] pb-5">
                                <h2 className="text-xl font-semibold text-[#1A1A1A]">Buku Tabungan Digital</h2>
                                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <p className="text-[#787671]">Nama User</p>
                                        <p className="font-semibold text-[#1A1A1A]">{passbookOwner.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#787671]">No Anggota</p>
                                        <p className="font-semibold text-[#1A1A1A]">{passbookOwner.member_number || passbookOwner.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#787671]">Periode</p>
                                        <p className="font-semibold text-[#1A1A1A]">{summary.periodLabel}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#787671]">Target</p>
                                        <p className="font-semibold text-[#1A1A1A]">{summary.targetLabel}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#787671]">Tanggal Cetak</p>
                                        <p className="font-semibold text-[#1A1A1A]">{summary.printedAt}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="my-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl bg-[#DCFCE7] p-4">
                                    <p className="text-sm text-[#15803D]">Total Setoran</p>
                                    <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.totalDeposit)}</p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-4">
                                    <p className="text-sm text-orange-700">Total Penarikan</p>
                                    <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.totalWithdraw)}</p>
                                </div>
                                <div className="rounded-xl bg-[#F6F5F4] p-4">
                                    <p className="text-sm text-[#787671]">Saldo Akhir</p>
                                    <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.finalBalance)}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] border-collapse text-sm">
                                    <thead className="bg-[#F6F5F4]">
                                        <tr>
                                            {['No Transaksi', 'Tanggal', 'Target', 'Jenis', 'Debit', 'Kredit', 'Saldo', 'Catatan'].map((head) => (
                                                <th key={head} className="border border-[#E5E3DF] px-3 py-2 text-left font-semibold text-[#5D5B54]">{head}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length > 0 ? transactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="border border-[#E5E3DF] px-3 py-2">{transaction.number}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2">{transaction.date}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2">{transaction.saving_goal}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2">{transaction.type === 'deposit' ? 'Setoran' : 'Penarikan'}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2 text-right">{transaction.debit > 0 ? formatRupiah(transaction.debit) : '-'}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2 text-right">{transaction.credit > 0 ? formatRupiah(transaction.credit) : '-'}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2 text-right font-semibold">{formatRupiah(transaction.balance)}</td>
                                                <td className="border border-[#E5E3DF] px-3 py-2">{transaction.note ?? '-'}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="8" className="border border-[#E5E3DF] px-3 py-8 text-center text-[#787671]">
                                                    Belum ada transaksi approved pada periode ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
