import { Component, HostListener, ViewChild, ElementRef, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/index';
import { CurrencyPipe } from '../../shared/pipes/common.pipes';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatSidenavModule,
    MatTableModule,
    MatSliderModule,
    CurrencyPipe,
  ],

  template: `
    <mat-sidenav-container class="pos-container">
      <mat-sidenav mode="side" opened class="cart-sidebar">
        <div class="cart-header">
          <div>
            <p class="panel-label">Current Order</p>
            <h2>Cart</h2>
          </div>
          <button
            mat-icon-button
            class="clear-btn"
            (click)="cartService.clearCart()"
            *ngIf="cartService.items$().length"
            aria-label="Clear cart"
          >
            <mat-icon>delete_sweep</mat-icon>
          </button>
        </div>

        <div class="cart-items" *ngIf="cartService.items$() as items">
          <div *ngIf="items.length === 0" class="empty-cart">
            <mat-icon>shopping_cart</mat-icon>
            <p>Cart is empty</p>
            <span>Add products to start billing</span>
          </div>

          <mat-card *ngFor="let item of items" class="cart-item-card">
            <mat-card-content>
              <div class="item-header">
                <h3>{{ item.product.name }}</h3>
                <span>{{ item.subtotal | currency }}</span>
              </div>
              <p class="item-meta">
                {{ item.product.price | currency }} / {{ item.product.unit }}
              </p>
              <div class="item-controls">
                <button
                  mat-icon-button
                  (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                  aria-label="Decrease quantity"
                >
                  <mat-icon>remove</mat-icon>
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  mat-icon-button
                  (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                  aria-label="Increase quantity"
                >
                  <mat-icon>add</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="cartService.removeFromCart(item.product.id)"
                  aria-label="Remove item"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ cartService.subtotal$() | currency }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (18%)</span>
            <span>{{ cartService.tax$() | currency }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>{{ cartService.total$() | currency }}</span>
          </div>
          <button
            mat-raised-button
            class="checkout-btn btn-success"
            [disabled]="!cartService.itemCount$()"
            routerLink="/billing"
          >
            Proceed To Billing
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="products-content">
        <section class="products-header">
          <div>
            <p class="panel-label">Counter View</p>
            <h1>Point Of Sale</h1>
          </div>
          <div class="quick-stats">
            <div class="stat-pill">
              <span>Products</span>
              <strong>{{ filteredProducts().length }}</strong>
            </div>
            <div class="stat-pill">
              <span>Cart Items</span>
              <strong>{{ cartService.itemCount$() }}</strong>
            </div>
          </div>
        </section>

        <mat-card class="filters">
          <mat-card-content>
            <div class="filter-row">
              <mat-form-field appearance="fill">
                <input
                  #searchInput
                  matInput
                  [ngModel]="searchQuery()"
                  (ngModelChange)="searchQuery.set($event)"
                  placeholder="Search by name or barcode..."
                  aria-label="Search products"
                />
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-select
                  #categorySelect
                  [ngModel]="selectedCategory()"
                  (ngModelChange)="selectedCategory.set($event)"
                  placeholder="All Categories"
                  aria-label="Category"
                >
                  <mat-option value="">All Categories</mat-option>
                  <mat-option
                    *ngFor="let cat of productService.products$().length ? categories() : []"
                    [value]="cat"
                  >
                    {{ cat }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="products-grid">
          <mat-card *ngFor="let product of filteredProducts()" class="product-card">
            <div class="product-image">
              <img
                [src]="product.image"
                [alt]="product.name"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'"
              />
            </div>
            <mat-card-content>
              <h3>{{ product.name }}</h3>
              <p class="category">{{ product.category }}</p>
              <div class="product-footer">
                <p class="price">{{ product.price | currency }}</p>
                <p class="stock" [class.low]="product.stock < 50">
                  {{ product.stock }} {{ product.unit }}
                </p>
              </div>
              @if (product.stock <= 0) {
                <span class="out-of-stock">Out of stock</span>
              } @else {
                <div class="quantity-control">
                  <input
                    type="number"
                    [(ngModel)]="quantities[product.id]"
                    min="1"
                    [max]="product.stock"
                    class="qty-input"
                  />
                  <button
                    class="btn-primary"
                    mat-raised-button
                    (click)="addToCart(product)"
                    [disabled]="product.stock < quantities[product.id] || !quantities[product.id]"
                  >
                    <mat-icon>add_shopping_cart</mat-icon>
                    Add
                  </button>
                </div>
              }
            </mat-card-content>
          </mat-card>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .pos-container {
        height: calc(100vh - 64px);
        background:
          radial-gradient(circle at 20% -10%, rgba(255, 193, 7, 0.18), transparent 38%),
          linear-gradient(180deg, var(--blinkit-bg) 0%, var(--blinkit-bg) 50%, var(--blinkit-muted-bg) 100%);
      }

      .panel-label {
        margin: 0;
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      .cart-sidebar {
        width: 360px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--border-color);
        background: var(--blinkit-card);
      }

      .cart-header {
        padding: 18px 16px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cart-header h2 {
        margin: 2px 0 0;
        font-size: 22px;
      }

      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .empty-cart {
        height: 100%;
        min-height: 220px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border: 1px dashed var(--border-color);
        border-radius: 16px;
        color: var(--text-secondary);
        background: var(--blinkit-bg);
      }

      .empty-cart mat-icon {
        color: var(--text-secondary);
        font-size: 30px;
        width: 30px;
        height: 30px;
      }

      .empty-cart p {
        margin: 0;
        font-weight: 600;
        color: var(--text-primary);
      }

      .empty-cart span {
        font-size: 12px;
      }

      .cart-item-card {
        margin: 0;
        border: 1px solid var(--border-color);
        box-shadow: none;
        border-radius: 14px;
        background: var(--blinkit-card);
      }

      .item-header {
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }

      .item-header h3 {
        margin: 0;
        font-size: 14px;
      }

      .item-header span {
        font-size: 14px;
        font-weight: 700;
      }

      .item-meta {
        margin: 0;
        font-size: 12px;
        color: var(--text-secondary);
      }

      .item-controls {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .item-controls span {
        text-align: center;
        font-weight: 600;
      }

      .cart-summary {
        padding: 14px;
        border-top: 1px solid var(--border-color);
        background: var(--blinkit-table-head);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
        color: var(--text-primary);
      }

      .summary-row.total {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 18px;
        margin-top: 6px;
        padding-top: 10px;
        border-top: 1px dashed var(--border-color);
      }

      .checkout-btn {
        width: 100%;
        margin-top: 10px;
      }

      .checkout-btn:disabled {
        background: var(--disabled-bg) !important;
        color: var(--disabled-text) !important;
      }

      .products-content {
        padding: 20px;
      }

      .products-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 14px;
        margin-bottom: 16px;
      }

      .products-header h1 {
        margin: 2px 0 0;
        font-size: 30px;
        line-height: 1.15;
      }

      .quick-stats {
        display: flex;
        gap: 10px;
      }

      .stat-pill {
        min-width: 112px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--blinkit-card);
        border: 1px solid var(--border-color);
      }

      .stat-pill span {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        color: var(--text-secondary);
      }

      .stat-pill strong {
        font-size: 20px;
        line-height: 1.2;
      }

      .filters {
        background: var(--blinkit-card);
        border-radius: var(--radius-lg);
        margin-bottom: 18px;
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--card-border);
      }

      .filter-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .filter-row mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 14px;
      }

      .product-card {
        overflow: hidden;
        border-radius: 16px;
        border: 1px solid var(--border-color);
        box-shadow: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        background: var(--blinkit-card);
      }

      .product-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-lg);
      }

      .product-image {
        width: 100%;
        height: 148px;
        overflow: hidden;
        background: var(--blinkit-muted-bg);
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-card h3 {
        margin: 10px 0 2px;
        font-size: 15px;
      }

      .category {
        color: var(--text-secondary);
        font-size: 12px;
        margin: 0;
      }

      .product-footer {
        margin: 8px 0 4px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .price {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 18px;
        margin: 0;
      }

      .stock {
        font-size: 12px;
        margin: 0;
        color: var(--text-secondary);
      }

      .stock.low {
        color: var(--blinkit-error);
        font-weight: 600;
      }

      .out-of-stock {
        display: block;
        margin-top: 8px;
        color: var(--blinkit-error);
        font-size: 12px;
        font-weight: 600;
      }

      .quantity-control {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }

      .qty-input {
        width: 60px;
        padding: 8px 6px;
        border: 1px solid var(--border-color);
        border-radius: 10px;
        text-align: center;
        background: var(--blinkit-field-bg);
        color: var(--text-primary);
      }

      .quantity-control button {
        flex: 1;
      }

      @media (max-width: 1300px) {
        .cart-sidebar {
          width: 320px;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        }
      }

      @media (max-width: 1024px) {
        .products-header {
          flex-direction: column;
        }

        .filter-row {
          flex-direction: column;
        }
      }

      @media (max-width: 768px) {
        .cart-sidebar {
          width: 260px;
        }

        .products-content {
          padding: 14px;
        }

        .products-header h1 {
          font-size: 24px;
        }

        .stat-pill {
          flex: 1;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }
    `,
  ],
})
export class PosComponent {
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
  @ViewChild('categorySelect') categorySelect?: MatSelect;

