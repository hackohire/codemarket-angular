import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketingGoalComponent } from './add-marketing-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addMarketingGoalRoutes: Routes = [
  {
    path: '',
    component: AddMarketingGoalComponent,
  },
];

@NgModule({
  declarations: [AddMarketingGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addMarketingGoalRoutes)
  ]
})
export class AddMarketingGoalModule { }
