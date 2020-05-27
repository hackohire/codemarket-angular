import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CompaniesListComponent } from '../companies/companies-list/companies-list.component';
import { AuthModule } from '../auth/auth.module';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full'
  },

  {
    path: 'post-list',
    loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule),
  },
  {
    path: 'company-list',
    component: CompaniesListComponent,
    data: { noReuse: true }
  },
  {
    path: 'bugfixes-all',
    loadChildren: () => import('../selling/products-list/products-list.module').then(module => module.ProductsListModule),
  },
  // {
  //   path: 'help-requests-all',
  //   loadChildren: () => import('../help/help-request-list/help-request-list.module').then(module => module.HelpRequestListModule),
  // },

  // Profile of LoggedIn User
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then(module => module.MyProfileModule),
  },

  // Profile of Other User
  // {
  //   path: 'profile/:authorId',
  //   loadChildren: () => import('./my-profile/my-profile.module').then(module => module.MyProfileModule),
  // },
  {
    path: 'product/:slug',
    loadChildren: () => import('./product-details/product-details.module').then(module => module.ProductDetailsModule),
    data: { noReuse: true, setPostMeta: true },
    // outlet: 'main',
    pathMatch: 'full'
  },
  {
    path: 'post/:slug',
    loadChildren: () => import('../detail/detail.module').then(module => module.DetailModule),
    data: { noReuse: true, setPostMeta: true },
    // outlet: 'main',
    pathMatch: 'full'
  }
];



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthModule,
    // CompaniesModule,
    RouterModule.forChild(dashboardRoutes)
  ]
})
export class DashboardModule { }
