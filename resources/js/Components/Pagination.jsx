import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) {
        return null;
    }

    const labelText = (label) => {
        return label
            .replace('&laquo;', '<')
            .replace('&raquo;', '>')
            .replace('Previous', 'Prev')
            .replace('Next', 'Next');
    };

    return (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {links.map((link, index) => {
                const isDisabled = !link.url;
                const isActive = link.active;

                if (isDisabled) {
                    return (
                        <span
                            key={`${link.label}-${index}`}
                            className="rounded-lg border border-[#E5E3DF] bg-[#F6F5F4] px-3 py-2 text-sm font-semibold text-[#787671]"
                        >
                            {labelText(link.label)}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                            isActive
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-[#E5E3DF] bg-white text-[#5D5B54] hover:bg-[#F6F5F4] hover:text-[#1A1A1A]'
                        }`}
                    >
                        {labelText(link.label)}
                    </Link>
                );
            })}
        </div>
    );
}
