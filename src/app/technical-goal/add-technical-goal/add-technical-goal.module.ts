import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTechnicalGoalComponent } from './add-technical-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addTechnicalGoalRoutes: Routes = [
  {
    path: '',
    component: AddTechnicalGoalComponent,
  },
];

@NgModule({
  declarations: [AddTechnicalGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTechnicalGoalRoutes)
  ]
})
export class AddTechnicalGoalModule { }
