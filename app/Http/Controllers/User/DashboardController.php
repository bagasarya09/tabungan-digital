<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

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

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'totalBalance' => $totalBalance,
                'totalGoals' => $totalGoals,
                'activeGoals' => $activeGoals,
                'pendingTransactions' => $pendingTransactions,
            ],
            'latestGoals' => $latestGoals,
            'latestTransactions' => $latestTransactions,
        ]);
    }
}