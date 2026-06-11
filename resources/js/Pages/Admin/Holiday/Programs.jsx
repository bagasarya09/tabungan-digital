import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Programs({ programs = [] }) {
    const [editTarget, setEditTarget] = useState(null);
    const form = useForm({
        name: '',
        holiday_type: 'idul_fitri',
        start_date: '',
        holiday_date: '',
        status: 'active',
        description: '',
    });

    const inputClass = 'min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15';
    const formatDate = (date) => date
        ? new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID')
        : '-';

    const resetForm = () => {
        setEditTarget(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();

        if (editTarget) {
            form.put(`/admin/holiday/programs/${editTarget.id}`, {
                preserveScroll: true,
                onSuccess: resetForm,
            });
            return;
        }

        form.post('/admin/holiday/programs', {
            preserveScroll: true,
            onSuccess: resetForm,
        });
    };

    const editProgram = (program) => {
        setEditTarget(program);
        form.setData({
            name: program.name ?? '',
            holiday_type: program.holiday_type ?? 'idul_fitri',
            start_date: program.start_date?.slice?.(0, 10) ?? '',
            holiday_date: program.holiday_date?.slice?.(0, 10) ?? '',
            status: program.status ?? 'active',
            description: program.description ?? '',
        });
        form.clearErrors();
    };

    const deleteProgram = (program) => {
        if (!window.confirm(`Hapus program "${program.name}"?`)) return;
        router.delete(`/admin/holiday/programs/${program.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Program Hari Raya" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-sm font-medium text-[#787671]">Tabungan Hari Raya</p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">Program Hari Raya</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                        Buat program Idul Fitri atau Idul Adha sebelum menambahkan peserta.
                    </p>
                </div>

                <form onSubmit={submit} className="rounded-xl border border-[#E5E3DF] bg-white p-4 sm:p-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Nama Program</label>
                            <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Contoh: Idul Fitri 2026" />
                            {form.errors.name && <p className="mt-1 text-sm text-[#E03131]">{form.errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Jenis Hari Raya</label>
                            <select className={inputClass} value={form.data.holiday_type} onChange={(e) => form.setData('holiday_type', e.target.value)}>
                                <option value="idul_fitri">Idul Fitri</option>
                                <option value="idul_adha">Idul Adha</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Tanggal Mulai</label>
                            <input type="date" className={inputClass} value={form.data.start_date} onChange={(e) => form.setData('start_date', e.target.value)} />
                            {form.errors.start_date && <p className="mt-1 text-sm text-[#E03131]">{form.errors.start_date}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Tanggal Hari Raya</label>
                            <input type="date" className={inputClass} value={form.data.holiday_date} onChange={(e) => form.setData('holiday_date', e.target.value)} />
                            {form.errors.holiday_date && <p className="mt-1 text-sm text-[#E03131]">{form.errors.holiday_date}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Status</label>
                            <select className={inputClass} value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">Deskripsi</label>
                            <input className={inputClass} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} placeholder="Catatan program" />
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        {editTarget && (
                            <button type="button" onClick={resetForm} className="rounded-lg border border-[#E5E3DF] px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">
                                Batal Edit
                            </button>
                        )}
                        <button disabled={form.processing} className="rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D] disabled:opacity-70">
                            {form.processing ? 'Menyimpan...' : editTarget ? 'Update Program' : 'Tambah Program'}
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-xl border border-[#E5E3DF] bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#E5E3DF]">
                            <thead className="bg-[#FAFAF9]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Program</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Periode</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Peserta</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#787671]">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#787671]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E3DF]">
                                {programs.length > 0 ? programs.map((program) => (
                                    <tr key={program.id}>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-semibold text-[#1A1A1A]">{program.name}</p>
                                            <p className="text-xs text-[#787671]">{program.holiday_type}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{formatDate(program.start_date)} - {formatDate(program.holiday_date)}</td>
                                        <td className="px-4 py-3 text-sm text-[#5D5B54]">{program.participants_count ?? 0} peserta</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-[#15803D]">{program.status}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => editProgram(program)} className="rounded-lg border border-[#E5E3DF] px-3 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4]">Edit</button>
                                                <button onClick={() => deleteProgram(program)} className="rounded-lg bg-[#E03131] px-3 py-2 text-sm font-semibold text-white hover:bg-red-700">Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-10 text-center text-sm text-[#787671]">Belum ada program hari raya.</td>
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
