import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFormDataComponent } from './add-form-data.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormioModule } from 'angular-formio';



@NgModule({
  declarations: [AddFormDataComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormioModule,
    RouterModule.forChild([{
      path: '',
      component: AddFormDataComponent
    }])
  ]
})
export class AddFormDataModule { }
