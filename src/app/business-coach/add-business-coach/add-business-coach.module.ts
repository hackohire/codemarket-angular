import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBusinessCoachComponent } from './add-business-coach.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const addBusinessCoachRoutes: Routes = [
  {
    path: '',
    component: AddBusinessCoachComponent,
  },
];

@NgModule({
  declarations: [AddBusinessCoachComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addBusinessCoachRoutes)
  ]
})
export class AddBusinessCoachModule { }
