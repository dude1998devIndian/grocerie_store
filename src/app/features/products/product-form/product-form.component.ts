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
    `,
  ],
})
export class 
ProductFormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    price: [0, Validators.required],
    unit: ['kg', Validators.required],
    stock: [0, Validators.required],
    barcode: ['', Validators.required],
    description: [''],
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
    }
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.data.product) {
        this.productService.updateProduct({
          ...this.data.product,
          ...formValue,
        } as Product);
        this.snackBar.open('Product updated successfully', 'Close', {
          duration: 2500,
        });
      } else {
        this.productService.addProduct(formValue as Omit<Product, 'id'>);
        this.snackBar.open('Product added successfully', 'Close', {
          duration: 2500,
        });
      }

      this.dialogRef.close(true);
    }
  }
}
