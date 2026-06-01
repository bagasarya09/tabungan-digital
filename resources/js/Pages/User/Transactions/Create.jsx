import { Link, useForm } from '@inertiajs/react';

export default function Create({ savingGoals }) {
    const { data, setData, post, processing, errors } = useForm({
        saving_goal_id: '',
        amount: '',
        note: '',
        proof_image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post('/transactions', {
            forceFormData: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Tambah Setoran
                    </h1>
                    <p className="text-gray-600">
                        Ajukan setoran tabungan. Saldo akan bertambah setelah disetujui admin.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Pilih Target Tabungan
                        </label>
                        <select
                            value={data.saving_goal_id}
                            onChange={(e) => setData('saving_goal_id', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">-- Pilih Target --</option>
                            {savingGoals.map((goal) => (
                                <option key={goal.id} value={goal.id}>
                                    {goal.title}
                                </option>
                            ))}
                        </select>
                        {errors.saving_goal_id && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.saving_goal_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Nominal Setoran
                        </label>
                        <input
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Contoh: 50000"
                        />
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Bukti Setoran
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('proof_image', e.target.files[0])}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                        {errors.proof_image && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.proof_image}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block font-medium text-gray-700">
                            Catatan
                        </label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                            rows="4"
                            placeholder="Contoh: Setoran dari uang jajan minggu ini"
                        ></textarea>
                        {errors.note && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.note}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/transactions"
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Mengirim...' : 'Ajukan Setoran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}