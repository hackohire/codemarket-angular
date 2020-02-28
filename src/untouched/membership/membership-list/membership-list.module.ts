import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MembershipListComponent } from './membership-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InviteMembersDialogComponent } from '../invite-members-dialog/invite-members-dialog.component';

const membrshipListRoutes: Routes = [
  {
    path: '',
    component: MembershipListComponent
  }
];

@NgModule({
  declarations: [MembershipListComponent, InviteMembersDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(membrshipListRoutes)
  ],
  entryComponents: [InviteMembersDialogComponent]
})
export class MembershipListModule { }
