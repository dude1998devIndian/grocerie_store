export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: 'kg' | 'packet' | 'liter' | 'piece';
  stock: number;
  barcode: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  unit: string;
}

export interface Order {
  id: string;
  billNumber: number;
  orderDate: Date;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentType: 'cash' | 'upi' | 'card';
  discount?: number;
}

export interface SalesReport {
  date: Date;
  totalOrders: number;
  totalRevenue: number;
  totalTax: number;
  bestSellingItems: { name: string; quantity: number; revenue: number }[];
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface GroceryCategory {
  category: string;
  items: string[];
}

export interface DashboardMetrics {
  totalSalesToday: number;
  totalOrdersToday: number;
  topSellingItems: { name: string; quantity: number; revenue: number }[];
  revenueData: DailySales[];
}
