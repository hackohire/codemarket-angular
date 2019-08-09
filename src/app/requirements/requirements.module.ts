import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequirementsComponent } from './add-requirements/add-requirements.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


const requirementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'add-requirement'
  },
  {
    path: 'add-requirement',
    component: AddRequirementsComponent
  }
];


@NgModule({
  declarations: [AddRequirementsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(requirementRoutes)
  ]
})
export class RequirementsModule { }
