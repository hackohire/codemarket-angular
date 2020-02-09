import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLeadershipChallengeComponent } from './add-leadership-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addLeadershipChallengeRoutes: Routes = [
  {
    path: '',
    component: AddLeadershipChallengeComponent,
  },
];

@NgModule({
  declarations: [AddLeadershipChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addLeadershipChallengeRoutes)
  ]
})
export class AddLeadershipChallengeModule { }
