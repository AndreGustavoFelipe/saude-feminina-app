export type CalendarEventType = 'menstruation' | 'reminder' | 'note';

export interface CalendarEvent {
  id: number;
  user_id: number;
  event_date: string;
  type: CalendarEventType;
  title: string | null;
  description: string | null;
  time: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventDto {
  event_date: string;
  type: CalendarEventType;
  title?: string;
  description?: string;
  time?: string;
}

export interface UpdateCalendarEventDto {
  event_date?: string;
  type?: CalendarEventType;
  title?: string;
  description?: string;
  time?: string;
}
