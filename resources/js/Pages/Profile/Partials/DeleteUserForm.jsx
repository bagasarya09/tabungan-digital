import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                    Hapus Akun
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#5D5B54]">
                    Setelah akun dihapus, semua data terkait akun akan ikut dihapus permanen. Gunakan aksi ini hanya jika benar-benar diperlukan.
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="mt-5 rounded-lg bg-[#E03131] px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
            >
                Hapus Akun
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-700">
                            !
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">
                                Konfirmasi hapus akun
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                                Masukkan password untuk memastikan Anda benar-benar ingin menghapus akun ini secara permanen.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <label htmlFor="password" className="text-sm font-medium text-[#1A1A1A]">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-2 w-full rounded-lg border border-[#E5E3DF] bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                            autoFocus
                            placeholder="Masukkan password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={processing}
                            className="rounded-lg border border-[#E5E3DF] px-4 py-3 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4] disabled:opacity-60"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#E03131] px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
