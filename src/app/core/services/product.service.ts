import { Injectable, signal, computed } from '@angular/core';
import { Product, Order, CartItem, OrderItem } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products = signal<Product[]>([]);
  products$ = computed(() => this.products());

  private groceryData = [
    {
      category: 'Vegetables',
      items: ['Potato', 'Onion', 'Tomato', 'Brinjal', 'Okra', 'Cabbage', 'Cauliflower'],
    },
    {
      category: 'Fruits',
      items: ['Banana', 'Apple', 'Orange', 'Mango', 'Papaya', 'Pineapple'],
    },
    {
      category: 'Rice & Grains',
      items: ['White Rice', 'Basmati Rice', 'Brown Rice', 'Poha', 'Semolina'],
    },
    {
      category: 'Pulses & Lentils',
      items: ['Toor Dal', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Chana Dal'],
    },
    {
      category: 'Spices',
      items: ['Turmeric Powder', 'Red Chilli Powder', 'Coriander Powder', 'Cumin Seeds'],
    },
    {
      category: 'Dairy',
      items: ['Milk', 'Curd', 'Paneer', 'Butter', 'Cheese'],
    },
  ];

  constructor() {
    this.initializeProducts();
    this.loadProducts();
  }

  private initializeProducts(): void {
    const products: Product[] = [];
    let id = 1;

    const unitMap: Record<string, 'kg' | 'packet' | 'liter' | 'piece'> = {
      Vegetables: 'kg',
      Fruits: 'kg',
      'Rice & Grains': 'kg',
      'Pulses & Lentils': 'kg',
      Spices: 'packet',
      Dairy: 'liter',
    };

    for (const categoryData of this.groceryData) {
      const unit = unitMap[categoryData.category] || 'packet';
      for (const item of categoryData.items) {
        products.push({
          id: id++,
          name: item,
          category: categoryData.category,
          price: this.generatePrice(categoryData.category),
          unit,
          stock: Math.floor(Math.random() * 500) + 50,
          barcode: `12345${String(id).padStart(5, '0')}`,
          description: `High quality ${item} from local suppliers`,
          image: this.buildPlaceholderImage(item),
        });
      }
    }

    this.products.set(products);
  }

  private generatePrice(category: string): number {
    const prices: Record<string, () => number> = {
      Vegetables: () => Math.floor(Math.random() * 50) + 10,
      Fruits: () => Math.floor(Math.random() * 80) + 20,
      'Rice & Grains': () => Math.floor(Math.random() * 100) + 30,
      'Pulses & Lentils': () => Math.floor(Math.random() * 120) + 40,
      Spices: () => Math.floor(Math.random() * 300) + 100,
      Dairy: () => Math.floor(Math.random() * 80) + 30,
    };
    return (prices[category] || (() => Math.random() * 100))();
  }

  private buildPlaceholderImage(name: string): string {
    const safeName = name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect fill='#f1f5f9' width='300' height='300'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='#64748b'>${safeName}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  private loadProducts(): void {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        const migrated = parsed.map((product) => ({
          ...product,
          image:
            !product.image || product.image.includes('via.placeholder.com')
              ? this.buildPlaceholderImage(product.name)
              : product.image,
        }));
        this.products.set(migrated);
        this.saveProducts();
      } catch {
        this.saveProducts();
      }
    } else {
      this.saveProducts();
    }
  }

  getProducts(): Product[] {
    return this.products();
  }

  getProductById(id: number): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products().filter((p) => p.category === category);
  }

  getCategories(): string[] {
    const categories = new Set(this.products().map((p) => p.category));
    return Array.from(categories);
  }

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      image: product.image || this.buildPlaceholderImage(product.name),
      id: Math.max(...this.products().map((p) => p.id), 0) + 1,
    };
    this.products.set([...this.products(), newProduct]);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(product: Product): void {
    const updated = {
      ...product,
      image: product.image || this.buildPlaceholderImage(product.name),
    };
    const products = this.products().map((p) => (p.id === updated.id ? updated : p));
    this.products.set(products);
    this.saveProducts();
  }

  deleteProduct(id: number): void {
    this.products.set(this.products().filter((p) => p.id !== id));
    this.saveProducts();
  }

  updateStock(productId: number, quantity: number): void {
    const product = this.getProductById(productId);
    if (product) {
      product.stock -= quantity;
      this.updateProduct(product);
    }
  }

  private saveProducts(): void {
    localStorage.setItem('products', JSON.stringify(this.products()));
  }
}
