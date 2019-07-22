import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

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
    SharedModule,
    RouterModule.forChild(productsListRoutes)
  ]
})
export class ProductsListModule { }
