<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PassbookController extends Controller
{
    public function index(Request $request)
    {
        $data = $this->passbookData($request);

        if ($data['passbookOwner']) {
            ActivityLogger::log(
                'view_admin_user_passbook',
                'Admin melihat buku tabungan user.',
                null,
                [
                    'user_id' => $data['passbookOwner']['id'],
                    'filters' => $data['filters'],
                ]
            );
        }

        return Inertia::render('Admin/Passbooks/Index', $data);
    }

    public function pdf(Request $request)
    {
        $data = $this->passbookData($request);

        abort_unless($data['passbookOwner'], 404);

        ActivityLogger::log(
            'download_admin_user_passbook_pdf',
            'Admin download PDF buku tabungan user.',
            null,
            [
                'user_id' => $data['passbookOwner']['id'],
                'filters' => $data['filters'],
            ]
        );

        return Pdf::loadView('pdf.passbook', $data)
            ->setPaper('a4', 'portrait')
            ->download('buku-tabungan-user-' . $data['passbookOwner']['id'] . '-' . now()->format('Ymd-His') . '.pdf');
    }

    private function passbookData(Request $request): array
    {
        $users = User::where('role', 'user')
            ->select('id', 'name', 'email', 'member_number')
            ->orderBy('name')
            ->get();

        $owner = $request->filled('user_id')
            ? User::where('role', 'user')->find($request->user_id)
            : null;

        $savingGoals = $owner
            ? SavingGoal::where('user_id', $owner->id)
                ->select('id', 'title')
                ->orderBy('title')
                ->get()
            : collect();

        $selectedGoal = $request->filled('saving_goal_id')
            ? $savingGoals->firstWhere('id', (int) $request->saving_goal_id)
            : null;

        $transactions = collect();
        $summary = [
            'totalDeposit' => 0,
            'totalWithdraw' => 0,
            'finalBalance' => 0,
            'printedAt' => now()->format('d/m/Y H:i'),
            'periodLabel' => $this->periodLabel($request),
            'targetLabel' => $selectedGoal?->title ?? 'Semua Target',
        ];

        if ($owner) {
            $query = Transaction::with('savingGoal')
                ->where('user_id', $owner->id)
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

            $summary['totalDeposit'] = $transactions->sum('credit');
            $summary['totalWithdraw'] = $transactions->sum('debit');
            $summary['finalBalance'] = $summary['totalDeposit'] - $summary['totalWithdraw'];
        }

        return [
            'users' => $users,
            'passbookOwner' => $owner ? [
                'id' => $owner->id,
                'name' => $owner->name,
                'member_number' => $owner->member_number,
                'email' => $owner->email,
            ] : null,
            'savingGoals' => $savingGoals,
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'user_id' => $request->user_id,
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
