import { Link } from '@inertiajs/react';

const variants = {
    primary: 'border-[#16A34A] bg-[#16A34A] text-white hover:bg-[#15803D]',
    secondary: 'border-[#E5E3DF] bg-white text-[#1A1A1A] hover:bg-[#F6F5F4]',
    danger: 'border-[#E03131] bg-[#E03131] text-white hover:bg-red-700',
    warning: 'border-[#DD5B00] bg-[#DD5B00] text-white hover:bg-orange-700',
    ghost: 'border-transparent bg-transparent text-[#5D5B54] hover:bg-[#F6F5F4] hover:text-[#1A1A1A]',
};

export default function Button({
    as = 'button',
    href,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    const classes = [
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant] ?? variants.primary,
        className,
    ].join(' ');

    if (as === Link || href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} disabled={disabled} className={classes} {...props}>
            {children}
        </button>
    );
}
