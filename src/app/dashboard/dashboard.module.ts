import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'product-details/:productId',
    loadChildren: () => import('./product-details/product-details.module').then(module => module.ProductDetailsModule),
  },
  {
    path: 'help-request-details/:helpRequestId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  },
  {
    path: 'interview-details/:interviewId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  },
  {
    path: 'requirement-details/:requirementId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  }
];



@NgModule({
  declarations: [DashboardComponent, ProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }
