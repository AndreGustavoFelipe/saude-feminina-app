<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateTagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tagId = $this->route('tag')->id ?? $this->route('tag');

        return [
            'name' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) use ($tagId) {
                $slug = Str::slug($value);
                if (\App\Models\Tag::where('slug', $slug)->where('id', '!=', $tagId)->exists()) {
                    $fail('Uma tag com este nome já existe.');
                }
            }],
        ];
    }
}
