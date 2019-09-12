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
    pathMatch: 'full'
  },
  {
    path: 'bugfixes-all',
    loadChildren: () => import('../selling/products-list/products-list.module').then(module => module.ProductsListModule),
  },
  {
    path: 'help-requests-all',
    loadChildren: () => import('../help/help-request-list/help-request-list.module').then(module => module.HelpRequestListModule),
  },

  // Profile of LoggedIn User
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then(module => module.MyProfileModule),
  },

  // Profile of Other User
  {
    path: 'profile/:authorId',
    loadChildren: () => import('./my-profile/my-profile.module').then(module => module.MyProfileModule),
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
  },
  {
    path: 'testing-details/:testingId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  },
  {
    path: 'howtodoc-details/:howtodocId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  },
  {
    path: 'design-details/:designId',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
  },
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
