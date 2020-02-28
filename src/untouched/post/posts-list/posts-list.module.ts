import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const postListRoutes: Routes = [
  {
    path: '',
    component: PostsListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [PostsListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(postListRoutes)
  ]
})
export class PostsListModule { }
