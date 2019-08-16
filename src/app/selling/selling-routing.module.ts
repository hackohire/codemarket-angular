import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SellingProductsComponent } from './selling-products/selling-products.component';

const productRoutes: Routes = [
  {
    path: '',
    component: SellingProductsComponent,
    children: [
      {
        path: '',
        redirectTo: 'products-list',
        pathMatch: 'full',
      },
      {
        path: 'products-list',
        loadChildren: () => import('./products-list/products-list.module').then(module => module.ProductsListModule)
      },
      {
        path: 'add-product',
        loadChildren: () => import('./add-products/add-products.module').then(module => module.AddProductsModule),
      },
      {
        path: 'edit-product/:productId',
        loadChildren: () => import('./add-products/add-products.module').then(module => module.AddProductsModule),
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(productRoutes)
  ],
  exports: []
})
export class SellingRoutingModule { }
