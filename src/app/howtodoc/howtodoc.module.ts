import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HowtodocComponent } from './howtodoc.component';

const howtodocRoutes: Routes = [
  {
    path: '',
    component: HowtodocComponent,
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
        path: 'add-howtodoc',
        loadChildren: () => import('./add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'edit-howtodoc/:howtodocId',
        loadChildren: () => import('./add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [HowtodocComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(howtodocRoutes)
  ]
})
export class HowtodocModule { }
