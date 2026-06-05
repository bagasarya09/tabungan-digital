<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        [$startDate, $endDate, $period] = $this->resolveDateRange($request);

        $totalUsers = User::where('role', 'user')->count();

        $totalGoals = SavingGoal::count();

        $totalTransactions = Transaction::count();

        $pendingTransactions = Transaction::where('status', 'pending')->count();

        $approvedDepositAmount = Transaction::where('type', 'deposit')
            ->where('status', 'approved')
            ->sum('amount');

        $latestTransactions = Transaction::with(['user', 'savingGoal'])
            ->latest()
            ->take(5)
            ->get();

        $filteredTransactions = Transaction::whereBetween('created_at', [
            $startDate->copy()->startOfDay(),
            $endDate->copy()->endOfDay(),
        ]);

        $transactionChartData = (clone $filteredTransactions)
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->status,
                'value' => $item->total,
            ]);

        $statusChartData = $transactionChartData;

        $typeChartData = (clone $filteredTransactions)
            ->selectRaw('type, COUNT(*) as total')
            ->groupBy('type')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->type,
                'value' => $item->total,
            ]);

        $balanceTrendData = (clone $filteredTransactions)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => Carbon::parse($item->date)->format('d M'),
                'total' => $item->total,
            ]);

        $approvedAmountChartData = (clone $filteredTransactions)
            ->where('status', 'approved')
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => Carbon::parse($item->date)->format('d M'),
                'total' => (float) $item->total,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalGoals' => $totalGoals,
                'totalTransactions' => $totalTransactions,
                'pendingTransactions' => $pendingTransactions,
                'approvedDepositAmount' => $approvedDepositAmount,
            ],
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
            'approvedAmountChartData' => $approvedAmountChartData,
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
