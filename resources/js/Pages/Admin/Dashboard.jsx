import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Head title="Dashboard Admin" />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard Admin
                </h1>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </Link>
            </div>
            <p className="mt-2 text-gray-600">
                Selamat datang di halaman admin Tabungan Digital.
            </p>
        </div>
    );
}
