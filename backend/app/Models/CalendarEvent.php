<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    protected $fillable = [
        'user_id',
        'event_date',
        'type',
        'title',
        'description',
        'time',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function scopeForUser($query, int $userId = 1)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOnDate($query, string $date)
    {
        return $query->where('event_date', $date);
    }

    public function scopeInRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('event_date', [$startDate, $endDate]);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date')
            ->orderBy('time');
    }
}
