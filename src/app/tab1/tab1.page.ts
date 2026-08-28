import { Component, OnInit } from '@angular/core';
import { CycleService } from '../services/cycle.service';
import { SymptomService } from '../services/symptom.service';
import { CalendarEventService } from '../services/calendar-event.service';
import { CyclePrediction } from '../models/prediction.model';
import { SymptomLog } from '../models/symptom.model';
import { CalendarEvent } from '../models/calendar-event.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  predictions: CyclePrediction | null = null;
  recentSymptoms: SymptomLog[] = [];
  upcomingReminders: CalendarEvent[] = [];
  isLoading = true;
  today: string = '';
  daysUntilNext: number | null = null;
  daysUntilFertile: number | null = null;
  phaseDescription: string = '';

  constructor(
    private cycleService: CycleService,
    private symptomService: SymptomService,
    private calendarEventService: CalendarEventService
  ) { }

  ngOnInit(): void {
    this.today = this.formatToday();
    this.loadData();
  }

  ionViewWillEnter(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.cycleService.getPredictions().subscribe({
      next: (predictions: CyclePrediction) => {
        this.predictions = predictions;
        this.calculateDays();
        this.phaseDescription = this.getPhaseDescription(predictions.current_phase);
        this.isLoading = false;
      },
      error: () => {
        this.predictions = null;
        this.isLoading = false;
      }
    });

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    this.symptomService.getSymptomLogs(startDate, endDate).subscribe({
      next: (logs: SymptomLog[]) => this.recentSymptoms = logs.slice(0, 5),
      error: () => this.recentSymptoms = []
    });

    this.calendarEventService.getUpcomingReminders().subscribe({
      next: (reminders: CalendarEvent[]) => this.upcomingReminders = reminders,
      error: () => this.upcomingReminders = []
    });
  }

  private calculateDays(): void {
    if (this.predictions?.predicted_next_start) {
      const nextStart = new Date(this.predictions.predicted_next_start);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.daysUntilNext = Math.max(0, Math.ceil((nextStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    }

    if (this.predictions?.fertile_window_start) {
      const fertileStart = new Date(this.predictions.fertile_window_start);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.daysUntilFertile = Math.max(0, Math.ceil((fertileStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    }
  }

  private getPhaseDescription(phase: string | null): string {
    switch (phase) {
      case 'Menstrual':
        return 'Período menstrual. Descanse e cuide-se.';
      case 'Folicular':
        return 'Seu corpo está se preparando para a ovulação. Energia em alta!';
      case 'Ovulatória':
        return 'Período de ovulação. Fertilidade no pico.';
      case 'Lútea':
        return 'Fase lútea. Possíveis sintomas pré-menstruais.';
      default:
        return 'Registre seus ciclos para ver informações personalizadas.';
    }
  }

  private formatToday(): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('pt-BR', options);
  }

  getSymptomIcon(log: SymptomLog): string {
    return log.symptom?.icon || 'ellipse-outline';
  }

  getIntensityLabel(intensity: string): string {
    switch (intensity) {
      case 'leve': return 'Leve';
      case 'moderado': return 'Moderado';
      case 'intenso': return 'Intenso';
      default: return intensity;
    }
  }

  formatReminderDate(dateStr: string): string {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    if (diff <= 7) return `Em ${diff} dias`;
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }
}
