import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CalendarEventService } from '../services/calendar-event.service';
import { SymptomModalComponent } from './symptom-modal/symptom-modal.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  isOpen = false;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private calendarEventService: CalendarEventService
  ) { }

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

  onMenstruation(): void {
    this.isOpen = false;
    const today = new Date().toISOString().split('T')[0];

    this.calendarEventService.toggleMenstruation(today).subscribe({
      next: (res: any) => {
        const msg = res.action === 'removed'
          ? 'Menstruação removida para hoje'
          : 'Menstruação marcada para hoje';
        this.showToast(msg);
      },
      error: () => this.showToast('Erro ao registrar menstruação')
    });
  }

  async onSymptom(): Promise<void> {
    this.isOpen = false;
    const modal = await this.modalCtrl.create({
      component: SymptomModalComponent,
      breakpoints: [0, 0.75, 1],
      initialBreakpoint: 0.75
    });
    await modal.present();
  }

  onEvent(): void {
    this.isOpen = false;
    this.showToast('Funcionalidade de eventos em breve!');
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
