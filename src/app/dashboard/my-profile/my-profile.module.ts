import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessCoachListComponent } from '../../business-coach/business-coach-list/business-coach-list.component';
import { CareerCoachListComponent } from '../../career-coach/career-coach-list/career-coach-list.component';

const myProfileRoutes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
    children: [
      {
        path: 'products-list',
        loadChildren: () => import('../../selling/products-list/products-list.module').then(module => module.ProductsListModule)
      },
      {
        path: 'post-list',
        loadChildren: () => import('../../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'purchased-items-list',
        loadChildren: () => import('../../purchase/purchase.module').then(module => module.PurchaseModule)
      },
      {
        path: 'membership-list',
        loadChildren: () => import('../../membership/membership-list/membership-list.module').then(module => module.MembershipListModule)
      },
      {
        path: 'business-coaches',
        component: BusinessCoachListComponent
      },
      {
        path: 'career-coaches',
        component: CareerCoachListComponent
      },
      {
        path: 'my-rsvp',
        loadChildren: () => import('../../event/my-rsvp/my-rsvp.module').then(module => module.MyRsvpModule)
      },
    ]
  }
];


@NgModule({
  declarations: [MyProfileComponent, BusinessCoachListComponent, CareerCoachListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(myProfileRoutes)
  ]
})
export class MyProfileModule { }
