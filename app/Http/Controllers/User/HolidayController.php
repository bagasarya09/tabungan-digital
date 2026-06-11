<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use App\Services\HolidayFeeCalculator;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    public function __construct(private HolidayFeeCalculator $calculator)
    {
    }

    public function dashboard()
    {
        $userId = auth()->id();
        $programs = $this->programsWithBalance($userId);

        return Inertia::render('User/Holiday/Dashboard', [
            'stats' => [
                'programCount' => $programs->count(),
                'activeProgramCount' => $programs->where('status', 'active')->count(),
                'totalBalance' => $programs->sum('balance'),
                'totalDeposit' => Transaction::where('saving_type', 'holiday')->where('user_id', $userId)->where('type', 'deposit')->where('status', 'approved')->sum('amount'),
            ],
            'programs' => $programs,
            'latestTransactions' => Transaction::with('holidayProgram:id,name')
                ->where('saving_type', 'holiday')
                ->where('user_id', $userId)
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }

    public function programs()
    {
        return Inertia::render('User/Holiday/Programs', [
            'programs' => $this->programsWithBalance(auth()->id()),
        ]);
    }

    public function showProgram(HolidaySavingProgram $program)
    {
        $participant = HolidaySavingParticipant::where('holiday_saving_program_id', $program->id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $transactions = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $program->id)
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('User/Holiday/ProgramDetail', [
            'program' => $program,
            'participant' => $participant,
            'transactions' => $transactions,
            'balance' => $this->balanceFor(auth()->id(), $program->id),
        ]);
    }

    public function transactions()
    {
        return Inertia::render('User/Holiday/Transactions', [
            'transactions' => Transaction::with('holidayProgram:id,name')
                ->where('saving_type', 'holiday')
                ->where('user_id', auth()->id())
                ->latest()
                ->paginate(15),
        ]);
    }

    public function passbook(Request $request)
    {
        return Inertia::render('User/Holiday/Passbook', $this->passbookData($request));
    }

    public function passbookPdf(Request $request)
    {
        $data = $this->passbookData($request);

        return Pdf::loadView('pdf.holiday-passbook', $data)
            ->setPaper('a4', 'portrait')
            ->download('buku-tabungan-hari-raya-' . now()->format('Ymd-His') . '.pdf');
    }

    private function passbookData(Request $request): array
    {
        $userId = auth()->id();
        $programs = HolidaySavingProgram::whereHas('participants', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->latest()->get(['id', 'name']);

        $selectedProgram = $request->filled('program_id')
            ? $programs->firstWhere('id', (int) $request->program_id)
            : null;

        $query = Transaction::with('holidayProgram:id,name')
            ->where('saving_type', 'holiday')
            ->where('user_id', $userId);

        if ($selectedProgram) {
            $query->where('program_id', $selectedProgram->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'approved');
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $this->applyPeriodFilter($query, $request);

        $transactions = $query->oldest()->get();

        $runningBalance = 0;
        $rows = $transactions->map(function (Transaction $transaction) use (&$runningBalance) {
            $deposit = $transaction->status === 'approved' && $transaction->type === 'deposit' ? (float) $transaction->amount : 0;
            $withdraw = $transaction->status === 'approved' && $transaction->type === 'withdraw' ? (float) $transaction->amount : 0;
            $runningBalance += $deposit - $withdraw;

            return [
                'id' => $transaction->id,
                'date' => $transaction->created_at?->format('d/m/Y H:i'),
                'program' => $transaction->holidayProgram?->name,
                'type' => $transaction->type,
                'status' => $transaction->status,
                'note' => $transaction->note,
                'admin_note' => $transaction->admin_note,
                'deposit' => $deposit,
                'withdraw' => $withdraw,
                'balance' => $runningBalance,
            ];
        });

        $grossBalance = $runningBalance;
        $totalDeductionApplied = $this->totalDeductionApplied($programs, $selectedProgram, $userId);
        $netBalance = $grossBalance - $totalDeductionApplied;
        $deductionSummary = $this->deductionSummary($selectedProgram, $userId);

        return [
            'passbookOwner' => [
                'name' => auth()->user()->name,
                'member_number' => auth()->user()->member_number,
                'email' => auth()->user()->email,
            ],
            'programs' => $programs,
            'rows' => $rows,
            'summary' => [
                'totalDeposit' => $rows->sum('deposit'),
                'totalWithdraw' => $rows->sum('withdraw'),
                'grossBalance' => $grossBalance,
                'totalDeductionApplied' => $totalDeductionApplied,
                'finalBalance' => $netBalance,
                'programLabel' => $selectedProgram?->name ?? 'Semua Program',
                'periodLabel' => $this->periodLabel($request),
                'printedAt' => now()->format('d/m/Y H:i'),
                'deduction' => $deductionSummary,
                'deductionNote' => $totalDeductionApplied > 0
                    ? 'Saldo akhir sudah terpotong uang pengendap dan biaya administrasi.'
                    : 'Potongan uang pengendap dan administrasi belum tersedia. Klik Hitung Ulang Potongan pada menu Uang Pengendap & Administrasi.',
            ],
            'filters' => [
                'program_id' => $request->program_id,
                'period' => $request->period ?: 'all',
                'month' => $request->month ?: now()->format('Y-m'),
                'year' => $request->year ?: now()->year,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => $request->status ?: 'approved',
                'type' => $request->type,
            ],
        ];
    }

    private function programsWithBalance(int $userId)
    {
        $programs = HolidaySavingProgram::whereHas('participants', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->with(['participants' => function ($query) use ($userId) {
            $query->where('user_id', $userId);
        }])->latest()->get();

        return $programs->map(function (HolidaySavingProgram $program) use ($userId) {
            $program->setAttribute('balance', $this->balanceFor($userId, $program->id));
            $program->setAttribute('participant_status', $program->participants->first()?->status);
            return $program;
        });
    }

    private function balanceFor(int $userId, int $programId): float
    {
        $deposit = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $programId)
            ->where('user_id', $userId)
            ->where('type', 'deposit')
            ->where('status', 'approved')
            ->sum('amount');

        $withdraw = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $programId)
            ->where('user_id', $userId)
            ->where('type', 'withdraw')
            ->where('status', 'approved')
            ->sum('amount');

        return (float) $deposit - (float) $withdraw;
    }

    private function applyPeriodFilter($query, Request $request): void
    {
        if ($request->period === 'monthly' && $request->filled('month')) {
            $date = \Carbon\Carbon::parse($request->month . '-01');
            $query->whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()]);
            return;
        }

        if ($request->period === 'yearly' && $request->filled('year')) {
            $query->whereYear('created_at', $request->year);
            return;
        }

        if ($request->period === 'custom') {
            if ($request->filled('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->filled('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }
        }
    }

    private function periodLabel(Request $request): string
    {
        if ($request->period === 'monthly' && $request->filled('month')) {
            return \Carbon\Carbon::parse($request->month . '-01')->translatedFormat('F Y');
        }

        if ($request->period === 'yearly' && $request->filled('year')) {
            return (string) $request->year;
        }

        if ($request->period === 'custom') {
            return ($request->start_date ?: '-') . ' s/d ' . ($request->end_date ?: '-');
        }

        return 'Semua Periode';
    }

    private function deductionSummary(?HolidaySavingProgram $program, int $userId): ?array
    {
        if (! $program?->feeSetting) {
            return null;
        }

        $setting = $program->feeSetting;
        $participant = HolidaySavingParticipant::where('holiday_saving_program_id', $program->id)
            ->where('user_id', $userId)
            ->first();
        $deduction = $participant
            ? $this->calculator->deductionForParticipant($program, $setting, $participant)
            : [
                'sinking_fund_per_user' => (float) $setting->sinking_fund_per_user,
                'admin_fee_total_per_user' => (float) $setting->admin_fee_total_per_user,
                'total_deduction_per_user' => (float) $setting->total_deduction_per_user,
            ];

        return [
            'sinking_fund_per_user' => (float) $deduction['sinking_fund_per_user'],
            'admin_fee_total_per_user' => (float) $deduction['admin_fee_total_per_user'],
            'total_deduction_per_user' => (float) $deduction['total_deduction_per_user'],
            'active_participant_count' => $setting->active_participant_count,
            'total_program_months' => $setting->total_program_months,
            'calculated_at' => $setting->calculated_at?->format('d/m/Y H:i'),
        ];
    }

    private function totalDeductionApplied($programs, ?HolidaySavingProgram $selectedProgram, int $userId): float
    {
        if ($selectedProgram) {
            $participant = HolidaySavingParticipant::where('holiday_saving_program_id', $selectedProgram->id)
                ->where('user_id', $userId)
                ->first();

            return $participant && $selectedProgram->feeSetting
                ? (float) $this->calculator->deductionForParticipant($selectedProgram, $selectedProgram->feeSetting, $participant)['total_deduction_per_user']
                : 0;
        }

        return (float) $programs->sum(function (HolidaySavingProgram $program) use ($userId) {
            $participant = HolidaySavingParticipant::where('holiday_saving_program_id', $program->id)
                ->where('user_id', $userId)
                ->first();

            return $participant && $program->feeSetting
                ? (float) $this->calculator->deductionForParticipant($program, $program->feeSetting, $participant)['total_deduction_per_user']
                : 0;
        });
    }
}
