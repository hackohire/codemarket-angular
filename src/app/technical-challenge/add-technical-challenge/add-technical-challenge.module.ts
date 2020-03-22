import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTechnicalChallengeComponent } from './add-technical-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addTechnicalChallengeRoutes: Routes = [
  {
    path: '',
    component: AddTechnicalChallengeComponent,
  },
];

@NgModule({
  declarations: [AddTechnicalChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addTechnicalChallengeRoutes)
  ]
})
export class AddTechnicalChallengeModule { }
