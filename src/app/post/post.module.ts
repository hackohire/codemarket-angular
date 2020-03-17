import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CompanyPostTypes, UserProfilePostTypes, PostType } from '../shared/models/post-types.enum';

const postRoutes: Routes = [
  {
    path: 'post-list',
    loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
  },
  {
    path: 'dream-job-list',
    loadChildren: () => import('../dream-job/dreamjob-list/dreamjob-list.module').then(module => module.DreamjobListModule)
  },

  /** SEND EMAIL */
  {
    path: `send-${PostType.Email}`,
    loadChildren: () => import('../email/send-email/send-email.module')
      .then(module => module.SendEmailModule),
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(postRoutes)
  ]
})
export class PostModule { }
