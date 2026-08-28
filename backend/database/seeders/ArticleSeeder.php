<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\LifePhase;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $menstruacao = Category::where('slug', 'menstruacao')->first();
        $contracepcao = Category::where('slug', 'contracepcao')->first();
        $gravidez = Category::where('slug', 'gravidez-e-pos-parto')->first();
        $emocional = Category::where('slug', 'saude-emocional')->first();
        $bemestar = Category::where('slug', 'bem-estar-e-autocuidado')->first();

        $adolescencia = LifePhase::where('slug', 'adolescencia')->first();
        $adulta = LifePhase::where('slug', 'fase-adulta')->first();
        $gestacao = LifePhase::where('slug', 'gestacao-e-pos-parto')->first();

        $tagCiclo = Tag::where('slug', 'ciclo-menstrual')->first();
        $tagHormonios = Tag::where('slug', 'hormonios')->first();
        $tagFertilidade = Tag::where('slug', 'fertilidade')->first();
        $tagAnticoncepcionais = Tag::where('slug', 'anticoncepcionais')->first();
        $tagSaudeIntima = Tag::where('slug', 'saude-intima')->first();
        $tagNutricao = Tag::where('slug', 'nutricao')->first();

        // Article 1
        $article1 = Article::create([
            'title' => 'Ciclo Menstrual: Entenda as Fases',
            'body' => '<h2>O que é o ciclo menstrual?</h2><p>O ciclo menstrual é o período entre o primeiro dia de uma menstruação e o primeiro dia da próxima. Em média, dura 28 dias, mas pode variar de 21 a 35 dias.</p><h3>As 4 fases do ciclo</h3><p><strong>Fase Menstrual (dias 1-5):</strong> É quando ocorre a menstruação. O endométrio se descama e é eliminado.</p><p><strong>Fase Folicular (dias 6-13):</strong> O corpo se prepara para a ovulação. Os níveis de estrogênio aumentam.</p><p><strong>Fase Ovulatória (dia 14):</strong> O óvulo é liberado pelo ovário. É o período mais fértil.</p><p><strong>Fase Lútea (dias 15-28):</strong> O corpo se prepara para uma possível gravidez. Se não houver fecundação, o ciclo recomeça.</p>',
            'status' => 'published',
            'category_id' => $menstruacao->id,
            'life_phase_id' => $adulta->id,
            'display_order' => 1,
        ]);
        $article1->tags()->attach([$tagCiclo->id, $tagHormonios->id]);

        // Article 2
        $article2 = Article::create([
            'title' => 'Métodos Contraceptivos: Guia Completo',
            'body' => '<h2>Escolhendo o método ideal</h2><p>Existem diversos métodos contraceptivos disponíveis. A escolha deve ser feita em conjunto com seu médico, considerando seu estilo de vida, saúde e preferências.</p><h3>Métodos Hormonais</h3><p><strong>Pílula:</strong> Tomada diariamente, impede a ovulação.</p><p><strong>DIU Hormonal:</strong> Dispositivo inserido no útero que libera hormônios por até 5 anos.</p><p><strong>Implante:</strong> Bastonete inserido no braço com duração de 3 anos.</p><h3>Métodos de Barreira</h3><p><strong>Preservativo:</strong> Único método que protege contra ISTs.</p><p><strong>Diafragma:</strong> Barreira física colocada no colo do útero.</p>',
            'status' => 'published',
            'category_id' => $contracepcao->id,
            'life_phase_id' => $adulta->id,
            'display_order' => 2,
        ]);
        $article2->tags()->attach([$tagAnticoncepcionais->id, $tagFertilidade->id]);

        // Article 3
        $article3 = Article::create([
            'title' => 'Sintomas Comuns e Como Aliviar',
            'body' => '<h2>Sintomas do ciclo menstrual</h2><p>É comum sentir desconfortos durante o ciclo. Conheça os mais frequentes e formas de alívio:</p><p><strong>Cólicas:</strong> Aplique bolsa de água quente na região abdominal. Exercícios leves também ajudam.</p><p><strong>Alterações de humor:</strong> Pratique atividades relaxantes como yoga ou meditação.</p><p><strong>Inchaço:</strong> Reduza o consumo de sal e aumente a ingestão de água.</p><p><strong>Dor de cabeça:</strong> Mantenha-se hidratada e evite longos períodos sem comer.</p>',
            'status' => 'published',
            'category_id' => $menstruacao->id,
            'life_phase_id' => $adolescencia->id,
            'display_order' => 3,
        ]);
        $article3->tags()->attach([$tagCiclo->id, $tagSaudeIntima->id]);

        // Article 4
        $article4 = Article::create([
            'title' => 'Alimentação e Ciclo Menstrual',
            'body' => '<h2>Como a alimentação afeta seu ciclo</h2><p>O que você come pode influenciar diretamente a regularidade e os sintomas do seu ciclo menstrual.</p><h3>Alimentos recomendados</h3><p><strong>Ferro:</strong> Carnes vermelhas, feijão, espinafre - reposição do ferro perdido na menstruação.</p><p><strong>Magnésio:</strong> Chocolate amargo, castanhas - ajuda a reduzir cólicas.</p><p><strong>Ômega-3:</strong> Peixes, linhaça - propriedades anti-inflamatórias.</p><p><strong>Vitamina B6:</strong> Banana, batata - auxilia na regulação hormonal.</p>',
            'status' => 'published',
            'category_id' => $bemestar->id,
            'life_phase_id' => $adulta->id,
            'display_order' => 4,
        ]);
        $article4->tags()->attach([$tagNutricao->id, $tagCiclo->id]);

        // Article 5
        $article5 = Article::create([
            'title' => 'Saúde Emocional no Puerpério',
            'body' => '<h2>O período pós-parto</h2><p>O puerpério é um período de grandes mudanças emocionais. É fundamental reconhecer os sinais e buscar apoio quando necessário.</p><h3>Baby Blues vs Depressão Pós-parto</h3><p><strong>Baby Blues:</strong> Sentimentos de tristeza e irritabilidade nos primeiros 15 dias. É temporário e comum em até 80% das mães.</p><p><strong>Depressão Pós-parto:</strong> Sintomas mais intensos e prolongados que requerem acompanhamento profissional.</p><p>Não hesite em pedir ajuda. Cuidar de você é cuidar do seu bebê.</p>',
            'status' => 'published',
            'category_id' => $emocional->id,
            'life_phase_id' => $gestacao->id,
            'display_order' => 5,
        ]);
        $article5->tags()->attach([$tagHormonios->id]);

        // Article 6 (draft)
        Article::create([
            'title' => 'Menopausa: O Que Esperar',
            'body' => '<h2>Entendendo a menopausa</h2><p>A menopausa é uma fase natural da vida da mulher, geralmente entre 45 e 55 anos. Conheça as mudanças e como se preparar.</p><p>Este artigo está em desenvolvimento.</p>',
            'status' => 'draft',
            'category_id' => $bemestar->id,
            'life_phase_id' => null,
            'display_order' => 6,
        ]);
    }
}
