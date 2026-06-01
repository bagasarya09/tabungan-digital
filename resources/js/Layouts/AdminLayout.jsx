import { Link, usePage } from '@inertiajs/react';
import FlashAlert from '@/Components/FlashAlert';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    const menuItems = [
        {
            label: 'Dashboard Admin',
            href: '/admin/dashboard',
        },
        {
            label: 'Verifikasi Setoran',
            href: '/admin/deposits/verification',
        },
        {
            label: 'Input Setoran Manual',
            href: '/admin/deposits/manual',
        },
        {
            label: 'Data User',
            href: '/admin/users',
        },
        {
            label: 'Laporan Transaksi',
            href: '/admin/reports/transactions',
        },
    ];

    const isActive = (href) => {
        return window.location.pathname === href;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow">
                <div className="border-b border-slate-700 p-6">
                    <h1 className="text-xl font-bold text-white">
                        Tabungan Digital
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Admin Panel
                    </p>
                </div>

                <nav className="p-4">
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                                    isActive(item.href)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
                    <p className="mb-3 text-sm font-medium text-white">
                        {auth?.user?.name}
                    </p>

                    <Link
                        href="/profile"
                        className="mb-2 block rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                        Profile
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onBefore={() => confirm('Yakin ingin logout dari admin panel?')}
                        className="w-full rounded-lg bg-red-600 px-4 py-2 text-left text-sm text-white hover:bg-red-700"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="ml-64 min-h-screen">
                <header className="border-b bg-white px-6 py-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Admin Area
                    </h2>
                </header>

                <div className="p-6">
                    <FlashAlert />
                    {children}
                </div>
            </main>
        </div>
    );
}
