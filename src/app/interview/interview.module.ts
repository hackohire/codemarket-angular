import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInterviewComponent } from './add-interview/add-interview.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const interviewRoutes: Routes = [
  {
    path: '',
    redirectTo: 'add-interview'
  },
  {
    path: 'add-interview',
    component: AddInterviewComponent
  }
];


@NgModule({
  declarations: [AddInterviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(interviewRoutes)
  ]
})
export class InterviewModule { }
