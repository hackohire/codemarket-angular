import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductsComponent } from './add-products.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

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
    SharedModule,
    RouterModule.forChild(addProductRoutes)
  ],
  providers: []
})
export class AddProductsModule { }
