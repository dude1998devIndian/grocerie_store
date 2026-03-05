import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'pos',
    loadComponent: () =>
      import('./features/pos/pos.component').then((m) => m.PosComponent),
  },
  {
    path: 'billing',
    loadComponent: () =>
      import('./features/billing/billing.component').then(
        (m) => m.BillingComponent
      ),
  },
  {
    path: 'receipt',
    loadComponent: () =>
      import('./features/billing/receipt/receipt.component').then(
        (m) => m.ReceiptComponent
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/reports/reports.component').then(
        (m) => m.ReportsComponent
      ),
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./features/report/report.component').then(m => m.ReportComponent),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
