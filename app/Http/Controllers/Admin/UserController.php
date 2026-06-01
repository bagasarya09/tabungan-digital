<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::withCount(['savingGoals', 'transactions'])
            ->withSum('savingGoals', 'current_amount')
            ->latest()
            ->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }
}