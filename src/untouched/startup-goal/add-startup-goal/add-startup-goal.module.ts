import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStartupGoalComponent } from './add-startup-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addStartupGoalRoutes: Routes = [
  {
    path: '',
    component: AddStartupGoalComponent,
  },
];

@NgModule({
  declarations: [AddStartupGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addStartupGoalRoutes)
  ]
})
export class AddStartupGoalModule { }
