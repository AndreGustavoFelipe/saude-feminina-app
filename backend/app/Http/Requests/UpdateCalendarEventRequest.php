<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCalendarEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_date' => ['sometimes', 'required', 'date'],
            'type' => ['sometimes', 'required', 'in:menstruation,reminder,note'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'time' => ['nullable', 'date_format:H:i'],
        ];
    }
}
