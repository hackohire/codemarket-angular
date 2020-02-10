import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTeamChallengeComponent } from './add-team-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addTeamChallengeRoutes: Routes = [
  {
    path: '',
    component: AddTeamChallengeComponent,
  },
];

@NgModule({
  declarations: [AddTeamChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTeamChallengeRoutes)
  ]
})
export class AddTeamChallengeModule { }
