import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title = 'Tabungan Digital', subtitle = 'Kelola target, setoran, dan penarikan tabungan dengan rapi.' }) {
    return (
        <div className="min-h-screen bg-[#F6F5F4] font-sans text-[#1A1A1A]">
            <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <section className="hidden border-r border-[#E5E3DF] bg-[#FAFAF9] p-10 lg:flex lg:flex-col lg:justify-between">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16A34A] text-sm font-bold text-white">
                            TD
                        </div>
                        <div>
                            <p className="font-semibold text-[#1A1A1A]">
                                Tabungan Digital
                            </p>
                            <p className="text-xs text-[#787671]">
                                Personal saving workspace
                            </p>
                        </div>
                    </Link>

                    <div className="max-w-xl">
                        <p className="text-sm font-medium text-[#15803D]">
                            Inspired by Notion, built for saving
                        </p>
                        <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#1A1A1A]">
                            Satu ruang bersih untuk mengatur tabungan Anda.
                        </h1>
                        <p className="mt-5 text-base leading-7 text-[#5D5B54]">
                            Pantau target, ajukan setoran, tarik saldo dengan verifikasi admin, dan lihat histori transaksi tanpa tampilan yang berantakan.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                            {['Target tabungan', 'Approval aman', 'Riwayat transaksi', 'Notifikasi status'].map((item) => (
                                <div key={item} className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
                                    <div className="mb-3 h-2 w-12 rounded-full bg-[#16A34A]" />
                                    <p className="text-sm font-semibold text-[#1A1A1A]">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-[#787671]">
                        Secure workspace for user and admin.
                    </p>
                </section>

                <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
                    <div className="w-full max-w-md">
                        <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A] text-xs font-bold text-white">
                                TD
                            </div>
                            <div>
                                <p className="font-semibold text-[#1A1A1A]">
                                    Tabungan Digital
                                </p>
                                <p className="text-xs text-[#787671]">
                                    Saving workspace
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-[0_16px_48px_-24px_rgba(15,15,15,0.35)] sm:p-7">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-[#1A1A1A]">
                                    {title}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                                    {subtitle}
                                </p>
                            </div>

                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
