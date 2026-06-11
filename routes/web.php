<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\User\SavingGoalController;
use App\Http\Controllers\User\TransactionController;
use App\Http\Controllers\User\HolidayController;
use App\Http\Controllers\Admin\DepositVerificationController;
use App\Http\Controllers\Admin\ManualDepositController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\Admin\WithdrawVerificationController;
use App\Http\Controllers\User\PassbookController as UserPassbookController;
use App\Http\Controllers\Admin\PassbookController as AdminPassbookController;
use App\Http\Controllers\Admin\ProgramFeeSettingController;
use App\Http\Controllers\Admin\HolidayProgramController;
use App\Http\Controllers\Admin\HolidayParticipantController;
use App\Http\Controllers\Admin\HolidayDashboardController;
use App\Http\Controllers\Admin\HolidayReportController;
use App\Http\Controllers\Admin\HolidayFeeController;
use App\Http\Controllers\Admin\HolidayWithdrawalController;
use App\Http\Controllers\Admin\HolidayPassbookController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => auth()->user(),
        ],
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/saving-goals', [SavingGoalController::class, 'index'])
        ->name('saving-goals.index');

    Route::post('/saving-goals', [SavingGoalController::class, 'store'])
        ->name('saving-goals.store');

    Route::put('/saving-goals/{savingGoal}', [SavingGoalController::class, 'update'])
        ->name('saving-goals.update');

    Route::delete('/saving-goals/{savingGoal}', [SavingGoalController::class, 'destroy'])
        ->name('saving-goals.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])
    ->name('transactions.index');

    Route::post('/transactions', [TransactionController::class, 'store'])
        ->name('transactions.store');

    Route::post('/transactions/withdraw', [TransactionController::class, 'withdraw'])
        ->name('transactions.withdraw');

    
    Route::get('/notifications', [NotificationController::class, 'index'])
    ->name('notifications.index');

    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');

    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.read-all');

    Route::get('/passbook', [UserPassbookController::class, 'index'])
        ->name('passbook.index');

    Route::get('/passbook/pdf', [UserPassbookController::class, 'pdf'])
        ->name('passbook.pdf');

    Route::get('/holiday/dashboard', [HolidayController::class, 'dashboard'])
        ->name('holiday.dashboard');

    Route::get('/holiday/programs', [HolidayController::class, 'programs'])
        ->name('holiday.programs.index');

    Route::get('/holiday/programs/{program}', [HolidayController::class, 'showProgram'])
        ->name('holiday.programs.show');

    Route::get('/holiday/transactions', [HolidayController::class, 'transactions'])
        ->name('holiday.transactions.index');

    Route::get('/holiday/passbook', [HolidayController::class, 'passbook'])
        ->name('holiday.passbook.index');

    Route::get('/holiday/passbook/pdf', [HolidayController::class, 'passbookPdf'])
        ->name('holiday.passbook.pdf');
        
    });

    Route::middleware(['auth', 'verified', 'admin'])
        ->prefix('admin')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('admin.dashboard');

            Route::get('/users', [AdminUserController::class, 'index'])
                ->name('admin.users.index');

            Route::post('/users', [AdminUserController::class, 'store'])
                ->name('admin.users.store');

            Route::put('/users/{user}', [AdminUserController::class, 'update'])
                ->name('admin.users.update');

            Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])
                ->name('admin.users.destroy');

            Route::get('/deposits/verification', [DepositVerificationController::class, 'index'])
                ->name('admin.deposits.verification');

            Route::post('/deposits/{transaction}/approve', [DepositVerificationController::class, 'approve'])
                ->name('admin.deposits.approve');

            Route::post('/deposits/{transaction}/reject', [DepositVerificationController::class, 'reject'])
                ->name('admin.deposits.reject');

            Route::get('/withdrawals/verification', [WithdrawVerificationController::class, 'index'])
                ->name('admin.withdrawals.verification');

            Route::post('/withdrawals/{transaction}/approve', [WithdrawVerificationController::class, 'approve'])
                ->name('admin.withdrawals.approve');

            Route::post('/withdrawals/{transaction}/reject', [WithdrawVerificationController::class, 'reject'])
                ->name('admin.withdrawals.reject');

            Route::get('/deposits/manual', [ManualDepositController::class, 'index'])
                ->name('admin.deposits.manual');

            Route::post('/deposits/manual', [ManualDepositController::class, 'store'])
                ->name('admin.deposits.manual.store');

            Route::get('/reports/transactions', [ReportController::class, 'transactions'])
                ->name('admin.reports.transactions');
            
            Route::get('/reports/transactions/export', [ReportController::class, 'exportTransactions'])
                ->name('admin.reports.transactions.export');

            Route::get('/activity-logs', [ActivityLogController::class, 'index'])
            ->name('admin.activity-logs.index');

            Route::get('/passbooks', [AdminPassbookController::class, 'index'])
                ->name('admin.passbooks.index');

            Route::get('/passbooks/pdf', [AdminPassbookController::class, 'pdf'])
                ->name('admin.passbooks.pdf');

            Route::get('/program-fees', [ProgramFeeSettingController::class, 'index'])
                ->name('admin.program-fees.index');

            Route::post('/program-fees/recalculate', [ProgramFeeSettingController::class, 'recalculate'])
                ->name('admin.program-fees.recalculate');

            Route::post('/program-fees/generate-holiday-withdrawals', [ProgramFeeSettingController::class, 'generateHolidayWithdrawals'])
                ->name('admin.program-fees.generate-holiday-withdrawals');

            Route::get('/holiday/dashboard', [HolidayDashboardController::class, 'index'])
                ->name('admin.holiday.dashboard');

            Route::get('/holiday/programs', [HolidayProgramController::class, 'index'])
                ->name('admin.holiday.programs.index');

            Route::post('/holiday/programs', [HolidayProgramController::class, 'store'])
                ->name('admin.holiday.programs.store');

            Route::put('/holiday/programs/{program}', [HolidayProgramController::class, 'update'])
                ->name('admin.holiday.programs.update');

            Route::delete('/holiday/programs/{program}', [HolidayProgramController::class, 'destroy'])
                ->name('admin.holiday.programs.destroy');

            Route::get('/holiday/participants', [HolidayParticipantController::class, 'index'])
                ->name('admin.holiday.participants.index');

            Route::post('/holiday/participants', [HolidayParticipantController::class, 'store'])
                ->name('admin.holiday.participants.store');

            Route::put('/holiday/participants/{participant}', [HolidayParticipantController::class, 'update'])
                ->name('admin.holiday.participants.update');

            Route::delete('/holiday/participants/{participant}', [HolidayParticipantController::class, 'destroy'])
                ->name('admin.holiday.participants.destroy');

            Route::post('/holiday/participants/{participant}/deposits', [HolidayParticipantController::class, 'storeDeposit'])
                ->name('admin.holiday.participants.deposits.store');

            Route::put('/holiday/deposits/{transaction}', [HolidayParticipantController::class, 'updateDeposit'])
                ->name('admin.holiday.deposits.update');

            Route::get('/holiday/fees', [HolidayFeeController::class, 'index'])
                ->name('admin.holiday.fees.index');

            Route::post('/holiday/fees/recalculate', [HolidayFeeController::class, 'recalculate'])
                ->name('admin.holiday.fees.recalculate');

            Route::get('/holiday/deposits/verification', fn () => Inertia::render('Admin/Holiday/DepositVerification'))
                ->name('admin.holiday.deposits.verification');

            Route::get('/holiday/withdrawals', [HolidayWithdrawalController::class, 'index'])
                ->name('admin.holiday.withdrawals.index');

            Route::post('/holiday/withdrawals/generate', [HolidayWithdrawalController::class, 'generate'])
                ->name('admin.holiday.withdrawals.generate');

            Route::post('/holiday/withdrawals/{transaction}/approve', [HolidayWithdrawalController::class, 'approve'])
                ->name('admin.holiday.withdrawals.approve');

            Route::post('/holiday/withdrawals/{transaction}/reject', [HolidayWithdrawalController::class, 'reject'])
                ->name('admin.holiday.withdrawals.reject');

            Route::get('/holiday/reports', [HolidayReportController::class, 'index'])
                ->name('admin.holiday.reports.index');

            Route::get('/holiday/reports/export', [HolidayReportController::class, 'export'])
                ->name('admin.holiday.reports.export');

            Route::get('/holiday/passbooks', [HolidayPassbookController::class, 'index'])
                ->name('admin.holiday.passbooks.index');

            Route::get('/holiday/passbooks/pdf', [HolidayPassbookController::class, 'pdf'])
                ->name('admin.holiday.passbooks.pdf');
        });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

require __DIR__.'/auth.php';
