<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) {
                $slug = Str::slug($value);
                if (\App\Models\Category::where('slug', $slug)->exists()) {
                    $fail('Uma categoria com este nome já existe.');
                }
            }],
        ];
    }
}
