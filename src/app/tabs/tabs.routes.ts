import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('../pages/products/products.page').then(
            (m) => m.ProductsPage
          ),
      },
      {
        path: 'list-baskets',
        loadComponent: () =>
          import('../pages/list-baskets/list-baskets.page').then(m => m.ListBasketsPage),
      },
      {
        path:'basket-detail/:id',
        loadComponent:() => import('../pages/basket-detail/basket-detail.page').then(m=>m.BasketDetailPage),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../pages/product-detail/product-detail.page')
            .then(m => m.ProductDetailPage),
      },
      {
        path: 'add-product',
        loadComponent: () => import('../pages/product-form/product-form.page').then(
          (m) => m.ProductFormPage
        )
      },
       {
        path: 'edit-product/:id',
        loadComponent: () => import('../pages/product-form/product-form.page').then(
          (m) => m.ProductFormPage
        )
      },
      {
        path: 'basket',
        loadComponent: () => import('../pages/basket/basket.page').then(
          (m) => m.BasketPage
        )
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('../pages/sales/sales.page').then(
            (m) => m.SalesPage
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];
