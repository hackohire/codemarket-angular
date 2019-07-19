import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductsComponent } from './add-products.component';
import { RouterModule, Routes } from '@angular/router';

const addProductRoutes: Routes = [
  {
    path: '',
    component: AddProductsComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [AddProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(addProductRoutes)
  ]
})
export class AddProductsModule { }
