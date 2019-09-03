import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const myProfileRoutes: Routes = [
  {
    path: '',
    component: MyProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'products-list',
        pathMatch: 'full',
      },
      {
        path: 'products-list',
        loadChildren: () => import('../../selling/products-list/products-list.module').then(module => module.ProductsListModule)
      },
      {
        path: 'help-request-list',
        loadChildren: () => import('../../help/help-request-list/help-request-list.module').then(module => module.HelpRequestListModule)
      },
      {
        path: 'purchased-items-list',
        loadChildren: () => import('../../purchase/purchase.module').then(module => module.PurchaseModule)
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

    ]
  }
];


@NgModule({
  declarations: [MyProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(myProfileRoutes)
  ]
})
export class MyProfileModule { }
