import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRsvpComponent } from './my-rsvp.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const myRSVPRoutes: Routes = [
  {
    path: '',
    component: MyRsvpComponent
  }
]
@NgModule({
  declarations: [MyRsvpComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(myRSVPRoutes)
  ]
})
export class MyRsvpModule { }
