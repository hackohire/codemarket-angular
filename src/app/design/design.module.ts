import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DesignComponent } from './design.component';

const designRoutes: Routes = [
  {
    path: '',
    component: DesignComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-list',
        pathMatch: 'full',
      },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-design',
        loadChildren: () => import('./add-design/add-design.module').then(module => module.AddDesignModule),
      },
      {
        path: 'edit-design/:designId',
        loadChildren: () => import('./add-design/add-design.module').then(module => module.AddDesignModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [DesignComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(designRoutes)
  ]
})
export class DesignModule { }
