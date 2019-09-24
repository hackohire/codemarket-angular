import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MembershipListComponent } from './membership-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

const membrshipListRoutes: Routes = [
  {
    path: '',
    component: MembershipListComponent
  }
]

@NgModule({
  declarations: [MembershipListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(membrshipListRoutes)
  ]
})
export class MembershipListModule { }
