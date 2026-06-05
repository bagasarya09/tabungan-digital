export default function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-normal text-[#1A1A1A]">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-sm leading-6 text-[#787671]">
                        {subtitle}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {actions}
                </div>
            )}
        </div>
    );
}
