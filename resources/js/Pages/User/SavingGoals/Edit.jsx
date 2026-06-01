import { Head, Link, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Edit({ savingGoal }) {
    const { data, setData, put, processing, errors } = useForm({
        title: savingGoal.title || '',
        target_amount: savingGoal.target_amount || '',
        deadline: savingGoal.deadline || '',
        status: savingGoal.status || 'active',
        description: savingGoal.description || '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (!confirm('Simpan perubahan target tabungan ini?')) {
            return;
        }

        put(`/saving-goals/${savingGoal.id}`);
    };

    return (
        <UserLayout>
            <Head title="Edit Target Tabungan" />

            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Target Tabungan
                    </h1>
                    <p className="text-gray-600">
                        Perbarui data target tabungan Anda.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Nama Target
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Nominal Target
                        </label>
                        <input
                            type="number"
                            value={data.target_amount}
                            onChange={(e) => setData('target_amount', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        {errors.target_amount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.target_amount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={data.deadline}
                            onChange={(e) => setData('deadline', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        />
                        {errors.deadline && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.deadline}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.status}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            rows="4"
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/saving-goals"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Update Target'}
                        </button>
                    </div>
                </form>
            </div>
        </UserLayout>
    );
}
