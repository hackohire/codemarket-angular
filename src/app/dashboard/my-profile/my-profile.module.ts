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
        path: 'post-list',
        loadChildren: () => import('../../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'membership-list',
        loadChildren: () => import('../../membership/membership-list/membership-list.module').then(module => module.MembershipListModule)
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
