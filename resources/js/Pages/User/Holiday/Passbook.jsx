import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';

export default function Passbook({ passbookOwner = {}, programs = [], rows = [], summary = {}, filters = {} }) {
    const [filterData, setFilterData] = useState({
        program_id: filters?.program_id || '',
        status: filters?.status || 'approved',
        type: filters?.type || '',
        period: filters?.period || 'all',
        month: filters?.month || '',
        year: filters?.year || new Date().getFullYear(),
        start_date: filters?.start_date || '',
        end_date: filters?.end_date || '',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const typeLabel = { deposit: 'Setoran', withdraw: 'Penarikan' };
    const statusClass = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/holiday/passbook', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        const reset = {
            program_id: '',
            status: 'approved',
            type: '',
            period: 'all',
            month: '',
            year: new Date().getFullYear(),
            start_date: '',
            end_date: '',
        };

        setFilterData(reset);
        router.get('/holiday/passbook', reset);
    };

    const pdfUrl = () => `/holiday/passbook/pdf?${new URLSearchParams(filterData).toString()}`;

    return (
        <UserLayout>
            <Head title="Buku Tabungan Hari Raya" />

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #holiday-passbook-print-area, #holiday-passbook-print-area * { visibility: visible; }
                    #holiday-passbook-print-area { position: absolute; left: 0; top: 0; width: 100%; background: white; }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="no-print">
                    <p className="text-sm font-medium text-[#787671]">Buku Tabungan</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">
                        Buku Tabungan Hari Raya
                    </h1>
                    <p className="mt-2 text-sm text-[#5D5B54]">
                        Cetak mutasi Hari Raya dan rincian potongan program.
                    </p>
                </div>

                <form onSubmit={applyFilter} className="no-print rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Program</label>
                            <select
                                value={filterData.program_id}
                                onChange={(e) => setFilterData({ ...filterData, program_id: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Program</option>
                                {programs.map((program) => (
                                    <option key={program.id} value={program.id}>{program.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Status</label>
                            <select
                                value={filterData.status}
                                onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-[#1A1A1A]">Jenis</label>
                            <select
                                value={filterData.type}
                                onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}
                                className="mt-2 w-full rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm focus:border-[#16A34A] focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="deposit">Setoran</option>
                                <option value="withdraw">Penarikan</option>
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

                        <div className="flex items-end gap-2">
                            <button type="submit" className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                Filter
                            </button>
                            <button type="button" onClick={resetFilter} className="rounded-lg border border-[#E5E3DF] px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                <div className="no-print flex flex-wrap gap-3">
                    <button onClick={() => window.print()} className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                        Cetak Buku Tabungan
                    </button>
                    <a href={pdfUrl()} className="rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                        Download PDF Buku Tabungan
                    </a>
                </div>

                <section id="holiday-passbook-print-area" className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                    <div className="border-b border-[#E5E3DF] pb-5">
                        <h2 className="text-xl font-semibold text-[#1A1A1A]">Buku Tabungan Hari Raya</h2>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                            <div>
                                <p className="text-[#787671]">Nama</p>
                                <p className="font-semibold text-[#1A1A1A]">{passbookOwner.name ?? '-'}</p>
                            </div>
                            <div>
                                <p className="text-[#787671]">No Anggota</p>
                                <p className="font-semibold text-[#1A1A1A]">{passbookOwner.member_number || passbookOwner.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-[#787671]">Program</p>
                                <p className="font-semibold text-[#1A1A1A]">{summary.programLabel ?? 'Semua Program'}</p>
                            </div>
                            <div>
                                <p className="text-[#787671]">Periode</p>
                                <p className="font-semibold text-[#1A1A1A]">{summary.periodLabel ?? 'Semua Periode'}</p>
                            </div>
                            <div>
                                <p className="text-[#787671]">Tanggal Cetak</p>
                                <p className="font-semibold text-[#1A1A1A]">{summary.printedAt ?? '-'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="my-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-[#DCFCE7] p-4">
                            <p className="text-sm text-[#15803D]">Total Setoran</p>
                            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.totalDeposit)}</p>
                        </div>
                        <div className="rounded-xl bg-orange-50 p-4">
                            <p className="text-sm text-orange-700">Total Penarikan</p>
                            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.totalWithdraw)}</p>
                        </div>
                        <div className="rounded-xl bg-red-50 p-4">
                            <p className="text-sm text-red-700">Total Potongan</p>
                            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.totalDeductionApplied)}</p>
                        </div>
                        <div className="rounded-xl bg-[#F6F5F4] p-4">
                            <p className="text-sm text-[#787671]">Saldo Bersih Akhir</p>
                            <p className="mt-1 text-lg font-semibold text-[#1A1A1A]">{formatRupiah(summary.finalBalance)}</p>
                            <p className="mt-1 text-xs text-[#787671]">Sebelum potongan: {formatRupiah(summary.grossBalance)}</p>
                        </div>
                    </div>

                    <div className="mb-5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 text-sm text-[#166534]">
                        {summary.deductionNote}
                    </div>

                    {summary.deduction && (
                        <div className="mb-5 rounded-xl border border-[#E5E3DF] bg-[#FAFAF9] p-4">
                            <h3 className="text-sm font-semibold text-[#1A1A1A]">Rincian Potongan Program</h3>
                            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                                <div><p className="text-[#787671]">Peserta Aktif</p><p className="font-semibold">{summary.deduction.active_participant_count}</p></div>
                                <div><p className="text-[#787671]">Bulan Program</p><p className="font-semibold">{summary.deduction.total_program_months}</p></div>
                                <div><p className="text-[#787671]">Uang Pengendap / Peserta</p><p className="font-semibold">{formatRupiah(summary.deduction.sinking_fund_per_user)}</p></div>
                                <div><p className="text-[#787671]">Admin Sesuai Bulan Aktif</p><p className="font-semibold">{formatRupiah(summary.deduction.admin_fee_total_per_user)}</p></div>
                                <div><p className="text-[#787671]">Total Potongan / Peserta</p><p className="font-semibold">{formatRupiah(summary.deduction.total_deduction_per_user)}</p></div>
                                <div><p className="text-[#787671]">Terakhir Dihitung</p><p className="font-semibold">{summary.deduction.calculated_at ?? '-'}</p></div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] border-collapse text-sm">
                            <thead className="bg-[#F6F5F4]">
                                <tr>
                                    {['No', 'Tanggal', 'Program', 'Jenis', 'Status', 'Setoran', 'Penarikan', 'Saldo', 'Catatan', 'Catatan Admin / Potongan'].map((head) => (
                                        <th key={head} className="border border-[#E5E3DF] px-3 py-2 text-left font-semibold text-[#5D5B54]">{head}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length > 0 ? rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{row.id}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{row.date}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{row.program ?? '-'}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{typeLabel[row.type] ?? row.type}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">
                                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[row.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="border border-[#E5E3DF] px-3 py-2 text-right">{row.deposit > 0 ? formatRupiah(row.deposit) : '-'}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2 text-right">{row.withdraw > 0 ? formatRupiah(row.withdraw) : '-'}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2 text-right font-semibold">{formatRupiah(row.balance)}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{row.note ?? '-'}</td>
                                        <td className="border border-[#E5E3DF] px-3 py-2">{row.admin_note ?? '-'}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="10" className="border border-[#E5E3DF] px-3 py-8 text-center text-[#787671]">
                                            Belum ada transaksi pada filter ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </UserLayout>
    );
}
