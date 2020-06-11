import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './appointment.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const postRoutes: Routes = [
  {
    path: '',
    component: AppointmentComponent,
  },
]

@NgModule({
  declarations: [AppointmentComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(postRoutes)
  ]
})
export class AppointmentModule { }
