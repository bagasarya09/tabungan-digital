<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;

class HolidayTransactionsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithColumnFormatting
{
    public function __construct(private Request $request)
    {
    }

    public function collection()
    {
        return $this->query()->get();
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nama User',
            'Email',
            'Program Hari Raya',
            'Jenis',
            'Nominal',
            'Status',
            'Catatan',
            'Catatan Admin / Potongan',
            'Approved By',
            'Approved At',
        ];
    }

    public function map($transaction): array
    {
        return [
            optional($transaction->created_at)->format('d/m/Y H:i'),
            $transaction->user->name ?? '-',
            $transaction->user->email ?? '-',
            $transaction->holidayProgram->name ?? '-',
            $transaction->type === 'deposit' ? 'Setoran' : 'Penarikan',
            $transaction->amount,
            $transaction->status,
            $transaction->note ?? '-',
            $transaction->admin_note ?? '-',
            $transaction->approvedBy->name ?? '-',
            $transaction->approved_at ? $transaction->approved_at->format('d/m/Y H:i') : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        $lastColumn = $sheet->getHighestColumn();

        $sheet->getStyle('A1:' . $lastColumn . '1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '16A34A']],
            'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
        ]);

        $sheet->getStyle('A1:' . $lastColumn . $lastRow)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'E5E3DF']]],
            'alignment' => ['vertical' => 'center'],
        ]);

        return [];
    }

    public function columnFormats(): array
    {
        return [
            'F' => NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1,
        ];
    }

    private function query()
    {
        $query = Transaction::with(['user', 'holidayProgram', 'approvedBy'])
            ->where('saving_type', 'holiday')
            ->latest();

        if ($this->request->filled('user_id')) {
            $query->where('user_id', $this->request->user_id);
        }

        if ($this->request->filled('program_id')) {
            $query->where('program_id', $this->request->program_id);
        }

        if ($this->request->filled('status')) {
            $query->where('status', $this->request->status);
        }

        if ($this->request->filled('type')) {
            $query->where('type', $this->request->type);
        }

        if ($this->request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $this->request->start_date);
        }

        if ($this->request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $this->request->end_date);
        }

        return $query;
    }
}
