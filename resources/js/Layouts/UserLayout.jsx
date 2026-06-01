import { Link, usePage } from '@inertiajs/react';
import FlashAlert from '@/Components/FlashAlert';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;

    const menuItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        {
            label: 'Target Tabungan',
            href: '/saving-goals',
        },
        {
            label: 'Riwayat Transaksi',
            href: '/transactions',
        },
        {
            label: 'Tambah Setoran',
            href: '/transactions/create',
        },
    ];

    const isActive = (href) => {
        return window.location.pathname === href;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow">
                <div className="border-b p-6">
                    <h1 className="text-xl font-bold text-blue-600">
                        Tabungan Digital
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        User Panel
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
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="absolute bottom-0 w-full border-t p-4">
                    <p className="mb-3 text-sm font-medium text-gray-800">
                        {auth?.user?.name}
                    </p>

                    <Link
                        href="/profile"
                        className="mb-2 block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Profile
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onBefore={() => confirm('Yakin ingin logout?')}
                        className="w-full rounded-lg bg-red-600 px-4 py-2 text-left text-sm text-white hover:bg-red-700"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="ml-64 min-h-screen">
                <header className="border-b bg-white px-6 py-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Selamat datang, {auth?.user?.name}
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
