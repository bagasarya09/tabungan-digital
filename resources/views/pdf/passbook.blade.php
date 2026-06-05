<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Buku Tabungan Digital</title>
    <style>
        body {
            color: #1A1A1A;
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            line-height: 1.45;
        }

        .header {
            border-bottom: 2px solid #16A34A;
            margin-bottom: 18px;
            padding-bottom: 12px;
        }

        h1 {
            font-size: 20px;
            margin: 0 0 4px;
        }

        .muted {
            color: #5D5B54;
        }

        .info-grid,
        .summary-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .info-grid td,
        .summary-grid td {
            border: 1px solid #E5E3DF;
            padding: 8px;
            vertical-align: top;
        }

        .summary-grid td {
            background: #F6F5F4;
        }

        .label {
            color: #787671;
            font-size: 10px;
            margin-bottom: 3px;
        }

        .value {
            font-weight: bold;
        }

        table.transactions {
            width: 100%;
            border-collapse: collapse;
        }

        table.transactions th {
            background: #F6F5F4;
            border: 1px solid #E5E3DF;
            color: #5D5B54;
            font-size: 10px;
            padding: 7px;
            text-align: left;
        }

        table.transactions td {
            border: 1px solid #E5E3DF;
            padding: 7px;
        }

        .right {
            text-align: right;
        }

        .footer {
            color: #787671;
            font-size: 10px;
            margin-top: 18px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Buku Tabungan Digital</h1>
        <div class="muted">Laporan transaksi approved dalam format buku tabungan.</div>
    </div>

    <table class="info-grid">
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
                <div class="label">Periode Laporan</div>
                <div class="value">{{ $summary['periodLabel'] }}</div>
            </td>
            <td>
                <div class="label">Target Tabungan</div>
                <div class="value">{{ $summary['targetLabel'] ?? 'Semua Target' }}</div>
            </td>
        </tr>
        <tr>
            <td colspan="4">
                <div class="label">Tanggal Cetak</div>
                <div class="value">{{ $summary['printedAt'] }}</div>
            </td>
        </tr>
    </table>

    <table class="summary-grid">
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
                <div class="label">Saldo Akhir</div>
                <div class="value">Rp {{ number_format($summary['finalBalance'], 0, ',', '.') }}</div>
            </td>
        </tr>
    </table>

    <table class="transactions">
        <thead>
            <tr>
                <th>No Transaksi</th>
                <th>Tanggal</th>
                <th>Target</th>
                <th>Jenis</th>
                <th class="right">Debit</th>
                <th class="right">Kredit</th>
                <th class="right">Saldo Berjalan</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($transactions as $transaction)
                <tr>
                    <td>{{ $transaction['number'] }}</td>
                    <td>{{ $transaction['date'] }}</td>
                    <td>{{ $transaction['saving_goal'] }}</td>
                    <td>{{ $transaction['type'] === 'deposit' ? 'Setoran' : 'Penarikan' }}</td>
                    <td class="right">
                        {{ $transaction['debit'] > 0 ? 'Rp ' . number_format($transaction['debit'], 0, ',', '.') : '-' }}
                    </td>
                    <td class="right">
                        {{ $transaction['credit'] > 0 ? 'Rp ' . number_format($transaction['credit'], 0, ',', '.') : '-' }}
                    </td>
                    <td class="right">Rp {{ number_format($transaction['balance'], 0, ',', '.') }}</td>
                    <td>{{ $transaction['note'] ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Belum ada transaksi approved pada periode ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Dicetak melalui Tabungan Digital.
    </div>
</body>
</html>
