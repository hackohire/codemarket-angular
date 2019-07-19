import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellingProductsComponent } from './selling-products/selling-products.component';
import { SellingRoutingModule } from './selling-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SellingProductsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SellingRoutingModule
  ],
  providers: []
})
export class SellingModule { }
