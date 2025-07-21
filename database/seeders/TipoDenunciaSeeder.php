<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoDenuncia;

class TipoDenunciaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            'Acoso Sexual',
            'Acoso Laboral',
            'Violencia en el Trabajo',
            'Robo',
            'Cohecho',
            'Otro',
        ];

        foreach ($tipos as $tipo) {
            TipoDenuncia::firstOrCreate(['nombre' => $tipo]);
        }
    }
}
