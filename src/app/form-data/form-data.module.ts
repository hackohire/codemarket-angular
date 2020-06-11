import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FormioModule } from 'angular-formio';
import { FormListComponent } from './form-list/form-list.component';

const emailRoutes: Routes = [
  {
    path: 'list',
    component: FormListComponent
  }
]

@NgModule({
  declarations: [FormListComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormioModule,
    MaterialFileInputModule,
    RouterModule.forChild(emailRoutes)
  ]
})

export class FormDataModule { }
