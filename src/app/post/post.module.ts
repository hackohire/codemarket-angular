import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PostComponent } from './post.component';

const postRoutes: Routes = [
  {
    path: '',
    component: PostComponent,
    data: { noReuse: true },
    children: [
      // {
      //   path: '',
      //   redirectTo: 'post-list',
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'post-list',
      //   loadChildren: () => import('./post-list/post-list.module').then(module => module.PostListModule)
      // },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-goal',
        loadChildren: () => import('../goal/add-goal/add-goal.module').then(module => module.AddGoalModule),
      },
      {
        path: 'edit-goal/:goalId',
        loadChildren: () => import('../goal/add-goal/add-goal.module').then(module => module.AddGoalModule),
      },
      {
        path: 'add-design',
        loadChildren: () => import('../design/add-design/add-design.module').then(module => module.AddDesignModule),
      },
      {
        path: 'edit-design/:designId',
        loadChildren: () => import('../design/add-design/add-design.module').then(module => module.AddDesignModule),
      },
      {
        path: 'add-testing',
        loadChildren: () => import('../testing/add-testing/add-testing.module').then(module => module.AddTestingModule),
      },
      {
        path: 'edit-testing/:testingId',
        loadChildren: () => import('../testing/add-testing/add-testing.module').then(module => module.AddTestingModule),
      },
      {
        path: 'add-howtodoc',
        loadChildren: () => import('../howtodoc/add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'edit-howtodoc/:howtodocId',
        loadChildren: () => import('../howtodoc/add-howtodoc/add-howtodoc.module').then(module => module.AddHowtodocModule),
      },
      {
        path: 'add-interview',
        loadChildren: () => import('../interview/add-interview/add-interview.module').then(module => module.AddInterviewModule),
      },
      {
        path: 'edit-interview/:interviewId',
        loadChildren: () => import('../interview/add-interview/add-interview.module').then(module => module.AddInterviewModule),
      },
      {
        path: 'add-requirement',
        loadChildren: () => import('../requirements/add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
      },
      {
        path: 'edit-requirement/:requirementId',
        loadChildren: () => import('../requirements/add-requirements/add-requirement.module').then(module => module.AddRequirementModule),
      },
      {
        path: 'add-teamskill',
        loadChildren: () => import('../team-skill/add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
      },
      {
        path: 'edit-team-skill/:teamskillId',
        loadChildren: () => import('../team-skill/add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
      },
      {
        path: 'edit-help-request/:helpRequestId',
        loadChildren: () => import('../help/askforhelp/askforhelp.module').then(module => module.AskforhelpModule),
      },
      {
        path: 'edit-event/:eventId',
        loadChildren: () => import('../event/add-event/add-event.module').then(module => module.AddEventModule),
      }
    ],
    runGuardsAndResolvers: 'always',
  },
];


@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(postRoutes)
  ]
})
export class PostModule { }
