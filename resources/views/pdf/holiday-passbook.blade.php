<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Buku Tabungan Hari Raya</title>
    <style>
        body {
            color: #1A1A1A;
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            line-height: 1.45;
        }

        .header {
            border-bottom: 2px solid #16A34A;
            margin-bottom: 16px;
            padding-bottom: 10px;
        }

        h1 {
            font-size: 18px;
            margin: 0 0 4px;
        }

        h2 {
            font-size: 13px;
            margin: 14px 0 8px;
        }

        .muted {
            color: #5D5B54;
        }

        .grid {
            border-collapse: collapse;
            margin-bottom: 12px;
            width: 100%;
        }

        .grid td {
            border: 1px solid #E5E3DF;
            padding: 7px;
            vertical-align: top;
        }

        .summary td {
            background: #F6F5F4;
        }

        .note {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            color: #166534;
            margin-bottom: 12px;
            padding: 8px;
        }

        .label {
            color: #787671;
            font-size: 9px;
            margin-bottom: 3px;
        }

        .value {
            font-weight: bold;
        }

        table.transactions {
            border-collapse: collapse;
            width: 100%;
        }

        table.transactions th {
            background: #F6F5F4;
            border: 1px solid #E5E3DF;
            color: #5D5B54;
            font-size: 9px;
            padding: 6px;
            text-align: left;
        }

        table.transactions td {
            border: 1px solid #E5E3DF;
            padding: 6px;
        }

        .right {
            text-align: right;
        }

        .footer {
            color: #787671;
            font-size: 9px;
            margin-top: 16px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Buku Tabungan Hari Raya</h1>
        <div class="muted">Laporan transaksi Hari Raya beserta informasi potongan program.</div>
    </div>

    <table class="grid">
        <tr>
            <td>
                <div class="label">Nama User</div>
                <div class="value">{{ $passbookOwner['name'] }}</div>
            </td>
            <td>
                <div class="label">Email</div>
                <div class="value">{{ $passbookOwner['email'] }}</div>
            </td>
            <td>
                <div class="label">Program</div>
                <div class="value">{{ $summary['programLabel'] }}</div>
            </td>
            <td>
                <div class="label">Periode</div>
                <div class="value">{{ $summary['periodLabel'] }}</div>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <div class="label">Tanggal Cetak</div>
                <div class="value">{{ $summary['printedAt'] }}</div>
            </td>
        </tr>
    </table>

    <table class="grid summary">
        <tr>
            <td>
                <div class="label">Total Setoran</div>
                <div class="value">Rp {{ number_format($summary['totalDeposit'], 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="label">Total Penarikan</div>
                <div class="value">Rp {{ number_format($summary['totalWithdraw'], 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="label">Total Potongan</div>
                <div class="value">Rp {{ number_format($summary['totalDeductionApplied'] ?? 0, 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="label">Saldo Bersih Akhir</div>
                <div class="value">Rp {{ number_format($summary['finalBalance'], 0, ',', '.') }}</div>
                <div class="label">Sebelum potongan: Rp {{ number_format($summary['grossBalance'] ?? $summary['finalBalance'], 0, ',', '.') }}</div>
            </td>
        </tr>
    </table>

    <div class="note">
        {{ $summary['deductionNote'] ?? 'Saldo akhir ditampilkan setelah perhitungan potongan program jika tersedia.' }}
    </div>

    @if (! empty($summary['deduction']))
        <h2>Rincian Potongan Program</h2>
        <table class="grid">
            <tr>
                <td>
                    <div class="label">Jumlah Peserta Aktif</div>
                    <div class="value">{{ $summary['deduction']['active_participant_count'] }}</div>
                </td>
                <td>
                    <div class="label">Jumlah Bulan Program</div>
                    <div class="value">{{ $summary['deduction']['total_program_months'] }}</div>
                </td>
                <td>
                    <div class="label">Uang Pengendap / Peserta</div>
                    <div class="value">Rp {{ number_format($summary['deduction']['sinking_fund_per_user'], 0, ',', '.') }}</div>
                </td>
                <td>
                    <div class="label">Admin Sesuai Bulan Aktif</div>
                    <div class="value">Rp {{ number_format($summary['deduction']['admin_fee_total_per_user'], 0, ',', '.') }}</div>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="label">Total Potongan / Peserta</div>
                    <div class="value">Rp {{ number_format($summary['deduction']['total_deduction_per_user'], 0, ',', '.') }}</div>
                </td>
                <td colspan="2">
                    <div class="label">Terakhir Dihitung</div>
                    <div class="value">{{ $summary['deduction']['calculated_at'] ?? '-' }}</div>
                </td>
            </tr>
        </table>
    @endif

    <table class="transactions">
        <thead>
            <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Program</th>
                <th>Jenis</th>
                <th>Status</th>
                <th class="right">Setoran</th>
                <th class="right">Penarikan</th>
                <th class="right">Saldo</th>
                <th>Catatan</th>
                <th>Catatan Admin / Potongan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    <td>{{ $row['id'] }}</td>
                    <td>{{ $row['date'] }}</td>
                    <td>{{ $row['program'] ?? '-' }}</td>
                    <td>{{ $row['type'] === 'deposit' ? 'Setoran' : 'Penarikan' }}</td>
                    <td>{{ $row['status'] }}</td>
                    <td class="right">{{ $row['deposit'] > 0 ? 'Rp ' . number_format($row['deposit'], 0, ',', '.') : '-' }}</td>
                    <td class="right">{{ $row['withdraw'] > 0 ? 'Rp ' . number_format($row['withdraw'], 0, ',', '.') : '-' }}</td>
                    <td class="right">Rp {{ number_format($row['balance'], 0, ',', '.') }}</td>
                    <td>{{ $row['note'] ?? '-' }}</td>
                    <td>{{ $row['admin_note'] ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="10" style="text-align: center;">Belum ada transaksi pada filter ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">Dicetak melalui Tabungan Digital.</div>
</body>
</html>
