import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceleratorComponent } from './accelerator.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';
import { SubscriptionSuccessComponent } from './subscription-success/subscription-success.component';

const acceleratorRoutes: Routes = [
  {
    path: ':planId/success',
    component: SubscriptionSuccessComponent
  },
  {
    path: '',
    component: AcceleratorComponent
  },
];

@NgModule({
  declarations: [AcceleratorComponent, SubscriptionDialogComponent, SubscriptionSuccessComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(acceleratorRoutes)
  ],
  entryComponents: [SubscriptionDialogComponent]
})
export class AcceleratorModule { }
