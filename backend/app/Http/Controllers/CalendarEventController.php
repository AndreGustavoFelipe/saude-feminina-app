<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarEventRequest;
use App\Http\Requests\UpdateCalendarEventRequest;
use App\Http\Resources\CalendarEventResource;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;

class CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $query = CalendarEvent::forUser();

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->inRange($request->input('start_date'), $request->input('end_date'));
        }

        if ($request->has('type')) {
            $query->ofType($request->input('type'));
        }

        if ($request->has('event_date')) {
            $query->onDate($request->input('event_date'));
        }

        $events = $query->orderBy('event_date')->orderBy('time')->get();

        return CalendarEventResource::collection($events);
    }

    public function store(StoreCalendarEventRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = 1;

        $event = CalendarEvent::create($data);

        return (new CalendarEventResource($event))->response()->setStatusCode(201);
    }

    public function show(CalendarEvent $calendarEvent)
    {
        return new CalendarEventResource($calendarEvent);
    }

    public function update(UpdateCalendarEventRequest $request, CalendarEvent $calendarEvent)
    {
        $calendarEvent->update($request->validated());
        return new CalendarEventResource($calendarEvent);
    }

    public function destroy(CalendarEvent $calendarEvent)
    {
        $calendarEvent->delete();
        return response()->json(null, 204);
    }

    /**
     * Toggle menstruation for a specific date.
     * If a menstruation event exists for that date, remove it.
     * If not, create one.
     */
    public function toggleMenstruation(Request $request)
    {
        $request->validate([
            'event_date' => ['required', 'date'],
        ]);

        $date = $request->input('event_date');

        $existing = CalendarEvent::forUser()
            ->ofType('menstruation')
            ->onDate($date)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['action' => 'removed', 'date' => $date]);
        }

        $event = CalendarEvent::create([
            'user_id' => 1,
            'event_date' => $date,
            'type' => 'menstruation',
            'title' => 'Menstruação',
        ]);

        return response()->json(['action' => 'created', 'date' => $date], 201);
    }

    /**
     * Get upcoming reminders for the home page.
     */
    public function upcomingReminders()
    {
        $reminders = CalendarEvent::forUser()
            ->ofType('reminder')
            ->upcoming()
            ->limit(5)
            ->get();

        return CalendarEventResource::collection($reminders);
    }
}