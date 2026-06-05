import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const barData = [
    { bulan: 'Jan', setoran: 400000, penarikan: 120000 },
    { bulan: 'Feb', setoran: 300000, penarikan: 80000 },
    { bulan: 'Mar', setoran: 600000, penarikan: 200000 },
    { bulan: 'Apr', setoran: 450000, penarikan: 150000 },
    { bulan: 'Mei', setoran: 700000, penarikan: 100000 },
    { bulan: 'Jun', setoran: 520000, penarikan: 90000 },
];
const lineData = [
    { bulan: 'Jan', saldo: 800000 },
    { bulan: 'Feb', saldo: 1020000 },
    { bulan: 'Mar', saldo: 1420000 },
    { bulan: 'Apr', saldo: 1720000 },
    { bulan: 'Mei', saldo: 2320000 },
    { bulan: 'Jun', saldo: 2750000 },
];
const pieData = [
    { name: 'Selesai', value: 3 },
    { name: 'Aktif', value: 5 },
    { name: 'Menunggu', value: 2 },
];
const PIE_COLORS = ['#16A34A', '#DCFCE7', '#BBF7D0'];

const fmtRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID');

// ─── FAQ Items ─────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
    {
        q: 'Apakah saldo langsung berubah saat user mengajukan setoran?',
        a: 'Tidak. Saldo baru bertambah setelah admin menyetujui (approve) pengajuan setoran tersebut.',
    },
    {
        q: 'Apakah user bisa menarik lebih dari saldo yang tersedia?',
        a: 'Tidak, sistem memvalidasi agar jumlah penarikan tidak melebihi saldo yang tersedia saat itu.',
    },
    {
        q: 'Apakah transaksi bisa dicetak?',
        a: 'Bisa. Tersedia fitur Buku Tabungan dan Laporan Transaksi yang bisa dicetak kapan saja.',
    },
    {
        q: 'Apakah admin bisa mencatat setoran secara manual?',
        a: 'Bisa. Admin dapat menginput setoran manual dengan status langsung approved tanpa perlu menunggu pengajuan dari user.',
    },
    {
        q: 'Apakah semua aktivitas sistem tercatat?',
        a: 'Ya, sistem memiliki fitur Activity Log yang mencatat semua aktivitas penting untuk keperluan audit dan keamanan.',
    },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-[#E5E3DF] last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-4 text-left gap-4"
            >
                <span className="text-[#1A1A1A] font-medium text-sm md:text-base">{q}</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#E5E3DF] flex items-center justify-center text-[#16A34A] font-bold text-lg leading-none">
                    {open ? '−' : '+'}
                </span>
            </button>
            {open && (
                <p className="pb-4 text-[#5D5B54] text-sm leading-relaxed">{a}</p>
            )}
        </div>
    );
}

