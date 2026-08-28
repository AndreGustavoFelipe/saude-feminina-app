<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'Ciclo Menstrual',
            'Hormônios',
            'Fertilidade',
            'Anticoncepcionais',
            'Saúde Íntima',
            'Nutrição',
            'Exercícios',
            'Saúde Mental',
            'Autoconhecimento',
            'Prevenção',
        ];

        foreach ($tags as $name) {
            Tag::create(['name' => $name]);
        }
    }
}
