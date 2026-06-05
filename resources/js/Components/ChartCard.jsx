import EmptyState from '@/Components/EmptyState';

export default function ChartCard({ title, description, hasData = true, children }) {
    return (
        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-5">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-[#1A1A1A]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm leading-6 text-[#787671]">
                        {description}
                    </p>
                )}
            </div>

            <div className="h-72">
                {hasData ? children : (
                    <EmptyState
                        title="Chart belum memiliki data"
                        description="Data akan muncul setelah transaksi tersedia pada filter yang dipilih."
                    />
                )}
            </div>
        </div>
    );
}
