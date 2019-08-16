import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementListComponent } from './requirement-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const requirementListRoutes: Routes = [
  {
    path: '',
    component: RequirementListComponent,
    // outlet: 'selling',
  },
];

@NgModule({
  declarations: [RequirementListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(requirementListRoutes)
  ]
})
export class RequirementListModule { }
