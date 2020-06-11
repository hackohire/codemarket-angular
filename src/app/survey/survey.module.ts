import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SurveyComponent } from './survey.component';
import { FormioModule } from 'angular-formio';

const emailRoutes: Routes = [
  {
    path: '',
    component: SurveyComponent
  }
]

@NgModule({
  declarations: [SurveyComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormioModule,
    MaterialFileInputModule,
    RouterModule.forChild(emailRoutes)
  ]
})

export class SurveyModule { }
