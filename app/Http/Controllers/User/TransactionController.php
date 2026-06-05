<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ActivityLogger;
use App\Helpers\NotificationHelper;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('savingGoal')
            ->where('user_id', auth()->id())
            ->latest();

        if ($request->filled('search')) {
            $query->whereHas('savingGoal', function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $transactions = $query->paginate(10)->withQueryString();

        $savingGoals = SavingGoal::where('user_id', auth()->id())
            ->where('status', 'active')
            ->latest()
            ->get();

        $withdrawableSavingGoals = SavingGoal::where('user_id', auth()->id())
            ->where('current_amount', '>', 0)
            ->latest()
            ->get();

        return Inertia::render('User/Transactions/Index', [
            'transactions' => $transactions,
            'savingGoals' => $savingGoals,
            'withdrawableSavingGoals' => $withdrawableSavingGoals,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
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

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'saving_goal_id' => $savingGoal->id,
            'type' => 'deposit',
            'amount' => $request->amount,
            'status' => 'pending',
            'proof_image' => $proofImagePath,
            'note' => $request->note,
        ]);

        NotificationHelper::send(
            auth()->id(),
            'Setoran Berhasil Diajukan',
            'Setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' untuk target ' . $savingGoal->title . ' sedang menunggu verifikasi admin.',
            'warning'
        );

        ActivityLogger::log(
            'create_deposit_request',
            'User mengajukan setoran sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
            $transaction,
            [
                'saving_goal_id' => $savingGoal->id,
                'saving_goal_title' => $savingGoal->title,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
            ]
        );

        return redirect()->route('transactions.index')
            ->with('success', 'Setoran berhasil diajukan dan menunggu verifikasi admin.');
    }

    public function withdraw(Request $request)
    {
        $request->validate([
            'saving_goal_id' => 'required|exists:saving_goals,id',
            'amount' => 'required|numeric|min:1000',
            'note' => 'required|string|max:500',
        ]);

        $savingGoal = SavingGoal::where('id', $request->saving_goal_id)
            ->where('user_id', auth()->id())
            ->where('current_amount', '>', 0)
            ->firstOrFail();

        if ((float) $request->amount > (float) $savingGoal->current_amount) {
            return redirect()->back()
                ->withErrors([
                'amount' => 'Nominal penarikan tidak boleh lebih besar dari saldo target tabungan.',
                ])
                ->with('error', 'Nominal penarikan tidak boleh lebih besar dari saldo target tabungan.');
        }

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'saving_goal_id' => $savingGoal->id,
            'type' => 'withdraw',
            'amount' => $request->amount,
            'status' => 'pending',
            'note' => $request->note,
        ]);

        NotificationHelper::send(
            auth()->id(),
            'Penarikan Berhasil Diajukan',
            'Penarikan sebesar Rp ' . number_format($transaction->amount, 0, ',', '.') . ' dari target ' . $savingGoal->title . ' sedang menunggu verifikasi admin.',
            'warning'
        );

        ActivityLogger::log(
            'create_withdraw_request',
            'User mengajukan penarikan sebesar Rp ' . number_format($transaction->amount, 0, ',', '.'),
            $transaction,
            [
                'saving_goal_id' => $savingGoal->id,
                'saving_goal_title' => $savingGoal->title,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
            ]
        );

        return redirect()->route('transactions.index')
            ->with('success', 'Penarikan berhasil diajukan dan menunggu verifikasi admin.');
    }
}
