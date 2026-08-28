import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { SymptomService } from '../../services/symptom.service';
import { CalendarEventService } from '../../services/calendar-event.service';
import { Symptom } from '../../models/symptom.model';

@Component({
  selector: 'app-symptom-modal',
  templateUrl: './symptom-modal.component.html',
  styleUrls: ['./symptom-modal.component.scss'],
  standalone: false,
})
export class SymptomModalComponent implements OnInit {
  symptoms: Symptom[] = [];
  selectedSymptomId: number | null = null;
  selectedIntensity: string = 'moderado';
  notes: string = '';
  isSubmitting = false;
  isLoadingSymptoms = true;

  constructor(
    private modalCtrl: ModalController,
    private symptomService: SymptomService,
    private calendarEventService: CalendarEventService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit(): void {
    this.loadSymptoms();
  }

  loadSymptoms(): void {
    this.isLoadingSymptoms = true;
    this.symptomService.getSymptoms().subscribe({
      next: (symptoms) => {
        this.symptoms = symptoms;
        this.isLoadingSymptoms = false;
      },
      error: () => {
        this.isLoadingSymptoms = false;
        this.showToast('Erro ao carregar sintomas');
      }
    });
  }

  selectSymptom(symptomId: number): void {
    this.selectedSymptomId = symptomId;
  }

  submit(): void {
    if (!this.selectedSymptomId) {
      this.showToast('Selecione um sintoma');
      return;
    }

    this.isSubmitting = true;
    const today = new Date().toISOString().split('T')[0];

    this.symptomService.createSymptomLog({
      symptom_id: this.selectedSymptomId,
      log_date: today,
      intensity: this.selectedIntensity as 'leve' | 'moderado' | 'intenso',
      notes: this.notes || undefined
    }).subscribe({
      next: () => {
        // Also create a calendar event so it appears in the calendar
        const symptomName = this.symptoms.find(s => s.id === this.selectedSymptomId)?.name || 'Sintoma';
        this.calendarEventService.createEvent({
          event_date: today,
          type: 'note',
          title: `Sintoma: ${symptomName}`,
          description: this.notes || undefined,
        }).subscribe(); // fire-and-forget, don't block dismissal

        this.isSubmitting = false;
        this.showToast('Sintoma registrado com sucesso');
        this.modalCtrl.dismiss({ success: true });
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Erro ao registrar sintoma';
        this.showToast(msg);
      }
    });
  }

  cancel(): void {
    this.modalCtrl.dismiss();
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
