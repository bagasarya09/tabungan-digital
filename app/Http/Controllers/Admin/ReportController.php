<?php

namespace App\Http\Controllers\Admin;

use App\Exports\TransactionsExport;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function transactions(Request $request)
    {
        $query = $this->transactionQuery($request);

        $transactions = $query->get();

        $totalAmount = $transactions
            ->where('status', 'approved')
            ->sum('amount');

        $users = User::where('role', 'user')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Reports/Transactions', [
            'transactions' => $transactions,
            'users' => $users,
            'filters' => [
                'user_id' => $request->user_id,
                'status' => $request->status,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'summary' => [
                'totalTransactions' => $transactions->count(),
                'totalApprovedAmount' => $totalAmount,
                'totalPending' => $transactions->where('status', 'pending')->count(),
                'totalApproved' => $transactions->where('status', 'approved')->count(),
                'totalRejected' => $transactions->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function exportTransactions(Request $request)
    {
        $filename = 'laporan-transaksi-' . now()->format('Y-m-d-His') . '.xlsx';

        return Excel::download(new TransactionsExport($request), $filename);
    }

    private function transactionQuery(Request $request)
    {
        $query = Transaction::with(['user', 'savingGoal', 'approvedBy'])
            ->latest();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
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

        return $query;
    }
}