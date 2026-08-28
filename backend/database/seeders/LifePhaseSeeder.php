<?php

namespace Database\Seeders;

use App\Models\LifePhase;
use Illuminate\Database\Seeder;

class LifePhaseSeeder extends Seeder
{
    public function run(): void
    {
        $phases = [
            'Adolescência',
            'Fase Adulta',
            'Gestação e Pós-parto',
            'Climatério e Menopausa',
            'Senescência',
        ];

        foreach ($phases as $name) {
            LifePhase::create(['name' => $name]);
        }
    }
}
