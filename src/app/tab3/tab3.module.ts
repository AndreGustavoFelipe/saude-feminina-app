import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { Tab3PageRoutingModule } from './tab3-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, Tab3PageRoutingModule],
  declarations: [Tab3Page]
})
export class Tab3PageModule { }