  searchQuery = signal('');
  selectedCategory = signal('');
  quantities: { [key: number]: number } = {};

  products = computed(() => this.productService.getProducts());
  categories = computed(() => this.productService.getCategories());

  filteredProducts = computed(() => {
    let products = this.products();

    if (this.searchQuery()) {
      products = this.productService.searchProducts(this.searchQuery());
    }

    if (this.selectedCategory()) {
      products = products.filter((p) => p.category === this.selectedCategory());
    }

    return products;
  });

  constructor(
    public productService: ProductService,
    public cartService: CartService,
    private router: Router
  ) {
    // Initialize quantities
    this.productService.getProducts().forEach((p) => {
      this.quantities[p.id] = 1;
    });
  }

  addToCart(product: Product): void {
    const quantity = this.quantities[product.id] || 1;
    this.cartService.addToCart(product, quantity);
    this.quantities[product.id] = 1;
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tagName = target?.tagName?.toLowerCase() || '';
    const isTypingTarget = tagName === 'input' || tagName === 'textarea';

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
      this.searchInput?.nativeElement.select();
      return;
    }

    if (event.altKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.categorySelect?.open();
      return;
    }

    if (event.key === 'Escape') {
      this.searchQuery.set('');
      this.selectedCategory.set('');
      return;
    }

    if (!isTypingTarget && event.key === 'F8' && this.cartService.itemCount$() > 0) {
      event.preventDefault();
      this.router.navigate(['/billing']);
    }
  }
}
