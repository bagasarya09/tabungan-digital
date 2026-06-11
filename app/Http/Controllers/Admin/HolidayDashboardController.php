<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use Inertia\Inertia;

class HolidayDashboardController extends Controller
{
    public function index()
    {
        $approvedTransactions = Transaction::query()
            ->where('saving_type', 'holiday')
            ->where('status', 'approved');

        return Inertia::render('Admin/Holiday/Dashboard', [
            'stats' => [
                'totalPrograms' => HolidaySavingProgram::count(),
                'activePrograms' => HolidaySavingProgram::where('status', 'active')->count(),
                'activeParticipants' => HolidaySavingParticipant::where('status', 'active')->count(),
                'totalDeposit' => (clone $approvedTransactions)->where('type', 'deposit')->sum('amount'),
                'totalWithdraw' => (clone $approvedTransactions)->where('type', 'withdraw')->sum('amount'),
                'pendingTransactions' => Transaction::where('saving_type', 'holiday')->where('status', 'pending')->count(),
            ],
            'latestTransactions' => Transaction::with(['user:id,name,email,member_number', 'holidayProgram:id,name'])
                ->where('saving_type', 'holiday')
                ->latest()
                ->take(8)
                ->get(),
            'latestPrograms' => HolidaySavingProgram::withCount('participants')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
