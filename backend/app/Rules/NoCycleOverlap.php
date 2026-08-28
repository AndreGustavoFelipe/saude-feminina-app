<?php

namespace App\Rules;

use App\Models\MenstrualCycle;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoCycleOverlap implements ValidationRule
{
    public function __construct(
        private ?string $endDate = null,
        private ?int $excludeId = null
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $query = MenstrualCycle::where('user_id', 1);

        if ($this->excludeId) {
            $query->where('id', '!=', $this->excludeId);
        }

        $startDate = $value;
        $endDate = $this->endDate;

        $overlapping = $query->where(function ($q) use ($startDate, $endDate) {
            if ($endDate) {
                $q->where(function ($sub) use ($startDate, $endDate) {
                    $sub->where('start_date', '<=', $endDate)
                        ->where(function ($inner) use ($startDate) {
                            $inner->where('end_date', '>=', $startDate)
                                  ->orWhereNull('end_date');
                        });
                });
            } else {
                $q->where('start_date', '<=', $startDate)
                  ->where(function ($inner) use ($startDate) {
                      $inner->where('end_date', '>=', $startDate)
                            ->orWhereNull('end_date');
                  });
            }
        })->exists();

        if ($overlapping) {
            $fail('O período informado sobrepõe um ciclo existente.');
        }
    }
}
