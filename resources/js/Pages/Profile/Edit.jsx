import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium text-[#787671]">
                        Pengaturan akun
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-[#1A1A1A]">
                        Profile
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5D5B54]">
                        Perbarui identitas akun, keamanan password, dan pengaturan akses akun Anda.
                    </p>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <aside className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DCFCE7] text-lg font-bold text-[#15803D]">
                        TD
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-[#1A1A1A]">
                        Ruang personal Anda
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                        Data profile dipakai untuk identitas user/admin di dashboard, transaksi, activity log, dan approval.
                    </p>
                    <div className="mt-5 rounded-xl bg-[#F6F5F4] p-4">
                        <p className="text-xs font-semibold uppercase text-[#787671]">
                            Tips keamanan
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                            Gunakan password unik dan jangan bagikan akun admin kepada orang lain.
                        </p>
                    </div>
                </aside>

                <div className="space-y-5">
                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                        <UpdatePasswordForm />
                    </div>

                    <div className="rounded-xl border border-red-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-6">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
