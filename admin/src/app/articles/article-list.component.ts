import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { ArticleService } from '../services/article.service';
import { CategoryService } from '../services/category.service';
import { LifePhaseService } from '../services/life-phase.service';
import { Article, ArticleFilters } from '../models/article.model';
import { Category } from '../models/category.model';
import { LifePhase } from '../models/life-phase.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div class="page-header">
      <h1>Artigos</h1>
      <button mat-raised-button color="primary" (click)="createArticle()">
        <mat-icon>add</mat-icon> Novo Artigo
      </button>
    </div>

    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Categoria</mat-label>
        <mat-select [(ngModel)]="filters.category_id" (selectionChange)="loadArticles()">
          <mat-option [value]="undefined">Todas</mat-option>
          <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Fase de Vida</mat-label>
        <mat-select [(ngModel)]="filters.life_phase_id" (selectionChange)="loadArticles()">
          <mat-option [value]="undefined">Todas</mat-option>
          <mat-option *ngFor="let phase of lifePhases" [value]="phase.id">{{ phase.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select [(ngModel)]="filters.status" (selectionChange)="loadArticles()">
          <mat-option [value]="undefined">Todos</mat-option>
          <mat-option value="published">Publicado</mat-option>
          <mat-option value="draft">Rascunho</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <table mat-table [dataSource]="articles" class="full-width">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Título</th>
        <td mat-cell *matCellDef="let article">{{ article.title }}</td>
      </ng-container>

      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Categoria</th>
        <td mat-cell *matCellDef="let article">{{ article.category?.name }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let article">
          <span class="status-chip" [class.published]="article.status === 'published'" [class.draft]="article.status === 'draft'">
            {{ article.status === 'published' ? 'Publicado' : 'Rascunho' }}
          </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="display_order">
        <th mat-header-cell *matHeaderCellDef>Ordem</th>
        <td mat-cell *matCellDef="let article">{{ article.display_order }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Ações</th>
        <td mat-cell *matCellDef="let article">
          <button mat-icon-button color="primary" (click)="editArticle(article)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="confirmDelete(article)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .full-width {
      width: 100%;
      border-radius: 18px;
      overflow: hidden;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1c1c1e;
    }
    mat-form-field { min-width: 150px; }
    .status-chip {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }
    .status-chip.published {
      background-color: #dff5e4;
      color: #16a34a;
    }
    .status-chip.draft {
      background-color: #fdebd2;
      color: #d97706;
    }
  `]
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  categories: Category[] = [];
  lifePhases: LifePhase[] = [];
  filters: ArticleFilters = {};
  displayedColumns = ['title', 'category', 'status', 'display_order', 'actions'];

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private lifePhaseService: LifePhaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArticles();
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.lifePhaseService.getAll().subscribe(phases => this.lifePhases = phases);
  }

  loadArticles(): void {
    this.articleService.getAll(this.filters).subscribe({
      next: (articles) => this.articles = articles,
      error: () => this.snackBar.open('Erro ao carregar artigos', 'Fechar', { duration: 3000 })
    });
  }

  createArticle(): void {
    this.router.navigate(['/articles/new']);
  }

  editArticle(article: Article): void {
    this.router.navigate(['/articles', article.id, 'edit']);
  }

  confirmDelete(article: Article): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Artigo',
        message: `Tem certeza que deseja excluir "${article.title}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.articleService.delete(article.id).subscribe({
          next: () => {
            this.snackBar.open('Artigo excluído com sucesso', 'Fechar', { duration: 3000 });
            this.loadArticles();
          },
          error: () => this.snackBar.open('Erro ao excluir artigo', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
