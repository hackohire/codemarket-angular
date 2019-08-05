import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SingleCartProductComponent } from './single-cart-product/single-cart-product.component';

const cartRoutes: Routes = [
  {
    path: '',
    component: CartComponent
  }
];


@NgModule({
  declarations: [CartComponent, SingleCartProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(cartRoutes)
  ]
})
export class CartModule { }
