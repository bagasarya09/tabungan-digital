import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Alert from '@/Components/Alert';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', icon: 'D' },
        { label: 'Target Tabungan', href: '/saving-goals', icon: 'T' },
        { label: 'Riwayat Transaksi', href: '/transactions', icon: 'R' },
        { label: 'Buku Tabungan', href: '/passbook', icon: 'B' },
        { label: 'Notifikasi', href: '/notifications', icon: 'N' },
    ];

    const isActive = (href) => window.location.pathname === href;

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="border-b border-[#E5E3DF] p-5">
                <h1 className="text-lg font-semibold text-[#15803D]">
                    Tabungan Digital
                </h1>
                <p className="mt-1 text-xs font-medium text-[#787671]">
                    User Workspace
                </p>
            </div>

            <nav className="flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                isActive(item.href)
                                    ? 'bg-[#DCFCE7] text-[#15803D]'
                                    : 'text-[#5D5B54] hover:bg-[#F6F5F4] hover:text-[#1A1A1A]'
                            }`}
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-xs font-semibold text-[#15803D] ring-1 ring-[#E5E3DF]">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="border-t border-[#E5E3DF] p-4">
                <p className="truncate text-sm font-semibold text-[#1A1A1A]">
                    {auth?.user?.name}
                </p>
                <p className="mt-1 truncate text-xs text-[#787671]">
                    {auth?.user?.email}
                </p>

                <Link
                    href="/profile"
                    className="mt-3 block rounded-lg px-3 py-2 text-sm font-medium text-[#5D5B54] hover:bg-[#F6F5F4]"
                >
                    Profile
                </Link>

                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="mt-2 w-full rounded-lg bg-[#E03131] px-3 py-2 text-left text-sm font-medium text-white hover:bg-red-700"
                >
                    Logout
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F6F5F4] font-sans text-[#1A1A1A]">
            <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-[#E5E3DF] bg-[#FAFAF9] print:hidden lg:block">
                <SidebarContent />
            </aside>

            {sidebarOpen && (
                <div className="fixed inset-0 z-[9997] lg:hidden">
                    <button
                        type="button"
                        aria-label="Tutup sidebar"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 bg-black/40"
                    />
                    <aside className="relative h-full w-72 max-w-[85vw] border-r border-[#E5E3DF] bg-[#FAFAF9] shadow-2xl">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            <main className="min-h-screen print:ml-0 lg:ml-72">
                <header className="sticky top-0 z-40 border-b border-[#E5E3DF] bg-[#FAFAF9]/95 px-4 py-3 backdrop-blur print:hidden sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg border border-[#E5E3DF] bg-white px-3 py-2 text-sm font-semibold text-[#1A1A1A] lg:hidden"
                            >
                                Menu
                            </button>
                            <div>
                                <p className="text-sm font-semibold text-[#1A1A1A]">
                                    Selamat datang, {auth?.user?.name}
                                </p>
                                <p className="text-xs text-[#787671]">
                                    Kelola tabungan dengan ringkas dan rapi.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 print:p-0 sm:p-6">
                    <Alert />
                    {children}
                </div>
            </main>
        </div>
    );
}
