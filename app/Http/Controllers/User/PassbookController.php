<?php

namespace App\Http\Controllers\User;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PassbookController extends Controller
{
    public function index(Request $request)
    {
        $data = $this->passbookData($request, auth()->user());

        ActivityLogger::log(
            'view_user_passbook',
            'User melihat buku tabungan digital.',
            null,
            ['filters' => $data['filters']]
        );

        return Inertia::render('User/Passbook/Index', $data);
    }

    public function pdf(Request $request)
    {
        $data = $this->passbookData($request, auth()->user());

        ActivityLogger::log(
            'download_user_passbook_pdf',
            'User download PDF buku tabungan digital.',
            null,
            ['filters' => $data['filters']]
        );

        return Pdf::loadView('pdf.passbook', $data)
            ->setPaper('a4', 'portrait')
            ->download('buku-tabungan-' . now()->format('Ymd-His') . '.pdf');
    }

    private function passbookData(Request $request, $user): array
    {
        $savingGoals = SavingGoal::where('user_id', $user->id)
            ->select('id', 'title')
            ->orderBy('title')
            ->get();

        $selectedGoal = $request->filled('saving_goal_id')
            ? $savingGoals->firstWhere('id', (int) $request->saving_goal_id)
            : null;

        $query = Transaction::with('savingGoal')
            ->where('user_id', $user->id)
            ->where('status', 'approved');

        if ($selectedGoal) {
            $query->where('saving_goal_id', $selectedGoal->id);
        }

        $this->applyPeriodFilter($query, $request);

        $runningBalance = 0;
        $transactions = $query
            ->orderBy('created_at')
            ->orderBy('id')
            ->get()
            ->map(function ($transaction) use (&$runningBalance) {
                $debit = $transaction->type === 'withdraw' ? (float) $transaction->amount : 0;
                $credit = $transaction->type === 'deposit' ? (float) $transaction->amount : 0;
                $runningBalance += $credit - $debit;

                return [
                    'id' => $transaction->id,
                    'number' => 'TRX-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
                    'date' => $transaction->created_at->format('d/m/Y H:i'),
                    'saving_goal' => $transaction->savingGoal?->title ?? '-',
                    'type' => $transaction->type,
                    'debit' => $debit,
                    'credit' => $credit,
                    'balance' => $runningBalance,
                    'note' => $transaction->note,
                ];
            });

        $totalDeposit = $transactions->sum('credit');
        $totalWithdraw = $transactions->sum('debit');

        return [
            'passbookOwner' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'savingGoals' => $savingGoals,
            'transactions' => $transactions,
            'summary' => [
                'totalDeposit' => $totalDeposit,
                'totalWithdraw' => $totalWithdraw,
                'finalBalance' => $totalDeposit - $totalWithdraw,
                'printedAt' => now()->format('d/m/Y H:i'),
                'periodLabel' => $this->periodLabel($request),
                'targetLabel' => $selectedGoal?->title ?? 'Semua Target',
            ],
            'filters' => [
                'saving_goal_id' => $selectedGoal?->id,
                'period' => $request->period ?: 'all',
                'month' => $request->month,
                'year' => $request->year,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
        ];
    }

    private function applyPeriodFilter($query, Request $request): void
    {
        if ($request->period === 'monthly' && $request->filled('month')) {
            $date = Carbon::parse($request->month . '-01');
            $query->whereBetween('created_at', [$date->copy()->startOfMonth(), $date->copy()->endOfMonth()]);
        }

        if ($request->period === 'yearly' && $request->filled('year')) {
            $query->whereYear('created_at', $request->year);
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
            return Carbon::parse($request->month . '-01')->translatedFormat('F Y');
        }

        if ($request->period === 'yearly' && $request->filled('year')) {
            return 'Tahun ' . $request->year;
        }

        if ($request->period === 'custom') {
            return ($request->start_date ?: '-') . ' s/d ' . ($request->end_date ?: '-');
        }

        return 'Semua Periode';
    }
}
