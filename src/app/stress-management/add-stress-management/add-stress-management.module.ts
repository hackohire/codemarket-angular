import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStressManagementComponent } from './add-stress-management.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addStressManagementRoutes: Routes = [
  {
    path: '',
    component: AddStressManagementComponent,
  },
];

@NgModule({
  declarations: [AddStressManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addStressManagementRoutes)
  ]
})
export class AddStressManagementModule { }
