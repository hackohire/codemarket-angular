import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { GoalComponent } from './goal.component';

const goalRoutes: Routes = [
  {
    path: '',
    component: GoalComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-list',
        pathMatch: 'full',
      },
      // {
      //   path: 'goal-list',
      //   loadChildren: () => import('./goal-list/goal-list.module').then(module => module.GoalListModule)
      // },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-goal',
        loadChildren: () => import('./add-goal/add-goal.module').then(module => module.AddGoalModule),
      },
      {
        path: 'edit-goal/:goalId',
        loadChildren: () => import('./add-goal/add-goal.module').then(module => module.AddGoalModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [GoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(goalRoutes)
  ]
})
export class GoalModule { }
