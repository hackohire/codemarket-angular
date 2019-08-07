import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SingleCartProductComponent } from './single-cart-product/single-cart-product.component';
import { CheckoutComponent } from './checkout/checkout.component';

const cartRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CartComponent
      },
      {
        path: 'checkout',
        component: CheckoutComponent
      }
    ]
  }
];


@NgModule({
  declarations: [CartComponent, SingleCartProductComponent, CheckoutComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(cartRoutes)
  ]
})
export class CartModule { }
