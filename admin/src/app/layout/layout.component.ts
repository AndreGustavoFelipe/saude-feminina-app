import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule
  ],
  template: `
    <div class="layout-container">
      <mat-toolbar color="primary" class="toolbar">
        <mat-icon class="toolbar-logo">favorite</mat-icon>
        <span class="toolbar-title">Minha Saúde Feminina</span>
        <span class="toolbar-badge">Admin</span>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav mode="side" opened class="sidenav">
          <div class="sidenav-header">
            <p class="sidenav-subtitle">Gerenciamento de Conteúdo</p>
          </div>
          <mat-nav-list>
            <a mat-list-item routerLink="/articles" routerLinkActive="active">
              <mat-icon matListItemIcon>article</mat-icon>
              <span matListItemTitle>Artigos</span>
            </a>
            <a mat-list-item routerLink="/categories" routerLinkActive="active">
              <mat-icon matListItemIcon>category</mat-icon>
              <span matListItemTitle>Categorias</span>
            </a>
            <a mat-list-item routerLink="/tags" routerLinkActive="active">
              <mat-icon matListItemIcon>label</mat-icon>
              <span matListItemTitle>Tags</span>
            </a>
            <a mat-list-item routerLink="/life-phases" routerLinkActive="active">
              <mat-icon matListItemIcon>timeline</mat-icon>
              <span matListItemTitle>Fases de Vida</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .toolbar-logo {
      font-size: 22px;
    }

    .toolbar-title {
      font-size: 18px;
      font-weight: 600;
    }

    .toolbar-badge {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.25);
      padding: 3px 10px;
      border-radius: 20px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .sidenav-container {
      flex: 1;
      margin-top: 64px;
    }

    .sidenav {
      width: 260px;
      background: #ffffff;
      border-right: 1px solid #f0f0f0;
    }

    .sidenav-header {
      padding: 20px 16px 8px;
    }

    .sidenav-subtitle {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      margin: 0;
    }

    .content {
      padding: 24px;
      background: #f5f6f7;
    }

    .active {
      background-color: rgba(233, 75, 106, 0.08) !important;
      border-radius: 12px;
    }
  `]
})
export class LayoutComponent { }
