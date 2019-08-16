import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewListComponent } from './interview-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const interviewListRoutes: Routes = [
  {
    path: '',
    component: InterviewListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [InterviewListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(interviewListRoutes)
  ]
})

export class InterviewListModule { }
