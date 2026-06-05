<?php

namespace App\Http\Controllers\Admin;

use App\Exports\TransactionsExport;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Helpers\ActivityLogger;

class ReportController extends Controller
{
    public function transactions(Request $request)
    {
        $query = $this->transactionQuery($request);

        $summaryTransactions = (clone $query)->get();
        $transactions = $query->paginate(15)->withQueryString();

        $totalAmount = $summaryTransactions
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
                'totalTransactions' => $summaryTransactions->count(),
                'totalApprovedAmount' => $totalAmount,
                'totalPending' => $summaryTransactions->where('status', 'pending')->count(),
                'totalApproved' => $summaryTransactions->where('status', 'approved')->count(),
                'totalRejected' => $summaryTransactions->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function exportTransactions(Request $request)
    {
        ActivityLogger::log(
            'export_transaction_report',
            'Admin melakukan export laporan transaksi.',
            null,
            [
                'filters' => [
                    'user_id' => $request->user_id,
                    'status' => $request->status,
                    'type' => $request->type,
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                ],
            ]
        );

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
