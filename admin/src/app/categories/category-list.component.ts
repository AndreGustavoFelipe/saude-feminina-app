import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { CategoryFormComponent, CategoryFormData } from './category-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <h1>Categorias</h1>
      <button mat-raised-button color="primary" (click)="openCreateDialog()">
        <mat-icon>add</mat-icon> Nova Categoria
      </button>
    </div>

    <table mat-table [dataSource]="categories" class="full-width">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nome</th>
        <td mat-cell *matCellDef="let category">{{ category.name }}</td>
      </ng-container>

      <ng-container matColumnDef="slug">
        <th mat-header-cell *matHeaderCellDef>Slug</th>
        <td mat-cell *matCellDef="let category">{{ category.slug }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Ações</th>
        <td mat-cell *matCellDef="let category">
          <button mat-icon-button color="primary" (click)="openEditDialog(category)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="confirmDelete(category)">
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
  `]
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns = ['name', 'slug', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: () => this.snackBar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 })
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      data: { category: undefined } as CategoryFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Categoria criada com sucesso', 'Fechar', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao criar categoria';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      data: { category } as CategoryFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.update(category.id, result).subscribe({
          next: () => {
            this.snackBar.open('Categoria atualizada com sucesso', 'Fechar', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao atualizar categoria';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  confirmDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Categoria',
        message: `Tem certeza que deseja excluir a categoria "${category.name}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.delete(category.id).subscribe({
          next: () => {
            this.snackBar.open('Categoria excluída com sucesso', 'Fechar', { duration: 3000 });
            this.loadCategories();
          },
          error: () => this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
