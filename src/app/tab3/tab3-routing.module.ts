import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
  { path: '', component: Tab3Page },
  { path: 'article/:id', loadChildren: () => import('./article-detail/article-detail.module').then(m => m.ArticleDetailPageModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab3PageRoutingModule { }
