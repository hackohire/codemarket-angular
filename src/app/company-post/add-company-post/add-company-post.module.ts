import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCompanyPostComponent } from './add-company-post.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addCompanyPostRoutes: Routes = [
  {
    path: '',
    component: AddCompanyPostComponent,
  },
];

@NgModule({
  declarations: [AddCompanyPostComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCompanyPostRoutes)
  ]
})
export class AddCompanyPostModule { }
