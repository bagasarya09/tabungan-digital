import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const alertConfig = {
    success: {
        icon: '✓',
        title: 'Berhasil',
        wrapper: 'border-green-200 bg-white text-green-800 shadow-green-100',
        iconBox: 'bg-green-50 text-[#15803D] ring-green-200',
        close: 'text-green-700 hover:bg-green-50',
    },
    error: {
        icon: '!',
        title: 'Gagal',
        wrapper: 'border-red-200 bg-white text-red-800 shadow-red-100',
        iconBox: 'bg-red-50 text-[#E03131] ring-red-200',
        close: 'text-red-700 hover:bg-red-50',
    },
    warning: {
        icon: '!',
        title: 'Perhatian',
        wrapper: 'border-orange-200 bg-white text-orange-800 shadow-orange-100',
        iconBox: 'bg-orange-50 text-[#DD5B00] ring-orange-200',
        close: 'text-orange-700 hover:bg-orange-50',
    },
    info: {
        icon: 'i',
        title: 'Informasi',
        wrapper: 'border-blue-200 bg-white text-blue-800 shadow-blue-100',
        iconBox: 'bg-blue-50 text-[#0075DE] ring-blue-200',
        close: 'text-blue-700 hover:bg-blue-50',
    },
};

export default function Alert({ duration = 4000 }) {
    const { flash = {}, errors = {} } = usePage().props;
    const [visible, setVisible] = useState(false);

    const alert = useMemo(() => {
        if (flash.success) {
            return { type: 'success', message: flash.success };
        }

        if (flash.error) {
            return { type: 'error', message: flash.error };
        }

        if (flash.warning) {
            return { type: 'warning', message: flash.warning };
        }

        if (flash.info) {
            return { type: 'info', message: flash.info };
        }

        const firstError = Object.values(errors)[0];

        if (firstError) {
            return { type: 'error', message: firstError };
        }

        return null;
    }, [flash.success, flash.error, flash.warning, flash.info, errors]);

    useEffect(() => {
        if (!alert?.message) {
            setVisible(false);
            return undefined;
        }

        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [alert?.type, alert?.message, duration]);

    if (!alert?.message || !visible) {
        return null;
    }

    const config = alertConfig[alert.type] ?? alertConfig.info;

    return (
        <div
            className={`fixed right-4 top-4 z-[10000] flex w-[calc(100vw-2rem)] max-w-md items-start gap-3 rounded-xl border px-4 py-4 shadow-lg sm:right-6 sm:top-6 ${config.wrapper}`}
            role="alert"
        >
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ${config.iconBox}`}
            >
                {config.icon}
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                    {config.title}
                </p>
                <p className="mt-1 break-words text-sm leading-6">
                    {alert.message}
                </p>
            </div>

            <button
                type="button"
                onClick={() => setVisible(false)}
                className={`rounded-lg px-2 py-1 text-sm font-bold transition ${config.close}`}
                aria-label="Tutup alert"
            >
                x
            </button>
        </div>
    );
}
