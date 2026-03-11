import { Component, OnInit, computed } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { CurrencyPipe } from '../../shared/pipes/common.pipes';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    UpperCasePipe,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    CurrencyPipe,
  ],
  template: `
    <div class="reports-container">
      <h1>Sales Reports</h1>

      <mat-tab-group>
        <!-- Daily Sales Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>calendar_today</mat-icon>
            <span>Daily Sales</span>
          </ng-template>

          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Daily Sales Summary</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="dailySalesData()">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let element">{{ element.date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="orders">
                    <th mat-header-cell *matHeaderCellDef>Orders</th>
                    <td mat-cell *matCellDef="let element">{{ element.orders }}</td>
                  </ng-container>

                  <ng-container matColumnDef="revenue">
                    <th mat-header-cell *matHeaderCellDef>Revenue</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.revenue | currency }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['date', 'orders', 'revenue']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['date', 'orders', 'revenue'];"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Top Selling Items Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>trending_up</mat-icon>
            <span>Top Items</span>
          </ng-template>

          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Top 10 Selling Items</mat-card-title>
              </mat-card-header>
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
                    <td mat-cell *matCellDef="let element">
                      {{ element.revenue | currency }}
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['name', 'quantity', 'revenue']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['name', 'quantity', 'revenue'];"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- All Orders Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>receipt_long</mat-icon>
            <span>All Orders</span>
          </ng-template>

          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Order History</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <table mat-table [dataSource]="orders()">
                  <ng-container matColumnDef="billNumber">
                    <th mat-header-cell *matHeaderCellDef>Bill #</th>
                    <td mat-cell *matCellDef="let element">{{ element.billNumber }}</td>
                  </ng-container>

                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.orderDate | date: 'short' }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="customer">
                    <th mat-header-cell *matHeaderCellDef>Customer</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.customerName || '-' }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="paymentType">
                    <th mat-header-cell *matHeaderCellDef>Payment</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.paymentType | uppercase }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="total">
                    <th mat-header-cell *matHeaderCellDef>Total</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.total | currency }}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let element">
                      <button
                        mat-icon-button
                        (click)="printOrder(element)"
                        title="Print"
                      >
                        <mat-icon>print</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['billNumber', 'date', 'customer', 'paymentType', 'total', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['billNumber', 'date', 'customer', 'paymentType', 'total', 'actions'];"></tr>
                </table>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .reports-container {
        padding: 0;
      }

      h1 {
        margin: 0 0 24px;
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .tab-content {
        padding: 16px 0;
      }

      mat-card {
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--card-border);
      }

      mat-card-header {
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 12px;
      }

      mat-card-content {
        overflow-x: auto;
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

      button[mat-icon-button] {
        margin: 0 5px;
      }

      @media (max-width: 768px) {
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }

        table {
          font-size: 12px;
        }

        table th,
        table td {
          padding: 8px;
        }
      }
    `,
  ],
})
export class ReportsComponent implements OnInit {
  dailySalesData = computed(() => this.orderService.getDailySales());
  topItems = computed(() => this.orderService.getTopSellingItems());
  orders = computed(() => [...this.orderService.getOrders()].reverse());

  constructor(public orderService: OrderService) {}

  ngOnInit(): void {}

  printOrder(order: any): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const html = this.generateInvoiceHTML(order);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }

  private generateInvoiceHTML(order: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.billNumber}</title>
        <style>
          body { font-family: Arial; margin: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .header h1 { margin: 0; }
          .bill-info { display: flex; justify-content: space-between; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { text-align: right; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>INVOICE</h1>
            <p>Bill #${order.billNumber}</p>
          </div>
          
          <div class="bill-info">
            <div>
              <strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}
              <br>
              <strong>Payment:</strong> ${order.paymentType.toUpperCase()}
            </div>
            <div>
              <strong>Customer:</strong> ${order.customerName || 'N/A'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item: any) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>&#8377;${item.unitPrice.toFixed(2)}</td>
                  <td>&#8377;${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <p><strong>Subtotal:</strong> &#8377;${order.subtotal.toFixed(2)}</p>
            <p><strong>Tax (18%):</strong> &#8377;${order.tax.toFixed(2)}</p>
            <p style="font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
              <strong>Total:</strong> &#8377;${order.total.toFixed(2)}
            </p>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p style="font-size: 12px; color: #999;">Generated on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}