// ─── Icons ─────────────────────────────────────────────────────────────────────
const IconWallet = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="6" width="20" height="14" rx="2" />
        <path d="M16 13h2" />
        <path d="M2 10h20" />
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
);
const IconTarget = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
);
const IconCheck = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#16A34A] flex-shrink-0">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconShield = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Welcome({ auth = {}, canLogin, canRegister }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Beranda', href: '#beranda' },
        { label: 'Fitur', href: '#fitur' },
        { label: 'Cara Kerja', href: '#cara-kerja' },
        { label: 'Keamanan', href: '#keamanan' },
        { label: 'FAQ', href: '#faq' },
    ];

    return (
        <>
            <Head title="Tabungan Digital — Kelola Tabungan Lebih Rapi" />

            <div className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] font-sans antialiased">

                {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
                <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#E5E3DF]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <a href="#beranda" className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-[#DCFCE7] rounded-lg flex items-center justify-center text-[#16A34A]">
                                    <IconWallet />
                                </div>
                                <span className="font-semibold text-[#1A1A1A] text-base tracking-tight">Tabungan Digital</span>
                            </a>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map(l => (
                                    <a key={l.label} href={l.href}
                                        className="px-3 py-2 text-sm text-[#5D5B54] hover:text-[#16A34A] hover:bg-[#DCFCE7] rounded-md transition-colors">
                                        {l.label}
                                    </a>
                                ))}
                            </div>

                            {/* Desktop Buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                {auth?.user ? (
                                    <Link href={route('dashboard')}
                                        className="px-4 py-2 text-sm font-medium text-[#16A34A] border border-[#16A34A] rounded-lg hover:bg-[#DCFCE7] transition-colors">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link href={route('login')}
                                                className="px-4 py-2 text-sm font-medium text-[#5D5B54] hover:text-[#1A1A1A] transition-colors">
                                                Login
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link href={route('register')}
                                                className="px-4 py-2 text-sm font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors">
                                                Daftar Gratis
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Hamburger */}
                            <button onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-md text-[#5D5B54] hover:bg-[#F6F5F4]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    {mobileOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Drawer */}
                    {mobileOpen && (
                        <div className="md:hidden border-t border-[#E5E3DF] bg-white px-4 py-4 space-y-1">
                            {navLinks.map(l => (
                                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                    className="block px-3 py-2.5 text-sm text-[#5D5B54] hover:text-[#16A34A] hover:bg-[#DCFCE7] rounded-md transition-colors">
                                    {l.label}
                                </a>
                            ))}
                            <div className="pt-3 border-t border-[#E5E3DF] flex flex-col gap-2">
                                {canLogin && (
                                    <Link href={route('login')}
                                        className="w-full text-center px-4 py-2.5 text-sm font-medium border border-[#E5E3DF] rounded-lg text-[#5D5B54] hover:border-[#16A34A] hover:text-[#16A34A] transition-colors">
                                        Login
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')}
                                        className="w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors">
                                        Daftar Gratis
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </nav>

                {/* ══ HERO ═════════════════════════════════════════════════════ */}
                <section id="beranda" className="relative overflow-hidden bg-[#FAFAF9] pt-16 pb-20 lg:pt-24 lg:pb-28">
                    {/* Soft dot pattern background */}
                    <div className="absolute inset-0 opacity-40"
                        style={{ backgroundImage: 'radial-gradient(#D9F3E1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                            {/* Left: Text */}
                            <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                                <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-3 py-1.5 rounded-full mb-5">
                                    <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full" />
                                    Tabungan Digital Aman & Mudah
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight mb-4">
                                    Kelola Tabungan Lebih{' '}
                                    <span className="text-[#16A34A]">Rapi, Aman,</span>{' '}
                                    dan Terukur
                                </h1>
                                <p className="text-[#5D5B54] text-base leading-relaxed mb-7">
                                    Buat target tabungan, catat setoran, ajukan penarikan, dan pantau progres keuanganmu dalam satu dashboard digital yang simple dan modern.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                                    {canRegister && (
                                        <Link href={route('register')}
                                            className="px-6 py-3 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg transition-colors">
                                            Mulai Menabung
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link href={route('login')}
                                            className="px-6 py-3 text-sm font-semibold text-[#1A1A1A] border border-[#E5E3DF] bg-white hover:border-[#16A34A] hover:text-[#16A34A] rounded-lg transition-colors">
                                            Masuk ke Akun
                                        </Link>
                                    )}
                                </div>
                                <p className="text-xs text-[#787671]">Cocok untuk personal, pelajar, komunitas, koperasi kecil, dan sistem tabungan internal.</p>
                            </div>

                            {/* Right: Dashboard Mockup */}
                            <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0 relative">
                                {/* Floating cards */}
                                <div className="absolute -top-4 -left-4 z-10 bg-white border border-[#E5E3DF] rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#16A34A] rounded-full" />
                                    <span className="text-xs font-medium text-[#1A1A1A]">Setoran Berhasil</span>
                                </div>
                                <div className="absolute -bottom-3 -right-2 z-10 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
                                    <span className="text-xs font-semibold text-[#16A34A]">Target 75%</span>
                                </div>
                                <div className="absolute top-1/2 -right-6 z-10 bg-white border border-[#E5E3DF] rounded-xl shadow-md px-3 py-2 hidden lg:flex items-center gap-2">
                                    <span className="text-green-600">🔒</span>
                                    <span className="text-xs font-medium text-[#1A1A1A]">Saldo Aman</span>
                                </div>

                                {/* Main card */}
                                <div className="bg-white border border-[#E5E3DF] rounded-2xl shadow-lg p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-[#787671]">Total Saldo</p>
                                            <p className="text-2xl font-bold text-[#1A1A1A]">Rp 2.750.000</p>
                                        </div>
                                        <div className="w-10 h-10 bg-[#DCFCE7] rounded-xl flex items-center justify-center text-[#16A34A]">
                                            <IconWallet />
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div>
                                        <div className="flex justify-between text-xs text-[#787671] mb-1.5">
                                            <span>Target Laptop — Rp 5.000.000</span>
                                            <span className="font-medium text-[#16A34A]">55%</span>
                                        </div>
                                        <div className="h-2 bg-[#F6F5F4] rounded-full overflow-hidden">
                                            <div className="h-full w-[55%] bg-gradient-to-r from-[#16A34A] to-[#4ADE80] rounded-full" />
                                        </div>
                                    </div>

                                    {/* Mini bar chart */}
                                    <div className="bg-[#FAFAF9] rounded-xl p-3 h-24">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData.slice(0, 4)} barSize={10}>
                                                <Bar dataKey="setoran" fill="#16A34A" radius={[3, 3, 0, 0]} />
                                                <Bar dataKey="penarikan" fill="#DCFCE7" radius={[3, 3, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Transactions */}
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Setoran — Dana Darurat', status: 'approved', amt: '+Rp 200.000' },
                                            { label: 'Setoran — Liburan', status: 'pending', amt: '+Rp 150.000' },
                                        ].map((t, i) => (
                                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#F6F5F4] last:border-0">
                                                <div>
                                                    <p className="text-xs font-medium text-[#1A1A1A]">{t.label}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.status === 'approved' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-yellow-50 text-yellow-600'}`}>
                                                        {t.status === 'approved' ? 'Approved' : 'Pending'}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-semibold text-[#16A34A]">{t.amt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ BENEFIT STRIP ═══════════════════════════════════════════ */}
                <section className="bg-white border-y border-[#E5E3DF] py-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: '🎯', title: 'Target Jelas', desc: 'Buat target tabungan dengan nominal dan deadline.' },
                                { icon: '📋', title: 'Transaksi Tercatat', desc: 'Setoran dan penarikan tersimpan rapi.' },
                                { icon: '✅', title: 'Approval Admin', desc: 'Setiap transaksi bisa diverifikasi agar lebih aman.' },
                                { icon: '📊', title: 'Laporan Lengkap', desc: 'Cetak buku tabungan dan export laporan transaksi.' },
                            ].map((b, i) => (
                                <div key={i} className="bg-white border border-[#E5E3DF] rounded-xl p-5 flex gap-4 items-start hover:shadow-sm transition-shadow">
                                    <div className="w-9 h-9 bg-[#DCFCE7] rounded-lg flex items-center justify-center text-lg flex-shrink-0">{b.icon}</div>
                                    <div>
                                        <p className="font-semibold text-sm text-[#1A1A1A] mb-0.5">{b.title}</p>
                                        <p className="text-xs text-[#787671] leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ FITUR UTAMA ══════════════════════════════════════════════ */}
                <section id="fitur" className="py-20 bg-[#FAFAF9]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Semua Kebutuhan Tabungan dalam Satu Tempat</h2>
                            <p className="text-[#5D5B54] max-w-xl mx-auto text-sm leading-relaxed">Mulai dari membuat target, mengajukan setoran, verifikasi transaksi, sampai mencetak buku tabungan.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[
                                {
                                    bg: 'bg-[#D9F3E1]', icon: '🎯', title: 'Target Tabungan',
                                    desc: 'Buat target seperti beli laptop, dana darurat, atau tabungan sekolah. Pantau progresnya dengan progress bar yang intuitif.',
                                    tag: 'Progress Bar',
                                },
                                {
                                    bg: 'bg-[#FEF9C3]', icon: '💰', title: 'Setoran Digital',
                                    desc: 'Ajukan setoran dengan catatan dan bukti. Status awal pending hingga diverifikasi admin.',
                                    tag: 'Pending Review',
                                },
                                {
                                    bg: 'bg-[#EFF6FF]', icon: '🏧', title: 'Penarikan Tabungan',
                                    desc: 'Ajukan penarikan dengan validasi saldo otomatis. Admin bisa approve atau reject sesuai kebijakan.',
                                    tag: 'Validasi Saldo',
                                },
                                {
                                    bg: 'bg-[#F0FDF4]', icon: '📈', title: 'Dashboard Real-time',
                                    desc: 'Lihat saldo, target aktif, transaksi pending, dan chart pergerakan saldo secara real-time.',
                                    tag: 'Live Chart',
                                },
                                {
                                    bg: 'bg-[#FFF7ED]', icon: '📒', title: 'Buku Tabungan',
                                    desc: 'Cetak buku tabungan dalam format laporan yang rapi. Tersedia untuk user maupun admin.',
                                    tag: 'Cetak PDF',
                                },
                                {
                                    bg: 'bg-[#FDF4FF]', icon: '🔍', title: 'Activity Log',
                                    desc: 'Semua aktivitas penting tercatat secara otomatis untuk keperluan audit dan keamanan sistem.',
                                    tag: 'Audit Trail',
                                },
                            ].map((f, i) => (
                                <div key={i} className="bg-white border border-[#E5E3DF] rounded-2xl p-5 hover:shadow-md transition-shadow group">
                                    <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center text-xl mb-4`}>{f.icon}</div>
                                    <h3 className="font-semibold text-[#1A1A1A] mb-2">{f.title}</h3>
                                    <p className="text-sm text-[#5D5B54] leading-relaxed mb-3">{f.desc}</p>
                                    <span className="inline-block bg-[#F6F5F4] text-[#787671] text-xs px-2.5 py-1 rounded-md">{f.tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ CARA KERJA ═══════════════════════════════════════════════ */}
                <section id="cara-kerja" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Cara Kerja Tabungan Digital</h2>
                            <p className="text-[#5D5B54] text-sm">Empat langkah mudah untuk mulai menabung secara digital.</p>
                        </div>

                        {/* Desktop: horizontal */}
                        <div className="hidden lg:flex items-start gap-0 relative">
                            {/* connector line */}
                            <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[#E5E3DF] z-0" />
                            {[
                                { num: '1', title: 'Buat Target', desc: 'User membuat target tabungan sesuai kebutuhan seperti nominal, nama, dan deadline.' },
                                { num: '2', title: 'Ajukan Setoran', desc: 'User menginput setoran dan menunggu verifikasi dari admin sistem.' },
                                { num: '3', title: 'Admin Verifikasi', desc: 'Admin menyetujui atau menolak transaksi berdasarkan data yang masuk.' },
                                { num: '4', title: 'Pantau & Cetak', desc: 'User bisa melihat progres, riwayat transaksi, dan mencetak buku tabungan.' },
                            ].map((s, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center text-center relative z-10 px-4">
                                    <div className="w-12 h-12 bg-[#16A34A] text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                                        {s.num}
                                    </div>
                                    <div className="bg-white border border-[#E5E3DF] rounded-xl p-4 w-full">
                                        <h3 className="font-semibold text-[#1A1A1A] mb-2">{s.title}</h3>
                                        <p className="text-xs text-[#5D5B54] leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile: vertical */}
                        <div className="lg:hidden relative pl-8">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E3DF]" />
                            {[
                                { num: '1', title: 'Buat Target', desc: 'User membuat target tabungan sesuai kebutuhan.' },
                                { num: '2', title: 'Ajukan Setoran', desc: 'User menginput setoran dan menunggu verifikasi admin.' },
                                { num: '3', title: 'Admin Verifikasi', desc: 'Admin menyetujui atau menolak transaksi berdasarkan data.' },
                                { num: '4', title: 'Pantau & Cetak', desc: 'User melihat progres dan mencetak buku tabungan.' },
                            ].map((s, i) => (
                                <div key={i} className="relative mb-6 last:mb-0">
                                    <div className="absolute -left-8 w-8 h-8 bg-[#16A34A] text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {s.num}
                                    </div>
                                    <div className="bg-white border border-[#E5E3DF] rounded-xl p-4">
                                        <h3 className="font-semibold text-[#1A1A1A] mb-1">{s.title}</h3>
                                        <p className="text-sm text-[#5D5B54]">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ PREVIEW DASHBOARD / CHART ════════════════════════════════ */}
                <section className="py-20 bg-[#F6F5F4]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Pantau Progres dengan Dashboard Visual</h2>
                            <p className="text-[#5D5B54] text-sm max-w-md mx-auto">Lihat perkembangan saldo, transaksi, dan target tabungan dengan chart yang mudah dipahami.</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Saldo', val: 'Rp 2.750.000', icon: '💳', color: 'text-[#16A34A]' },
                                { label: 'Target Aktif', val: '5 Target', icon: '🎯', color: 'text-blue-600' },
                                { label: 'Pending Approval', val: '3 Transaksi', icon: '⏳', color: 'text-yellow-600' },
                                { label: 'Saldo Bulan Ini', val: 'Rp 520.000', icon: '📅', color: 'text-purple-600' },
                            ].map((c, i) => (
                                <div key={i} className="bg-white border border-[#E5E3DF] rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{c.icon}</span>
                                        <span className="text-xs text-[#787671]">{c.label}</span>
                                    </div>
                                    <p className={`font-bold text-sm sm:text-base ${c.color}`}>{c.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Bar Chart */}
                            <div className="lg:col-span-2 bg-white border border-[#E5E3DF] rounded-2xl p-5">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-4">Setoran vs Penarikan</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={barData} barSize={14}>
                                        <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#787671' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#787671' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                                        <Tooltip formatter={(v) => fmtRupiah(v)} />
                                        <Bar dataKey="setoran" fill="#16A34A" radius={[4, 4, 0, 0]} name="Setoran" />
                                        <Bar dataKey="penarikan" fill="#DCFCE7" radius={[4, 4, 0, 0]} name="Penarikan" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart */}
                            <div className="bg-white border border-[#E5E3DF] rounded-2xl p-5">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-4">Status Target</p>
                                <ResponsiveContainer width="100%" height={160}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                                            {pieData.map((_, index) => (
                                                <Cell key={index} fill={PIE_COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-2 space-y-1">
                                    {pieData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-[#5D5B54]">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                                            {d.name}: {d.value}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Line Chart */}
                            <div className="lg:col-span-3 bg-white border border-[#E5E3DF] rounded-2xl p-5">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-4">Trend Saldo 6 Bulan</p>
                                <ResponsiveContainer width="100%" height={160}>
                                    <LineChart data={lineData}>
                                        <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#787671' }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#787671' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                                        <Tooltip formatter={(v) => fmtRupiah(v)} />
                                        <Line type="monotone" dataKey="saldo" stroke="#16A34A" strokeWidth={2.5} dot={{ fill: '#16A34A', r: 3 }} name="Saldo" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ KEAMANAN ═════════════════════════════════════════════════ */}
                <section id="keamanan" className="py-20 bg-[#F0FDF4]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Lebih Aman dengan Sistem Verifikasi</h2>
                            <p className="text-[#5D5B54] text-sm max-w-md mx-auto">Setiap transaksi penting tidak langsung mengubah saldo sebelum melewati proses validasi.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { icon: '🛡️', title: 'Approval Admin', desc: 'Setoran dan penarikan bisa diverifikasi admin sebelum mengubah saldo.' },
                                { icon: '🔄', title: 'Status Transaksi', desc: 'Pantau status transaksi: pending, approved, atau rejected secara real-time.' },
                                { icon: '📜', title: 'Activity Log', desc: 'Semua aktivitas penting tercatat otomatis untuk keperluan audit.' },
                                { icon: '🔔', title: 'Notifikasi', desc: 'User mendapat informasi ketika transaksi diproses oleh admin.' },
                                { icon: '⚖️', title: 'Validasi Saldo', desc: 'Penarikan tidak bisa melebihi saldo tersedia. Sistem memvalidasi otomatis.' },
                                { icon: '🖨️', title: 'Laporan Tercetak', desc: 'Buku tabungan bisa dicetak sebagai bukti transaksi yang sah.' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-[#BBF7D0] rounded-xl p-5 flex gap-4 items-start">
                                    <div className="w-9 h-9 bg-[#DCFCE7] rounded-lg flex items-center justify-center text-lg flex-shrink-0">{s.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A] text-sm mb-1">{s.title}</h3>
                                        <p className="text-xs text-[#5D5B54] leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ USER & ADMIN ROLE ════════════════════════════════════════ */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Dibuat untuk User dan Admin</h2>
                            <p className="text-[#5D5B54] text-sm">Dua peran dengan akses dan fitur yang berbeda.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* User Card */}
                            <div className="bg-[#D9F3E1] border border-[#BBF7D0] rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center text-white text-xl">👤</div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A]">User</h3>
                                </div>
                                <ul className="space-y-2.5">
                                    {['Membuat target tabungan', 'Mengajukan setoran', 'Mengajukan penarikan', 'Melihat riwayat transaksi', 'Melihat notifikasi', 'Mencetak buku tabungan sendiri'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                                            <IconCheck />{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Admin Card */}
                            <div className="bg-white border-2 border-[#16A34A] rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center text-white text-xl">⚙️</div>
                                    <h3 className="text-lg font-bold text-[#1A1A1A]">Admin</h3>
                                </div>
                                <ul className="space-y-2.5">
                                    {['Verifikasi setoran', 'Verifikasi penarikan', 'Input setoran manual', 'Kelola data user', 'Melihat laporan transaksi', 'Mencetak buku tabungan user', 'Melihat activity log'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                                            <IconCheck />{item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ USE CASE ═════════════════════════════════════════════════ */}
                <section className="py-20 bg-[#FAFAF9]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Cocok untuk Berbagai Kebutuhan</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: '🧑', title: 'Tabungan Pribadi', desc: 'Kelola tabungan personal dengan target yang jelas dan terstruktur.', tag: 'Personal' },
                                { icon: '🎓', title: 'Tabungan Pelajar', desc: 'Cocok untuk pelajar yang ingin belajar mengelola keuangan sedini mungkin.', tag: 'Pelajar' },
                                { icon: '👥', title: 'Kas Komunitas', desc: 'Transparansi pengelolaan kas komunitas kecil dengan sistem approval.', tag: 'Komunitas' },
                                { icon: '🏢', title: 'Koperasi Internal', desc: 'Solusi tabungan internal koperasi dengan verifikasi dan laporan lengkap.', tag: 'Koperasi' },
                            ].map((u, i) => (
                                <div key={i} className="bg-white border border-[#E5E3DF] rounded-2xl p-5 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-[#DCFCE7] rounded-xl flex items-center justify-center text-xl mb-4">{u.icon}</div>
                                    <h3 className="font-semibold text-[#1A1A1A] mb-2">{u.title}</h3>
                                    <p className="text-sm text-[#5D5B54] mb-3 leading-relaxed">{u.desc}</p>
                                    <span className="inline-block bg-[#DCFCE7] text-[#16A34A] text-xs font-medium px-2.5 py-1 rounded-full">{u.tag}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══ FAQ ══════════════════════════════════════════════════════ */}
                <section id="faq" className="py-20 bg-white">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">Pertanyaan yang Sering Diajukan</h2>
                        </div>
                        <div className="bg-white border border-[#E5E3DF] rounded-2xl px-6 py-2 divide-y divide-[#F6F5F4]">
                            {FAQ_ITEMS.map((item, i) => <FAQItem key={i} {...item} />)}
                        </div>
                    </div>
                </section>

                {/* ══ CTA AKHIR ════════════════════════════════════════════════ */}
                <section className="py-16 bg-[#FAFAF9]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-[#16A34A] rounded-2xl p-10 text-center text-white relative overflow-hidden">
                            {/* soft bg dots */}
                            <div className="absolute inset-0 opacity-10"
                                style={{ backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                            <div className="relative">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Mulai Kelola Tabungan dengan Lebih Rapi</h2>
                                <p className="text-green-100 text-sm max-w-md mx-auto mb-8">Buat target, catat transaksi, dan pantau progres tabunganmu dari satu dashboard digital.</p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {canRegister && (
                                        <Link href={route('register')}
                                            className="px-7 py-3 text-sm font-semibold text-[#16A34A] bg-white rounded-lg hover:bg-green-50 transition-colors">
                                            Daftar Sekarang
                                        </Link>
                                    )}
                                    {canLogin && (
                                        <Link href={route('login')}
                                            className="px-7 py-3 text-sm font-semibold text-white border border-white/40 rounded-lg hover:bg-white/10 transition-colors">
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
                <footer className="bg-white border-t border-[#E5E3DF] py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            {/* Brand */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <div className="w-8 h-8 bg-[#DCFCE7] rounded-lg flex items-center justify-center text-[#16A34A]">
                                        <IconWallet />
                                    </div>
                                    <span className="font-semibold text-[#1A1A1A]">Tabungan Digital</span>
                                </div>
                                <p className="text-xs text-[#787671] leading-relaxed max-w-xs">Platform pencatatan tabungan digital yang membantu user dan admin mengelola transaksi dengan lebih aman dan rapi.</p>
                            </div>

                            {/* Nav Links */}
                            <div>
                                <p className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-3">Menu</p>
                                <ul className="space-y-2">
                                    {['Beranda', 'Fitur', 'Cara Kerja', 'Keamanan', 'FAQ'].map(l => (
                                        <li key={l}><a href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-[#787671] hover:text-[#16A34A] transition-colors">{l}</a></li>
                                    ))}
                                </ul>
                            </div>

                            {/* Account */}
                            <div>
                                <p className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wide mb-3">Akun</p>
                                <ul className="space-y-2">
                                    {canLogin && (
                                        <li><Link href={route('login')} className="text-sm text-[#787671] hover:text-[#16A34A] transition-colors">Login</Link></li>
                                    )}
                                    {canRegister && (
                                        <li><Link href={route('register')} className="text-sm text-[#787671] hover:text-[#16A34A] transition-colors">Register</Link></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-[#E5E3DF] pt-6 text-center">
                            <p className="text-xs text-[#787671]">© 2026 Tabungan Digital. All rights reserved.</p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}