import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
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
          <h2>Cart</h2>
          <button
            mat-icon-button
            (click)="cartService.clearCart()"
            *ngIf="cartService.items$().length"
          >
            <mat-icon>delete_sweep</mat-icon>
          </button>
        </div>

        <div class="cart-items" *ngIf="cartService.items$() as items">
          <div *ngIf="items.length === 0" class="empty-cart">
            <p>Cart is empty</p>
          </div>

          <mat-card *ngFor="let item of items" class="cart-item-card">
            <mat-card-content>
              <div class="item-header">
                <h3>{{ item.product.name }}</h3>
              </div>
              <div class="item-details">
                <p><strong>Price:</strong> {{ item.product.price | currency }}</p>
                <p><strong>Qty:</strong> {{ item.quantity }} {{ item.product.unit }}</p>
                <p><strong>Subtotal:</strong> {{ item.subtotal | currency }}</p>
              </div>
              <div class="item-controls">
                <button
                  mat-icon-button
                  (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)"
                >
                  <mat-icon>remove</mat-icon>
                </button>
                <span>{{ item.quantity }}</span>
                <button
                  mat-icon-button
                  (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)"
                >
                  <mat-icon>add</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="cartService.removeFromCart(item.product.id)"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ cartService.subtotal$() | currency }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (18%):</span>
            <span>{{ cartService.tax$() | currency }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ cartService.total$() | currency }}</span>
          </div>
          <button
            mat-raised-button
            color="primary"
            class="checkout-btn btn-success"
            [disabled]="!cartService.itemCount$()"
            routerLink="/billing"
          >
            Checkout
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="products-content">
        <div class="filters">
          <mat-form-field>
            <mat-label>Search Products</mat-label>
            <input matInput [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search..." />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Category</mat-label>
            <mat-select [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let cat of productService.products$().length ? categories() : []" [value]="cat">
                {{ cat }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="products-grid">
          <mat-card
            *ngFor="let product of filteredProducts()"
            class="product-card"
          >
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
              <p class="price">{{ product.price | currency }}</p>
              <p class="stock" [class.low]="product.stock < 50">
                Stock: {{ product.stock }} {{ product.unit }}
               
              </p>
               @if (product.stock <= 0) {
                  <span>(out of stock)</span>
                }@else {
              <div class="quantity-control">
                <input
                  type="number"
                  [(ngModel)]="quantities[product.id]"
                  min="1"
                  [max]="product.stock"
                  class="qty-input"
                />
                <button class="btn-primary"
                  mat-raised-button
                  color="btn-primary"
                  (click)="addToCart(product)"
                 
                  [disabled]="product.stock <quantities[product.id] || !quantities[product.id]"
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
      }

      .cart-sidebar {
        width: 350px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e0e0e0;
      }

      .cart-header {
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .cart-header h2 {
        margin: 0;
      }

      .cart-items {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
      }

      .empty-cart {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .cart-item-card {
        margin-bottom: 10px;
      }

      .item-header {
        margin-bottom: 10px;
      }

      .item-header h3 {
        margin: 0;
        font-size: 14px;
      }

      .item-details {
        font-size: 12px;
        margin-bottom: 10px;
      }

      .item-details p {
        margin: 5px 0;
      }

      .item-controls {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      .item-controls button {
        padding: 0;
      }

      .cart-summary {
        padding: 15px;
        border-top: 1px solid #e0e0e0;
        background-color: #f5f5f5;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 14px;
      }

      .summary-row.total {
        font-weight: bold;
        font-size: 16px;
        padding-top: 10px;
        border-top: 1px solid #e0e0e0;
      }

      .checkout-btn {
        width: 100%;
        margin-top: 10px;
      }
      .checkout-btn :disabled{
        background-color: #ccc !important;
        color: #666 !important;
        cursor: not-allowed !important;
      }

      .products-content {
        padding: 20px;
      }

      .filters {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        flex-wrap: wrap;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
      }

      .product-card {
        cursor: pointer;
        transition: transform 0.2s;
      }

      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .product-image {
        width: 100%;
        height: 150px;
        overflow: hidden;
        background-color: #f0f0f0;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .product-card h3 {
        margin: 10px 0 5px;
        font-size: 16px;
      }

      .category {
        color: #999;
        font-size: 12px;
        margin: 0;
      }

      .price {
        color: var(--mdc-theme-primary);
        font-weight: bold;
        font-size: 18px;
        margin: 10px 0;
      }

      .stock {
        font-size: 12px;
        margin: 5px 0;
      }

      .stock.low {
        color: #f44336;
        font-weight: bold;
      }

      .quantity-control {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }

      .qty-input {
        width: 50px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .quantity-control button {
        flex: 1;
      }

      @media (max-width: 1200px) {
        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
      }

      @media (max-width: 768px) {
        .cart-sidebar {
          width: 250px;
        }

        .products-grid {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        }
      }
    `,
  ],
})
export class PosComponent {
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
    public cartService: CartService
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
}
