<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class UpdateLifePhaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $lifePhaseId = $this->route('lifePhase')->id ?? $this->route('lifePhase');

        return [
            'name' => ['required', 'string', 'max:255', function ($attribute, $value, $fail) use ($lifePhaseId) {
                $slug = Str::slug($value);
                if (\App\Models\LifePhase::where('slug', $slug)->where('id', '!=', $lifePhaseId)->exists()) {
                    $fail('Uma fase de vida com este nome já existe.');
                }
            }],
        ];
    }
}
