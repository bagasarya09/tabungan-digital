<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ActivityLogger;
use App\Http\Controllers\Controller;
use App\Models\HolidayProgramFeeSetting;
use App\Models\HolidaySavingParticipant;
use App\Models\HolidaySavingProgram;
use App\Models\Transaction;
use App\Services\HolidayFeeCalculator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayFeeController extends Controller
{
    public function __construct(private HolidayFeeCalculator $calculator)
    {
    }

    public function index(Request $request)
    {
        $programs = HolidaySavingProgram::latest()->get();
        $selectedProgram = $this->selectedProgram($request, $programs);

        if (! $selectedProgram) {
            return Inertia::render('Admin/Holiday/Fees', [
                'programs' => $programs,
                'selectedProgram' => null,
                'setting' => null,
                'calculation' => null,
                'monthlyAdmin' => null,
                'participants' => [],
                'filters' => [
                    'admin_month' => $request->admin_month ?: now()->format('Y-m'),
                ],
            ]);
        }

        $setting = $this->settingFor($selectedProgram);
        $calculation = $this->calculate($selectedProgram, $setting);
        $adminMonth = $request->admin_month ?: now()->format('Y-m');

        return Inertia::render('Admin/Holiday/Fees', [
            'programs' => $programs,
            'selectedProgram' => $selectedProgram,
            'setting' => $setting,
            'calculation' => $calculation,
            'monthlyAdmin' => $this->calculator->monthlyBreakdown($selectedProgram, $setting, $adminMonth),
            'participants' => $this->participants($selectedProgram, $setting),
            'filters' => [
                'admin_month' => $adminMonth,
            ],
        ]);
    }

    public function recalculate(Request $request)
    {
        $data = $request->validate([
            'program_id' => 'required|exists:holiday_saving_programs,id',
            'sinking_fund_total' => 'required|numeric|min:0',
            'admin_fee_monthly_total' => 'required|numeric|min:0',
        ]);

        $program = HolidaySavingProgram::findOrFail($data['program_id']);
        $setting = $this->settingFor($program);
        $setting->update([
            'sinking_fund_total' => $data['sinking_fund_total'],
            'admin_fee_monthly_total' => $data['admin_fee_monthly_total'],
        ]);

        $setting->update($this->calculate($program, $setting) + [
            'calculated_at' => now(),
        ]);

        ActivityLogger::log(
            'recalculate_holiday_fee',
            'Admin menghitung ulang potongan program hari raya: ' . $program->name,
            $setting,
            ['program_id' => $program->id]
        );

        return redirect()->route('admin.holiday.fees.index', ['program_id' => $program->id])
            ->with('success', 'Potongan program hari raya berhasil dihitung ulang.');
    }

    private function selectedProgram(Request $request, $programs): ?HolidaySavingProgram
    {
        $programId = $request->integer('program_id') ?: $programs->first()?->id;

        return $programId ? HolidaySavingProgram::find($programId) : null;
    }

    private function settingFor(HolidaySavingProgram $program): HolidayProgramFeeSetting
    {
        $setting = HolidayProgramFeeSetting::firstOrCreate([
            'holiday_saving_program_id' => $program->id,
        ], [
            'sinking_fund_total' => 100000,
            'admin_fee_monthly_total' => 6000,
        ]);

        if ((float) $setting->sinking_fund_total === 10000000.0 && (float) $setting->admin_fee_monthly_total === 600000.0) {
            $setting->update([
                'sinking_fund_total' => 100000,
                'admin_fee_monthly_total' => 6000,
            ]);
        }

        return $setting->fresh();
    }

    private function calculate(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting): array
    {
        return $this->calculator->summary($program, $setting);
    }

    private function participants(HolidaySavingProgram $program, HolidayProgramFeeSetting $setting): array
    {
        $participants = HolidaySavingParticipant::with('user:id,name,email,member_number')
            ->where('holiday_saving_program_id', $program->id)
            ->where('status', 'active')
            ->latest()
            ->get();

        $balances = Transaction::where('saving_type', 'holiday')
            ->where('program_id', $program->id)
            ->where('status', 'approved')
            ->selectRaw("user_id, SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END) as balance")
            ->groupBy('user_id')
            ->pluck('balance', 'user_id');

        return $participants->map(function (HolidaySavingParticipant $participant) use ($program, $setting, $balances) {
            $balance = (float) ($balances[$participant->user_id] ?? 0);
            $deduction = $this->calculator->deductionForParticipant($program, $setting, $participant);
            $totalDeduction = $deduction['total_deduction_per_user'];

            return [
                'id' => $participant->id,
                'user' => $participant->user,
                'balance' => $balance,
                'sinking_fund_per_user' => $deduction['sinking_fund_per_user'],
                'admin_fee_total_per_user' => $deduction['admin_fee_total_per_user'],
                'total_deduction_per_user' => $totalDeduction,
                'net_withdrawal_amount' => round($balance - $totalDeduction, 2),
                'is_sufficient' => ($balance - $totalDeduction) > 0,
            ];
        })->values()->all();
    }
}
