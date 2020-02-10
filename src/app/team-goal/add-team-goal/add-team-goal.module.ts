import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTeamGoalComponent } from './add-team-goal.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addTeamGoalRoutes: Routes = [
  {
    path: '',
    component: AddTeamGoalComponent,
  },
];

@NgModule({
  declarations: [AddTeamGoalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTeamGoalRoutes)
  ]
})
export class AddTeamGoalModule { }
