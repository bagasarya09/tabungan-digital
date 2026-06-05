import Button from '@/Components/Button';

export default function EmptyState({
    title = 'Data belum tersedia',
    description = 'Belum ada data yang bisa ditampilkan saat ini.',
    action,
}) {
    return (
        <div className="rounded-xl border border-dashed border-[#E5E3DF] bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7] text-lg font-bold text-[#15803D]">
                i
            </div>
            <h3 className="mt-4 text-base font-semibold text-[#1A1A1A]">
                {title}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#787671]">
                {description}
            </p>
            {action && (
                <div className="mt-5">
                    <Button onClick={action.onClick} href={action.href}>
                        {action.label}
                    </Button>
                </div>
            )}
        </div>
    );
}
