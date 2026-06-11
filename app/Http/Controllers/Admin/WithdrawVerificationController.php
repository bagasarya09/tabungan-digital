<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;
use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WithdrawVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'savingGoal', 'approvedBy'])
            ->where('type', 'withdraw')
            ->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('member_number', 'like', '%' . $request->search . '%')
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

        return Inertia::render('Admin/Withdrawals/Verification', [
            'transactions' => $query->paginate(10)->withQueryString(),
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
        if ($transaction->type !== 'withdraw') {
            return redirect()->back()
                ->with('error', 'Transaksi ini bukan pengajuan penarikan.');
        }

        if ($transaction->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Transaksi ini sudah diproses.');
        }

        try {
            DB::transaction(function () use ($transaction) {
                $lockedTransaction = Transaction::whereKey($transaction->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($lockedTransaction->status !== 'pending') {
                    throw ValidationException::withMessages([
                        'transaction' => 'Transaksi ini sudah diproses.',
                    ]);
                }

                if ($lockedTransaction->type !== 'withdraw') {
                    throw ValidationException::withMessages([
                        'transaction' => 'Transaksi ini bukan pengajuan penarikan.',
                    ]);
                }

                $savingGoal = SavingGoal::whereKey($lockedTransaction->saving_goal_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ((float) $lockedTransaction->amount > (float) $savingGoal->current_amount) {
                    throw ValidationException::withMessages([
                        'amount' => 'Saldo target tabungan tidak mencukupi untuk menyetujui penarikan ini.',
                    ]);
                }

                $previousAmount = (float) $savingGoal->current_amount;
                $newAmount = $previousAmount - (float) $lockedTransaction->amount;

                $lockedTransaction->update([
                    'status' => 'approved',
                    'approved_by' => auth()->id(),
                    'approved_at' => now(),
                ]);

                $savingGoal->update([
                    'current_amount' => $newAmount,
                    'status' => $newAmount < (float) $savingGoal->target_amount ? 'active' : $savingGoal->status,
                ]);

                NotificationHelper::send(
                    $lockedTransaction->user_id,
                    'Penarikan Disetujui',
                    'Penarikan sebesar Rp ' . number_format($lockedTransaction->amount, 0, ',', '.') . ' telah disetujui oleh admin.',
                    'success'
                );

                ActivityLogger::log(
                    'approve_withdraw',
                    'Admin menyetujui penarikan sebesar Rp ' . number_format($lockedTransaction->amount, 0, ',', '.'),
                    $lockedTransaction,
                    [
                        'transaction_id' => $lockedTransaction->id,
                        'user_id' => $lockedTransaction->user_id,
                        'saving_goal_id' => $lockedTransaction->saving_goal_id,
                        'amount' => $lockedTransaction->amount,
                        'previous_amount' => $previousAmount,
                        'current_amount' => $newAmount,
                        'approved_by' => auth()->id(),
                    ]
                );
            });
        } catch (ValidationException $exception) {
            return redirect()->back()
                ->withErrors($exception->errors())
                ->with('error', collect($exception->errors())->flatten()->first());
        }

        return redirect()->back()
            ->with('success', 'Penarikan berhasil disetujui.');
    }

    public function reject(Request $request, Transaction $transaction)
    {
        $request->validate([
            'admin_note' => 'required|string|max:500',
        ]);

        if ($transaction->type !== 'withdraw') {
            return redirect()->back()
                ->with('error', 'Transaksi ini bukan pengajuan penarikan.');
        }

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
            'Penarikan Ditolak',
            'Penarikan sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' ditolak oleh admin. Alasan: ' . $request->admin_note,
            'danger'
        );

        ActivityLogger::log(
            'reject_withdraw',
            'Admin menolak penarikan sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
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
            ->with('success', 'Penarikan berhasil ditolak.');
    }
}
