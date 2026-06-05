import Alert from '@/Components/Alert';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const dashboardHref = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    return (
        <div className="min-h-screen bg-[#F6F5F4] font-sans text-[#1A1A1A]">
            <header className="border-b border-[#E5E3DF] bg-[#FAFAF9]">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <Link href={dashboardHref} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A] text-xs font-bold text-white">
                            TD
                        </div>
                        <div>
                            <p className="font-semibold text-[#1A1A1A]">
                                Tabungan Digital
                            </p>
                            <p className="text-xs text-[#787671]">
                                Profile workspace
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={dashboardHref}
                            className="rounded-lg border border-[#E5E3DF] bg-white px-3 py-2 text-sm font-medium text-[#5D5B54] hover:bg-[#F6F5F4]"
                        >
                            Kembali Dashboard
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-lg bg-[#E03131] px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </header>

            {header && (
                <section className="border-b border-[#E5E3DF] bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </section>
            )}

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Alert />
                {children}
            </main>
        </div>
    );
}
