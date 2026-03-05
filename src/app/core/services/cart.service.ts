import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items = signal<CartItem[]>([]);
  items$ = computed(() => this.items());

  subtotal$ = computed(() =>
    this.items().reduce((sum, item) => sum + item.subtotal, 0)
  );

  tax$ = computed(() => this.subtotal$() * 0.18); // 18% GST

  total$ = computed(() => this.subtotal$() + this.tax$());

  itemCount$ = computed(() =>
    this.items().reduce((count, item) => count + item.quantity, 0)
  );

  constructor() {
    this.loadCart();
  }

  addToCart(product: Product, quantity: number): void {
    const existingItem = this.items().find((item) => item.product.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const cartItem: CartItem = {
        product,
        quantity,
        subtotal: product.price * quantity,
      };
      this.items.set([...this.items(), cartItem]);
      this.saveCart();
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.items().map((item) =>
      item.product.id === productId
        ? { ...item, quantity, subtotal: item.product.price * quantity }
        : item
    );
    this.items.set(items);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    this.items.set(this.items().filter((item) => item.product.id !== productId));
    this.saveCart();
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem('cart');
  }

  getItems(): CartItem[] {
    return this.items();
  }

  private loadCart(): void {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        this.items.set(JSON.parse(saved));
      } catch {
        this.clearCart();
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.items()));
  }
}
