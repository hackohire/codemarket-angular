import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SurveyComponent, SurveyDialogComponent } from './survey.component';
import { FormioModule } from 'angular-formio';
import { MySurveyComponent, MySurveyDialogComponent } from './my-survey/my-survey.component';

const surveyRoutes: Routes = [
  {
    path: '',
    component: SurveyComponent
  },
  {
    path: 'my-survey',
    component: MySurveyComponent
  }
]

@NgModule({
  declarations: [SurveyComponent, SurveyDialogComponent, MySurveyComponent, MySurveyDialogComponent],
  entryComponents: [SurveyDialogComponent, MySurveyDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormioModule,
    MaterialFileInputModule,
    RouterModule.forChild(surveyRoutes)
  ]
})

export class SurveyModule { }
