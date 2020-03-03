import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBusinessServicesComponent } from './add-business-services.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: AddBusinessServicesComponent,
  },
];

@NgModule({
  declarations: [AddBusinessServicesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AddBusinessServicesModule { }
