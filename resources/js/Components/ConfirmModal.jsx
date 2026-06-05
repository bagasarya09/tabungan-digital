const modalConfig = {
    danger: {
        icon: '!',
        iconBox: 'bg-red-50 text-[#E03131] ring-red-200',
        confirmButton: 'border-[#E03131] bg-[#E03131] hover:bg-red-700 focus:ring-red-500',
    },
    success: {
        icon: '✓',
        iconBox: 'bg-green-50 text-[#15803D] ring-green-200',
        confirmButton: 'border-[#16A34A] bg-[#16A34A] hover:bg-[#15803D] focus:ring-green-500',
    },
    warning: {
        icon: '!',
        iconBox: 'bg-orange-50 text-[#DD5B00] ring-orange-200',
        confirmButton: 'border-[#DD5B00] bg-[#DD5B00] hover:bg-orange-700 focus:ring-orange-500',
    },
    info: {
        icon: 'i',
        iconBox: 'bg-blue-50 text-[#0075DE] ring-blue-200',
        confirmButton: 'border-[#0075DE] bg-[#0075DE] hover:bg-blue-700 focus:ring-blue-500',
    },
};

export default function ConfirmModal({
    show,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin ingin melanjutkan aksi ini?',
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    type = 'info',
    onConfirm,
    onCancel,
    processing = false,
}) {
    if (!show) {
        return null;
    }

    const config = modalConfig[type] ?? modalConfig.info;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#E5E3DF] bg-white p-5 shadow-2xl sm:p-6">
                <div className="flex items-start gap-4">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ${config.iconBox}`}
                    >
                        {config.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#5D5B54]">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={processing}
                        className="min-h-10 rounded-lg border border-[#E5E3DF] bg-white px-4 py-2 text-sm font-semibold text-[#5D5B54] hover:bg-[#F6F5F4] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className={`min-h-10 rounded-lg border px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${config.confirmButton}`}
                    >
                        {processing ? 'Memproses...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
