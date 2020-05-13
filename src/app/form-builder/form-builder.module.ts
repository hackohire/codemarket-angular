import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilderComponent} from './form-builder.component';
import {AddFormDataComponent} from './add-form-data/add-form-data.component';
import {CreateFormTemplateComponent} from './create-form-template/create-form-template.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ViewFormDataListComponent } from './view-form-data-list/view-form-data-list.component';


const contactRoutes: Routes = [
  {
    path: '',
    // data: { noReuse: true },
    children: [
      {
        path: '',
        component: FormBuilderComponent
      },
      {
        path: 'add-form-data/:formname/:formId',
        loadChildren: () => import('./add-form-data/add-form-data.module').then(module => module.AddFormDataModule),
      },
      {
        path: 'view-form-data-list/:formname/:formId',
        component: ViewFormDataListComponent
      },
      {
        path: 'edit-form-structure/:formname/:formId',
        component: CreateFormTemplateComponent
      },
      {
        path: 'create-form-template',
        component: CreateFormTemplateComponent
      },
    ]
  }
];

@NgModule({
  declarations: [FormBuilderComponent, CreateFormTemplateComponent, ViewFormDataListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(contactRoutes)
  ]
})
export class FormBuilderModule { }
