import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../../core/services/cart.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <button
        mat-icon-button
        (click)="sidenav.toggle()"
        aria-label="Toggle sidenav"
      >
        <mat-icon>menu</mat-icon>
      </button>
      <span class="spacer">Grocery Store POS</span>
      <button
        mat-icon-button
        (click)="theme.toggle()"
        [attr.aria-label]="theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme'"
        title="Toggle theme"
      >
        <mat-icon>{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
      <button
        mat-icon-button
        routerLink="/billing"
        [matBadge]="cartService.itemCount$()"
        matBadgeColor="accent"
        [matBadgeHidden]="cartService.itemCount$() === 0"
      >
        <mat-icon>shopping_cart</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container>
      <mat-sidenav #sidenav mode="side" [opened]="!isMobile">
        <mat-nav-list>
          <mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </mat-list-item>

          <mat-list-item routerLink="/products" routerLinkActive="active">
            <mat-icon matListItemIcon>inventory_2</mat-icon>
            <span matListItemTitle>Products</span>
          </mat-list-item>

          <mat-list-item routerLink="/pos" routerLinkActive="active">
            <mat-icon matListItemIcon>point_of_sale</mat-icon>
            <span matListItemTitle>POS</span>
          </mat-list-item>

          <mat-list-item routerLink="/billing" routerLinkActive="active">
            <mat-icon matListItemIcon>receipt</mat-icon>
            <span matListItemTitle>Billing</span>
          </mat-list-item>

          <mat-list-item routerLink="/reports" routerLinkActive="active">
            <mat-icon matListItemIcon>assessment</mat-icon>
            <span matListItemTitle>Reports</span>
          </mat-list-item>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

      mat-toolbar {
        background: var(--blinkit-card) !important;
        border-bottom: 1px solid var(--border-color);
        box-shadow: var(--shadow-sm);
        color: var(--text-primary);
        height: 64px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        min-height: 64px;
      }

      mat-toolbar span {
        line-height: 1.5;
        font-size: 18px;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .toolbar-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        gap: 16px;
      }

      .logo-section {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 160px;
      }

      .logo-icon {
        width: 32px;
        height: 32px;
        background: var(--blinkit-primary);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #000;
      }

      .logo-text {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .search-wrapper {
        flex: 1;
        max-width: 500px;
      }

      .search-input {
        width: 100%;
        height: 40px;
        border-radius: 20px;
        border: 1px solid var(--border-color);
        padding: 0 16px;
        background: var(--blinkit-bg);
        font-size: 14px;
        transition: var(--transition-fast);
      }

      .search-input::placeholder {
        color: var(--text-secondary);
      }

      .search-input:focus {
        outline: none;
        background: var(--blinkit-field-bg);
        border-color: var(--blinkit-primary);
        box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        min-width: 120px;
      }

      .cart-button {
        position: relative;
      }

      .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--blinkit-error);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
      }

      mat-sidenav-container {
        height: calc(100vh - 64px);
      }

      mat-sidenav {
        background: var(--blinkit-card);
        width: 280px;
        box-shadow: var(--shadow-md);
        overflow: visible !important;
      }

      mat-nav-list {
        padding: 12px 0;
      }

      mat-list-item {
        border-radius: var(--radius-md);
        margin: 6px 8px;
        transition: var(--transition-fast);
        height: 48px;
        line-height: 48px;
        font-size: 14px;
      }

      mat-list-item span {
        line-height: 1.5;
        overflow: visible;
      }

      mat-list-item.active {
        background: var(--blinkit-nav-active-bg);
        color: var(--blinkit-primary);
        font-weight: 600;
      }

      mat-list-item:hover:not(.active) {
        background: var(--blinkit-nav-hover-bg);
      }

      .content {
        padding: 24px;
        overflow-y: auto;
        overflow-x: hidden;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
        line-height: 1.6;
      }

      @media (max-width: 1024px) {
        mat-sidenav {
          width: 240px;
        }

        .search-wrapper {
          max-width: 300px;
        }
      }

      @media (max-width: 768px) {
        mat-sidenav {
          width: 220px;
        }

        .logo-text {
          display: none;
        }

        .search-wrapper {
          max-width: 200px;
        }
      }
    `,
  ],
})
export class LayoutComponent implements OnInit {
  isMobile = false;

  constructor(
    public cartService: CartService,
    public theme: ThemeService
  ) {}

  ngOnInit(): void {
    this.checkMobile();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }
}
