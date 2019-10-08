import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TeamskillComponent } from './teamskill.component';

const teamskillRoutes: Routes = [
  {
    path: '',
    component: TeamskillComponent,
    children: [
      {
        path: '',
        redirectTo: 'post-list',
        pathMatch: 'full',
      },
      // {
      //   path: 'teamskill-list',
      //   loadChildren: () => import('./teamskill-list/teamskill-list.module').then(module => module.TeamskillListModule)
      // },
      {
        path: 'post-list',
        loadChildren: () => import('../post/posts-list/posts-list.module').then(module => module.PostsListModule)
      },
      {
        path: 'add-teamskill',
        loadChildren: () => import('./add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
      },
      {
        path: 'edit-teamskill/:teamskillId',
        loadChildren: () => import('./add-teamskill/add-teamskill.module').then(module => module.AddTeamskillModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [TeamskillComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(teamskillRoutes)
  ]
})
export class TeamskillModule { }
