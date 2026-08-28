<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::published()
            ->with(['category', 'lifePhase', 'tags'])
            ->orderBy('display_order');

        $this->applyFilters($query, $request);

        return ArticleResource::collection($query->get());
    }

    public function adminIndex(Request $request)
    {
        $query = Article::with(['category', 'lifePhase', 'tags'])
            ->orderBy('display_order');

        $this->applyFilters($query, $request);

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        return ArticleResource::collection($query->get());
    }

    public function store(StoreArticleRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = 1;

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $article = Article::create($data);

        if (!empty($tagIds)) {
            $article->tags()->attach($tagIds);
        }

        $article->load(['category', 'lifePhase', 'tags']);

        return (new ArticleResource($article))->response()->setStatusCode(201);
    }

    public function show(Article $article)
    {
        $article->load(['category', 'lifePhase', 'tags']);
        return new ArticleResource($article);
    }

    public function update(UpdateArticleRequest $request, Article $article)
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            if ($article->cover_image) {
                Storage::disk('public')->delete($article->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        }

        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        $article->update($data);

        if ($tagIds !== null) {
            $article->tags()->sync($tagIds);
        }

        $article->load(['category', 'lifePhase', 'tags']);

        return new ArticleResource($article);
    }

    public function destroy(Article $article)
    {
        if ($article->cover_image) {
            Storage::disk('public')->delete($article->cover_image);
        }

        $article->tags()->detach();
        $article->delete();

        return response()->json(null, 204);
    }

    private function applyFilters($query, Request $request): void
    {
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('life_phase_id')) {
            $query->where('life_phase_id', $request->input('life_phase_id'));
        }

        if ($request->has('tag_id')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('tags.id', $request->input('tag_id'));
            });
        }
    }
}
