<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;

class DepositVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'savingGoal'])
            ->where('type', 'deposit')
            ->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('email', 'like', '%' . $request->search . '%');
                })->orWhereHas('savingGoal', function ($goalQuery) use ($request) {
                    $goalQuery->where('title', 'like', '%' . $request->search . '%');
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Deposits/Verification', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
        ]);
    }

    public function approve(Transaction $transaction)
    {
        if ($transaction->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Transaksi ini sudah diproses.');
        }

        NotificationHelper::send(
        $transaction->user_id,
        'Setoran Disetujui',
        'Setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' telah disetujui oleh admin.',
        'success'
    );

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
        
        ActivityLogger::log(
        'approve_deposit',
        'Admin menyetujui setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
        $transaction,
        [
            'transaction_id' => $transaction->id,
            'user_id' => $transaction->user_id,
            'saving_goal_id' => $transaction->saving_goal_id,
            'amount' => $transaction->amount,
            'approved_by' => auth()->id(),
        ]
    );

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

        NotificationHelper::send(
            $transaction->user_id,
            'Setoran Ditolak',
            'Setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' ditolak oleh admin. Alasan: ' . $request->admin_note,
            'danger'
        );


        ActivityLogger::log(
            'reject_deposit',
            'Admin menolak setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
            $transaction,
            [
                'transaction_id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'saving_goal_id' => $transaction->saving_goal_id,
                'amount' => $transaction->amount,
                'admin_note' => $request->admin_note,
                'rejected_by' => auth()->id(),
            ]
        );

        return redirect()->back()
            ->with('success', 'Setoran berhasil ditolak.');
    }
}
