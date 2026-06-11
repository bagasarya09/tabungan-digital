<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ImageParticipantSeeder extends Seeder
{
    public function run(): void
    {
        $participants = [
            'Ajanki / Kiki',
            'Yati-Angki',
            'Ryan',
            'Salamah',
            'Agus K',
            'Lilis',
            'Ratna',
            'Nana',
            'Bu Lina',
            'Suryadi',
            'Hj. Aminah',
            'Abd. Ghofur',
            'Ibu Ida',
            'Halimah',
            'Kholifah',
            'Irwan',
            'Ai',
            'Niskala - Mega',
            'Marsan',
            'I r m a',
            'Indra',
            'Oma',
            'Dini - Warkop',
            'Ibu Uting',
            'Rasdem',
            'Ibas',
            'Devi - Rizal',
            'Silmie',
            'Edy Kusdinar',
            'Sholeh',
            'N i t a',
        ];

        foreach ($participants as $index => $name) {
            $memberNumber = 'ANG-' . str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT);
            $email = strtolower(str_replace('-', '', $memberNumber)) . '@anggota.local';

            User::updateOrCreate(
                ['member_number' => $memberNumber],
                [
                    'name' => $name,
                    'email' => $email,
                    'role' => 'user',
                    'password' => Hash::make('password123'),
                ]
            );
        }
    }
}
