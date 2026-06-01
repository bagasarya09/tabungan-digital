<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalGoals' => $totalGoals,
                'totalTransactions' => $totalTransactions,
                'pendingTransactions' => $pendingTransactions,
                'approvedDepositAmount' => $approvedDepositAmount,
            ],
            'latestTransactions' => $latestTransactions,
        ]);
    }
}