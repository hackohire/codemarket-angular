import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBusinessGoalComponent } from './add-business-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addBusinessGoalRoutes: Routes = [
  {
    path: '',
    component: AddBusinessGoalComponent,
  },
];

@NgModule({
  declarations: [AddBusinessGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addBusinessGoalRoutes)
  ]
})
export class AddBusinessGoalModule { }
