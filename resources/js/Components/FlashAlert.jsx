import { usePage } from '@inertiajs/react';

export default function FlashAlert() {
    const { flash = {}, errors = {} } = usePage().props;

    const firstError = Object.values(errors)[0];
    const message = flash.success || flash.error || firstError;
    const type = flash.success ? 'success' : 'error';

    if (!message) {
        return null;
    }

    const classes =
        type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-800';

    return (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${classes}`}>
            {message}
        </div>
    );
}
