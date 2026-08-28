import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CycleService } from '../services/cycle.service';
import { CalendarEventService } from '../services/calendar-event.service';
import { SymptomService } from '../services/symptom.service';
import { CalendarEvent } from '../models/calendar-event.model';
import { SymptomLog } from '../models/symptom.model';
import { CyclePrediction } from '../models/prediction.model';
import { DayModalComponent } from './day-modal/day-modal.component';

interface CalendarDay {
  day: number | null;
  date: string;
  types: string[];
  isToday: boolean;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  currentDate = new Date();
  currentYear: number;
  currentMonth: number;
  monthName = '';
  weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  calendarDays: CalendarDay[] = [];
  predictions: CyclePrediction | null = null;
  events: CalendarEvent[] = [];
  symptomLogs: SymptomLog[] = [];
  upcomingReminders: CalendarEvent[] = [];
  isLoading = true;

  constructor(
    private cycleService: CycleService,
    private calendarEventService: CalendarEventService,
    private symptomService: SymptomService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ionViewWillEnter(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;

    const startDate = this.formatDate(this.currentYear, this.currentMonth + 1, 1);
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const endDate = this.formatDate(this.currentYear, this.currentMonth + 1, daysInMonth);

    // Load calendar events for this month
    this.calendarEventService.getEvents(startDate, endDate).subscribe({
      next: (events) => {
        this.events = events;
        // Load predictions
        this.cycleService.getPredictions().subscribe({
          next: (predictions) => {
            this.predictions = predictions;
            this.buildCalendar();
            this.isLoading = false;
          },
          error: () => {
            this.predictions = null;
            this.buildCalendar();
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.events = [];
        this.buildCalendar();
        this.isLoading = false;
        this.showToast('Erro ao carregar dados');
      }
    });

    // Load upcoming reminders
    this.calendarEventService.getUpcomingReminders().subscribe({
      next: (reminders) => this.upcomingReminders = reminders,
      error: () => this.upcomingReminders = []
    });

    // Load symptom logs for this month
    this.symptomService.getSymptomLogs(startDate, endDate).subscribe({
      next: (logs) => {
        this.symptomLogs = logs;
        this.buildCalendar();
      },
      error: () => this.symptomLogs = []
    });
  }

  previousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.loadData();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.loadData();
  }

  buildCalendar(): void {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    this.monthName = `${months[this.currentMonth]} ${this.currentYear}`;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayStr = this.formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    this.calendarDays = [];

    // Padding for first week
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ day: null, date: '', types: [], isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = this.formatDate(this.currentYear, this.currentMonth + 1, day);
      const types = this.getDayTypes(dateStr);
      this.calendarDays.push({
        day,
        date: dateStr,
        types,
        isToday: dateStr === todayStr
      });
    }
  }

  getDayTypes(dateStr: string): string[] {
    const types: string[] = [];

    // Check calendar events
    const dayEvents = this.events.filter(e => e.event_date === dateStr);
    if (dayEvents.some(e => e.type === 'menstruation')) {
      types.push('menstruation');
    }
    if (dayEvents.some(e => e.type === 'reminder')) {
      types.push('reminder');
    }
    if (dayEvents.some(e => e.type === 'note')) {
      types.push('note');
    }

    // Check symptom logs
    if (this.symptomLogs.some(s => s.log_date === dateStr)) {
      types.push('symptom');
    }

    // Check predictions
    if (this.predictions && !types.includes('menstruation')) {
      if (this.predictions.fertile_window_start && this.predictions.fertile_window_end) {
        if (dateStr >= this.predictions.fertile_window_start && dateStr <= this.predictions.fertile_window_end) {
          types.push('fertile');
        }
      }
      if (this.predictions.fertile_window_end) {
        const ovulationDate = new Date(this.predictions.fertile_window_end);
        ovulationDate.setDate(ovulationDate.getDate() + 1);
        const ovStr = ovulationDate.toISOString().split('T')[0];
        if (dateStr === ovStr) {
          types.push('ovulation');
        }
      }
    }

    return types;
  }

  async onDayTap(dayObj: CalendarDay): Promise<void> {
    if (!dayObj.day) return;

    const modal = await this.modalCtrl.create({
      component: DayModalComponent,
      componentProps: {
        selectedDate: dayObj.date,
        isMenstruationDay: dayObj.types.includes('menstruation')
      },
      breakpoints: [0, 0.6, 0.9],
      initialBreakpoint: 0.6,
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.changed) {
      this.loadData();
    }
  }

  private formatDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
