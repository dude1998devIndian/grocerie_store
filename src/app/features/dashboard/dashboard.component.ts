import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { CurrencyPipe } from '../../shared/pipes/common.pipes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    CurrencyPipe,
  ],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      <div class="metrics-grid">
        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric">
              <div class="icon">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="details">
                <h3>Today's Sales</h3>
                <p class="value">{{ orderService.totalSalestoday$() | currency }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric">
              <div class="icon">
                <mat-icon>receipt</mat-icon>
              </div>
              <div class="details">
                <h3>Today's Orders</h3>
                <p class="value">{{ orderService.totalOrdersToday$() }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric">
              <div class="icon">
                <mat-icon>inventory_2</mat-icon>
              </div>
              <div class="details">
                <h3>Total Products</h3>
                <p class="value">{{ products().length }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="metric-card">
          <mat-card-content>
            <div class="metric">
              <div class="icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="details">
                <h3>Categories</h3>
                <p class="value">{{ categories().length }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="section">
        <h2>Top Selling Items</h2>
        <mat-card *ngIf="topItems().length > 0; else noData">
          <mat-card-content>
            <table mat-table [dataSource]="topItems()">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Product Name</th>
                <td mat-cell *matCellDef="let element">{{ element.name }}</td>
              </ng-container>

              <ng-container matColumnDef="quantity">
                <th mat-header-cell *matHeaderCellDef>Quantity Sold</th>
                <td mat-cell *matCellDef="let element">{{ element.quantity }}</td>
              </ng-container>

              <ng-container matColumnDef="revenue">
                <th mat-header-cell *matHeaderCellDef>Revenue</th>
                <td mat-cell *matCellDef="let element">{{ element.revenue | currency }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['name', 'quantity', 'revenue']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['name', 'quantity', 'revenue']"></tr>
            </table>
          </mat-card-content>
        </mat-card>
        <ng-template #noData>
          <mat-card>
            <mat-card-content>
              <p>No sales data available</p>
            </mat-card-content>
          </mat-card>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 0;
      }

      h1 {
        margin: 0 0 28px;
        font-size: 32px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .section {
        margin-top: 32px;
      }

      h2 {
        margin: 0 0 20px;
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .metric-card {
        height: 100%;
        display: flex;
        align-items: center;
        border-radius: var(--radius-lg);
        background: var(--blinkit-card);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--card-border);
        transition: var(--transition-normal);
        overflow: hidden;
      }

      .metric-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
      }

      .metric-card mat-card-content {
        width: 100%;
        padding: 20px !important;
      }

      .metric {
        display: flex;
        align-items: center;
        gap: 20px;
        width: 100%;
      }

      .icon {
        min-width: 56px;
        width: 56px;
        height: 56px;
        border-radius: var(--radius-md);
        background: rgba(255, 193, 7, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--blinkit-primary);
      }

      .icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .details {
        flex: 1;
      }

      .details h3 {
        margin: 0 0 6px;
        font-size: 13px;
        color: var(--text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .details .value {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
      }

      mat-card {
        background: var(--blinkit-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--card-border);
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      table th {
        background: var(--blinkit-table-head);
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 13px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
      }

      table td {
        padding: 12px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
      }

      table tr:hover {
        background: var(--blinkit-table-row-hover);
      }

      @media (max-width: 1200px) {
        .metrics-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .metrics-grid {
          grid-template-columns: 1fr;
        }

        .metric {
          gap: 16px;
        }

        .icon {
          min-width: 48px;
          width: 48px;
          height: 48px;
        }

        .details .value {
          font-size: 20px;
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  topItems = computed(() => this.orderService.getTopSellingItems());
  products = computed(() => this.productService.getProducts());
  categories = computed(() => this.productService.getCategories());

  constructor(
    public orderService: OrderService,
    public productService: ProductService
  ) {}

  ngOnInit(): void {}
}
