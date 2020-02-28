import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCareerCoachComponent } from './add-career-coach.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const addCareerCoachRoutes: Routes = [
  {
    path: '',
    component: AddCareerCoachComponent,
  },
];

@NgModule({
  declarations: [AddCareerCoachComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCareerCoachRoutes)
  ]
})
export class AddCareerCoachModule { }
