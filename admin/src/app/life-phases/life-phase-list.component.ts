import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LifePhaseService } from '../services/life-phase.service';
import { LifePhase } from '../models/life-phase.model';
import { LifePhaseFormComponent, LifePhaseFormData } from './life-phase-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-life-phase-list',
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
      <h1>Fases de Vida</h1>
      <button mat-raised-button color="primary" (click)="openCreateDialog()">
        <mat-icon>add</mat-icon> Nova Fase de Vida
      </button>
    </div>

    <table mat-table [dataSource]="lifePhases" class="full-width">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nome</th>
        <td mat-cell *matCellDef="let lifePhase">{{ lifePhase.name }}</td>
      </ng-container>

      <ng-container matColumnDef="slug">
        <th mat-header-cell *matHeaderCellDef>Slug</th>
        <td mat-cell *matCellDef="let lifePhase">{{ lifePhase.slug }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Ações</th>
        <td mat-cell *matCellDef="let lifePhase">
          <button mat-icon-button color="primary" (click)="openEditDialog(lifePhase)">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button color="warn" (click)="confirmDelete(lifePhase)">
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
export class LifePhaseListComponent implements OnInit {
  lifePhases: LifePhase[] = [];
  displayedColumns = ['name', 'slug', 'actions'];

  constructor(
    private lifePhaseService: LifePhaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadLifePhases();
  }

  loadLifePhases(): void {
    this.lifePhaseService.getAll().subscribe({
      next: (lifePhases) => this.lifePhases = lifePhases,
      error: () => this.snackBar.open('Erro ao carregar fases de vida', 'Fechar', { duration: 3000 })
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(LifePhaseFormComponent, {
      data: { lifePhase: undefined } as LifePhaseFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lifePhaseService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Fase de vida criada com sucesso', 'Fechar', { duration: 3000 });
            this.loadLifePhases();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao criar fase de vida';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditDialog(lifePhase: LifePhase): void {
    const dialogRef = this.dialog.open(LifePhaseFormComponent, {
      data: { lifePhase } as LifePhaseFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lifePhaseService.update(lifePhase.id, result).subscribe({
          next: () => {
            this.snackBar.open('Fase de vida atualizada com sucesso', 'Fechar', { duration: 3000 });
            this.loadLifePhases();
          },
          error: (err) => {
            const message = err.error?.message || 'Erro ao atualizar fase de vida';
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
    });
  }

  confirmDelete(lifePhase: LifePhase): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir Fase de Vida',
        message: `Tem certeza que deseja excluir a fase de vida "${lifePhase.name}"?`
      } as ConfirmDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.lifePhaseService.delete(lifePhase.id).subscribe({
          next: () => {
            this.snackBar.open('Fase de vida excluída com sucesso', 'Fechar', { duration: 3000 });
            this.loadLifePhases();
          },
          error: () => this.snackBar.open('Erro ao excluir fase de vida', 'Fechar', { duration: 3000 })
        });
      }
    });
  }
}
