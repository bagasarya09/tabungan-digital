export default function StatCard({ title, value, icon, tone = 'green' }) {
    const tones = {
        green: 'bg-[#DCFCE7] text-[#15803D]',
        blue: 'bg-blue-50 text-blue-700',
        yellow: 'bg-yellow-50 text-yellow-700',
        red: 'bg-red-50 text-red-700',
        gray: 'bg-[#F6F5F4] text-[#5D5B54]',
    };

    return (
        <div className="rounded-xl border border-[#E5E3DF] bg-white p-4 shadow-[0_1px_2px_rgba(15,15,15,0.04)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-[#787671]">
                        {title}
                    </p>
                    <h2 className="mt-2 break-words text-2xl font-semibold text-[#1A1A1A]">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${tones[tone] ?? tones.green}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
