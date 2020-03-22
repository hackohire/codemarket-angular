import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerProfileComponent } from './add-customer-profile.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addCustomerProfileRoutes: Routes = [
  {
    path: '',
    component: AddCustomerProfileComponent,
  },
];

@NgModule({
  declarations: [AddCustomerProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCustomerProfileRoutes)
  ]
})
export class AddCustomerProfileModule { }
