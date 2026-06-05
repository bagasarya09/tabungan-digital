import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ notifications, unreadCount }) {
    const [showReadAllModal, setShowReadAllModal] = useState(false);
    const [readAllProcessing, setReadAllProcessing] = useState(false);

    const typeClass = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };

    const formatDate = (date) => {
        if (!date) return '-';

        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const markAsRead = (notificationId) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        setShowReadAllModal(true);
    };

    const closeReadAllModal = () => {
        if (readAllProcessing) return;

        setShowReadAllModal(false);
    };

    const confirmMarkAllAsRead = () => {
        setReadAllProcessing(true);

        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setShowReadAllModal(false);
            },
            onFinish: () => {
                setReadAllProcessing(false);
            },
        });
    };

    const notificationItems = notifications?.data ?? [];

    return (
        <UserLayout>
            <Head title="Notifikasi" />

            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Notifikasi
                        </h1>
                        <p className="text-gray-600">
                            Informasi status setoran dan aktivitas tabungan Anda.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Notifikasi</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {notifications.total}
                        </h2>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Belum Dibaca</p>
                        <h2 className="mt-2 text-2xl font-bold text-gray-800">
                            {unreadCount}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    {notificationItems.length > 0 ? (
                        notificationItems.map((notification) => (
                            <div
                                key={notification.id}
                                className={`rounded-xl border bg-white p-5 shadow ${
                                    notification.is_read
                                        ? 'border-gray-200 opacity-80'
                                        : 'border-blue-300'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-2 flex items-center gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    typeClass[notification.type] ??
                                                    'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {notification.type}
                                            </span>

                                            {!notification.is_read && (
                                                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                                                    Baru
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-800">
                                            {notification.title}
                                        </h2>

                                        <p className="mt-1 text-gray-600">
                                            {notification.message}
                                        </p>

                                        <p className="mt-3 text-sm text-gray-400">
                                            {formatDate(notification.created_at)}
                                        </p>
                                    </div>

                                    {!notification.is_read && (
                                        <button
                                            type="button"
                                            onClick={() => markAsRead(notification.id)}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Tandai Dibaca
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl bg-white p-8 text-center shadow">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Belum ada notifikasi
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Notifikasi status setoran akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>

                <Pagination links={notifications.links} />
            </div>

            <ConfirmModal
                show={showReadAllModal}
                title="Tandai Semua Dibaca"
                message="Semua notifikasi yang belum dibaca akan ditandai sebagai sudah dibaca."
                confirmText="Ya, Tandai"
                cancelText="Batal"
                type="info"
                processing={readAllProcessing}
                onConfirm={confirmMarkAllAsRead}
                onCancel={closeReadAllModal}
            />
        </UserLayout>
    );
}
