<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
            'status' => ['nullable', 'in:published,draft'],
            'category_id' => ['required', 'exists:categories,id'],
            'life_phase_id' => ['nullable', 'exists:life_phases,id'],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['exists:tags,id'],
        ];
    }
}
