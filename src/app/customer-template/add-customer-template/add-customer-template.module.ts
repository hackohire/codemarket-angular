import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerTemplateComponent } from './add-customer-template.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';


const addCustomerTemplateRoutes: Routes = [
  {
    path: '',
    component: AddCustomerTemplateComponent,
  },
];

@NgModule({
  declarations: [AddCustomerTemplateComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addCustomerTemplateRoutes)
  ]
})
export class AddCustomerTemplateModule { }
