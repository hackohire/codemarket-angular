import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddGoalComponent } from './add-goal.component';
import { SharedModule } from 'src/app/shared/shared.module';

const addGoalRoutes: Routes = [
  {
    path: '',
    component: AddGoalComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addGoalRoutes)
  ]
})
export class AddGoalModule { }
