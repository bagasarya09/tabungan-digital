import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Programs({ programs = [] }) {
    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
    const formatDate = (date) => date
        ? new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID')
        : '-';

    return (
        <UserLayout>
            <Head title="Program Hari Raya" />
            <div className="mx-auto max-w-6xl space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#1A1A1A]">Program Hari Raya</h1>
                    <p className="mt-2 text-sm leading-6 text-[#5D5B54]">Daftar program yang Anda ikuti.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {programs.length > 0 ? programs.map((program) => (
                        <Link key={program.id} href={`/holiday/programs/${program.id}`} className="rounded-xl border border-[#E5E3DF] bg-white p-5 hover:border-[#16A34A]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#1A1A1A]">{program.name}</h2>
                                    <p className="mt-1 text-sm text-[#787671]">{formatDate(program.start_date)} - {formatDate(program.holiday_date)}</p>
                                    <p className="mt-1 text-sm text-[#787671]">Status peserta: {program.participant_status}</p>
                                </div>
                                <p className="text-sm font-semibold text-[#15803D]">{formatRupiah(program.balance)}</p>
                            </div>
                        </Link>
                    )) : <div className="rounded-xl border border-[#E5E3DF] bg-white p-6 text-sm text-[#787671]">Belum ada program hari raya yang Anda ikuti.</div>}
                </div>
            </div>
        </UserLayout>
    );
}
