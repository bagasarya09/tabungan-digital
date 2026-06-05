<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SavingGoal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ActivityLogger;

class SavingGoalController extends Controller
{
    public function index(Request $request)
    {
        $query = SavingGoal::where('user_id', auth()->id())
            ->latest();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $savingGoals = $query->get();

        return Inertia::render('User/SavingGoals/Index', [
            'savingGoals' => $savingGoals,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
            ],
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

    $savingGoal = SavingGoal::create([
        'user_id' => auth()->id(),
        'title' => $request->title,
        'target_amount' => $request->target_amount,
        'current_amount' => 0,
        'deadline' => $request->deadline,
        'status' => 'active',
        'description' => $request->description,
    ]);

    ActivityLogger::log(
        'create_saving_goal',
        'User membuat target tabungan: ' . $savingGoal->title,
        $savingGoal,
        [
            'target_amount' => $savingGoal->target_amount,
            'deadline' => $savingGoal->deadline,
        ]
    );

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

    $oldData = $savingGoal->only([
        'title',
        'target_amount',
        'deadline',
        'status',
        'description',
    ]);

    $savingGoal->update([
        'title' => $request->title,
        'target_amount' => $request->target_amount,
        'deadline' => $request->deadline,
        'status' => $request->status,
        'description' => $request->description,
    ]);

    ActivityLogger::log(
        'update_saving_goal',
        'User memperbarui target tabungan: ' . $savingGoal->title,
        $savingGoal,
        [
            'old_data' => $oldData,
            'new_data' => $savingGoal->only([
                'title',
                'target_amount',
                'deadline',
                'status',
                'description',
            ]),
        ]
    );

    return redirect()->route('saving-goals.index')
        ->with('success', 'Target tabungan berhasil diperbarui.');
}

    public function destroy(SavingGoal $savingGoal)
{
    if ($savingGoal->user_id !== auth()->id()) {
        abort(403);
    }

    ActivityLogger::log(
        'delete_saving_goal',
        'User menghapus target tabungan: ' . $savingGoal->title,
        $savingGoal,
        [
            'title' => $savingGoal->title,
            'target_amount' => $savingGoal->target_amount,
            'current_amount' => $savingGoal->current_amount,
        ]
    );

    $savingGoal->delete();

    return redirect()->route('saving-goals.index')
        ->with('success', 'Target tabungan berhasil dihapus.');
}
}
