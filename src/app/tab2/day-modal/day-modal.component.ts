import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CalendarEventService } from '../../services/calendar-event.service';
import { SymptomService } from '../../services/symptom.service';
import { CalendarEvent, CalendarEventType } from '../../models/calendar-event.model';
import { SymptomLog } from '../../models/symptom.model';

@Component({
  selector: 'app-day-modal',
  templateUrl: './day-modal.component.html',
  styleUrls: ['./day-modal.component.scss'],
  standalone: false,
})
export class DayModalComponent implements OnInit {
  @Input() selectedDate!: string;
  @Input() isMenstruationDay = false;

  eventsForDay: CalendarEvent[] = [];
  symptomLogsForDay: SymptomLog[] = [];
  isLoading = true;
  isSubmitting = false;

  // Form state for new event
  showForm = false;
  formType: CalendarEventType = 'reminder';
  formTitle = '';
  formDescription = '';
  formTime = '';

  constructor(
    private modalCtrl: ModalController,
    private calendarEventService: CalendarEventService,
    private symptomService: SymptomService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.loadEventsForDay();
  }

  get formattedDate(): string {
    const date = new Date(this.selectedDate + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  loadEventsForDay(): void {
    this.isLoading = true;
    this.calendarEventService.getEventsForDate(this.selectedDate).subscribe({
      next: (events) => {
        this.eventsForDay = events;
        this.isMenstruationDay = events.some(e => e.type === 'menstruation');
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Erro ao carregar eventos');
      }
    });

    // Carregar sintomas do dia
    this.symptomService.getSymptomLogs(this.selectedDate, this.selectedDate).subscribe({
      next: (logs) => this.symptomLogsForDay = logs,
      error: () => this.symptomLogsForDay = []
    });
  }

  toggleMenstruation(): void {
    this.isSubmitting = true;
    this.calendarEventService.toggleMenstruation(this.selectedDate).subscribe({
      next: (res) => {
        // Define o estado com base na resposta do servidor (não otimista)
        this.isMenstruationDay = res.action === 'created';
        this.isSubmitting = false;
        const msg = res.action === 'removed' ? 'Menstruação removida' : 'Menstruação marcada';
        this.showToast(msg);
        // Recarrega a lista de eventos SEM sobrescrever isMenstruationDay
        this.reloadEvents();
      },
      error: () => {
        this.isSubmitting = false;
        this.showToast('Erro ao atualizar menstruação');
      }
    });
  }

  private reloadEvents(): void {
    this.calendarEventService.getEventsForDate(this.selectedDate).subscribe({
      next: (events) => {
        this.eventsForDay = events;
        // Sincroniza o estado da menstruação com os dados reais do servidor
        this.isMenstruationDay = events.some(e => e.type === 'menstruation');
      },
      error: () => {
        // Silencioso - o estado do toggle já foi definido pela resposta do toggleMenstruation
      }
    });
  }

  showAddForm(type: CalendarEventType): void {
    this.formType = type;
    this.formTitle = '';
    this.formDescription = '';
    this.formTime = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  submitEvent(): void {
    if (!this.formTitle.trim()) {
      this.showToast('Insira um título');
      return;
    }

    this.isSubmitting = true;
    this.calendarEventService.createEvent({
      event_date: this.selectedDate,
      type: this.formType,
      title: this.formTitle.trim(),
      description: this.formDescription.trim() || undefined,
      time: this.formTime || undefined,
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showForm = false;
        this.showToast(this.formType === 'reminder' ? 'Lembrete criado' : 'Anotação salva');
        this.loadEventsForDay();
      },
      error: () => {
        this.isSubmitting = false;
        this.showToast('Erro ao salvar evento');
      }
    });
  }

  deleteEvent(event: CalendarEvent): void {
    this.calendarEventService.deleteEvent(event.id).subscribe({
      next: () => {
        this.showToast('Evento removido');
        this.loadEventsForDay();
      },
      error: () => this.showToast('Erro ao remover evento')
    });
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'menstruation': return 'water';
      case 'reminder': return 'alarm-outline';
      case 'note': return 'document-text-outline';
      default: return 'ellipse-outline';
    }
  }

  getEventLabel(type: string): string {
    switch (type) {
      case 'menstruation': return 'Menstruação';
      case 'reminder': return 'Lembrete';
      case 'note': return 'Anotação';
      default: return type;
    }
  }

  getIntensityLabel(intensity: string): string {
    switch (intensity) {
      case 'leve': return 'Leve';
      case 'moderado': return 'Moderado';
      case 'intenso': return 'Intenso';
      default: return intensity;
    }
  }

  close(): void {
    this.modalCtrl.dismiss({ changed: true });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom'
    });
    await toast.present();
  }
}
