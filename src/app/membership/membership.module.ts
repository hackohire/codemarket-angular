import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipComponent } from './membership.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';

const membershipRoutes: Routes = [
  {
    path: '',
    component: MembershipComponent
  }
];

@NgModule({
  declarations: [MembershipComponent, SubscriptionDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(membershipRoutes)
  ],
  entryComponents: [SubscriptionDialogComponent]
})
export class MembershipModule { }
