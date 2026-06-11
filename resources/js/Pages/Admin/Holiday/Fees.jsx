import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Fees({ programs = [], selectedProgram, setting, calculation, monthlyAdmin, participants = [], filters = {} }) {
    const form = useForm({
        program_id: selectedProgram?.id ?? '',
        sinking_fund_total: setting?.sinking_fund_total ?? 100000,
        admin_fee_monthly_total: setting?.admin_fee_monthly_total ?? 6000,
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const onlyDigits = (value) => String(value || '').replace(/\D/g, '');
    const currencyValue = (value) => {
        if (typeof value === 'number') {
            return Math.round(value);
        }

        const text = String(value || '');
        if (/^\d+(\.\d+)?$/.test(text)) {
            return Math.round(Number(text));
        }

        return Number(onlyDigits(text) || 0);
    };
    const formatRupiahInput = (value) => {
        const amount = currencyValue(value);
        return amount ? `Rp ${amount.toLocaleString('id-ID')}` : '';
    };
    const formatDate = (date) => date
        ? new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID')
        : '-';
    const formatDateTime = (date) => date
        ? new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';
    const inputClass = 'min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15';

    const changeProgram = (programId) => {
        form.setData('program_id', programId);
        router.get('/admin/holiday/fees', { program_id: programId, admin_month: filters.admin_month }, { preserveScroll: true });
    };

    const changeAdminMonth = (month) => {
        router.get('/admin/holiday/fees', {
            program_id: form.data.program_id,
            admin_month: month,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/holiday/fees/recalculate', { preserveScroll: true });
    };

    const Metric = ({ label, value }) => (
        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4">
            <p className="text-sm text-[#787671]">{label}</p>
            <p className="mt-2 text-xl font-semibold text-[#1A1A1A]">{value}</p>
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Uang Pengendap & Administrasi" />
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Tabungan Hari Raya</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Uang Pengendap & Administrasi</h1>
                    <p className="mt-2 text-sm text-[#5D5B54]">Hitung potongan berdasarkan program, peserta aktif, dan saldo setoran approved.</p>
                </div>

                {programs.length === 0 ? (
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-6 text-sm text-[#787671]">Belum ada program hari raya. Buat program dulu di menu Program Hari Raya.</div>
                ) : (
                    <>
                        <form onSubmit={submit} className="rounded-xl border border-[#E5E3DF] bg-white p-4 sm:p-6">
                            <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Program</label>
                                    <select className={inputClass} value={form.data.program_id} onChange={(e) => changeProgram(e.target.value)}>
                                        {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Total Uang Pengendap</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={inputClass}
                                        value={formatRupiahInput(form.data.sinking_fund_total)}
                                        onChange={(e) => form.setData('sinking_fund_total', onlyDigits(e.target.value))}
                                        placeholder="Rp 100.000"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Admin Bulanan Total</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={inputClass}
                                        value={formatRupiahInput(form.data.admin_fee_monthly_total)}
                                        onChange={(e) => form.setData('admin_fee_monthly_total', onlyDigits(e.target.value))}
                                        placeholder="Rp 6.000"
                                    />
                                </div>
                                <button disabled={form.processing} className="min-h-11 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-70">
                                    {form.processing ? 'Menghitung...' : 'Hitung Ulang'}
                                </button>
                            </div>
                        </form>

                        {calculation && (
                            <>
                                <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 sm:p-6">
                                    <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:items-end">
                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Filter Bulan Admin</label>
                                            <input
                                                type="month"
                                                className={inputClass}
                                                value={monthlyAdmin?.selected_month ?? filters.admin_month ?? ''}
                                                onChange={(e) => changeAdminMonth(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-sm leading-6 text-[#5D5B54]">
                                            Breakdown ini menampilkan biaya admin per bulan berdasarkan peserta yang punya setoran approved pada bulan terpilih. Peserta hanya kena admin pada bulan ketika ia benar-benar menabung.
                                        </p>
                                    </div>

                                    {monthlyAdmin && (
                                        <>
                                            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                                <Metric label="Bulan Dipilih" value={monthlyAdmin.month_label} />
                                                <Metric label="Peserta Menabung Bulan Ini" value={`${monthlyAdmin.active_participant_count || 0} peserta`} />
                                                <Metric label="Total Admin Bulanan" value={formatRupiah(monthlyAdmin.admin_fee_monthly_total)} />
                                                <Metric label="Admin per Peserta Bulan Ini" value={formatRupiah(monthlyAdmin.admin_fee_per_user_monthly)} />
                                            </div>

                                            <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E3DF]">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-[#E5E3DF]">
                                                        <thead className="bg-[#FAFAF9]">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta Menabung</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tanggal Bergabung</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tanggal Nonaktif</th>
                                                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status Saat Ini</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-[#E5E3DF]">
                                                            {monthlyAdmin.participants.length > 0 ? monthlyAdmin.participants.map((participant) => (
                                                                <tr key={participant.id}>
                                                                    <td className="px-4 py-3">
                                                                        <p className="text-sm font-semibold text-[#1A1A1A]">{participant.user?.name ?? '-'}</p>
                                                                        <p className="text-xs text-[#787671]">{participant.user?.member_number || participant.user?.email || '-'}</p>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-[#5D5B54]">{participant.joined_at ?? '-'}</td>
                                                                    <td className="px-4 py-3 text-sm text-[#5D5B54]">{participant.inactive_at ?? '-'}</td>
                                                                    <td className="px-4 py-3 text-sm font-semibold text-[#1A1A1A]">{participant.status}</td>
                                                                </tr>
                                                            )) : (
                                                                <tr>
                                                                    <td colSpan="4" className="px-4 py-8 text-center text-sm text-[#787671]">
                                                                        Tidak ada peserta aktif pada bulan ini.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    <Metric label="Peserta Aktif" value={`${calculation.active_participant_count || 0} peserta`} />
                                    <Metric label="Jumlah Bulan" value={`${calculation.total_program_months || 0} bulan`} />
                                    <Metric label="Uang Pengendap per Peserta" value={formatRupiah(calculation.sinking_fund_per_user)} />
                                    <Metric label="Admin per Peserta per Bulan" value={formatRupiah(calculation.admin_fee_per_user_monthly)} />
                                    <Metric label="Rata-rata Admin per Peserta" value={formatRupiah(calculation.admin_fee_total_per_user)} />
                                    <Metric label="Rata-rata Potongan per Peserta" value={formatRupiah(calculation.total_deduction_per_user)} />
                                    <Metric label="Periode Program" value={`${formatDate(selectedProgram?.start_date)} - ${formatDate(selectedProgram?.holiday_date)}`} />
                                    <Metric label="Terakhir Dihitung" value={formatDateTime(setting?.calculated_at)} />
                                </div>

                                <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                                    <div className="border-b border-[#E5E3DF] px-4 py-4"><h2 className="text-lg font-semibold">Estimasi Peserta</h2></div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-[#E5E3DF]">
                                            <thead className="bg-[#FAFAF9]"><tr><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Saldo</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Pengendap</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Admin Sesuai Bulan Aktif</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Total Potongan</th><th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Estimasi Bersih</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th></tr></thead>
                                            <tbody className="divide-y divide-[#E5E3DF]">
                                                {participants.length > 0 ? participants.map((participant) => (
                                                    <tr key={participant.id}>
                                                        <td className="px-4 py-3"><p className="text-sm font-semibold">{participant.user?.name ?? '-'}</p><p className="text-xs text-[#787671]">{participant.user?.member_number || participant.user?.email || '-'}</p></td>
                                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.balance)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.sinking_fund_per_user)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.admin_fee_total_per_user)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(participant.total_deduction_per_user)}</td>
                                                        <td className="px-4 py-3 text-right text-sm font-semibold">{formatRupiah(Math.max(participant.net_withdrawal_amount, 0))}</td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-[#15803D]">{participant.is_sufficient ? 'Siap dicairkan' : 'Saldo tidak mencukupi'}</td>
                                                    </tr>
                                                )) : <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada peserta aktif pada program ini.</td></tr>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
