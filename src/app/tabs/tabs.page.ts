import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  isOpen = false;

  constructor() {}

  onAdd() {
    alert('Ação do botão +');
  }

  toggleFab() {
    this.isOpen = !this.isOpen;
  }

}
