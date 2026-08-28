<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use App\Models\MenstrualCycle;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class PredictionController extends Controller
{
    public function index(): JsonResponse
    {
        // Try new calendar_events system first
        $menstruationDays = CalendarEvent::forUser()
            ->ofType('menstruation')
            ->orderBy('event_date', 'desc')
            ->pluck('event_date')
            ->map(fn ($d) => Carbon::parse($d))
            ->toArray();

        if (!empty($menstruationDays)) {
            return $this->predictFromCalendarEvents($menstruationDays);
        }

        // Fallback to old menstrual_cycles system
        return $this->predictFromCycles();
    }

    private function predictFromCalendarEvents(array $menstruationDays): JsonResponse
    {
        // Group consecutive menstruation days into periods
        $periods = $this->groupIntoPeriods($menstruationDays);

        if (empty($periods)) {
            return response()->json([
                'predicted_next_start' => null,
                'fertile_window_start' => null,
                'fertile_window_end' => null,
                'average_cycle_length' => null,
                'current_phase' => null,
                'current_day' => null,
                'message' => 'Registre seus dias de menstruação para obter predições.',
            ]);
        }

        $averageCycleLength = $this->calculateAverageCycleLengthFromPeriods($periods);
        $lastPeriodStart = $periods[0][0]; // Most recent period, first day
        $currentDay = (int) $lastPeriodStart->diffInDays(Carbon::today()) + 1;
        $lastPeriodLength = count($periods[0]);
        $currentPhase = $this->determinePhaseWithLength($currentDay, $lastPeriodLength);
        $predictedNextStart = $lastPeriodStart->copy()->addDays($averageCycleLength);
        [$fertileStart, $fertileEnd] = $this->calculateFertileWindow($predictedNextStart);

        return response()->json([
            'predicted_next_start' => $predictedNextStart->format('Y-m-d'),
            'fertile_window_start' => $fertileStart?->format('Y-m-d'),
            'fertile_window_end' => $fertileEnd?->format('Y-m-d'),
            'average_cycle_length' => $averageCycleLength,
            'current_phase' => $currentPhase,
            'current_day' => $currentDay,
        ]);
    }

    /**
     * Group menstruation days into periods (consecutive day groups).
     * Returns array of periods, each period is an array of Carbon dates sorted asc.
     * Periods are ordered most recent first.
     */
    private function groupIntoPeriods(array $menstruationDays): array
    {
        // Sort ascending
        $sorted = collect($menstruationDays)->sort(function ($a, $b) {
            return $a->lt($b) ? -1 : 1;
        })->values()->toArray();

        if (empty($sorted)) return [];

        $periods = [];
        $currentPeriod = [$sorted[0]];

        for ($i = 1; $i < count($sorted); $i++) {
            $diffDays = $sorted[$i - 1]->diffInDays($sorted[$i]);
            if ($diffDays <= 2) {
                // Allow 1-day gap (forgetting to mark a day)
                $currentPeriod[] = $sorted[$i];
            } else {
                $periods[] = $currentPeriod;
                $currentPeriod = [$sorted[$i]];
            }
        }
        $periods[] = $currentPeriod;

        // Reverse so most recent is first
        return array_reverse($periods);
    }

    private function calculateAverageCycleLengthFromPeriods(array $periods): int
    {
        if (count($periods) < 2) {
            return 28;
        }

        $lengths = [];
        // Periods are most-recent-first, so we go from index 0 to n
        // Cycle length = difference between start of one period and start of the next
        for ($i = 0; $i < min(count($periods) - 1, 6); $i++) {
            $currentStart = $periods[$i][0];
            $previousStart = $periods[$i + 1][0];
            $length = (int) $previousStart->diffInDays($currentStart);
            if ($length > 0 && $length <= 45) {
                $lengths[] = $length;
            }
        }

        if (empty($lengths) || count($lengths) < 2) {
            return 28;
        }

        return (int) round(array_sum($lengths) / count($lengths));
    }

    private function determinePhaseWithLength(int $currentDay, int $periodLength): string
    {
        if ($currentDay >= 1 && $currentDay <= $periodLength) {
            return 'Menstrual';
        }
        if ($currentDay >= $periodLength + 1 && $currentDay <= 13) {
            return 'Folicular';
        }
        if ($currentDay === 14) {
            return 'Ovulatória';
        }
        return 'Lútea';
    }

    // --- Fallback: old cycle-based prediction ---

    private function predictFromCycles(): JsonResponse
    {
        $cycles = MenstrualCycle::where('user_id', 1)
            ->orderBy('start_date', 'desc')
            ->get();

        if ($cycles->isEmpty()) {
            return response()->json([
                'predicted_next_start' => null,
                'fertile_window_start' => null,
                'fertile_window_end' => null,
                'average_cycle_length' => null,
                'current_phase' => null,
                'current_day' => null,
                'message' => 'Registre pelo menos um ciclo para obter predições.',
            ]);
        }

        $averageCycleLength = $this->calculateAverageCycleLength($cycles);
        $lastCycle = $cycles->first();
        $currentDay = $this->calculateCurrentDay($lastCycle);
        $currentPhase = $this->determinePhase($currentDay);
        $predictedNextStart = $this->predictNextStart($lastCycle, $averageCycleLength);
        [$fertileStart, $fertileEnd] = $this->calculateFertileWindow($predictedNextStart);

        return response()->json([
            'predicted_next_start' => $predictedNextStart?->format('Y-m-d'),
            'fertile_window_start' => $fertileStart?->format('Y-m-d'),
            'fertile_window_end' => $fertileEnd?->format('Y-m-d'),
            'average_cycle_length' => $averageCycleLength,
            'current_phase' => $currentPhase,
            'current_day' => $currentDay,
        ]);
    }

    private function calculateAverageCycleLength($cycles): int
    {
        $completeCycles = $cycles->filter(fn ($cycle) => $cycle->end_date !== null);

        if ($completeCycles->count() < 3) {
            return 28;
        }

        $sortedCycles = $cycles->sortBy('start_date')->values();
        $lengths = [];

        for ($i = 1; $i < min($sortedCycles->count(), 7); $i++) {
            $length = $sortedCycles[$i - 1]->start_date->diffInDays($sortedCycles[$i]->start_date);
            if ($length > 0 && $length <= 45) {
                $lengths[] = $length;
            }
        }

        if (empty($lengths)) {
            return 28;
        }

        $lengths = array_slice($lengths, -6);
        if (count($lengths) < 3) {
            return 28;
        }

        return (int) round(array_sum($lengths) / count($lengths));
    }

    private function calculateCurrentDay($lastCycle): int
    {
        $today = Carbon::today();
        return (int) $lastCycle->start_date->diffInDays($today) + 1;
    }

    private function determinePhase(int $currentDay): string
    {
        if ($currentDay >= 1 && $currentDay <= 5) {
            return 'Menstrual';
        }
        if ($currentDay >= 6 && $currentDay <= 13) {
            return 'Folicular';
        }
        if ($currentDay === 14) {
            return 'Ovulatória';
        }
        return 'Lútea';
    }

    private function predictNextStart($lastCycle, int $averageCycleLength): ?Carbon
    {
        return $lastCycle->start_date->copy()->addDays($averageCycleLength);
    }

    private function calculateFertileWindow(?Carbon $predictedNextStart): array
    {
        if (!$predictedNextStart) {
            return [null, null];
        }

        $ovulation = $predictedNextStart->copy()->subDays(14);
        $fertileStart = $ovulation->copy()->subDays(5);
        $fertileEnd = $ovulation->copy()->subDay();

        return [$fertileStart, $fertileEnd];
    }
}
