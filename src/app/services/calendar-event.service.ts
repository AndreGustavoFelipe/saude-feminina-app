import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarEvent, CreateCalendarEventDto, UpdateCalendarEventDto } from '../models/calendar-event.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getEvents(startDate?: string, endDate?: string, type?: string): Observable<CalendarEvent[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (type) params = params.set('type', type);

    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events`, { params })
      .pipe(map(res => res.data));
  }

  getEventsForDate(date: string): Observable<CalendarEvent[]> {
    const params = new HttpParams().set('event_date', date);
    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events`, { params })
      .pipe(map(res => res.data));
  }

  createEvent(dto: CreateCalendarEventDto): Observable<CalendarEvent> {
    return this.http.post<{ data: CalendarEvent }>(`${this.baseUrl}/calendar-events`, dto)
      .pipe(map(res => res.data));
  }

  updateEvent(id: number, dto: UpdateCalendarEventDto): Observable<CalendarEvent> {
    return this.http.put<{ data: CalendarEvent }>(`${this.baseUrl}/calendar-events/${id}`, dto)
      .pipe(map(res => res.data));
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/calendar-events/${id}`);
  }

  toggleMenstruation(date: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/calendar-events/toggle-menstruation`, { event_date: date });
  }

  getUpcomingReminders(): Observable<CalendarEvent[]> {
    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events-reminders/upcoming`)
      .pipe(map(res => res.data));
  }
}
