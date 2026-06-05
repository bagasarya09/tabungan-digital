const statusStyles = {
    pending: 'bg-orange-50 text-[#DD5B00] ring-orange-200',
    approved: 'bg-green-50 text-[#15803D] ring-green-200',
    success: 'bg-green-50 text-[#15803D] ring-green-200',
    rejected: 'bg-red-50 text-[#E03131] ring-red-200',
    error: 'bg-red-50 text-[#E03131] ring-red-200',
    active: 'bg-green-50 text-[#15803D] ring-green-200',
    completed: 'bg-blue-50 text-[#0075DE] ring-blue-200',
    cancelled: 'bg-red-50 text-[#E03131] ring-red-200',
    deposit: 'bg-green-50 text-[#15803D] ring-green-200',
    withdraw: 'bg-orange-50 text-[#DD5B00] ring-orange-200',
    admin: 'bg-blue-50 text-[#0075DE] ring-blue-200',
    user: 'bg-[#F6F5F4] text-[#5D5B54] ring-[#E5E3DF]',
};

export default function Badge({ value, children, className = '' }) {
    const key = String(value ?? children ?? '').toLowerCase();
    const classes = statusStyles[key] ?? 'bg-[#F6F5F4] text-[#5D5B54] ring-[#E5E3DF]';

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${classes} ${className}`}
        >
            {children ?? value}
        </span>
    );
}
