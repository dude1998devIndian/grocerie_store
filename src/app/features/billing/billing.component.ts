import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { ReceiptService } from '../../core/services/receipt.service';
import { Order, OrderItem } from '../../core/models/index';
import { CurrencyPipe } from '../../shared/pipes/common.pipes';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    CurrencyPipe,
  ],
  template: `
    <div class="billing-container">
      <div class="billing-grid">
        <!-- Cart Items Section -->
        <div class="grid-item">
          <mat-card class="billing-card">
            <mat-card-header>
              <mat-card-title>Order Items</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="cartService.items$().length === 0" class="empty-message">
                <p>No items in cart. Please add items from POS.</p>
                <a routerLink="/pos">
                  <button mat-raised-button color="primary">
                    Go to POS
                  </button>
                </a>
              </div>

              <table mat-table [dataSource]="cartService.items$()" *ngIf="cartService.items$().length">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Product</th>
                  <td mat-cell *matCellDef="let element">{{ element.product.name }}</td>
                </ng-container>

                <ng-container matColumnDef="price">
                  <th mat-header-cell *matHeaderCellDef>Price</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.product.price | currency }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="qty">
                  <th mat-header-cell *matHeaderCellDef>Qty</th>
                  <td mat-cell *matCellDef="let element">{{ element.quantity }}</td>
                </ng-container>

                <ng-container matColumnDef="subtotal">
                  <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.subtotal | currency }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="['name', 'price', 'qty', 'subtotal']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'price', 'qty', 'subtotal'];"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Billing Form Section -->
        <div class="grid-item">
          <mat-card class="billing-card">
            <mat-card-header>
              <mat-card-title>Billing Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form [formGroup]="billingForm" class="billing-form">
                <div class="form-grid">
                  <mat-form-field class="full-width">
                    <mat-label>Customer Name (Optional)</mat-label>
                    <input matInput formControlName="customerName" placeholder="Customer Name (Optional)" />
                  </mat-form-field>

                  <mat-form-field class="full-width" style="display: none;">
                    <mat-label>WhatsApp Number (Optional)</mat-label>
                    <input
                      matInput
                      placeholder="e.g. 919876543210"
                      formControlName="customerPhone"
                    />
                    <mat-hint>10 to 15 digits</mat-hint>
                  </mat-form-field>
                </div>

                <mat-form-field class="full-width">
                  <mat-label>Payment Type</mat-label>
                  <mat-select formControlName="paymentType" placeholder="Select Payment Type">
                    <mat-option value="cash">Cash</mat-option>
                    <mat-option value="upi">UPI</mat-option>
                    <mat-option value="card">Card</mat-option>
                  </mat-select>
                </mat-form-field>


                <div class="summary-section">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <strong>{{ cartService.subtotal$() | currency }}</strong>
                  </div>
                  <div class="summary-row">
                    <span>Tax (18%):</span>
                    <strong>{{ cartService.tax$() | currency }}</strong>
                  </div>
                  <div class="summary-row total">
                    <span>Total:</span>
                    <strong>{{ cartService.total$() | currency }}</strong>
                  </div>
                </div>

                <div class="actions">
                  <button
                    mat-raised-button
                    routerLink="/pos"
                  >
                    Back to POS
                  </button>
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="processPayment()"
                    [disabled]="!cartService.itemCount$()"
                  >
                    Process Payment
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .billing-container {
        padding: 0;
        max-width: 1200px;
        margin: 0 auto;
      }

      .billing-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        grid-auto-rows: max-content;
      }

      .grid-item {
        display: flex;
        flex-direction: column;
        min-height: 600px;
      }

      .billing-card {
        width: 100%;
        border-radius: var(--radius-lg);
        background: var(--blinkit-card);
        box-shadow: var(--shadow-md);
        border: 1px solid var(--card-border);
        display: flex;
        flex-direction: column;
        height: 100%;
      }

              .full-width {
        width: 100%;
      }

      .billing-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      mat-card-header {
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 16px;
        padding: 16px;
        flex-shrink: 0;
      }

      mat-card-content {
        padding: 16px;
        overflow-y: auto;
        flex: 1;
      }

      mat-card-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
      }

      table {
        width: 100%;
        margin: 16px 0;
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

      mat-form-field {
        margin-bottom: 8px;
        width: 100%;
      }

      .summary-section {
        margin: 20px 0;
        padding: 20px;
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.05) 0%, rgba(255, 193, 7, 0.02) 100%);
        border: 1px solid rgba(255, 193, 7, 0.2);
        border-radius: var(--radius-lg);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        font-size: 14px;
        color: var(--text-secondary);
      }

      .summary-row strong {
        color: var(--text-primary);
        font-weight: 600;
      }

      .summary-row.total {
        font-weight: 700;
        font-size: 18px;
        color: var(--text-primary);
        padding-top: 16px;
        border-top: 2px solid rgba(255, 193, 7, 0.3);
        margin-top: 16px;
        margin-bottom: 0;
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
      }

      .actions button {
        flex: 1;
        height: 44px;
        border-radius: var(--radius-md);
        font-weight: 600;
      }

      .actions [mat-raised-button] {
        background: var(--blinkit-card) !important;
        color: var(--text-primary) !important;
        border: 1px solid var(--border-color);
      }

      .actions [mat-raised-button]:hover {
        background: var(--blinkit-bg) !important;
        border-color: var(--blinkit-primary);
      }

      .actions [color="primary"] {
        background: var(--blinkit-primary) !important;
        color: #000 !important;
      }

      .actions [color="primary"]:hover {
        background: var(--blinkit-primary-hover) !important;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
      }

      .empty-message {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-message p {
        color: var(--text-secondary);
        margin-bottom: 20px;
      }

      .empty-message button {
        margin-top: 16px;
      }

      @media (max-width: 1024px) {
        .billing-grid {
          grid-template-columns: 1fr;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .grid-item {
          min-height: auto;
        }

        .billing-container {
          padding: 0;
        }
      }

      @media (max-width: 768px) {
        .billing-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .summary-section {
          padding: 16px;
        }

        .actions {
          flex-direction: column;
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
export class BillingComponent implements OnInit {
  billingForm = this.fb.group({
    customerName: ['', Validators.maxLength(50)],
    customerPhone: ['', Validators.pattern(/^\+?[0-9]{10,15}$/)],
    paymentType: ['', Validators.required],
  });

  constructor(
    public cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private receiptService: ReceiptService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  processPayment(): void {
    const items = this.cartService.getItems();

    if (items.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const formValue = this.billingForm.value;
    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      subtotal: item.subtotal,
      unit: item.product.unit,
    }));

    const subtotal = this.cartService.subtotal$();
    const tax = this.cartService.tax$();
    const total = this.cartService.total$();

    const order = this.orderService.createOrder(
      orderItems,
      subtotal,
      tax,
      total,
      (formValue.paymentType as 'cash' | 'upi' | 'card') || 'cash',
      formValue.customerName || undefined
    );

    this.openWhatsAppMessage(order, formValue.customerPhone || '');

    // Update stock
    items.forEach((item) => {
      this.productService.updateStock(item.product.id, item.quantity);
    });

    // Clear cart
    this.cartService.clearCart();

    // Store order in service and navigate
    console.log('Setting order in receipt service:', order);
    this.receiptService.setOrder(order);
    console.log('Order set, navigating to receipt');
    this.router.navigate(['/receipt']);
  }

  private openWhatsAppMessage(order: Order, customerPhone: string): void {
    const phone = customerPhone.trim().replace(/[^\d]/g, '');
    if (!phone) {
      return;
    }

    if (phone.length < 10 || phone.length > 15) {
      this.snackBar.open('Invalid WhatsApp number. Use 10 to 15 digits.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const itemsText = order.items
      .map((item) => `${item.productName} x${item.quantity} = ${item.subtotal.toFixed(2)}`)
      .join('\n');

    const message = [
      'Thank you for shopping with H Mart.',
      `Bill No: #${order.billNumber}`,
      `Total: ${order.total.toFixed(2)}`,
      `Payment: ${order.paymentType.toUpperCase()}`,
      '',
      'Items:',
      itemsText,
    ].join('\n');

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    this.snackBar.open('WhatsApp message opened.', 'Close', {
      duration: 2500,
    });
  }
}
