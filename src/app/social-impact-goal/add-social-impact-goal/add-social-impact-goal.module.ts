import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSocialImpactGoalComponent } from './add-social-impact-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addSocialImpactGoalRoutes: Routes = [
  {
    path: '',
    component: AddSocialImpactGoalComponent,
  },
];

@NgModule({
  declarations: [AddSocialImpactGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addSocialImpactGoalRoutes)
  ]
})
export class AddSocialImpactGoalModule { }
