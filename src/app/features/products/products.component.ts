import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/index';
import { ProductFormComponent } from './product-form/product-form.component';
import { CurrencyPipe } from '../../shared/pipes/common.pipes';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    CurrencyPipe,
  ],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>Product Management</h1> 
        <button
          mat-raised-button
          color="primary"
          (click)="openAddForm()"
        >
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <mat-card class="filters">
        <mat-card-content>
          <div class="filter-row">
            <mat-form-field>
              <mat-label>Search</mat-label>
              <input
                matInput
                [(ngModel)]="searchTerm"
                placeholder="Search by name or barcode..."
              />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Category</mat-label>
              <mat-select [(ngModel)]="selectedCategory">
                <mat-option value="">All Categories</mat-option>
                <mat-option *ngFor="let cat of categories()" [value]="cat">
                  {{ cat }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="products-table">
        <mat-card-content>
          <table mat-table [dataSource]="filteredProducts()">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let element">{{ element.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Product Name</th>
              <td mat-cell *matCellDef="let element">{{ element.name }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let element">{{ element.category }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef>Price</th>
              <td mat-cell *matCellDef="let element">
                {{ element.price | currency }}
              </td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let element">
                <span
                  [class.low-stock]="element.stock < 50"
                >
                  {{ element.stock }} {{ element.unit }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="barcode">
              <th mat-header-cell *matHeaderCellDef>Barcode</th>
              <td mat-cell *matCellDef="let element">{{ element.barcode }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button
                  mat-icon-button
                  (click)="openEditForm(element)"
                  title="Edit"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="deleteProduct(element.id)"
                  title="Delete"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .products-container {
        padding: 0;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .header button {
        background: var(--blinkit-primary) !important;
        color: #000 !important;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: var(--radius-md);
        gap: 8px;
      }

      .header button:hover {
        background: var(--blinkit-primary-hover) !important;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
      }

      .filters {
        background: var(--blinkit-card);
        border-radius: var(--radius-lg);
        margin-bottom: 24px;
        box-shadow: var(--shadow-sm);
        border: 1px solid rgba(0, 0, 0, 0.02);
      }

      .filter-row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }

      .products-table {
        background: var(--blinkit-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 0, 0, 0.02);
        overflow: hidden;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      table th {
        background: #f9fafb;
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
        background: #fafbfc;
      }

      .low-stock {
        color: var(--blinkit-error);
        font-weight: 600;
      }

      button[mat-icon-button] {
        margin: 0 4px;
        transition: var(--transition-fast);
      }

      button[mat-icon-button]:hover {
        background: rgba(255, 193, 7, 0.1);
        color: var(--blinkit-primary);
      }

      @media (max-width: 1024px) {
        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .filter-row {
          flex-direction: column;
        }

        mat-form-field {
          width: 100%;
        }
      }

      @media (max-width: 768px) {
        .products-table {
          overflow-x: auto;
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
export class ProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'category',
    'price',
    'stock',
    'barcode',
    'actions',
  ];

  searchTerm = '';
  selectedCategory = '';

  products = computed(() => this.productService.getProducts());
  categories = computed(() => this.productService.getCategories());
  filteredProducts = computed(() => {
    let filtered = this.products();

    if (this.searchTerm) {
      filtered = this.productService.searchProducts(this.searchTerm);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory);
    }

    return filtered;
  });

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openAddForm(): void {
    this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { product: null },
    });
  }

  openEditForm(product: Product): void {
    this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: { product },
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id);
    }
  }
}
