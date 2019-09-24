import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from './membership.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const memborshipRoutes: Routes = [
  {
    path: '',
    component: MembershipComponent
  }
];

@NgModule({
  declarations: [MembershipComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(memborshipRoutes)
  ]
})
export class MembershipModule { }
