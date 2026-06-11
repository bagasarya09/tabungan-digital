<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

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
                ->orWhere('member_number', 'like', '%' . $request->search . '%')
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

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'member_number' => ['required', 'string', 'max:50', 'unique:users,member_number'],
            'role' => ['required', Rule::in(['user', 'admin'])],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'member_number' => $data['member_number'],
            'email' => $this->emailForMemberNumber($data['member_number']),
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        ActivityLogger::log('create_user', 'Admin menambahkan akun peserta/admin.', $user, [
            'user_id' => $user->id,
            'role' => $user->role,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Peserta berhasil ditambahkan.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'member_number' => ['required', 'string', 'max:50', Rule::unique('users', 'member_number')->ignore($user->id)],
            'role' => ['required', Rule::in(['user', 'admin'])],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if ($user->id === auth()->id() && $data['role'] !== 'admin') {
            throw ValidationException::withMessages([
                'role' => 'Akun admin yang sedang login tidak boleh diubah menjadi user.',
            ]);
        }

        $user->fill([
            'name' => $data['name'],
            'member_number' => $data['member_number'],
            'role' => $data['role'],
        ]);

        if (! $user->email || str_ends_with($user->email, '@anggota.local')) {
            $user->email = $this->emailForMemberNumber($data['member_number']);
        }

        if (filled($data['password'] ?? null)) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        ActivityLogger::log('update_user', 'Admin mengubah data akun peserta/admin.', $user, [
            'user_id' => $user->id,
            'role' => $user->role,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Data peserta berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Akun yang sedang login tidak bisa dihapus.');
        }

        $deletedUser = [
            'id' => $user->id,
            'name' => $user->name,
            'member_number' => $user->member_number,
            'email' => $user->email,
            'role' => $user->role,
        ];

        DB::transaction(function () use ($user, $deletedUser) {
            $user->delete();

            ActivityLogger::log('delete_user', 'Admin menghapus akun peserta beserta seluruh data terkait.', null, [
                'deleted_user' => $deletedUser,
            ]);
        });

        return redirect()->route('admin.users.index')
            ->with('success', 'Peserta dan seluruh data terkait berhasil dihapus.');
    }

    private function emailForMemberNumber(string $memberNumber): string
    {
        $clean = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '.', trim($memberNumber)));
        $clean = trim($clean, '.');

        return ($clean ?: uniqid('anggota')) . '@anggota.local';
    }
}
