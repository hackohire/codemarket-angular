import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSalesChallengeComponent } from './add-sales-challenge.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const addSalesChallengeRoutes: Routes = [
  {
    path: '',
    component: AddSalesChallengeComponent,
  },
];

@NgModule({
  declarations: [AddSalesChallengeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(addSalesChallengeRoutes)
  ]
})
export class AddSalesChallengeModule { }
