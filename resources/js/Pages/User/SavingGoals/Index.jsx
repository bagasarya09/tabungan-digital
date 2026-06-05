import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Badge from '@/Components/Badge';
import Button from '@/Components/Button';
import ConfirmModal from '@/Components/ConfirmModal';
import EmptyState from '@/Components/EmptyState';
import PageHeader from '@/Components/PageHeader';
import SectionCard from '@/Components/SectionCard';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ savingGoals = [], filters }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        status: filters?.status || '',
    });

    const createForm = useForm({
        title: '',
        target_amount: '',
        deadline: '',
        description: '',
    });

    const editForm = useForm({
        title: '',
        target_amount: '',
        deadline: '',
        status: 'active',
        description: '',
    });

    const goals = Array.isArray(savingGoals) ? savingGoals : savingGoals.data ?? [];

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    const inputClass =
        'min-h-11 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm text-[#1A1A1A] outline-none transition placeholder:text-[#787671] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/15';

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();

        createForm.post('/saving-goals', {
            preserveScroll: true,
            onSuccess: closeCreateModal,
        });
    };

    const openEditModal = (goal) => {
        setSelectedGoal(goal);
        editForm.setData({
            title: goal.title || '',
            target_amount: goal.target_amount || '',
            deadline: goal.deadline || '',
            status: goal.status || 'active',
            description: goal.description || '',
        });
        editForm.clearErrors();
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedGoal(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submitEdit = (e) => {
        e.preventDefault();

        if (!selectedGoal) return;

        editForm.put(`/saving-goals/${selectedGoal.id}`, {
            preserveScroll: true,
            onSuccess: closeEditModal,
        });
    };

    const confirmDeleteGoal = () => {
        if (!deleteTarget) return;

        setDeleteProcessing(true);

        router.delete(`/saving-goals/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
            onFinish: () => setDeleteProcessing(false),
        });
    };

    const applyFilter = (e) => {
        e.preventDefault();

        router.get('/saving-goals', filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        const emptyFilter = { search: '', status: '' };

        setFilterData(emptyFilter);
        router.get('/saving-goals', emptyFilter, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const ModalShell = ({ title, description, onClose, children }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#E5E3DF] bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-[#E5E3DF] px-4 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-[#787671]">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-[#787671] hover:bg-[#F6F5F4]"
                        aria-label="Tutup modal"
                    >
                        x
                    </button>
                </div>
                <div className="p-4 sm:p-6">{children}</div>
            </div>
        </div>
    );

    const GoalForm = ({ form, onSubmit, submitText, processingText, onCancel, isEdit = false }) => (
        <form onSubmit={onSubmit} className="space-y-5">
            <div>
                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                    Nama Target
                </label>
                <input
                    type="text"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    className={inputClass}
                    placeholder="Contoh: Beli Laptop"
                />
                {form.errors.title && (
                    <p className="mt-1 text-sm text-[#E03131]">{form.errors.title}</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                        Nominal Target
                    </label>
                    <input
                        type="number"
                        value={form.data.target_amount}
                        onChange={(e) => form.setData('target_amount', e.target.value)}
                        className={inputClass}
                        placeholder="Contoh: 1000000"
                    />
                    {form.errors.target_amount && (
                        <p className="mt-1 text-sm text-[#E03131]">
                            {form.errors.target_amount}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                        Deadline
                    </label>
                    <input
                        type="date"
                        value={form.data.deadline}
                        onChange={(e) => form.setData('deadline', e.target.value)}
                        className={inputClass}
                    />
                    {form.errors.deadline && (
                        <p className="mt-1 text-sm text-[#E03131]">
                            {form.errors.deadline}
                        </p>
                    )}
                </div>
            </div>

            {isEdit && (
                <div>
                    <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                        Status
                    </label>
                    <select
                        value={form.data.status}
                        onChange={(e) => form.setData('status', e.target.value)}
                        className={inputClass}
                    >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {form.errors.status && (
                        <p className="mt-1 text-sm text-[#E03131]">{form.errors.status}</p>
                    )}
                </div>
            )}

            <div>
                <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                    Deskripsi
                </label>
                <textarea
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    className={`${inputClass} min-h-28`}
                    rows="4"
                    placeholder="Catatan tambahan untuk target tabungan"
                />
                {form.errors.description && (
                    <p className="mt-1 text-sm text-[#E03131]">
                        {form.errors.description}
                    </p>
                )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={form.processing}
                    className="w-full sm:w-auto"
                >
                    {form.processing ? processingText : submitText}
                </Button>
            </div>
        </form>
    );

    return (
        <UserLayout>
            <Head title="Target Tabungan" />

            <div className="mx-auto max-w-6xl space-y-6">
                <PageHeader
                    title="Target Tabungan"
                    subtitle="Kelola target, pantau progress, dan sesuaikan rencana tabungan Anda."
                    actions={
                        <Button onClick={openCreateModal} className="w-full sm:w-auto">
                            + Tambah Target
                        </Button>
                    }
                />

                <SectionCard
                    title="Filter Target"
                    description="Cari target berdasarkan nama atau status."
                >
                    <form onSubmit={applyFilter} className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Cari Target
                            </label>
                            <input
                                type="text"
                                value={filterData.search}
                                onChange={(e) =>
                                    setFilterData({ ...filterData, search: e.target.value })
                                }
                                className={inputClass}
                                placeholder="Contoh: laptop, liburan"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-[#5D5B54]">
                                Status
                            </label>
                            <select
                                value={filterData.status}
                                onChange={(e) =>
                                    setFilterData({ ...filterData, status: e.target.value })
                                }
                                className={inputClass}
                            >
                                <option value="">Semua Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row md:items-end">
                            <Button type="submit" className="w-full sm:w-auto">
                                Cari
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={resetFilter}
                                className="w-full sm:w-auto"
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </SectionCard>

                {goals.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {goals.map((goal) => {
                            const progress =
                                goal.target_amount > 0
                                    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                                    : 0;

                            return (
                                <article
                                    key={goal.id}
                                    className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h2 className="break-words text-lg font-semibold text-[#1A1A1A]">
                                                {goal.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-[#787671]">
                                                Deadline: {goal.deadline ?? '-'}
                                            </p>
                                        </div>
                                        <Badge value={goal.status} />
                                    </div>

                                    <div className="mt-5 rounded-xl bg-[#FAFAF9] p-4">
                                        <p className="text-xs font-semibold uppercase text-[#787671]">
                                            Terkumpul
                                        </p>
                                        <p className="mt-2 break-words text-lg font-semibold text-[#1A1A1A]">
                                            {formatRupiah(goal.current_amount)}
                                        </p>
                                        <p className="text-sm text-[#787671]">
                                            dari {formatRupiah(goal.target_amount)}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <div className="h-3 overflow-hidden rounded-full bg-[#DCFCE7]">
                                            <div
                                                className="h-full rounded-full bg-[#16A34A]"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-[#5D5B54]">
                                            Progress {progress.toFixed(0)}%
                                        </p>
                                    </div>

                                    {goal.description && (
                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#5D5B54]">
                                            {goal.description}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center gap-2">
                                        <Button
                                            variant="warning"
                                            onClick={() => openEditModal(goal)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => setDeleteTarget(goal)}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        title="Belum ada target tabungan"
                        description="Buat target pertama untuk mulai memantau progress tabungan Anda."
                        action={{ label: '+ Tambah Target', onClick: openCreateModal }}
                    />
                )}
            </div>

            {showCreateModal && (
                <ModalShell
                    title="Tambah Target Tabungan"
                    description="Buat target tabungan baru sesuai kebutuhan Anda."
                    onClose={closeCreateModal}
                >
                    <GoalForm
                        form={createForm}
                        onSubmit={submitCreate}
                        submitText="Simpan Target"
                        processingText="Menyimpan..."
                        onCancel={closeCreateModal}
                    />
                </ModalShell>
            )}

            {showEditModal && selectedGoal && (
                <ModalShell
                    title="Edit Target Tabungan"
                    description="Perbarui data target tabungan Anda."
                    onClose={closeEditModal}
                >
                    <GoalForm
                        form={editForm}
                        onSubmit={submitEdit}
                        submitText="Update Target"
                        processingText="Menyimpan..."
                        onCancel={closeEditModal}
                        isEdit
                    />
                </ModalShell>
            )}

            <ConfirmModal
                show={Boolean(deleteTarget)}
                title="Hapus Target Tabungan"
                message={`Yakin ingin menghapus target "${deleteTarget?.title}"? Data target yang dihapus tidak bisa dikembalikan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
                processing={deleteProcessing}
                onConfirm={confirmDeleteGoal}
                onCancel={() => {
                    if (!deleteProcessing) setDeleteTarget(null);
                }}
            />
        </UserLayout>
    );
}
