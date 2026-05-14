import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  activeTab: string = 'menstruacao';

  constructor() {}

  setTab(tab: string) {
    this.activeTab = tab;
  }


}
