<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')->id ?? $this->route('category');

        return [
            'name' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) use ($categoryId) {
                $slug = Str::slug($value);
                if (\App\Models\Category::where('slug', $slug)->where('id', '!=', $categoryId)->exists()) {
                    $fail('Uma categoria com este nome já existe.');
                }
            }],
        ];
    }
}
