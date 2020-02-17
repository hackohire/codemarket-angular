import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssignmentComponent } from './add-assignment.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const addBusinessGoalRoutes: Routes = [
  {
    path: '',
    component: AddAssignmentComponent,
  },
];

@NgModule({
  declarations: [AddAssignmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addBusinessGoalRoutes)
  ],
  exports: [AddAssignmentComponent]
})

export class AddAssignmentModule { }
