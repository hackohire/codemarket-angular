import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'product-details/:productId',
    loadChildren: () => import('./product-details/product-details.module').then(module => module.ProductDetailsModule),
  }
];



@NgModule({
  declarations: [DashboardComponent, ProductComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }
