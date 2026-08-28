<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSymptomLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'symptom_id' => ['required', 'exists:symptoms,id'],
            'log_date' => ['required', 'date'],
            'intensity' => ['required', 'in:leve,moderado,intenso'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'symptom_id.required' => 'O sintoma é obrigatório.',
            'symptom_id.exists' => 'O sintoma informado não existe.',
            'log_date.required' => 'A data é obrigatória.',
            'log_date.date' => 'A data deve ser uma data válida.',
            'intensity.required' => 'A intensidade é obrigatória.',
            'intensity.in' => 'A intensidade deve ser: leve, moderado ou intenso.',
        ];
    }
}
