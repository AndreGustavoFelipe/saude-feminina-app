<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $endDate = $this->input('end_date');
            $startDate = $this->input('start_date') ?? $this->route('cycle')?->start_date?->format('Y-m-d');

            if ($endDate && $startDate && $endDate < $startDate) {
                $validator->errors()->add('end_date', 'A data de fim não pode ser anterior à data de início.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'end_date.date' => 'A data de fim deve ser uma data válida.',
        ];
    }
}
