import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ setting, preview, participants = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        sinking_fund_total: setting?.sinking_fund_total ?? 100000,
        admin_fee_monthly_total: setting?.admin_fee_monthly_total ?? 6000,
        start_date: setting?.start_date?.slice?.(0, 10) ?? '',
        holiday_date: setting?.holiday_date?.slice?.(0, 10) ?? '',
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

    const inputClass =
        'min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none transition placeholder:text-[#787671] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15';

    const submitRecalculate = (e) => {
        e.preventDefault();
        post('/admin/program-fees/recalculate', {
            preserveScroll: true,
        });
    };

    const generateWithdrawals = () => {
        if (!window.confirm('Generate penarikan hari raya untuk semua peserta aktif?')) {
            return;
        }

        router.post('/admin/program-fees/generate-holiday-withdrawals', {}, {
            preserveScroll: true,
        });
    };

    const MetricCard = ({ title, value, caption }) => (
        <div className="rounded-lg border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
            <p className="text-sm font-medium text-[#787671]">{title}</p>
            <p className="mt-2 break-words text-xl font-semibold text-[#1A1A1A]">{value}</p>
            {caption && <p className="mt-1 text-xs leading-5 text-[#787671]">{caption}</p>}
        </div>
    );

    return (
        <AdminLayout>
            <Head title="Potongan Hari Raya" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#787671]">Pengaturan Biaya Program</p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1A1A1A]">
                            Potongan Peserta Aktif
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5D5B54]">
                            Sistem menghitung uang pengendap, biaya administrasi, total potongan, dan estimasi pencairan bersih berdasarkan peserta aktif terbaru.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={generateWithdrawals}
                        className="min-h-11 rounded-lg bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534]"
                    >
                        Generate Penarikan Hari Raya
                    </button>
                </div>

                <form onSubmit={submitRecalculate} className="rounded-lg border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Total Uang Pengendap
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formatRupiahInput(data.sinking_fund_total)}
                                onChange={(e) => setData('sinking_fund_total', onlyDigits(e.target.value))}
                                className={inputClass}
                                placeholder="Rp 100.000"
                            />
                            {errors.sinking_fund_total && <p className="mt-1 text-sm text-[#E03131]">{errors.sinking_fund_total}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Total Admin Bulanan
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formatRupiahInput(data.admin_fee_monthly_total)}
                                onChange={(e) => setData('admin_fee_monthly_total', onlyDigits(e.target.value))}
                                className={inputClass}
                                placeholder="Rp 6.000"
                            />
                            {errors.admin_fee_monthly_total && <p className="mt-1 text-sm text-[#E03131]">{errors.admin_fee_monthly_total}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className={inputClass}
                            />
                            {errors.start_date && <p className="mt-1 text-sm text-[#E03131]">{errors.start_date}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Tanggal Hari Raya
                            </label>
                            <input
                                type="date"
                                value={data.holiday_date}
                                onChange={(e) => setData('holiday_date', e.target.value)}
                                className={inputClass}
                            />
                            {errors.holiday_date && <p className="mt-1 text-sm text-[#E03131]">{errors.holiday_date}</p>}
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[#787671]">
                            Terakhir dihitung: {setting?.calculated_at ? new Date(setting.calculated_at).toLocaleString('id-ID') : '-'}
                        </p>
                        <button
                            type="submit"
                            disabled={processing}
                            className="min-h-11 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Menghitung...' : 'Hitung Ulang Potongan'}
                        </button>
                    </div>
                </form>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MetricCard title="Total Uang Pengendap Program" value={formatRupiah(setting?.sinking_fund_total)} />
                    <MetricCard title="Total Biaya Admin Bulanan" value={formatRupiah(setting?.admin_fee_monthly_total)} />
                    <MetricCard title="Jumlah Peserta Aktif" value={`${preview.active_participant_count || 0} peserta`} />
                    <MetricCard title="Uang Pengendap per Peserta" value={formatRupiah(preview.sinking_fund_per_user)} />
                    <MetricCard title="Admin per Peserta per Bulan" value={formatRupiah(preview.admin_fee_per_user_monthly)} />
                    <MetricCard title="Jumlah Bulan Program" value={`${preview.total_program_months || 0} bulan`} />
                    <MetricCard title="Total Admin per Peserta" value={formatRupiah(preview.admin_fee_total_per_user)} />
                    <MetricCard title="Total Potongan per Peserta" value={formatRupiah(preview.total_deduction_per_user)} />
                    <MetricCard title="Estimasi Saldo Bersih Total" value={formatRupiah(preview.estimated_total_net_withdrawal)} caption="Akumulasi estimasi pencairan bersih peserta yang saldonya mencukupi." />
                </div>

                <div className="overflow-hidden rounded-lg border border-[#E5E3DF] bg-white shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <div className="border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">Estimasi per Peserta</h2>
                        <p className="mt-1 text-sm text-[#787671]">
                            Peserta dengan saldo bersih kurang dari atau sama dengan nol tidak akan dibuatkan transaksi penarikan otomatis.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E5E3DF]">
                            <thead className="bg-[#FAFAF9]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Target</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Saldo Tersedia</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Estimasi Bersih</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E3DF] bg-white">
                                {participants.length > 0 ? participants.map((participant) => (
                                    <tr key={participant.id}>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-semibold text-[#1A1A1A]">{participant.user?.name ?? '-'}</p>
                                            <p className="text-xs text-[#787671]">{participant.user?.member_number || participant.user?.email || '-'}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{participant.title}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">{formatRupiah(participant.available_balance)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">{formatRupiah(Math.max(participant.net_withdrawal_amount, 0))}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${participant.is_sufficient ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-red-50 text-[#E03131]'}`}>
                                                {participant.is_sufficient ? 'Siap dicairkan' : 'Saldo tidak mencukupi'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-10 text-center text-sm text-[#787671]">
                                            Belum ada peserta aktif.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
