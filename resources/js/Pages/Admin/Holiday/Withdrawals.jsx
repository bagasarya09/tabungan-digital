import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Withdrawals({ programs = [], selectedProgram, calculation, participants = [], pendingWithdrawals = [] }) {
    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const formatDateTime = (date) => date
        ? new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';

    const changeProgram = (programId) => {
        router.get('/admin/holiday/withdrawals', { program_id: programId }, { preserveScroll: true });
    };

    const generate = () => {
        if (!selectedProgram) return;
        if (!window.confirm(`Generate penarikan hari raya untuk program "${selectedProgram.name}"?`)) return;

        router.post('/admin/holiday/withdrawals/generate', { program_id: selectedProgram.id }, { preserveScroll: true });
    };

    const approveWithdrawal = (withdrawal) => {
        if (!window.confirm(`Setujui penarikan Hari Raya ${withdrawal.user?.name ?? 'peserta'} sebesar ${formatRupiah(withdrawal.amount)}?`)) return;

        router.post(`/admin/holiday/withdrawals/${withdrawal.id}/approve`, {}, { preserveScroll: true });
    };

    const rejectWithdrawal = (withdrawal) => {
        const reason = window.prompt(`Alasan menolak penarikan ${withdrawal.user?.name ?? 'peserta'}:`);
        if (!reason) return;

        router.post(`/admin/holiday/withdrawals/${withdrawal.id}/reject`, { admin_note: reason }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Generate Penarikan Hari Raya" />
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#787671]">Tabungan Hari Raya</p>
                        <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Generate Penarikan Hari Raya</h1>
                        <p className="mt-2 text-sm text-[#5D5B54]">Buat withdraw pending dari saldo bersih peserta setelah potongan.</p>
                    </div>
                    <button onClick={generate} disabled={!selectedProgram || participants.length === 0} className="min-h-11 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-70">Generate Penarikan</button>
                </div>

                {programs.length === 0 ? (
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-6 text-sm text-[#787671]">Belum ada program hari raya.</div>
                ) : (
                    <>
                        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Program</label>
                            <select value={selectedProgram?.id ?? ''} onChange={(e) => changeProgram(e.target.value)} className="min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A]">
                                {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
                            </select>
                        </div>

                        {calculation && (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4"><p className="text-sm text-[#787671]">Peserta Aktif</p><p className="mt-2 text-xl font-semibold">{calculation.active_participant_count || 0}</p></div>
                                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4"><p className="text-sm text-[#787671]">Rata-rata Potongan</p><p className="mt-2 text-xl font-semibold">{formatRupiah(calculation.total_deduction_per_user)}</p></div>
                                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4"><p className="text-sm text-[#787671]">Bulan Program</p><p className="mt-2 text-xl font-semibold">{calculation.total_program_months || 0}</p></div>
                                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4"><p className="text-sm text-[#787671]">Withdraw Pending</p><p className="mt-2 text-xl font-semibold">{pendingWithdrawals.length}</p></div>
                            </div>
                        )}

                        <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                            <div className="border-b border-[#E5E3DF] px-4 py-4"><h2 className="text-lg font-semibold">Estimasi Generate</h2></div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#E5E3DF]">
                                    <thead className="bg-[#FAFAF9]"><tr><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Saldo</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Pengendap</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Admin Sesuai Bulan Aktif</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Total Potongan</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Nominal Withdraw</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th></tr></thead>
                                    <tbody className="divide-y divide-[#E5E3DF]">
                                        {participants.length > 0 ? participants.map((participant) => (
                                            <tr key={participant.id}>
                                                <td className="px-4 py-3"><p className="text-sm font-semibold">{participant.user?.name ?? '-'}</p><p className="text-xs text-[#787671]">{participant.user?.member_number || participant.user?.email || '-'}</p></td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.balance)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.sinking_fund_per_user)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.admin_fee_total_per_user)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.total_deduction_per_user)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(Math.max(participant.net_withdrawal_amount, 0))}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-[#15803D]">{participant.is_sufficient ? 'Bisa dibuat pending' : 'Saldo tidak mencukupi'}</td>
                                            </tr>
                                        )) : <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada peserta aktif.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                            <div className="border-b border-[#E5E3DF] px-4 py-4">
                                <h2 className="text-lg font-semibold">Penarikan Pending</h2>
                                <p className="mt-1 text-sm text-[#787671]">Penarikan baru berhasil setelah admin menekan Setujui.</p>
                            </div>
                            <div className="divide-y divide-[#E5E3DF]">
                                {pendingWithdrawals.length > 0 ? pendingWithdrawals.map((withdrawal) => (
                                    <div key={withdrawal.id} className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">{withdrawal.user?.name ?? '-'}</p>
                                            <p className="text-xs text-[#787671]">{withdrawal.user?.member_number || withdrawal.user?.email || '-'}</p>
                                            <p className="text-xs text-[#787671]">{formatDateTime(withdrawal.created_at)}</p>
                                            <p className="text-xs text-[#787671]">{withdrawal.note}</p>
                                            {withdrawal.admin_note && <p className="mt-1 text-xs text-[#5D5B54]">{withdrawal.admin_note}</p>}
                                            {withdrawal.is_amount_current === false && withdrawal.expected_amount !== null && (
                                                <p className="mt-1 text-xs font-semibold text-amber-700">
                                                    Nominal belum sesuai hitungan terbaru. Seharusnya {formatRupiah(withdrawal.expected_amount)}.
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                                            <div className="mr-2 text-right">
                                                <p className="text-sm font-semibold">{formatRupiah(withdrawal.amount)}</p>
                                                {withdrawal.is_amount_current === false && withdrawal.expected_amount !== null && (
                                                    <p className="text-xs text-amber-700">Perlu hitung ulang</p>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => approveWithdrawal(withdrawal)}
                                                className="rounded-lg bg-[#16A34A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#15803D]"
                                            >
                                                Setujui
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => rejectWithdrawal(withdrawal)}
                                                className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                )) : <p className="px-4 py-8 text-center text-sm text-[#787671]">Belum ada penarikan pending untuk program ini.</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
