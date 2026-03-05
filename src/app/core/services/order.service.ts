import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem, DailySales } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders = signal<Order[]>([]);
  private billNumberCounter = signal(1000);
  
  orders$ = computed(() => this.orders());

  totalSalestoday$ = computed(() => {
    const today = new Date().toDateString();
    return this.orders()
      .filter((o) => new Date(o.orderDate).toDateString() === today)
      .reduce((sum, o) => sum + o.total, 0);
  });

  totalOrdersToday$ = computed(() => {
    const today = new Date().toDateString();
    return this.orders().filter((o) => new Date(o.orderDate).toDateString() === today).length;
  });

  constructor() {
    this.loadOrders();
  }

  createOrder(
    items: OrderItem[],
    subtotal: number,
    tax: number,
    total: number,
    paymentType: 'cash' | 'upi' | 'card',
    customerName?: string
  ): Order {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      billNumber: this.billNumberCounter(),
      orderDate: new Date(),
      customerName,
      items,
      subtotal,
      tax,
      total,
      paymentType,
    };

    this.billNumberCounter.update((n) => n + 1);
    this.orders.set([...this.orders(), order]);
    this.saveOrders();
    return order;
  }

  getOrders(): Order[] {
    return this.orders();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  getOrdersByDate(date: Date): Order[] {
    const dateStr = date.toDateString();
    return this.orders().filter((o) => new Date(o.orderDate).toDateString() === dateStr);
  }

  getDailySales(): DailySales[] {
    const salesMap = new Map<string, { revenue: number; count: number }>();

    this.orders().forEach((order) => {
      const dateStr = new Date(order.orderDate).toISOString().split('T')[0];
      const existing = salesMap.get(dateStr) || { revenue: 0, count: 0 };
      salesMap.set(dateStr, {
        revenue: existing.revenue + order.total,
        count: existing.count + 1,
      });
    });

    return Array.from(salesMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getTopSellingItems() {
    const itemsMap = new Map<
      string,
      { name: string; quantity: number; revenue: number }
    >();

    this.orders().forEach((order) => {
      order.items.forEach((item) => {
        const existing = itemsMap.get(item.productId.toString()) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
        itemsMap.set(item.productId.toString(), {
          name: item.productName,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.subtotal,
        });
      });
    });

    return Array.from(itemsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private loadOrders(): void {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const orders = JSON.parse(saved);
        this.orders.set(orders);
        if (orders.length > 0) {
          const maxBill = Math.max(...orders.map((o: Order) => o.billNumber));
          this.billNumberCounter.set(maxBill + 1);
        }
      } catch {
        this.orders.set([]);
      }
    }
  }

  private saveOrders(): void {
    localStorage.setItem('orders', JSON.stringify(this.orders()));
  }
}
