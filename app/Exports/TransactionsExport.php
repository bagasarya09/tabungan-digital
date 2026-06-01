<?php

namespace App\Exports;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithColumnFormatting
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Transaction::with(['user', 'savingGoal', 'approvedBy'])
            ->latest();

        if ($this->request->filled('user_id')) {
            $query->where('user_id', $this->request->user_id);
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

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nama User',
            'Email User',
            'Target Tabungan',
            'Jenis Transaksi',
            'Nominal',
            'Status',
            'Catatan User',
            'Catatan Admin',
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
            $transaction->savingGoal->title ?? '-',
            $transaction->type === 'deposit' ? 'Setoran' : 'Penarikan',
            $transaction->amount,
            $transaction->status,
            $transaction->note ?? '-',
            $transaction->admin_note ?? '-',
            $transaction->approvedBy->name ?? '-',
            $transaction->approved_at
                ? date('d/m/Y H:i', strtotime($transaction->approved_at))
                : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $sheet->getHighestRow();
        $lastColumn = $sheet->getHighestColumn();

        $sheet->getStyle('A1:' . $lastColumn . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => [
                    'rgb' => 'FFFFFF',
                ],
            ],
            'fill' => [
                'fillType' => 'solid',
                'startColor' => [
                    'rgb' => '2563EB',
                ],
            ],
            'alignment' => [
                'horizontal' => 'center',
                'vertical' => 'center',
            ],
        ]);

        $sheet->getStyle('A1:' . $lastColumn . $lastRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                    'color' => [
                        'rgb' => 'D1D5DB',
                    ],
                ],
            ],
            'alignment' => [
                'vertical' => 'center',
            ],
        ]);

        $sheet->getStyle('F2:F' . $lastRow)->applyFromArray([
            'alignment' => [
                'horizontal' => 'right',
            ],
        ]);

        $sheet->getRowDimension(1)->setRowHeight(25);

        return [];
    }

    public function columnFormats(): array
    {
        return [
            'F' => '#,##0',
        ];
    }
}