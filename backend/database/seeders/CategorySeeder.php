<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Menstruação',
            'Contracepção',
            'Gravidez e Pós-parto',
            'Saúde Emocional',
            'Bem-estar e Autocuidado',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
