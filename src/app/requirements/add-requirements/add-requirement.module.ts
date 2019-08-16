import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRequirementsComponent } from '../add-requirements/add-requirements.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const addRequirementRoutes: Routes = [
  {
    path: '',
    component: AddRequirementsComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [AddRequirementsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addRequirementRoutes)
  ]
})
export class AddRequirementModule { }
