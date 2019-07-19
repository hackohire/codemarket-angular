import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { Routes, RouterModule } from '@angular/router';

const productsListRoutes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(productsListRoutes)
  ]
})
export class ProductsListModule { }
