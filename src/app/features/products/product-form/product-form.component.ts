import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/index';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Edit Product' : 'Add Product' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field class="full-width">
          <mat-label>Product Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Category</mat-label>
          <mat-select formControlName="category">
            <mat-option *ngFor="let cat of categories" [value]="cat">
              {{ cat }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Unit</mat-label>
          <mat-select formControlName="unit">
            <mat-option value="kg">kg</mat-option>
            <mat-option value="packet">packet</mat-option>
            <mat-option value="liter">liter</mat-option>
            <mat-option value="piece">piece</mat-option>
          </mat-select>
        </mat-form-field>
<!-- dist\grocery-store-pos -->
        <mat-form-field class="full-width">
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Barcode</mat-label>
          <input matInput formControlName="barcode" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Description</mat-label>
          <input matInput formControlName="description" />
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="image" placeholder="https://example.com/product.jpg" />
        </mat-form-field>

        <div class="image-upload-row">
          <input
            #imageFileInput
            type="file"
            accept="image/*"
            (change)="onImageFileChange($event)"
          />
          <button mat-stroked-button type="button" (click)="imageFileInput.click()">
            Upload Image
          </button>
          <span class="hint">JPG, PNG, WEBP</span>
        </div>

        <div class="preview" *ngIf="imagePreview">
          <img [src]="imagePreview" alt="Product preview" />
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="!form.valid"
        (click)="save()"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 15px;
      }

      .image-upload-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .image-upload-row input[type='file'] {
        display: none;
      }

      .hint {
        font-size: 12px;
        color: var(--text-secondary);
      }

      .preview img {
        width: 96px;
        height: 96px;
        object-fit: cover;
        border-radius: 12px;
        border: 1px solid var(--border-color);
      }
    `,
  ],
})
export class 
ProductFormComponent {
  imagePreview = '';

  form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, Validators.required],
    unit: ['kg', Validators.required],
    stock: [0, Validators.required],
    barcode: ['', Validators.required],
    description: [''],
    image: [''],
  });

  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product | null }
  ) {
    this.categories = this.productService.getCategories();

    if (data.product) {
      this.form.patchValue(data.product);
      this.imagePreview = data.product.image || '';
    }
  }

  onImageFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      this.form.patchValue({ image: result });
      this.imagePreview = result;
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const payload = {
        ...formValue,
        image: formValue.image?.trim() || undefined,
      };
      if (this.data.product) {
        this.productService.updateProduct({
          ...this.data.product,
          ...payload,
        } as Product);
        this.snackBar.open('Product updated successfully', 'Close', {
          duration: 2500,
        });
      } else {
        this.productService.addProduct(payload as Omit<Product, 'id'>);
        this.snackBar.open('Product added successfully', 'Close', {
          duration: 2500,
        });
      }

      this.dialogRef.close(true);
    }
  }
}
