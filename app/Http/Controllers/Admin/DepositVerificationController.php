<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepositVerificationController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'savingGoal'])
            ->where('type', 'deposit')
            ->latest()
            ->get();

        return Inertia::render('Admin/Deposits/Verification', [
            'transactions' => $transactions,
        ]);
    }

    public function approve(Transaction $transaction)
    {
        if ($transaction->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Transaksi ini sudah diproses.');
        }

        $transaction->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $savingGoal = $transaction->savingGoal;

        $savingGoal->update([
            'current_amount' => $savingGoal->current_amount + $transaction->amount,
        ]);

        if ($savingGoal->current_amount >= $savingGoal->target_amount) {
            $savingGoal->update([
                'status' => 'completed',
            ]);
        }

        return redirect()->back()
            ->with('success', 'Setoran berhasil disetujui.');
    }

    public function reject(Request $request, Transaction $transaction)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ]);

        if ($transaction->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Transaksi ini sudah diproses.');
        }

        $transaction->update([
            'status' => 'rejected',
            'admin_note' => $request->admin_note,
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Setoran berhasil ditolak.');
    }
}