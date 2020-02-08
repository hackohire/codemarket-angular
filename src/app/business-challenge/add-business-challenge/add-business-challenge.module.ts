import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBusinessChallengeComponent } from './add-business-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addBusinessChallengeRoutes: Routes = [
  {
    path: '',
    component: AddBusinessChallengeComponent,
  },
];

@NgModule({
  declarations: [AddBusinessChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addBusinessChallengeRoutes)
  ]
})
export class AddBusinessChallengeModule { }
