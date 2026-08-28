<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'status' => $this->status,
            'category_id' => $this->category_id,
            'life_phase_id' => $this->life_phase_id,
            'display_order' => $this->display_order,
            'user_id' => $this->user_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'life_phase' => new LifePhaseResource($this->whenLoaded('lifePhase')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
