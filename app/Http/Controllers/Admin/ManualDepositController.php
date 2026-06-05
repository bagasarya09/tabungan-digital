<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;

class ManualDepositController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $savingGoals = SavingGoal::with('user')
            ->where('status', 'active')
            ->latest()
            ->get();

        $transactions = Transaction::with(['user', 'savingGoal'])
            ->where('type', 'deposit')
            ->where('status', 'approved')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Deposits/Manual', [
            'users' => $users,
            'savingGoals' => $savingGoals,
            'transactions' => $transactions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'saving_goal_id' => 'required|exists:saving_goals,id',
            'amount' => 'required|numeric|min:1000',
            'note' => 'nullable|string|max:500',
        ]);

        $savingGoal = SavingGoal::where('id', $request->saving_goal_id)
            ->where('user_id', $request->user_id)
            ->where('status', 'active')
            ->firstOrFail();

        $transaction = Transaction::create([
            'user_id' => $request->user_id,
            'saving_goal_id' => $savingGoal->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'status' => 'approved',
            'note' => $request->note,
            'admin_note' => 'Setoran dicatat langsung oleh admin.',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        NotificationHelper::send(
            $transaction->user_id,
            'Setoran Manual Berhasil Dicatat',
            'Admin telah mencatat setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' ke target tabungan Anda.',
            'success'
        );


        ActivityLogger::log(
            'manual_deposit',
            'Admin mencatat setoran manual sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
            $transaction,
            [
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'saving_goal_id' => $transaction->saving_goal_id,
                'amount' => $transaction->amount,
                'created_by_admin' => auth()->id(),
            ]
        );

        $savingGoal->update([
            'current_amount' => $savingGoal->current_amount + $request->amount,
        ]);

        if ($savingGoal->current_amount >= $savingGoal->target_amount) {
            $savingGoal->update([
                'status' => 'completed',
            ]);
        }

        return redirect()->route('admin.deposits.manual')
            ->with('success', 'Setoran manual berhasil disimpan.');
    }
}