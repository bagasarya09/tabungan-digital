<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();
        [$startDate, $endDate, $period] = $this->resolveDateRange($request);

        $totalBalance = SavingGoal::where('user_id', $userId)
            ->sum('current_amount');

        $totalGoals = SavingGoal::where('user_id', $userId)
            ->count();

        $activeGoals = SavingGoal::where('user_id', $userId)
            ->where('status', 'active')
            ->count();

        $pendingTransactions = Transaction::where('user_id', $userId)
            ->where('status', 'pending')
            ->count();

        $latestGoals = SavingGoal::where('user_id', $userId)
            ->latest()
            ->take(3)
            ->get();

        $latestTransactions = Transaction::with('savingGoal')
            ->where('user_id', $userId)
            ->latest()
            ->take(5)
            ->get();

        $filteredTransactions = Transaction::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate->copy()->startOfDay(), $endDate->copy()->endOfDay()]);

        $transactionChartData = (clone $filteredTransactions)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END) as deposit")
            ->selectRaw("SUM(CASE WHEN type = 'withdraw' THEN amount ELSE 0 END) as withdraw")
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => Carbon::parse($item->date)->format('d M'),
                'deposit' => (float) $item->deposit,
                'withdraw' => (float) $item->withdraw,
            ]);

        $statusChartData = SavingGoal::where('user_id', $userId)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->status,
                'value' => $item->total,
            ]);

        $typeChartData = (clone $filteredTransactions)
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->type,
                'value' => $item->total,
            ]);

        $runningBalance = 0;
        $balanceTrendData = (clone $filteredTransactions)
            ->where('status', 'approved')
            ->orderBy('created_at')
            ->get()
            ->map(function ($transaction) use (&$runningBalance) {
                $runningBalance += $transaction->type === 'deposit'
                    ? (float) $transaction->amount
                    : -1 * (float) $transaction->amount;

                return [
                    'date' => $transaction->created_at->format('d M'),
                    'balance' => $runningBalance,
                ];
            });

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'totalBalance' => $totalBalance,
                'totalGoals' => $totalGoals,
                'activeGoals' => $activeGoals,
                'pendingTransactions' => $pendingTransactions,
            ],
            'latestGoals' => $latestGoals,
            'latestTransactions' => $latestTransactions,
            'chartFilters' => [
                'period' => $period,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'transactionChartData' => $transactionChartData,
            'statusChartData' => $statusChartData,
            'typeChartData' => $typeChartData,
            'balanceTrendData' => $balanceTrendData,
        ]);
    }

    private function resolveDateRange(Request $request): array
    {
        $period = $request->period ?: 'weekly';

        return match ($period) {
            'today' => [now()->startOfDay(), now()->endOfDay(), $period],
            'monthly' => [now()->startOfMonth(), now()->endOfMonth(), $period],
            'yearly' => [now()->startOfYear(), now()->endOfYear(), $period],
            'custom' => [
                $request->filled('start_date') ? Carbon::parse($request->start_date) : now()->subDays(6),
                $request->filled('end_date') ? Carbon::parse($request->end_date) : now(),
                $period,
            ],
            default => [now()->subDays(6), now(), 'weekly'],
        };
    }
}
