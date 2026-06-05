export default function SectionCard({ title, description, actions, children, className = '' }) {
    return (
        <section className={`rounded-xl border border-[#E5E3DF] bg-white shadow-[0_1px_2px_rgba(15,15,15,0.04)] ${className}`}>
            {(title || description || actions) && (
                <div className="flex flex-col gap-3 border-b border-[#E5E3DF] px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                    <div>
                        {title && (
                            <h2 className="text-base font-semibold text-[#1A1A1A]">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="mt-1 text-sm leading-6 text-[#787671]">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex flex-wrap items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className="p-4 sm:p-5">{children}</div>
        </section>
    );
}
