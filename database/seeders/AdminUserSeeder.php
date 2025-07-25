<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Greenex',
            'email' => 'admin@greenex.cl',
            'password' => Hash::make('password'), // Puedes cambiar la contraseña
            'rol' => 'admin',
        ]);
    }
}
