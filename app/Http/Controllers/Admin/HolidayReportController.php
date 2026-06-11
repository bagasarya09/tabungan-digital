<?php

namespace App\Http\Controllers\Admin;

use App\Exports\HolidayTransactionsExport;
use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class HolidayReportController extends Controller
{
    public function index(Request $request)
    {
        $query = $this->query($request);
        $summaryTransactions = (clone $query)->get();

        return Inertia::render('Admin/Holiday/Reports', [
            'transactions' => $query->paginate(15)->withQueryString(),
            'users' => User::where('role', 'user')->orderBy('name')->get(['id', 'name', 'email', 'member_number']),
            'programs' => HolidaySavingProgram::latest()->get(['id', 'name']),
            'filters' => [
                'user_id' => $request->user_id,
                'program_id' => $request->program_id,
                'status' => $request->status,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'summary' => [
                'totalTransactions' => $summaryTransactions->count(),
                'deposit' => $summaryTransactions->where('type', 'deposit')->where('status', 'approved')->sum('amount'),
                'withdraw' => $summaryTransactions->where('type', 'withdraw')->where('status', 'approved')->sum('amount'),
                'pending' => $summaryTransactions->where('status', 'pending')->count(),
                'approved' => $summaryTransactions->where('status', 'approved')->count(),
                'rejected' => $summaryTransactions->where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function export(Request $request)
    {
        ActivityLogger::log('export_holiday_report', 'Admin export laporan hari raya.', null, [
            'filters' => $request->only(['user_id', 'program_id', 'status', 'type', 'start_date', 'end_date']),
        ]);

        return Excel::download(new HolidayTransactionsExport($request), 'laporan-hari-raya-' . now()->format('Y-m-d-His') . '.xlsx');
    }

    private function query(Request $request)
    {
        $query = Transaction::with(['user:id,name,email,member_number', 'holidayProgram:id,name', 'approvedBy:id,name'])
            ->where('saving_type', 'holiday')
            ->latest();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->program_id);
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
