<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\User\SavingGoalController;
use App\Http\Controllers\User\TransactionController;
use App\Http\Controllers\Admin\DepositVerificationController;
use App\Http\Controllers\Admin\ManualDepositController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\Admin\WithdrawVerificationController;
use App\Http\Controllers\User\PassbookController as UserPassbookController;
use App\Http\Controllers\Admin\PassbookController as AdminPassbookController;

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
        
    });

    Route::middleware(['auth', 'verified', 'admin'])
        ->prefix('admin')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index'])
                ->name('admin.dashboard');

            Route::get('/users', [AdminUserController::class, 'index'])
                ->name('admin.users.index');

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
        });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

require __DIR__.'/auth.php';
