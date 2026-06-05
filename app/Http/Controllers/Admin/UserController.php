<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount(['savingGoals', 'transactions'])
            ->withSum('savingGoals', 'current_amount')
            ->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $summaryUsers = (clone $query)->get();
        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'summary' => [
                'totalAccounts' => $summaryUsers->count(),
                'totalUsers' => $summaryUsers->where('role', 'user')->count(),
                'totalAdmins' => $summaryUsers->where('role', 'admin')->count(),
            ],
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
            ],
        ]);
    }
}
