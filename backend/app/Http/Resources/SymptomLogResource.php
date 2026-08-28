<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SymptomLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'symptom_id' => $this->symptom_id,
            'symptom' => new SymptomResource($this->whenLoaded('symptom')),
            'log_date' => $this->log_date->format('Y-m-d'),
            'intensity' => $this->intensity,
            'notes' => $this->notes,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
