import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InterviewComponent } from './interview.component';

const interviewRoutes: Routes = [
  {
    path: '',
    component: InterviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'interview-list',
        pathMatch: 'full',
      },
      {
        path: 'interview-list',
        loadChildren: () => import('./interview-list/interview-list.module').then(module => module.InterviewListModule)
      },
      {
        path: 'add-interview',
        loadChildren: () => import('./add-interview/add-interview.module').then(module => module.AddInterviewModule),
      },
      {
        path: 'edit-interview/:interviewId',
        loadChildren: () => import('./add-interview/add-interview.module').then(module => module.AddInterviewModule),
        // outlet: 'selling'
      }
    ]
  },
];


@NgModule({
  declarations: [InterviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(interviewRoutes)
  ]
})
export class InterviewModule { }
