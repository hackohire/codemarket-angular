import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from './membership.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MembershipListComponent } from './membership-list/membership-list.component';

const memborshipRoutes: Routes = [
  {
    path: '',
    component: MembershipComponent
  }
];

@NgModule({
  declarations: [MembershipComponent, MembershipListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(memborshipRoutes)
  ]
})
export class MembershipModule { }
