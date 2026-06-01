<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavingGoalController extends Controller
{
    public function index()
    {
        $savingGoals = SavingGoal::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('User/SavingGoals/Index', [
            'savingGoals' => $savingGoals,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:1000',
            'deadline' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        SavingGoal::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'target_amount' => $request->target_amount,
            'current_amount' => 0,
            'deadline' => $request->deadline,
            'status' => 'active',
            'description' => $request->description,
        ]);

        return redirect()->route('saving-goals.index')
            ->with('success', 'Target tabungan berhasil dibuat.');
    }

    public function update(Request $request, SavingGoal $savingGoal)
    {
        if ($savingGoal->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'target_amount' => 'required|numeric|min:1000',
            'deadline' => 'nullable|date',
            'status' => 'required|in:active,completed,cancelled',
            'description' => 'nullable|string',
        ]);

        $savingGoal->update([
            'title' => $request->title,
            'target_amount' => $request->target_amount,
            'deadline' => $request->deadline,
            'status' => $request->status,
            'description' => $request->description,
        ]);

        return redirect()->route('saving-goals.index', status: 303)
            ->with('success', 'Target tabungan berhasil diperbarui.');
    }

    public function destroy(SavingGoal $savingGoal)
    {
        if ($savingGoal->user_id !== auth()->id()) {
            abort(403);
        }

        $savingGoal->delete();

        return redirect()->route('saving-goals.index', status: 303)
            ->with('success', 'Target tabungan berhasil dihapus.');
    }
}
