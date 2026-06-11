import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Participants({ programs = [], participants = [], deposits = [], users = [], filters = {}, deduction = {} }) {
    const [depositTarget, setDepositTarget] = useState(null);
    const [editDepositTarget, setEditDepositTarget] = useState(null);
    const selectedProgramId = filters.program_id || programs[0]?.id || '';
    const form = useForm({
        holiday_saving_program_id: selectedProgramId,
        user_id: '',
        status: 'active',
    });
    const depositForm = useForm({
        amount: '',
        deposit_date: new Date().toISOString().slice(0, 10),
        note: '',
    });
    const editDepositForm = useForm({
        amount: '',
        deposit_date: new Date().toISOString().slice(0, 10),
        note: '',
    });

    const inputClass = 'min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15';
    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const onlyDigits = (value) => String(value || '').replace(/\D/g, '');
    const formatRupiahInput = (value) => {
        const digits = onlyDigits(value);
        return digits ? `Rp ${Number(digits).toLocaleString('id-ID')}` : '';
    };
    const formatDateTime = (date) => date
        ? new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-';
    const withdrawalStatusClass = {
        'Belum digenerate': 'bg-slate-100 text-slate-700',
        'Menunggu persetujuan': 'bg-yellow-100 text-yellow-700',
        'Sudah dicairkan': 'bg-green-100 text-green-700',
        'Saldo tidak mencukupi': 'bg-red-100 text-red-700',
        'Belum ada saldo': 'bg-gray-100 text-gray-700',
    };

    const changeProgram = (programId) => {
        form.setData('holiday_saving_program_id', programId);
        router.get('/admin/holiday/participants', { program_id: programId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/holiday/participants', {
            preserveScroll: true,
            onSuccess: () => form.setData('user_id', ''),
        });
    };

    const updateStatus = (participant, status) => {
        router.put(`/admin/holiday/participants/${participant.id}`, { status }, { preserveScroll: true });
    };

    const deleteParticipant = (participant) => {
        if (!window.confirm(`Hapus ${participant.user?.name ?? 'peserta'} dari program?`)) return;
        router.delete(`/admin/holiday/participants/${participant.id}`, { preserveScroll: true });
    };

    const openDepositModal = (participant) => {
        setDepositTarget(participant);
        depositForm.setData({
            amount: '',
            deposit_date: new Date().toISOString().slice(0, 10),
            note: '',
        });
        depositForm.clearErrors();
    };

    const closeDepositModal = () => {
        setDepositTarget(null);
        depositForm.reset();
        depositForm.clearErrors();
    };

    const submitDeposit = (e) => {
        e.preventDefault();
        if (!depositTarget) return;

        depositForm.post(`/admin/holiday/participants/${depositTarget.id}/deposits`, {
            preserveScroll: true,
            onSuccess: closeDepositModal,
        });
    };

    const openEditDepositModal = (deposit) => {
        setEditDepositTarget(deposit);
        editDepositForm.setData({
            amount: String(Math.round(Number(deposit.amount || 0))),
            deposit_date: deposit.created_at ? new Date(deposit.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
            note: deposit.note || '',
        });
        editDepositForm.clearErrors();
    };

    const closeEditDepositModal = () => {
        setEditDepositTarget(null);
        editDepositForm.reset();
        editDepositForm.clearErrors();
    };

    const submitEditDeposit = (e) => {
        e.preventDefault();
        if (!editDepositTarget) return;

        editDepositForm.put(`/admin/holiday/deposits/${editDepositTarget.id}`, {
            preserveScroll: true,
            onSuccess: closeEditDepositModal,
        });
    };

    return (
        <AdminLayout>
            <Head title="Peserta Program" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Tabungan Hari Raya</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Peserta Program</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                        Tambahkan user sebagai peserta aktif ke program hari raya.
                    </p>
                </div>

                {programs.length === 0 ? (
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">Belum ada program</h2>
                        <p className="mt-2 text-sm text-[#5D5B54]">
                            Buat program dulu dari menu Program Hari Raya, lalu kembali ke halaman ini untuk menambahkan peserta.
                        </p>
                    </div>
                ) : (
                    <>
                        <form onSubmit={submit} className="rounded-xl border border-[#E5E3DF] bg-white p-4 sm:p-6">
                            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_180px_auto] lg:items-end">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Program</label>
                                    <select className={inputClass} value={form.data.holiday_saving_program_id} onChange={(e) => changeProgram(e.target.value)}>
                                        {programs.map((program) => (
                                            <option key={program.id} value={program.id}>{program.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">User Peserta</label>
                                    <select className={inputClass} value={form.data.user_id} onChange={(e) => form.setData('user_id', e.target.value)}>
                                        <option value="">Pilih user</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>{user.name} - {user.member_number || user.email}</option>
                                        ))}
                                    </select>
                                    {form.errors.user_id && <p className="mt-1 text-sm text-[#E03131]">{form.errors.user_id}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Status</label>
                                    <select className={inputClass} value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <button disabled={form.processing || !form.data.user_id} className="min-h-11 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-70">
                                    {form.processing ? 'Menyimpan...' : 'Tambah Peserta'}
                                </button>
                            </div>
                        </form>

                        <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                            <div className="border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                                <h2 className="text-lg font-semibold text-[#1A1A1A]">Daftar Peserta</h2>
                                <p className="mt-1 text-sm text-[#787671]">
                                    {participants.length} peserta pada program terpilih. Potongan per peserta: {formatRupiah(deduction.total_deduction_per_user)}
                                    {deduction.calculated_at ? `, dihitung ${deduction.calculated_at}` : ''}.
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-[1100px] divide-y divide-[#E5E3DF]">
                                    <thead className="bg-[#FAFAF9]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Program</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Saldo Setoran</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Admin Sesuai Bulan Aktif</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Total Potongan</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Saldo Bersih</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status Pencairan</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status Peserta</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Bergabung</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E3DF]">
                                        {participants.length > 0 ? participants.map((participant) => (
                                            <tr key={participant.id}>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-[#1A1A1A]">{participant.user?.name ?? '-'}</p>
                                                    <p className="text-xs text-[#787671]">{participant.user?.member_number || participant.user?.email || '-'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[#5D5B54]">{participant.program?.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">{formatRupiah(participant.deposit_balance ?? participant.balance)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">{formatRupiah(participant.admin_fee_total_per_user)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-[#E03131]">{formatRupiah(participant.total_deduction)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-[#15803D]">{formatRupiah(participant.net_balance)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${withdrawalStatusClass[participant.withdrawal_status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                        {participant.withdrawal_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select className="rounded-lg border border-[#E5E3DF] bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A]" value={participant.status} onChange={(e) => updateStatus(participant, e.target.value)}>
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-[#5D5B54]">{formatDateTime(participant.joined_at)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex flex-wrap justify-end gap-2">
                                                        <button onClick={() => openDepositModal(participant)} className="rounded-lg bg-[#16A34A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                                                            Tambah Setoran
                                                        </button>
                                                        <button onClick={() => deleteParticipant(participant)} className="rounded-lg bg-[#E03131] px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="10" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada peserta pada program ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                            <div className="border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                                <h2 className="text-lg font-semibold text-[#1A1A1A]">Riwayat Setoran Peserta</h2>
                                <p className="mt-1 text-sm text-[#787671]">
                                    Edit setoran dari sini jika nominal, tanggal, atau catatan salah input.
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[#E5E3DF]">
                                    <thead className="bg-[#FAFAF9]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Tanggal</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Nominal</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Catatan</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E3DF]">
                                        {deposits.length > 0 ? deposits.map((deposit) => (
                                            <tr key={deposit.id}>
                                                <td className="px-4 py-3 text-sm text-[#5D5B54]">{formatDateTime(deposit.created_at)}</td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-[#1A1A1A]">{deposit.user?.name ?? '-'}</p>
                                                    <p className="text-xs text-[#787671]">{deposit.user?.member_number || deposit.user?.email || '-'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-[#1A1A1A]">{formatRupiah(deposit.amount)}</td>
                                                <td className="px-4 py-3 text-sm text-[#5D5B54]">{deposit.note ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => openEditDepositModal(deposit)} className="rounded-lg border border-[#E5E3DF] bg-white px-3 py-2 text-sm font-semibold text-[#15803D] hover:bg-[#DCFCE7]">
                                                        Edit Setoran
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada setoran pada program ini.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {depositTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-xl border border-[#E5E3DF] bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1A1A1A]">Tambah Setoran Hari Raya</h2>
                                <p className="mt-1 text-sm text-[#787671]">
                                    {depositTarget.user?.name ?? '-'} - {depositTarget.program?.name ?? '-'}
                                </p>
                            </div>
                            <button onClick={closeDepositModal} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#787671] hover:bg-[#F6F5F4]">
                                x
                            </button>
                        </div>

                        <form onSubmit={submitDeposit} className="space-y-4 p-4 sm:p-6">
                            {depositForm.errors.participant && (
                                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-[#E03131]">
                                    {depositForm.errors.participant}
                                </p>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Nominal Setoran</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={inputClass}
                                    value={formatRupiahInput(depositForm.data.amount)}
                                    onChange={(e) => depositForm.setData('amount', onlyDigits(e.target.value))}
                                    placeholder="Rp 50.000"
                                />
                                {depositForm.errors.amount && <p className="mt-1 text-sm text-[#E03131]">{depositForm.errors.amount}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Tanggal Setoran</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={depositForm.data.deposit_date}
                                    onChange={(e) => depositForm.setData('deposit_date', e.target.value)}
                                />
                                {depositForm.errors.deposit_date && <p className="mt-1 text-sm text-[#E03131]">{depositForm.errors.deposit_date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Catatan</label>
                                <textarea
                                    className={`${inputClass} min-h-24`}
                                    value={depositForm.data.note}
                                    onChange={(e) => depositForm.setData('note', e.target.value)}
                                    placeholder="Contoh: Setoran tunai diterima admin"
                                />
                                {depositForm.errors.note && <p className="mt-1 text-sm text-[#E03131]">{depositForm.errors.note}</p>}
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeDepositModal} className="rounded-lg border border-[#E5E3DF] px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">
                                    Batal
                                </button>
                                <button disabled={depositForm.processing} className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-70">
                                    {depositForm.processing ? 'Menyimpan...' : 'Simpan Setoran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editDepositTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-xl border border-[#E5E3DF] bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1A1A1A]">Edit Setoran Hari Raya</h2>
                                <p className="mt-1 text-sm text-[#787671]">
                                    {editDepositTarget.user?.name ?? '-'} - transaksi #{editDepositTarget.id}
                                </p>
                            </div>
                            <button onClick={closeEditDepositModal} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#787671] hover:bg-[#F6F5F4]">
                                x
                            </button>
                        </div>

                        <form onSubmit={submitEditDeposit} className="space-y-4 p-4 sm:p-6">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Nominal Setoran</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={inputClass}
                                    value={formatRupiahInput(editDepositForm.data.amount)}
                                    onChange={(e) => editDepositForm.setData('amount', onlyDigits(e.target.value))}
                                    placeholder="Rp 50.000"
                                />
                                {editDepositForm.errors.amount && <p className="mt-1 text-sm text-[#E03131]">{editDepositForm.errors.amount}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Tanggal Setoran</label>
                                <input
                                    type="date"
                                    className={inputClass}
                                    value={editDepositForm.data.deposit_date}
                                    onChange={(e) => editDepositForm.setData('deposit_date', e.target.value)}
                                />
                                {editDepositForm.errors.deposit_date && <p className="mt-1 text-sm text-[#E03131]">{editDepositForm.errors.deposit_date}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Catatan</label>
                                <textarea
                                    className={`${inputClass} min-h-24`}
                                    value={editDepositForm.data.note}
                                    onChange={(e) => editDepositForm.setData('note', e.target.value)}
                                    placeholder="Contoh: Koreksi nominal setoran"
                                />
                                {editDepositForm.errors.note && <p className="mt-1 text-sm text-[#E03131]">{editDepositForm.errors.note}</p>}
                            </div>

                            <div className="rounded-lg bg-[#F6F5F4] px-4 py-3 text-sm text-[#5D5B54]">
                                Setelah disimpan, saldo peserta, laporan, buku tabungan, dan estimasi pencairan akan ikut menyesuaikan.
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button type="button" onClick={closeEditDepositModal} className="rounded-lg border border-[#E5E3DF] px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">
                                    Batal
                                </button>
                                <button disabled={editDepositForm.processing} className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-70">
                                    {editDepositForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
