import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddInterviewComponent } from './add-interview.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addInterviewRoutes: Routes = [
  {
    path: '',
    component: AddInterviewComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddInterviewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addInterviewRoutes)
  ]
})
export class AddInterviewModule { }
