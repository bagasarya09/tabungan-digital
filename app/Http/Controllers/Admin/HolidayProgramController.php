<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\HolidaySavingProgram;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayProgramController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Holiday/Programs', [
            'programs' => HolidaySavingProgram::withCount('participants')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'holiday_type' => 'required|in:idul_fitri,idul_adha,other',
            'start_date' => 'required|date',
            'holiday_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,active,completed,cancelled',
            'description' => 'nullable|string',
        ]);

        $program = HolidaySavingProgram::create($data);

        ActivityLogger::log('create_holiday_program', 'Admin membuat program hari raya: ' . $program->name, $program);

        return redirect()->route('admin.holiday.programs.index')
            ->with('success', 'Program hari raya berhasil dibuat.');
    }

    public function update(Request $request, HolidaySavingProgram $program)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'holiday_type' => 'required|in:idul_fitri,idul_adha,other',
            'start_date' => 'required|date',
            'holiday_date' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:draft,active,completed,cancelled',
            'description' => 'nullable|string',
        ]);

        $program->update($data);

        ActivityLogger::log('update_holiday_program', 'Admin memperbarui program hari raya: ' . $program->name, $program);

        return redirect()->route('admin.holiday.programs.index')
            ->with('success', 'Program hari raya berhasil diperbarui.');
    }

    public function destroy(HolidaySavingProgram $program)
    {
        $programName = $program->name;
        $program->delete();

        ActivityLogger::log('delete_holiday_program', 'Admin menghapus program hari raya: ' . $programName);

        return redirect()->route('admin.holiday.programs.index')
            ->with('success', 'Program hari raya berhasil dihapus.');
    }
}
