import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailPage } from './article-detail.page';

const routes: Routes = [
  { path: '', component: ArticleDetailPage }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ArticleDetailPage]
})
export class ArticleDetailPageModule {}
