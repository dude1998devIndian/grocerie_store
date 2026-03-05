import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../core/models/index';
import { ReceiptService } from '../../../core/services/receipt.service';
import { CurrencyPipe } from '../../../shared/pipes/common.pipes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatIconModule,
    CurrencyPipe,
  ],
  template: `
    <div class="receipt-container" *ngIf="order; else noReceipt">
      <mat-card class="receipt-card" #receipt>
        <div class="receipt-content">
          <div class="header">
            <h1>H Mart</h1>
            <p class="subtitle">Receipt / Invoice</p>
            <mat-divider></mat-divider>
          </div>

          <div class="bill-info">
            <div>
              <p><strong>Bill No:</strong> #{{ order.billNumber }}</p>
              <p><strong>Order ID:</strong> {{ order.id }}</p>
              <p><strong>Date:</strong> {{ order.orderDate | date: 'short' }}</p>
            </div>
            <div>
              <p *ngIf="order.customerName">
                <strong>Customer:</strong> {{ order.customerName }}
              </p>
              <p><strong>Payment:</strong> {{ order.paymentType | uppercase }}</p>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="items-section">
            <h3>Order Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of order.items">
                  <td>{{ item.productName }}</td>
                  <td>{{ item.quantity }} {{ item.unit }}</td>
                  <td>{{ item.unitPrice | currency }}</td>
                  <td>{{ item.subtotal | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <mat-divider></mat-divider>

          <div class="summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ order.subtotal | currency }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (18% GST):</span>
              <span>{{ order.tax | currency }}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL AMOUNT:</span>
              <span>{{ order.total | currency }}</span>
            </div>
          </div>

          <mat-divider></mat-divider>

          <div class="footer">
            <p><strong>Thank you for your purchase.</strong></p>
            <p>We appreciate your business. Please visit again!</p>
            <p class="timestamp">{{ order.orderDate | date: 'medium' }}</p>
          </div>
        </div>

        <div class="actions">
          <button
            mat-raised-button
            color="primary"
            (click)="printReceipt()"
          >
            <mat-icon>print</mat-icon>
            Print Receipt
          </button>
          <button
            mat-raised-button
            (click)="downloadPDF()"
          >
            <mat-icon>download</mat-icon>
            Download
          </button>
          <button
            mat-raised-button
            (click)="newTransaction()"
          >
            <mat-icon>add_circle</mat-icon>
            New Order
          </button>
          <button
            mat-raised-button
            routerLink="/reports"
          >
            <mat-icon>assessment</mat-icon>
            Reports
          </button>
        </div>
      </mat-card>
    </div>

    <ng-template #noReceipt>
      <div class="receipt-container">
        <mat-card class="receipt-card">
          <div class="no-receipt">
            <mat-icon>error_outline</mat-icon>
            <h2>No Receipt Data</h2>
            <p>Unable to retrieve receipt information. Please complete a transaction first.</p>
            <button mat-raised-button color="primary" routerLink="/pos">
              <mat-icon>arrow_back</mat-icon>
              Go to POS
            </button>
          </div>
        </mat-card>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .receipt-container {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: calc(100vh - 64px);
        background: var(--blinkit-bg);
      }

      .receipt-card {
        width: 100%;
        max-width: 600px;
        background: var(--blinkit-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
      }

      .receipt-content {
        padding: 32px;
        background: #fafbfc;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        line-height: 1.8;
      }

      .header {
        text-align: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--text-primary);
      }

      .header .subtitle {
        margin: 8px 0 0;
        color: var(--text-secondary);
        font-size: 13px;
      }

      .bill-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin: 20px 0;
        font-size: 13px;
      }

      .bill-info p {
        margin: 6px 0;
        color: var(--text-primary);
      }

      .bill-info strong {
        color: var(--text-secondary);
        font-weight: 600;
      }

      .items-section {
        margin: 20px 0;
      }

      .items-section h3 {
        margin: 0 0 16px;
        font-size: 16px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        margin-bottom: 16px;
      }

      .items-table th {
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.08), rgba(255, 193, 7, 0.04));
        border: 1px solid rgba(255, 193, 7, 0.2);
        padding: 10px;
        text-align: left;
        font-weight: 700;
        color: var(--text-primary);
      }

      .items-table td {
        padding: 10px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-primary);
      }

      .items-table tr:last-child td {
        border-bottom: 1px solid rgba(255, 193, 7, 0.3);
      }

      .items-table th:nth-child(2),
      .items-table th:nth-child(3),
      .items-table th:nth-child(4),
      .items-table td:nth-child(2),
      .items-table td:nth-child(3),
      .items-table td:nth-child(4) {
        text-align: right;
      }

      .summary {
        margin: 20px 0;
        padding: 16px;
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.06), rgba(255, 193, 7, 0.02));
        border: 1px solid rgba(255, 193, 7, 0.2);
        border-radius: var(--radius-md);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 13px;
        color: var(--text-primary);
      }

      .summary-row.total {
        font-weight: 700;
        font-size: 16px;
        border-top: 2px solid rgba(255, 193, 7, 0.4);
        border-bottom: 2px solid rgba(255, 193, 7, 0.4);
        padding: 12px 0;
        margin: 8px 0;
        color: var(--text-primary);
      }

      .footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
        font-size: 12px;
        color: var(--text-secondary);
      }

      .footer p {
        margin: 6px 0;
        line-height: 1.6;
      }

      .footer .timestamp {
        font-size: 11px;
        color: #999;
        margin-top: 10px;
      }

      .actions {
        display: flex;
        gap: 12px;
        padding: 20px;
        flex-wrap: wrap;
        background: var(--blinkit-card);
        border-top: 1px solid var(--border-color);
      }

      .actions button {
        flex: 1;
        min-width: 120px;
        height: 40px;
        border-radius: var(--radius-md);
        font-weight: 600;
      }

      .actions [color="primary"] {
        background: var(--blinkit-primary) !important;
        color: #000 !important;
      }

      .actions [color="primary"]:hover {
        background: var(--blinkit-primary-hover) !important;
      }

      .no-receipt {
        text-align: center;
        padding: 60px 40px;
      }

      .no-receipt mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--blinkit-error);
        margin-bottom: 16px;
        opacity: 0.8;
      }

      .no-receipt h2 {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 16px 0;
      }

      .no-receipt p {
        color: var(--text-secondary);
        margin: 16px 0 24px;
        font-size: 14px;
      }

      .no-receipt button {
        height: 40px;
        padding: 0 24px;
      }

      @media print {
        .actions {
          display: none;
        }

        .receipt-container {
          background-color: white;
          min-height: auto;
          padding: 0;
        }

        .receipt-card {
          box-shadow: none;
          max-width: 100%;
          border-radius: 0;
        }

        .receipt-content {
          padding: 0;
          background: white;
        }
      }

      @media (max-width: 768px) {
        .receipt-container {
          padding: 12px;
        }

        .receipt-card {
          max-width: 100%;
        }

        .receipt-content {
          padding: 20px;
        }

        .bill-info {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .items-table {
          font-size: 12px;
        }

        .items-table th,
        .items-table td {
          padding: 8px;
        }

        .actions {
          flex-direction: column;
          gap: 10px;
        }

        .actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ReceiptComponent implements OnInit, OnDestroy {
  order: Order | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private receiptService: ReceiptService
  ) {}

  ngOnInit(): void {
    // Subscribe to order changes from service
    this.receiptService.getOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe((order) => {
        this.order = order;
        console.log('Order received in receipt component:', order);

        if (!this.order) {
          console.warn('No order found in receipt service, redirecting to billing');
          this.router.navigate(['/billing']);
          return;
        }

        // Auto-print after content loads
        setTimeout(() => this.printReceipt(), 500);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  printReceipt(): void {
    window.print();
  }

  downloadPDF(): void {
    alert('PDF download functionality would require a PDF library like pdfkit or html2pdf');
  }

  newTransaction(): void {
    this.router.navigate(['/pos']);
  }
}
