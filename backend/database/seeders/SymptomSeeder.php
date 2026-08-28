<?php

namespace Database\Seeders;

use App\Models\Symptom;
use Illuminate\Database\Seeder;

class SymptomSeeder extends Seeder
{
    public function run(): void
    {
        $symptoms = [
            ['name' => 'Cólica', 'icon' => 'fitness-outline'],
            ['name' => 'Dor de cabeça', 'icon' => 'flash-outline'],
            ['name' => 'Alteração de humor', 'icon' => 'happy-outline'],
            ['name' => 'Inchaço', 'icon' => 'water-outline'],
            ['name' => 'Acne', 'icon' => 'ellipse-outline'],
            ['name' => 'Fadiga', 'icon' => 'battery-dead-outline'],
            ['name' => 'Náusea', 'icon' => 'medical-outline'],
            ['name' => 'Dor nas mamas', 'icon' => 'heart-outline'],
            ['name' => 'Insônia', 'icon' => 'moon-outline'],
            ['name' => 'Ansiedade', 'icon' => 'pulse-outline'],
        ];

        foreach ($symptoms as $symptom) {
            Symptom::create($symptom);
        }
    }
}
