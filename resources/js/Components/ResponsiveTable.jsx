export default function ResponsiveTable({ children, className = '' }) {
    return (
        <div className={`overflow-hidden rounded-xl border border-[#E5E3DF] bg-white ${className}`}>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#E5E3DF] text-sm">
                    {children}
                </table>
            </div>
        </div>
    );
}
