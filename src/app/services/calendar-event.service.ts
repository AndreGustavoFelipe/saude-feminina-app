import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CalendarEvent, CreateCalendarEventDto, UpdateCalendarEventDto } from '../models/calendar-event.model';
import { MenstruationLocalService } from './menstruation-local.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private menstruationLocal: MenstruationLocalService
  ) {}

  getEvents(startDate?: string, endDate?: string, type?: string): Observable<CalendarEvent[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (type) params = params.set('type', type);

    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events`, { params })
      .pipe(
        catchError(() => of({ data: [] as CalendarEvent[] })),
        map(res => (res.data || []).filter(e => e.type !== 'menstruation')),
        map(apiEvents => {
          if (type && type !== 'menstruation') {
            return apiEvents;
          }
          const localEvents = this.menstruationLocal.getMenstruationEventsInRange(startDate, endDate);
          return type === 'menstruation' ? localEvents : [...apiEvents, ...localEvents];
        })
      );
  }

  getEventsForDate(date: string): Observable<CalendarEvent[]> {
    const params = new HttpParams().set('event_date', date);
    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events`, { params })
      .pipe(
        catchError(() => of({ data: [] as CalendarEvent[] })),
        map(res => (res.data || []).filter(e => e.type !== 'menstruation')),
        map(apiEvents => {
          const localEvent = this.menstruationLocal.isMenstruationDay(date)
            ? [this.menstruationLocal.buildSyntheticEvent(date)]
            : [];
          return [...localEvent, ...apiEvents];
        })
      );
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

  toggleMenstruation(date: string): Observable<{ action: 'created' | 'removed'; date: string }> {
    return of(this.menstruationLocal.toggleMenstruation(date));
  }

  getUpcomingReminders(): Observable<CalendarEvent[]> {
    return this.http.get<{ data: CalendarEvent[] }>(`${this.baseUrl}/calendar-events-reminders/upcoming`)
      .pipe(map(res => res.data));
  }
}
