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
      // {
      //   path: '',
      //   redirectTo: 'products-list',
      //   pathMatch: 'full',
      // },
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
      {
        path: 'add-product',
        loadChildren: () => import('../../selling/add-products/add-products.module').then(module => module.AddProductsModule)
      },
      {
        path: 'add-help-request',
        loadChildren: () => import('../../help/askforhelp/askforhelp.module').then(module => module.AskforhelpModule)
      },
      {
        path: 'add-interview',
        loadChildren: () => import('../../interview/add-interview/add-interview.module').then(module => module.AddInterviewModule)
      },
      {
        path: 'add-requirement',
        loadChildren: () => import('../../requirements/add-requirements/add-requirement.module').then(module => module.AddRequirementModule)
      },
      {
        path: 'add-testing',
        loadChildren: () => import('../../testing/add-testing/add-testing.module').then(module => module.AddTestingModule)
      },
      {
        path: 'add-howtodoc',
        loadChildren: () => import('../../howtodoc/add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule)
      },
      {
        path: 'add-design',
        loadChildren: () => import('../../design/add-design/add-design.module').then(module => module.AddDesignModule)
      },
      {
        path: 'add-goal',
        loadChildren: () => import('../../goal/add-goal/add-goal.module').then(module => module.AddGoalModule)
      },
      {
        path: 'add-event',
        loadChildren: () => import('../../event/add-event/add-event.module').then(module => module.AddEventModule)
      },
      {
        path: 'add-teamskill',
        loadChildren: () => import('../../team-skill/add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule)
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
