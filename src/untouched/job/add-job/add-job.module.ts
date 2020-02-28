import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddJobComponent } from './add-job.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const addJobRoutes: Routes = [
  {
    path: '',
    component: AddJobComponent,
    // outlet: 'selling',
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addJobRoutes)
  ]
})
export class AddJobModule { }
