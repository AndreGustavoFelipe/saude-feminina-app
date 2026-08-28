import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CyclePrediction } from '../models/prediction.model';
import { CalendarEvent } from '../models/calendar-event.model';

const STORAGE_KEY = 'sf_menstruation_days';

@Injectable({
  providedIn: 'root'
})
export class MenstruationLocalService {

  private changed$ = new Subject<void>();
  /** Emite toda vez que um dia de menstruação é marcado/desmarcado, de qualquer lugar do app. */
  readonly changes: Observable<void> = this.changed$.asObservable();

  // ---------- Persistência ----------

  getDays(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const days: string[] = raw ? JSON.parse(raw) : [];
      return days.filter(d => typeof d === 'string').sort();
    } catch {
      return [];
    }
  }

  private saveDays(days: string[]): void {
    const unique = Array.from(new Set(days)).sort();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
  }

  isMenstruationDay(date: string): boolean {
    return this.getDays().includes(date);
  }

  toggleMenstruation(date: string): { action: 'created' | 'removed'; date: string } {
    const days = this.getDays();
    const exists = days.includes(date);

    if (exists) {
      this.saveDays(days.filter(d => d !== date));
      this.changed$.next();
      return { action: 'removed', date };
    }

    this.saveDays([...days, date]);
    this.changed$.next();
    return { action: 'created', date };
  }

  // ---------- CalendarEvent sintético (compatibilidade com o resto do app) ----------

  buildSyntheticEvent(date: string): CalendarEvent {
    return {
      id: -Number(date.replace(/-/g, '')),
      user_id: 1,
      event_date: date,
      type: 'menstruation',
      title: 'Menstruação',
      description: null,
      time: null,
      created_at: date,
      updated_at: date
    };
  }

  getMenstruationEventsInRange(startDate?: string, endDate?: string): CalendarEvent[] {
    return this.getDays()
      .filter(d => (!startDate || d >= startDate) && (!endDate || d <= endDate))
      .map(d => this.buildSyntheticEvent(d));
  }

  // ---------- Helpers de data (dias puros, em UTC, sem hora, evita bug de fuso) ----------
  // Públicos de propósito: outros componentes (ex: tab2.page.ts) usam para
  // fazer aritmética de datas sem cair no bug de timezone do Date nativo.

  parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
  }

  /** Soma (ou subtrai) dias a uma string 'YYYY-MM-DD', em UTC, sem risco de fuso horário. */
  addDaysToDateString(dateStr: string, days: number): string {
    return this.formatDate(this.addDays(this.parseDate(dateStr), days));
  }

  private diffInDays(a: Date, b: Date): number {
    return Math.round(Math.abs(b.getTime() - a.getTime()) / 86400000);
  }

  private todayUTC(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  // ---------- Predições (porte fiel de PredictionController.php) ----------

  getPredictions(): CyclePrediction {
    const menstruationDays = this.getDays().map(d => this.parseDate(d));

    if (menstruationDays.length === 0) {
      return this.emptyPrediction();
    }

    const periods = this.groupIntoPeriods(menstruationDays);

    if (periods.length === 0) {
      return this.emptyPrediction();
    }

    const averageCycleLength = this.calculateAverageCycleLengthFromPeriods(periods);
    const lastPeriodStart = periods[0][0];
    const currentDay = this.diffInDays(lastPeriodStart, this.todayUTC()) + 1;
    const lastPeriodLength = periods[0].length;
    const currentPhase = this.determinePhaseWithLength(currentDay, lastPeriodLength);
    const predictedNextStart = this.addDays(lastPeriodStart, averageCycleLength);
    const [fertileStart, fertileEnd] = this.calculateFertileWindow(predictedNextStart);

    return {
      predicted_next_start: this.formatDate(predictedNextStart),
      fertile_window_start: this.formatDate(fertileStart),
      fertile_window_end: this.formatDate(fertileEnd),
      average_cycle_length: averageCycleLength,
      current_phase: currentPhase,
      current_day: currentDay
    };
  }

  private emptyPrediction(): CyclePrediction {
    return {
      predicted_next_start: null,
      fertile_window_start: null,
      fertile_window_end: null,
      average_cycle_length: null,
      current_phase: null,
      current_day: null,
      message: 'Registre seus dias de menstruação para obter predições.'
    };
  }

  private groupIntoPeriods(days: Date[]): Date[][] {
    const sorted = [...days].sort((a, b) => a.getTime() - b.getTime());
    if (sorted.length === 0) return [];

    const periods: Date[][] = [];
    let current: Date[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const gap = this.diffInDays(sorted[i - 1], sorted[i]);
      if (gap <= 2) {
        current.push(sorted[i]);
      } else {
        periods.push(current);
        current = [sorted[i]];
      }
    }
    periods.push(current);

    return periods.reverse();
  }

  private calculateAverageCycleLengthFromPeriods(periods: Date[][]): number {
    if (periods.length < 2) {
      return 28;
    }

    const lengths: number[] = [];
    const iterations = Math.min(periods.length - 1, 6);

    for (let i = 0; i < iterations; i++) {
      const currentStart = periods[i][0];
      const previousStart = periods[i + 1][0];
      const length = this.diffInDays(previousStart, currentStart);
      if (length > 0 && length <= 45) {
        lengths.push(length);
      }
    }

    if (lengths.length < 2) {
      return 28;
    }

    return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
  }

  private determinePhaseWithLength(currentDay: number, periodLength: number): string {
    if (currentDay >= 1 && currentDay <= periodLength) {
      return 'Menstrual';
    }
    if (currentDay >= periodLength + 1 && currentDay <= 13) {
      return 'Folicular';
    }
    if (currentDay === 14) {
      return 'Ovulatória';
    }
    return 'Lútea';
  }

  private calculateFertileWindow(predictedNextStart: Date): [Date, Date] {
    const ovulation = this.addDays(predictedNextStart, -14);
    const fertileStart = this.addDays(ovulation, -5);
    const fertileEnd = this.addDays(ovulation, -1);
    return [fertileStart, fertileEnd];
  }
}
