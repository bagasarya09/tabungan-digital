<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('savingGoal')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        $savingGoals = SavingGoal::where('user_id', auth()->id())
            ->where('status', 'active')
            ->latest()
            ->get();

        return Inertia::render('User/Transactions/Index', [
            'transactions' => $transactions,
            'savingGoals' => $savingGoals,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'saving_goal_id' => 'required|exists:saving_goals,id',
            'amount' => 'required|numeric|min:1000',
            'note' => 'nullable|string',
            'proof_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $savingGoal = SavingGoal::where('id', $request->saving_goal_id)
            ->where('user_id', auth()->id())
            ->where('status', 'active')
            ->firstOrFail();

        $proofImagePath = null;

        if ($request->hasFile('proof_image')) {
            $proofImagePath = $request->file('proof_image')->store('proof-images', 'public');
        }

        Transaction::create([
            'user_id' => auth()->id(),
            'saving_goal_id' => $savingGoal->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'status' => 'pending',
            'proof_image' => $proofImagePath,
            'note' => $request->note,
        ]);

        return redirect()->route('transactions.index', status: 303)
            ->with('success', 'Setoran berhasil diajukan dan menunggu verifikasi admin.');
    }
}
