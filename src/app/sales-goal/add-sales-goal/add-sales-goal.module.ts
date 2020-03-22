import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSalesGoalComponent } from './add-sales-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addSalesGoalsRoutes: Routes = [
  {
    path: '',
    component: AddSalesGoalComponent,
  },
];

@NgModule({
  declarations: [AddSalesGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addSalesGoalsRoutes)
  ]
})
export class AddSalesGoalModule { }
