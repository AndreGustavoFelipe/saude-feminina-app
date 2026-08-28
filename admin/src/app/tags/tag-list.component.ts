import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TagService } from '../services/tag.service';
import { Tag } from '../models/tag.model';
import { TagFormComponent, TagFormData } from './tag-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-tag-list',
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
      <h1>Tags</h1>
      <button mat-raised-button color="primary" (click)="openCreateDialog()">
        <mat-icon>add</mat-icon> Nova Tag
      </button>
    </div>

    <table mat-table [dataSource]="tags" class="full-width">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nome</th>
        <td mat-cell *matCellDef="let tag">{{ tag.name }}</td>
      </ng-container>

      <ng-container matColumnDef="slug">
        <th mat-header-cell *matHeaderCellDef>Slug</th>
        <td mat-cell *matCellDef="let tag">{{ tag.slug }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Ações</th>
        <td mat-cell *matCellDef="let tag">
          <button mat-icon-button color="primary" (click)="openEditDialog(tag)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="confirmDelete(tag)">
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
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  displayedColumns = ['name', 'slug', 'actions'];

  constructor(
    private tagService: TagService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAll().subscribe({
      next: (tags) => this.tags = tags,
      error: () => this.snackBar.open('Erro ao carregar tags', 'Fechar', { duration: 3000 })
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TagFormComponent, {
      data: { tag: undefined } as TagFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Tag criada com sucesso', 'Fechar', { duration: 3000 });
            this.loadTags();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao criar tag';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(tag: Tag): void {
    const dialogRef = this.dialog.open(TagFormComponent, {
      data: { tag } as TagFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.update(tag.id, result).subscribe({
          next: () => {
            this.snackBar.open('Tag atualizada com sucesso', 'Fechar', { duration: 3000 });
            this.loadTags();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao atualizar tag';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  confirmDelete(tag: Tag): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Tag',
        message: `Tem certeza que deseja excluir a tag "${tag.name}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tagService.delete(tag.id).subscribe({
          next: () => {
            this.snackBar.open('Tag excluída com sucesso', 'Fechar', { duration: 3000 });
            this.loadTags();
          },
          error: () => this.snackBar.open('Erro ao excluir tag', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
