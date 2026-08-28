import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'articles', pathMatch: 'full' },
      { path: 'articles', loadComponent: () => import('./articles/article-list.component').then(m => m.ArticleListComponent) },
      { path: 'articles/new', loadComponent: () => import('./articles/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'articles/:id/edit', loadComponent: () => import('./articles/article-form.component').then(m => m.ArticleFormComponent) },
      { path: 'categories', loadComponent: () => import('./categories/category-list.component').then(m => m.CategoryListComponent) },
      { path: 'tags', loadComponent: () => import('./tags/tag-list.component').then(m => m.TagListComponent) },
      { path: 'life-phases', loadComponent: () => import('./life-phases/life-phase-list.component').then(m => m.LifePhaseListComponent) },
    ]
  }
];
